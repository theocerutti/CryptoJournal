import React from 'react';

const ChartAssets = () => {
  return <div></div>;
  // const [chartData, setData] = useState<{ [label: string]: number }>({});
  // const [loadingCalculation, setLoadingCalculation] = useState(true);
  // const { data, isError, isSuccess } = useQuery([INVESTMENT_QUERY_KEY], getInvestmentsQuery, {
  //   ...defaultQueryConfig,
  // });
  //
  // useEffect(() => {
  //   if (isSuccess) {
  //     setLoadingCalculation(true);
  //     const updatedChartData = {} as { [key: string]: number };
  //     for (let i = 0; i < data.data.length; i++) {
  //       const investment = data.data[i] as GetInvestmentDto;
  //       if (updatedChartData[investment.name]) {
  //         updatedChartData[investment.name] += 1;
  //       } else {
  //         updatedChartData[investment.name] = 1;
  //       }
  //     }
  //     setData(updatedChartData);
  //     setLoadingCalculation(false);
  //   }
  // }, [isSuccess]);
  //
  // if (isError) return <Alert status='error'>Can't fetch investments</Alert>;
  // if (loadingCalculation) return <CenteredSpinner />;
  //
  // return <PieChart title='Number of investments by asset' chartId='pie-chart-assets' data={chartData} />;
};

export default ChartAssets;
