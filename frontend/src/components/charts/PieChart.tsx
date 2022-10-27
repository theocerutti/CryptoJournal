import React from 'react';
import { ChartProps } from './index';
import Card from '../card/Card';
import { Box, Flex, Heading } from '@chakra-ui/react';
import ReactApexChart from 'react-apexcharts';
import { ApexOptions } from 'apexcharts';
import { globalStyles } from '../../theme/styles';
import { formatCurrency } from '../../utils/format';

type PieChartProps = {
  data: { [label: string]: number };
  title?: string;
  shouldFormatCurrency?: boolean;
} & ChartProps;

const PieChart = ({
  chartId,
  data,
  height = 350,
  title,
  options = {},
  shouldFormatCurrency = false,
}: PieChartProps) => {
  // @ts-ignore
  const colors = Object.keys(globalStyles.colors.navy).map((color) => globalStyles.colors.navy[color]);

  const chartOptions: ApexOptions = {
    chart: {
      type: 'pie',
      animations: {
        enabled: false,
      },
    },
    legend: {
      show: false,
    },
    stroke: {
      show: false,
    },
    tooltip: {
      y: {
        title: {
          formatter: () => '',
        },
        formatter: function (v: any, opts: any) {
          const label = opts.config.labels[opts.seriesIndex];
          const value = opts.config.series[opts.seriesIndex];

          return `${label}: ${shouldFormatCurrency ? formatCurrency(value) : value}`;
        },
      },
    },
    dataLabels: {
      enabled: true,
      formatter: function (val: any, opts: any) {
        return opts.w.globals.labels[opts.seriesIndex];
      },
    },
    plotOptions: {
      pie: {
        expandOnClick: false,
      },
    },
    colors,
    title: {
      style: {
        fontSize: '20px',
      },
    },
    labels: Object.keys(data).map((label) => label),
    ...options,
  };

  return (
    <Card>
      <Flex w='100%'>
        <Box minW='92%' minH={`${height}px`} height='100%' mt='auto'>
          <div id={chartId} style={{ zIndex: 0, height: '100%' }}>
            <Heading size={'md'}>{title}</Heading>
            {data && Object.keys(data).length > 0 ? (
              <ReactApexChart
                options={chartOptions}
                series={Object.keys(data).map((key) => data[key])}
                type='pie'
                width='100%'
                height={height}
              />
            ) : (
              <Flex height='100%' width='100%' justify='center' align='center'>
                No data
              </Flex>
            )}
          </div>
        </Box>
      </Flex>
    </Card>
  );
};

export default PieChart;
