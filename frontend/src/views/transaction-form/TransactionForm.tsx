import React from 'react';
import { useFormik } from 'formik';
import { Button, Heading, HStack, Icon, useToast, VStack } from '@chakra-ui/react';
import * as Yup from 'yup';
import { createTransactionMutation, TRANSACTION_QUERY_KEY, updateTransactionMutation } from '../../queries/transaction';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import dayjs from 'dayjs';
import { useHistory } from 'react-router-dom';
import { CreateTransactionDto, GetTransactionDto, UpdateTransactionDto } from '@shared/transaction';
import FormikInput from '../../components/form/FormikInput';
import { showToast } from '../../utils/toast';
import { MdArrowRightAlt } from 'react-icons/md';
import { GetAssetDto } from '@shared/asset';

export enum ScrapeSite {
  CoinMarketCap = 'coinmarketcap.com',
  Investing = 'investing.com',
  JustEtf = 'justetf.com', // TODO: scrape price in EUR.. need to convert to USD
}

const validationSchema = Yup.object().shape({
  from: Yup.object({
    amount: Yup.number().required('Amount is required'),
    price: Yup.number().required('Price is required'),
  }),
  to: Yup.object({
    amount: Yup.number().required('Amount is required'),
    price: Yup.number().required('Price is required'),
  }),
  note: Yup.string().nullable().optional(),
  feeAmount: Yup.number().min(0, 'Fees cannot be negative').optional(),
  feePrice: Yup.number().min(0, 'Fees cannot be negative').optional(),
  date: Yup.date().required('Buy date is required'),
});

const TransactionForm = ({
  editTransaction,
  assets,
}: {
  editTransaction: GetTransactionDto | null;
  assets: GetAssetDto[];
}) => {
  const toast = useToast();
  const history = useHistory();
  const queryClient = useQueryClient();

  const showSuccessToast = () => {
    showToast(toast, `Successfully ${editTransaction ? 'updated' : 'created'} transaction`);
  };

  const mutationCreate = useMutation(createTransactionMutation, {
    onSuccess: () => {
      // queryClient.setQueryData(['INVESTMENT_QUERY_KEY', res.investment.id], res.investment); TODO
      queryClient.invalidateQueries([TRANSACTION_QUERY_KEY]);
      history.push('/dashboard');
      showSuccessToast();
    },
  });

  const mutationUpdate = useMutation(updateTransactionMutation, {
    onSuccess: () => {
      // queryClient.setQueryData(['INVESTMENT_QUERY_KEY', res.investment.id], res.investment); TODO
      queryClient.invalidateQueries([TRANSACTION_QUERY_KEY]);
      history.push('/dashboard');
      showSuccessToast();
    },
  });

  const formik = useFormik({
    initialValues: {
      from: {
        asset: {
          id: editTransaction?.from.asset.id || -1,
          name: editTransaction ? editTransaction.from.asset.name : '',
          priceTrackerUrl: editTransaction ? editTransaction.from.asset.priceTrackerUrl : '/currencies/bitcoin/',
        },
        amount: editTransaction ? editTransaction.from.amount : 0,
        price: editTransaction ? editTransaction.from.price : 0,
      },
      to: {
        asset: {
          id: editTransaction?.to.asset.id || -1,
          name: editTransaction ? editTransaction.to.asset.name : '',
          priceTrackerUrl: editTransaction ? editTransaction.to.asset.priceTrackerUrl : '/currencies/ethereum/',
        },
        amount: editTransaction ? editTransaction.to.amount : 0,
        price: editTransaction ? editTransaction.to.price : 0,
      },
      feeAmount: editTransaction ? editTransaction.feeAmount : 0,
      feePrice: editTransaction ? editTransaction.feePrice : 1,
      feeAsset: {
        id: editTransaction?.feeAsset.id || -1,
        name: editTransaction ? editTransaction.feeAsset.name : '',
        priceTrackerUrl: editTransaction ? editTransaction.feeAsset.priceTrackerUrl : '/currencies/tether/',
      },
      note: editTransaction ? editTransaction.note : '',
      date: editTransaction ? new Date(editTransaction.date) : new Date(),
    },
    validationSchema: validationSchema,
    onSubmit: (values: CreateTransactionDto | UpdateTransactionDto) => {
      values.date = dayjs(values.date).toDate();

      console.log(values);

      // if (editTransaction) {
      //   const v = values as UpdateTransactionDto;
      //   v.id = editTransaction.id;
      //   return mutationUpdate.mutateAsync(v);
      // } else {
      //   return mutationCreate.mutateAsync(values as CreateTransactionDto);
      // }
    },
  });

  const assetsNames = assets.map((a) => a.name);

  const getAssetFromName = (name: string) => {
    return assets.find((a) => a.name === name);
  };

  return (
    <form onSubmit={formik.handleSubmit}>
      <VStack spacing={4} align='flex-start'>
        <HStack width='100%' spacing='10px'>
          <VStack width='48%' align='end'>
            <VStack width='70%'>
              <HStack width='100%'>
                <Heading size='lg'>From</Heading>
              </HStack>
              <FormikInput
                formik={formik}
                valueKey='from.asset'
                label='Asset'
                tooltip='Name of the asset'
                type='select'
                setValue={(asset: GetAssetDto) => asset.name}
                onChange={(e: any) => {
                  formik.handleChange({ target: { name: 'from.asset', value: getAssetFromName(e.target.value) } });
                }}
                selectValues={assetsNames}
                required
              />
              <FormikInput
                formik={formik}
                valueKey='from.amount'
                label='Amount'
                tooltip='Amount of the asset you had'
                type='number'
                required
              />
              <FormikInput
                formik={formik}
                valueKey='from.price'
                label='Asset Price'
                tooltip='Price of the asset when you converted it (in USD)'
                type='number'
                inputLeftElement='$'
                required
              />
            </VStack>
          </VStack>
          <VStack width='4%' align='center' justify='center'>
            <Icon as={MdArrowRightAlt} fontSize='2rem' />
          </VStack>
          <VStack width='48%' align='flex-start'>
            <VStack width='70%'>
              <HStack width='100%'>
                <Heading size='lg'>To</Heading>
              </HStack>
              <FormikInput
                formik={formik}
                valueKey='to.asset'
                label='Asset'
                tooltip='Name of the asset'
                type='select'
                setValue={(asset: GetAssetDto) => asset.name}
                onChange={(e: any) =>
                  formik.handleChange({ target: { name: 'to.asset', value: getAssetFromName(e.target.value) } })
                }
                selectValues={assetsNames}
                required
              />
              <FormikInput
                formik={formik}
                valueKey='to.amount'
                label='Amount'
                tooltip='Amount of the asset you have now'
                type='number'
                required
              />
              <FormikInput
                formik={formik}
                valueKey='to.price'
                label='Asset Price'
                tooltip='Price of the asset (in USD)'
                type='number'
                inputLeftElement='$'
                required
              />
            </VStack>
          </VStack>
        </HStack>
        <VStack width='100%' spacing='10px'>
          <VStack width='30%'>
            <FormikInput
              formik={formik}
              valueKey='feeAmount'
              label='Fee Amount'
              tooltip='Quantity of fees'
              type='number'
              required
            />
            <FormikInput
              formik={formik}
              valueKey='feeAsset'
              label='Fee Asset Name'
              tooltip='Asset in which you paid the fees'
              type='select'
              setValue={(asset: GetAssetDto) => asset.name}
              onChange={(e: any) =>
                formik.handleChange({ target: { name: 'feeAsset', value: getAssetFromName(e.target.value) } })
              }
              selectValues={assetsNames}
              required
            />
            <FormikInput
              formik={formik}
              valueKey='feePrice'
              label='Price of the fee asset'
              tooltip='Price of the Asset in which you paid the fees (in USD)'
              type='number'
              inputLeftElement='$'
              required
            />
            <FormikInput
              formik={formik}
              valueKey='date'
              label='Date'
              tooltip='Date of the transaction'
              type='date'
              required
            />
            <FormikInput
              formik={formik}
              valueKey='note'
              label='Note'
              tooltip='Note about the transaction'
              type='textarea'
            />
          </VStack>
          <HStack justify='end' w='100%'>
            <Button onClick={() => history.push('/dashboard')} colorScheme='gray' mr={3}>
              Close
            </Button>
            <Button isLoading={formik.isSubmitting} type='submit' colorScheme='blue' mr={3}>
              {editTransaction ? 'Update' : 'Add'}
            </Button>
          </HStack>
        </VStack>
      </VStack>
    </form>
  );
};

export default TransactionForm;
