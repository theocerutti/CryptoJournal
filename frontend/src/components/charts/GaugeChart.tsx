import React from 'react';
import { ChartProps } from './index';
import { Box, Flex } from '@chakra-ui/react';
import ReactApexChart from 'react-apexcharts';
import { valueToPercent } from '../../utils/math';
import { ApexOptions } from 'apexcharts';
import { formatCurrency } from '../../utils/format';

type GaugeChartProps = {
  min?: number;
  max?: number;
  value?: number;
} & ChartProps;

const GaugeChart = ({
  value,
  min,
  max,
  chartId,
  height,
  options,
}: GaugeChartProps) => {
  const chartOptions: ApexOptions = {
    chart: {
      type: 'radialBar',
      offsetY: -20,
      sparkline: {
        enabled: true,
      },
    },
    plotOptions: {
      radialBar: {
        startAngle: -90,
        endAngle: 90,
        track: {
          background: '#e7e7e7',
          strokeWidth: '97%',
          margin: 5, // margin is in pixels
          dropShadow: {
            enabled: true,
            top: 2,
            left: 0,
            color: '#999',
            opacity: 1,
            blur: 2,
          },
        },
        dataLabels: {
          name: {
            show: false,
          },
          value: {
            offsetY: -2,
            fontSize: '30px',
            formatter: () => {
              return formatCurrency(value);
            },
          },
        },
      },
    },
    grid: {
      padding: {
        top: -10,
      },
    },
    ...options,
  };

  return (
    <Flex w='100%'>
      <Box minW='92%' minH={`${height}px`} mt='auto'>
        <div id={chartId} style={{ zIndex: 0 }}>
          <ReactApexChart
            options={chartOptions}
            series={[valueToPercent(value, max)]}
            type='radialBar'
            width='100%'
            height={height}
          />
        </div>
      </Box>
    </Flex>
  );
};

export default GaugeChart;
