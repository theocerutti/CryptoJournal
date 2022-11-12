import React, { useState } from 'react';
import { useFormik } from 'formik';
import { Button, Heading, HStack, useToast, VStack } from '@chakra-ui/react';
import * as Yup from 'yup';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useHistory } from 'react-router-dom';
import { CreateAssetDto, GetAssetDto, UpdateAssetDto } from '@shared/asset';
import FormikInput from '../../components/form/FormikInput';
import { showToast } from '../../utils/toast';
import { ASSET_QUERY_KEY, createAssetMutation, updateAssetMutation } from '../../queries/asset';

export enum ScrapeSite {
  CoinMarketCap = 'coinmarketcap.com',
  Investing = 'investing.com',
  JustEtf = 'justetf.com', // TODO: scrape price in EUR.. need to convert to USD
}

const validationSchema = Yup.object().shape({
  name: Yup.string().required('Name of the asset is required'),
  priceTrackerUrl: Yup.string().required('Price tracker URL is required'),
});

const AssetForm = ({ editAsset }: { editAsset: GetAssetDto | null }) => {
  const toast = useToast();
  const history = useHistory();
  const queryClient = useQueryClient();
  const [priceTrackerHostname, setPriceTrackerHostname] = useState(
    editAsset ? new URL(editAsset.priceTrackerUrl).hostname : ScrapeSite.CoinMarketCap
  );

  const showSuccessToast = () => {
    showToast(toast, `Successfully ${editAsset ? 'updated' : 'created'} asset`);
  };

  const mutationCreate = useMutation(createAssetMutation, {
    onSuccess: () => {
      queryClient.invalidateQueries([ASSET_QUERY_KEY]);
      history.push('/dashboard');
      showSuccessToast();
    },
  });

  const mutationUpdate = useMutation(updateAssetMutation, {
    onSuccess: () => {
      queryClient.invalidateQueries([ASSET_QUERY_KEY]);
      history.push('/dashboard');
      showSuccessToast();
    },
  });

  const formik = useFormik({
    initialValues: {
      name: editAsset ? editAsset.name : '',
      priceTrackerUrl: editAsset ? editAsset.priceTrackerUrl : '/currencies/bitcoin/',
    },
    validationSchema: validationSchema,
    onSubmit: (values: CreateAssetDto | UpdateAssetDto) => {
      values.priceTrackerUrl = `${priceTrackerHostname}${values.priceTrackerUrl}`;
      if (editAsset) {
        const v = values as UpdateAssetDto;
        v.id = editAsset.id;
        return mutationUpdate.mutateAsync(v);
      } else {
        return mutationCreate.mutateAsync(values as CreateAssetDto);
      }
    },
  });

  return (
    <form onSubmit={formik.handleSubmit}>
      <Heading size='lg' mb='12px'>
        Add Asset
      </Heading>
      <VStack spacing={4} align='flex-start'>
        <VStack width='50%'>
          <FormikInput formik={formik} valueKey='name' label='Asset' tooltip='Name of the asset' type='text' required />
          <FormikInput
            formik={formik}
            valueKey='priceTrackerUrl'
            label='Price Tracker Url'
            tooltip='Link to the price of the asset'
            type='select-with-input'
            selectValues={Object.values(ScrapeSite).map((v) => `https://${v}`)}
            selectValue={priceTrackerHostname}
            onSelectChange={(e) => setPriceTrackerHostname(e.target.value)}
            required
          />
        </VStack>
        <HStack justify='end' w='100%'>
          {editAsset && (
            <Button onClick={() => history.goBack()} colorScheme='gray' mr={3}>
              Close
            </Button>
          )}
          <Button isLoading={formik.isSubmitting} type='submit' colorScheme='blue' mr={3}>
            {editAsset ? 'Update' : 'Add'}
          </Button>
        </HStack>
      </VStack>
    </form>
  );
};

export default AssetForm;
