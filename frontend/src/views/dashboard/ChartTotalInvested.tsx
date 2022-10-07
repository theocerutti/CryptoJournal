import { Alert, Box, Button, Flex, Icon, Menu, MenuButton, MenuItem, MenuList, Spinner, Stat, StatHelpText, StatLabel, StatNumber, Text, useColorModeValue } from '@chakra-ui/react';
import Card from 'components/card/Card';
import { MdOutlineCalendarToday } from 'react-icons/md';
import React, { useCallback, useEffect, useState } from 'react';
import ReactApexChart from 'react-apexcharts';
import { formatCurrency } from '../../utils/format';
import { zoomApexChart } from '../../utils/chart';
import { useQuery } from '@tanstack/react-query';
import { getInvestmentsQuery, INVESTMENT_QUERY_KEY } from '../../queries/investments';
import { defaultQueryConfig } from '../../queries/config';
import { GetInvestmentDto } from '@shared/investment';

export type ChartTimeline = 'ONE_MONTH' | 'SIX_MONTHS' | 'ONE_YEAR' | 'YTD' | 'ALL';

const chartTimelineToString = (timeline: ChartTimeline): string => {
  switch (timeline) {
    case 'ALL':
      return 'All';
    case 'ONE_MONTH':
      return '1M';
    case 'ONE_YEAR':
      return '1Y';
    case 'SIX_MONTHS':
      return '6M';
    case 'YTD':
      return 'YTD';
    default:
      return 'Unknown';
  }
};

export default function ChartTotalInvested() {
  const textColorSecondary = useColorModeValue('secondaryGrey.600', 'white');
  const boxBg = useColorModeValue('secondaryGrey.300', 'whiteAlpha.100');

  const [currentTimeline, setCurrentTimeline] = useState<ChartTimeline>('YTD');
  const [tooltipValue, setTooltipValue] = useState({ x: 0, y: new Date() });

  const [lineChartData, setData] = useState<{ name: string, data: any[] }[]>([{
    name: 'Profit',
    data: [],
  }]);

  const [loadingCalculation, setLoadingCalculation] = useState(true);

  const { data, isError, isSuccess } = useQuery(
    [INVESTMENT_QUERY_KEY],
    getInvestmentsQuery,
    {
      ...defaultQueryConfig,
    },
  );

  const updateTimeline = useCallback((timeline: ChartTimeline) => {
    setCurrentTimeline(timeline);

    switch (timeline) {
      case 'ONE_MONTH': {
        const startDate = new Date();
        startDate.setMonth(startDate.getMonth() - 1);
        zoomApexChart('line-datetime', startDate, new Date());
        break;
      }
      case 'SIX_MONTHS': {
        const startDate = new Date();
        startDate.setMonth(startDate.getMonth() - 6);
        zoomApexChart('line-datetime', startDate, new Date());
        break;
      }
      case 'ONE_YEAR': {
        const startDate = new Date();
        startDate.setFullYear(startDate.getFullYear() - 1);
        zoomApexChart('line-datetime', startDate, new Date());
        break;
      }
      default:
      case 'YTD': {
        const startDate = new Date();
        startDate.setMonth(0);
        startDate.setDate(1);
        zoomApexChart('line-datetime', startDate, new Date());
        break;
      }
      case 'ALL': {
        zoomApexChart('line-datetime', new Date(lineChartData[0].data[0][0]), new Date());
        break;
      }
    }
  }, [lineChartData]);

  useEffect(() => {
    if (isSuccess) {
      setLoadingCalculation(true);
      let chartData = lineChartData;
      chartData[0].data = data.data.map((investment) => {
        // @ts-ignore
        return [Date.parse(new Date(investment.buyDate))];
      }).sort((a, b) => a[0] - b[0]);
      let amount = 0;
      for (let i = 0; i < data.data.length; i++) {
        const investment: GetInvestmentDto = data.data[i];
        amount += investment.investedAmount;
        chartData[0].data[i].push(amount);
      }
      setData(chartData);
      setLoadingCalculation(false);
    }
  }, [isSuccess, data, lineChartData]);

  useEffect(() => {
    if (isSuccess && !loadingCalculation && lineChartData[0].data.length > 0) {
      updateTimeline('YTD');
    }
  }, [isSuccess, lineChartData, loadingCalculation, updateTimeline]);

  const lineChartOptionsTotalSpent = {
    chart: {
      id: 'line-datetime',
      type: 'area',
      height: 350,
      zoom: {
        autoScaleYaxis: true,
      },
      dropShadow: {
        enabled: true,
        top: 13,
        left: 0,
        blur: 10,
        opacity: 0.1,
        color: '#4318FF',
      },
    },
    dataLabels: {
      enabled: false,
    },
    markers: {
      size: 0,
      style: 'hollow',
    },
    yaxis: {
      tickAmount: 5,
      labels: {
        formatter: function(val: number) {
          return formatCurrency(val);
        },
        style: {
          colors: '#A3AED0',
          fontSize: '12px',
          fontWeight: '500',
        },
      },
    },
    xaxis: {
      type: 'datetime',
      min: lineChartData[0].data[0] && lineChartData[0].data[0].length !== 0 ? new Date(lineChartData[0].data[0][0]).getTime() : new Date().getTime(),
      tickAmount: 30, // 30 days
      tooltip: {
        enabled: false,
      },
      labels: {
        style: {
          colors: '#A3AED0',
          fontSize: '12px',
          fontWeight: '500',
        },
      },
    },
    grid: {
      show: false,
    },
    tooltip: {
      theme: 'dark',
      x: {
        format: 'dd MMM yyyy',
      },
      custom: function({ seriesIndex, dataPointIndex, w }: any) {
        const data = w.globals.initialSeries[seriesIndex].data[dataPointIndex];
        setTooltipValue({ x: data[1], y: new Date(data[0]) });
        return '';
      },
    },
    fill: {
      type: 'gradient',
      gradient: {
        shadeIntensity: 1,
        opacityFrom: 0.7,
        opacityTo: 0.9,
        stops: [0, 100],
      },
    },
  };

  if (isError) return <Alert status='error'>Can't fetch investments</Alert>;
  if (loadingCalculation) return <Spinner />;

  return (
    <Card>
      <Flex justify='center'>
        <Menu>
          <MenuButton
            as={Button}
            bg={boxBg}
            fontSize='sm'
            fontWeight='500'
            color={textColorSecondary}
            borderRadius='7px'
          >
            <Icon
              as={MdOutlineCalendarToday}
              color={textColorSecondary}
              me='4px'
            />
            {chartTimelineToString(currentTimeline)}
          </MenuButton>
          <MenuList>
            {(['ALL', 'YTD', 'ONE_YEAR', 'SIX_MONTHS', 'ONE_MONTH'] as ChartTimeline[]).map((timeline: ChartTimeline) => (
              <MenuItem
                onClick={() => updateTimeline(timeline)}
                key={timeline}
              >
                <Text>{chartTimelineToString(timeline)}</Text>
              </MenuItem>
            ))}
          </MenuList>
        </Menu>
      </Flex>
      <Flex w='100%' flexDirection='row'>
        <Flex w='8%' justify='center' align='center'>
          <Stat
            style={{
              display: 'flex',
              justifyContent: 'center',
            }}
          >
            <StatLabel>Total Invested</StatLabel>
            <StatNumber>{formatCurrency(tooltipValue.x)}</StatNumber>
            <StatHelpText>{tooltipValue.y.toLocaleDateString()}</StatHelpText>
          </Stat>
        </Flex>
        <Box minW='92%' minH='300px' mt='auto'>
          <div id='chart-timeline'>
              <ReactApexChart
                onMouseLeave={() => setTooltipValue({ x: 0, y: new Date() })}
                // @ts-ignore
                options={lineChartOptionsTotalSpent}
                series={lineChartData}
                type='area'
                width='100%'
                height={300}
              />
          </div>
        </Box>
      </Flex>
    </Card>
  );
}
