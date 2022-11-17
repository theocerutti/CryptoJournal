import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { defaultQueryConfig } from '../../../queries/config';
import { Alert, Flex, Link, Stat, StatHelpText, StatLabel, Text, Image, Icon } from '@chakra-ui/react';
import CenteredSpinner from '../../../components/CenteredSpinner';
import NoDataTable from '../../../components/NoDataTable';
import { getGlobalInfoQuery, GLOBAL_INFO_QUERY_KEY } from '../../../queries/global-info';
import { formatCurrency } from '../../../utils/format';
import { MultiCheckBoxColumnFilter } from '../../../components/table/MultiCheckBoxColumnFilter';
import { getGrowthColor } from '../../../utils/colors';
import { getSign, toSpecialPrecision } from '../../../utils/math';
import Table from '../../../components/table/Table';
import { GlobalInfoAssetDto } from '@shared/global-info';
import { BsQuestionCircle } from 'react-icons/bs';

const AssetPNLTable = () => {
  const { data, isError, isLoading, isSuccess } = useQuery([GLOBAL_INFO_QUERY_KEY], getGlobalInfoQuery, {
    ...defaultQueryConfig,
  });

  if (isError) return <Alert status='error'>Can't fetch transactions</Alert>;

  if (isLoading) return <CenteredSpinner />;

  if (isSuccess) {
    if (data.data?.globalInfoAssets.length === 0) return <NoDataTable>No Data</NoDataTable>;

    const columns = [
      {
        Header: 'LOGO',
        accessor: 'assetLogoURL',
        Cell: ({ value }: { value: string }) => (value ? <Image src={value} /> : <Icon as={BsQuestionCircle} />),
      },
      {
        Header: 'NAME',
        accessor: 'asset.name',
        Cell: ({ value, row }: { value: string; row: any }) => (
          <Flex alignItems='center' flexDirection='row'>
            <Stat>
              <StatLabel>
                <Link href={row.original.asset.priceTrackerUrl}>{value}</Link>
              </StatLabel>
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
        Header: 'PNL',
        accessor: 'pnl',
        Cell: ({ value, row }: { value: number; row: any }) => (
          <Flex align='center'>
            <Text color={getGrowthColor(value)} fontSize='xs' fontWeight='700' me='5px'>
              {getSign(value)}
              {formatCurrency(Math.abs(value))} ({toSpecialPrecision(row.original.pnlPercent)}%)
            </Text>
          </Flex>
        ),
      },
      {
        Header: 'HOLDINGS',
        accessor: 'amount',
        Cell: ({ value, row }: { value: number; row: { original: GlobalInfoAssetDto } }) =>
          `${toSpecialPrecision(value)} ${row.original.asset.name}`,
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

export default AssetPNLTable;
