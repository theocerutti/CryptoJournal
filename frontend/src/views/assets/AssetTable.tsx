import React from 'react';
import { Alert, Button, HStack, Icon, Link, useToast } from '@chakra-ui/react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { ASSET_QUERY_KEY, deleteAssetMutation, getAssetsQuery } from '../../queries/asset';
import { defaultQueryConfig } from '../../queries/config';
import { showToast } from '../../utils/toast';
import CenteredSpinner from '../../components/CenteredSpinner';
import NoDataTable from '../../components/NoDataTable';
import { useHistory } from 'react-router-dom';
import { GetAssetDto } from '@shared/asset';
import { MdDelete, MdEdit } from 'react-icons/md';
import Table from '../../components/table/Table';

const AssetsContainer = () => {
  const toast = useToast();
  const history = useHistory();
  const queryClient = useQueryClient();
  const { data, isError, isLoading, isSuccess } = useQuery([ASSET_QUERY_KEY], getAssetsQuery, {
    ...defaultQueryConfig,
  });

  const mutation = useMutation(deleteAssetMutation, {
    onSuccess: () => {
      queryClient.invalidateQueries([ASSET_QUERY_KEY]);
      showToast(toast, 'Asset deleted successfully', 'success');
    },
  });

  const handleDelete = (assetID: number) => {
    mutation.mutate(assetID);
  };

  const handleEdit = (asset: GetAssetDto) => {
    history.push('/dashboard/edit-asset', { asset });
  };

  if (isError) return <Alert status='error'>Can't fetch assets</Alert>;

  if (isLoading) return <CenteredSpinner />;

  if (isSuccess) {
    if (data.data.length === 0) return <NoDataTable message="You don't have any assets yet. Add one to get started." />;

    const columns = [
      {
        Header: 'NAME',
        accessor: 'name',
      },
      {
        Header: 'PRICE TRACKER',
        accessor: 'priceTrackerUrl',
        Cell: ({ value }: { value: string }) => <Link href={value}>{value}</Link>,
      },
      {
        id: 'actions',
        Cell: ({ row }: { row: { original: GetAssetDto } }) => (
          <HStack justify={'end'}>
            <Button onClick={() => handleEdit(row.original)} colorScheme='yellow' variant='ghost'>
              <Icon as={MdEdit} />
            </Button>
            <Button onClick={() => handleDelete(row.original.id)} colorScheme='red' variant='ghost'>
              <Icon as={MdDelete} />
            </Button>
          </HStack>
        ),
      },
    ];

    return <Table data={data.data} columns={columns} />;
  }
};

export default AssetsContainer;
