import {
  Box,
  Button,
  Flex,
  Icon,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Stat,
  StatHelpText,
  StatLabel,
  StatNumber,
  Text,
  useColorModeValue,
} from '@chakra-ui/react';
import Card from 'components/card/Card';
import { MdOutlineCalendarToday } from 'react-icons/md';
import React, { useCallback, useEffect, useState } from 'react';
import ReactApexChart from 'react-apexcharts';
import { formatCurrency } from '../../utils/format';
import { zoomApexChart } from '../../utils/chart';
import { ChartProps } from './index';
import { ApexOptions } from 'apexcharts';

export type ChartTimeline =
  | 'ONE_MONTH'
  | 'SIX_MONTHS'
  | 'ONE_YEAR'
  | 'YTD'
  | 'ALL';

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

type LineChartProps = {
  tooltipTitle: string;
  data: { name: string; data: any[] }[];
  resetTooltipValue?: number;
  canZoom?: boolean;
} & ChartProps;

const LineChart = ({
  chartId,
  resetTooltipValue = null,
  canZoom = true,
  data,
  tooltipTitle,
  height = 350,
  options = {},
}: LineChartProps) => {
  const textColorSecondary = useColorModeValue('secondaryGrey.600', 'white');
  const boxBg = useColorModeValue('secondaryGrey.300', 'whiteAlpha.100');

  const [currentTimeline, setCurrentTimeline] = useState<ChartTimeline>('YTD');
  const [tooltipValue, setTooltipValue] = useState({ x: 0, y: new Date() });

  const updateTimeline = useCallback(
    (timeline: ChartTimeline) => {
      setCurrentTimeline(timeline);

      switch (timeline) {
        case 'ONE_MONTH': {
          const startDate = new Date();
          startDate.setMonth(startDate.getMonth() - 1);
          zoomApexChart(chartId, startDate, new Date());
          break;
        }
        case 'SIX_MONTHS': {
          const startDate = new Date();
          startDate.setMonth(startDate.getMonth() - 6);
          zoomApexChart(chartId, startDate, new Date());
          break;
        }
        case 'ONE_YEAR': {
          const startDate = new Date();
          startDate.setFullYear(startDate.getFullYear() - 1);
          zoomApexChart(chartId, startDate, new Date());
          break;
        }
        default:
        case 'YTD': {
          const startDate = new Date();
          startDate.setMonth(0);
          startDate.setDate(1);
          zoomApexChart(chartId, startDate, new Date());
          break;
        }
        case 'ALL': {
          zoomApexChart(chartId, new Date(data[0].data[0][0]), new Date());
          break;
        }
      }
    },
    [data, chartId]
  );

  const resetTooltip = useCallback(() => {
    if (resetTooltipValue) {
      setTooltipValue({
        x: resetTooltipValue,
        y: new Date(),
      });
    }
  }, [resetTooltipValue]);

  useEffect(() => {
    resetTooltip();
  }, [resetTooltip]);

  useEffect(() => {
    if (data[0].data.length > 0) {
      updateTimeline('YTD');
    }
  }, [data, updateTimeline]);

  const chartOptions: ApexOptions = {
    chart: {
      id: chartId,
      type: 'area',
      height: height,
      zoom: {
        autoScaleYaxis: true,
      },
      events: {
        mouseLeave: () => {
          resetTooltip();
        },
        mouseMove: (event: any, chartContext: any, config: any) => {
          const seriesIndex = config.seriesIndex;
          const dataPointIndex =
            config.dataPointIndex === -1 ? 0 : config.dataPointIndex;
          const w = chartContext.w;

          if (seriesIndex !== -1) {
            const data =
              w.globals.initialSeries[seriesIndex].data[dataPointIndex];
            setTooltipValue({ x: data[1], y: new Date(data[0]) });
          } else {
            resetTooltip();
          }
        },
      },
    },
    dataLabels: {
      enabled: false,
    },
    markers: {
      size: 0,
    },
    yaxis: {
      tickAmount: 5,
      labels: {
        formatter: function (val: number) {
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
      min:
        data[0].data[0] && data[0].data[0].length !== 0
          ? new Date(data[0].data[0][0]).getTime()
          : new Date().getTime(),
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
      custom: () => '',
    },
    ...options,
  };

  return (
    <Card>
      <Flex justify='center'>
        {canZoom && (
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
              {(
                [
                  'ALL',
                  'YTD',
                  'ONE_YEAR',
                  'SIX_MONTHS',
                  'ONE_MONTH',
                ] as ChartTimeline[]
              ).map((timeline: ChartTimeline) => (
                <MenuItem
                  onClick={() => updateTimeline(timeline)}
                  key={timeline}
                >
                  <Text>{chartTimelineToString(timeline)}</Text>
                </MenuItem>
              ))}
            </MenuList>
          </Menu>
        )}
      </Flex>
      <Flex w='100%' flexDirection='row'>
        <Flex w='8%' justify='center' align='center'>
          <Stat
            style={{
              display: 'flex',
              justifyContent: 'center',
            }}
          >
            <StatLabel>{tooltipTitle}</StatLabel>
            <StatNumber>{formatCurrency(tooltipValue.x)}</StatNumber>
            <StatHelpText>{tooltipValue.y.toLocaleDateString()}</StatHelpText>
          </Stat>
        </Flex>
        <Box minW='92%' minH={`${height}px`} mt='auto'>
          <div id={chartId} style={{ zIndex: 0 }}>
            <ReactApexChart
              options={chartOptions}
              series={data}
              type='area'
              width='100%'
              height={height}
            />
          </div>
        </Box>
      </Flex>
    </Card>
  );
};

export default LineChart;
