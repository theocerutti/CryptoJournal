import {
  Button,
  Flex,
  HStack,
  Icon,
  Link,
  Stat,
  StatHelpText,
  StatLabel,
  Text,
  Tooltip,
  useColorModeValue,
} from '@chakra-ui/react';
import Table from 'components/table/Table';
import React from 'react';
import { GetInvestmentDto } from '@shared/investment';
import { MdDelete, MdEdit } from 'react-icons/md';
import { RiCheckboxBlankCircleFill } from 'react-icons/ri';
import { formatCurrency } from '../../../utils/format';
import { getSign } from '../../../utils/math';
import { MultiCheckBoxColumnFilter } from '../../../components/table/MultiCheckBoxColumnFilter';

export enum OrderInvestmentStatus {
  OPEN = 'OPEN',
  CLOSED = 'CLOSED',
}

const InvestmentTable = ({
  investments,
  handleDelete,
  handleEdit,
}: {
  investments: GetInvestmentDto[];
  handleDelete: (investmentID: number) => void;
  handleEdit: (investment: GetInvestmentDto) => void;
}) => {
  const orderInvestmentStatusOpenColor = useColorModeValue(
    'green.500',
    'green.500'
  );
  const orderInvestmentStatusClosedColor = useColorModeValue(
    'orange.500',
    'orange.500'
  );
  const textColorSecondary = 'secondaryGrey.600';

  const getGrowthColor = (value: number) => {
    if (value === 0) return textColorSecondary;
    return value > 0 ? 'green.500' : 'red.500';
  };

  const columns = [
    {
      Header: 'STATUS',
      accessor: 'orderStatus',
      Cell: ({ value }: { value: OrderInvestmentStatus }) => (
        <Tooltip label={value} placement='top'>
          <Flex width='100%' justify='center'>
            <Icon
              color={
                value === OrderInvestmentStatus.OPEN
                  ? orderInvestmentStatusOpenColor
                  : orderInvestmentStatusClosedColor
              }
              as={RiCheckboxBlankCircleFill}
            />
          </Flex>
        </Tooltip>
      ),
    },
    {
      Header: 'NAME',
      accessor: 'name',
      Cell: ({ value, row }: { value: string; row: any }) => (
        <Stat>
          <StatLabel>
            <Link href={row.original.priceLink}>{value}</Link>
          </StatLabel>
          {row.original.orderStatus === OrderInvestmentStatus.OPEN && (
            <StatHelpText fontSize='12px'>
              {formatCurrency(row.original.price)}
            </StatHelpText>
          )}
        </Stat>
      ),
      Filter: MultiCheckBoxColumnFilter,
      filter: 'multiSelect',
      disableSortBy: true,
    },
    {
      Header: 'BALANCE',
      accessor: 'total',
      Cell: ({ value }: { value: number }) => formatCurrency(value),
    },
    {
      Header: 'INVESTED AMOUNT',
      accessor: 'investedAmount',
      Cell: ({ value }: { value: number }) => formatCurrency(value),
    },
    {
      Header: 'PNL',
      accessor: 'pnl',
      Cell: ({ value, row }: { value: number; row: any }) => (
        <Flex align='center'>
          <Text
            color={getGrowthColor(value)}
            fontSize='xs'
            fontWeight='700'
            me='5px'
          >
            {getSign(value)}
            {formatCurrency(Math.abs(value))} (
            {row.original.pnlPercent?.toFixed(2)}%)
          </Text>
        </Flex>
      ),
    },
    {
      Header: 'HOLDINGS',
      accessor: 'holdings',
      Cell: ({ value }: { value: number }) => value.toFixed(3),
    },
    {
      Header: 'BUY PRICE',
      accessor: 'buyPrice',
      Cell: ({ value }: { value: number }) => formatCurrency(value),
    },
    {
      Header: 'BUY DATE',
      accessor: 'buyDate',
      Cell: ({ value }: { value: string }) =>
        value ? new Date(value).toLocaleDateString() : '--',
    },
    {
      Header: 'SELL PRICE',
      accessor: 'sellPrice',
      Cell: ({ value }: { value: number }) =>
        value ? formatCurrency(value) : '--',
    },
    {
      Header: 'SELL DATE',
      accessor: 'sellDate',
      Cell: ({ value }: { value: string }) =>
        value ? new Date(value).toLocaleDateString() : '--',
    },
    {
      Header: 'FEES',
      accessor: 'fees',
      Cell: ({ value }: { value: number }) =>
        value !== 0 ? formatCurrency(value) : '--',
    },
    {
      Header: 'LOCATION NAME',
      accessor: 'locationName',
      Filter: MultiCheckBoxColumnFilter,
      filter: 'multiSelect',
      disableSortBy: true,
    },
    {
      id: 'actions',
      Cell: ({ row }: { row: { original: GetInvestmentDto } }) => (
        <HStack>
          <Button
            onClick={() => handleEdit(row.original)}
            colorScheme='yellow'
            variant='ghost'
          >
            <Icon as={MdEdit} />
          </Button>
          <Button
            onClick={() => handleDelete(row.original.id)}
            colorScheme='red'
            variant='ghost'
          >
            <Icon as={MdDelete} />
          </Button>
        </HStack>
      ),
    },
  ];

  return <Table data={investments} columns={columns} />;
};

export default InvestmentTable;
