import { ApexOptions } from 'apexcharts';

export * from './LineChart';
export * from './PieChart';
export * from './NumberChart';

export type ChartProps = {
  chartId: string;
  height?: number;
  options?: ApexOptions;
};
