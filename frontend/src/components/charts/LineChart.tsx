import { Box, Button, Flex, Stat, StatHelpText, StatLabel, StatNumber } from '@chakra-ui/react';
import Card from 'components/card/Card';
import React, { useCallback, useEffect, useState } from 'react';
import ReactApexChart from 'react-apexcharts';
import { formatCurrency } from '../../utils/format';
import { zoomApexChart } from '../../utils/chart';
import { ChartProps } from './index';
import { ApexOptions } from 'apexcharts';
import { globalStyles } from '../../theme/styles';

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
  const { colors } = globalStyles;
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
    [data, chartId],
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
      type: 'line',
      height: height,
      animations: {
        easing: 'linear',
      },
      toolbar: {
        tools: {
          download: false,
          selection: true,
          zoom: true,
          zoomin: true,
          zoomout: true,
          pan: true,
        },
      },
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
    colors: [colors.brand['500']],
    dataLabels: {
      enabled: false,
    },
    stroke: {
      curve: 'smooth',
      lineCap: 'butt',
      width: 2,
    },
    markers: {
      size: 0,
    },
    legend: {
      show: false,
    },
    yaxis: {
      show: false,
    },
    xaxis: {
      type: 'datetime',
      crosshairs: {
        show: false
      },
      axisBorder: {
        show: false
      },
      axisTicks: {
        show: false,
      },
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
          colors: colors.secondaryGrey['500'],
          fontSize: '12px',
          fontWeight: '500',
        },
      },
    },
    grid: {
      show: false,
      xaxis: {
        lines: {
          show: false,
        },
      },
      yaxis: {
        lines: {
          show: false,
        },
      }
    },
    tooltip: {
      custom: () => '',
    },
    ...options,
  };

  return (
    <Card paddingRight='0' paddingLeft='0'>
      <Flex justify='space-around'>
        <Stat flex={0}>
          <StatLabel>{tooltipTitle}</StatLabel>
          <StatNumber>{formatCurrency(tooltipValue.x)}</StatNumber>
          <StatHelpText>{tooltipValue.y.toLocaleDateString()}</StatHelpText>
        </Stat>
        {canZoom && <Flex justify='center' align='center'>
          {(
            [
              'ALL',
              'YTD',
              'ONE_YEAR',
              'SIX_MONTHS',
              'ONE_MONTH',
            ] as ChartTimeline[]
          ).map((timeline: ChartTimeline) => (
            <Button onClick={() => updateTimeline(timeline)} size='sm' color={currentTimeline === timeline ? 'navy.300' : 'grey.400'} variant='ghost' key={timeline}>
              {chartTimelineToString(timeline)}
            </Button>
          ))}
        </Flex>}
      </Flex>
      <Flex w='100%' flexDirection='row'>
        <Box minW='100%' minH={`${height}px`} mt='auto'>
          <div id={chartId}>
            <ReactApexChart
              style={{ zIndex: 0 }}
              options={chartOptions}
              series={data}
              type='line'
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
