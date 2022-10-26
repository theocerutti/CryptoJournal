export const zoomApexChart = (chartId: string, startDate: Date, endDate: Date) => {
  ApexCharts.exec(chartId, 'zoomX', startDate.getTime(), endDate.getTime());
};
