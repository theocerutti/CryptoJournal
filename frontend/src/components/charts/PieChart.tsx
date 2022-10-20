import React from 'react';
import { ChartProps } from './index';
import Card from '../card/Card';
import { Box, Flex, Heading } from '@chakra-ui/react';
import ReactApexChart from 'react-apexcharts';
import { ApexOptions } from 'apexcharts';

type PieChartProps = {
  data: { [label: string]: number };
  title?: string;
} & ChartProps;

const PieChart = ({
                    chartId,
                    data,
                    height = 350,
                    title,
                    options = {},
                  }: PieChartProps) => {
  const chartOptions: ApexOptions = {
    chart: {
      type: 'pie',
    },
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
        <Box minW='92%' minH={`${height}px`} height="100%" mt='auto'>
          <div id={chartId} style={{ zIndex: 0, height: "100%" }}>
            <Heading size={'md'}>
              {title}
            </Heading>
            {data && data.length > 0 ? (
              <ReactApexChart
                options={chartOptions}
                series={Object.keys(data).map((key) => data[key])}
                type='pie'
                width='100%'
                height={height}
              />
            ) : (
              <Flex height="100%" width="100%" justify="center" align="center">No data</Flex>
            )}
          </div>
        </Box>
      </Flex>
    </Card>
  );
};

export default PieChart;
