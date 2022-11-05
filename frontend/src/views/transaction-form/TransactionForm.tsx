import React, { useState } from 'react';
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

export enum ScrapeSite {
  CoinMarketCap = 'coinmarketcap.com',
  Investing = 'investing.com',
  JustEtf = 'justetf.com', // TODO: scrape price in EUR.. need to convert to USD
}

const validationSchema = Yup.object().shape({
  from: Yup.object({
    asset: Yup.object({
      name: Yup.string().required('Required'),
      priceTrackerUrl: Yup.string().required('Required'),
    }),
    amount: Yup.number().required('Amount is required'),
    price: Yup.number().required('Price is required'),
  }),
  to: Yup.object({
    asset: Yup.object({
      name: Yup.string().required('Required'),
      priceTrackerUrl: Yup.string().required('Required'),
    }),
    amount: Yup.number().required('Amount is required'),
    price: Yup.number().required('Price is required'),
  }),
  note: Yup.string().nullable().optional(),
  feeAmount: Yup.number().min(0, 'Fees cannot be negative').optional(),
  feePrice: Yup.number().min(0, 'Fees cannot be negative').optional(),
  feeAsset: Yup.object({
    name: Yup.string().required('Required'),
    priceTrackerUrl: Yup.string().required('Required'),
  }),
  date: Yup.date().required('Buy date is required'),
});

const TransactionForm = ({ editTransaction }: { editTransaction: GetTransactionDto | null }) => {
  const toast = useToast();
  const history = useHistory();
  const queryClient = useQueryClient();
  const [priceLinkToHostname, setPriceLinkToHostname] = useState(
    editTransaction ? new URL(editTransaction.to.asset.priceTrackerUrl).hostname : ScrapeSite.CoinMarketCap
  );
  const [priceLinkFromHostname, setPriceLinkFromHostname] = useState(
    editTransaction ? new URL(editTransaction.from.asset.priceTrackerUrl).hostname : ScrapeSite.CoinMarketCap
  );

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
          name: editTransaction ? editTransaction.from.asset.name : '',
          priceTrackerUrl: editTransaction ? editTransaction.from.asset.priceTrackerUrl : '/currencies/bitcoin/',
        },
        amount: editTransaction ? editTransaction.from.amount : 0,
        price: editTransaction ? editTransaction.from.price : 0,
      },
      to: {
        asset: {
          name: editTransaction ? editTransaction.to.asset.name : '',
          priceTrackerUrl: editTransaction ? editTransaction.to.asset.priceTrackerUrl : '/currencies/ethereum/',
        },
        amount: editTransaction ? editTransaction.to.amount : 0,
        price: editTransaction ? editTransaction.to.price : 0,
      },
      feeAmount: editTransaction ? editTransaction.feeAmount : 0,
      feePrice: editTransaction ? editTransaction.feePrice : 1,
      feeAsset: {
        name: editTransaction ? editTransaction.feeAsset.name : 'USD',
        priceTrackerUrl: editTransaction ? editTransaction.feeAsset.priceTrackerUrl : '/currencies/tether/',
      },
      note: editTransaction ? editTransaction.note : '',
      date: editTransaction ? new Date(editTransaction.date) : new Date(),
    },
    validationSchema: validationSchema,
    onSubmit: (values: CreateTransactionDto | UpdateTransactionDto) => {
      values.date = dayjs(values.date).toDate();

      console.log('LA?');

      if (editTransaction) {
        const v = values as UpdateTransactionDto;
        v.id = editTransaction.id;
        return mutationUpdate.mutateAsync(v);
      } else {
        return mutationCreate.mutateAsync(values as CreateTransactionDto);
      }
    },
  });

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
                valueKey='from.asset.name'
                label='Asset'
                tooltip='Name of the asset'
                type='text'
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
                label='Price'
                tooltip='Price of the asset when you converted it (in USD)'
                type='number'
                inputLeftElement='$'
                required
              />
              <FormikInput
                formik={formik}
                valueKey='from.asset.priceTrackerUrl'
                label='Price Tracker Url'
                tooltip='Link to the price of the asset'
                type='select-with-input'
                selectValues={Object.values(ScrapeSite).map((v) => `https://${v}`)}
                selectValue={priceLinkToHostname}
                onSelectChange={(e) => setPriceLinkToHostname(e.target.value)}
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
                valueKey='to.asset.name'
                label='Asset'
                tooltip='Name of the asset'
                type='text'
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
                label='Price'
                tooltip='Price of the asset (in USD)'
                type='number'
                inputLeftElement='$'
                required
              />
              <FormikInput
                formik={formik}
                valueKey='to.asset.priceTrackerUrl'
                label='Price Tracker Url'
                tooltip='Link to the price of the asset'
                type='select-with-input'
                selectValues={Object.values(ScrapeSite).map((v) => `https://${v}`)}
                selectValue={priceLinkFromHostname}
                onSelectChange={(e) => setPriceLinkFromHostname(e.target.value)}
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
              valueKey='feeAsset.name'
              label='Fee Asset Name'
              tooltip='Asset in which you paid the fees'
              type='text'
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
              required
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
