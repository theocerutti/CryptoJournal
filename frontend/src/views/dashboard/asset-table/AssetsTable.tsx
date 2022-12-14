import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { defaultQueryConfig } from '../../../queries/config';
import { Alert, Flex, Icon, Image, Stat, StatHelpText, StatLabel } from '@chakra-ui/react';
import CenteredSpinner from '../../../components/CenteredSpinner';
import NoDataTable from '../../../components/NoDataTable';
import { getGlobalInfoQuery, GLOBAL_INFO_QUERY_KEY } from '../../../queries/global-info';
import { formatCurrency } from '../../../utils/format';
import { MultiCheckBoxColumnFilter } from '../../../components/table/MultiCheckBoxColumnFilter';
import { toSpecialPrecision } from '../../../utils/math';
import Table from '../../../components/table/Table';
import { GlobalInfoAssetDto } from '@shared/global-info';
import { BsQuestionCircle } from 'react-icons/bs';

const AssetsTable = () => {
  const { data, isError, isLoading, isSuccess } = useQuery([GLOBAL_INFO_QUERY_KEY], getGlobalInfoQuery, {
    ...defaultQueryConfig,
  });

  if (isError) return <Alert status='error'>Can't fetch transactions</Alert>;

  if (isLoading) return <CenteredSpinner />;

  if (isSuccess) {
    if (!data.data?.globalInfoAssets || data.data?.globalInfoAssets.length === 0)
      return <NoDataTable>No Asset History. Please add a transaction!</NoDataTable>;

    const columns = [
      {
        Header: 'LOGO',
        accessor: 'logo',
        Cell: ({ value }: { value: string }) =>
          value ? <Image style={{ width: '32px', height: '32px' }} src={value} /> : <Icon as={BsQuestionCircle} />,
      },
      {
        Header: 'NAME',
        accessor: 'name',
        Cell: ({ value, row }: { value: string; row: any }) => (
          <Flex alignItems='center' flexDirection='row'>
            <Stat>
              <StatLabel>{value}</StatLabel>
              <StatHelpText fontSize='12px'>{formatCurrency(row.original.price)}</StatHelpText>
            </Stat>
          </Flex>
        ),
        Filter: MultiCheckBoxColumnFilter,
        filter: 'multiSelect',
        disableSortBy: true,
      },
      {
        Header: 'BALANCE',
        accessor: 'totalBalance',
        Cell: ({ value }: { value: number }) => formatCurrency(value),
      },
      {
        Header: 'HOLDINGS',
        accessor: 'amount',
        Cell: ({ value, row }: { value: number; row: { original: GlobalInfoAssetDto } }) =>
          `${toSpecialPrecision(value)} ${row.original.symbol}`,
      },
      {
        Header: 'FEES',
        accessor: 'fees',
        Cell: ({ value }: { value: number }) => formatCurrency(value),
      },
    ];

    return (
      <Table
        data={data.data?.globalInfoAssets}
        columns={columns}
        initialState={{
          sortBy: [{ id: 'totalBalance', desc: true }],
        }}
      />
    );
  }
};

export default AssetsTable;
