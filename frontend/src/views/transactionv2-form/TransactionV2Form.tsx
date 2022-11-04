import React, { useState } from 'react';
import { useFormik } from 'formik';
import { Button, Heading, HStack, Icon, useToast, VStack } from '@chakra-ui/react';
import * as Yup from 'yup';
import { INVESTMENT_QUERY_KEY } from '../../queries/investments';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import dayjs from 'dayjs';
import { useHistory } from 'react-router-dom';
import { CreateTransactionV2Dto, GetTransactionV2Dto, UpdateTransactionV2Dto } from '@shared/transactionv2';
import FormikInput from '../../components/form/FormikInput';
import { showToast } from '../../utils/toast';
import { createTransactionV2Mutation, updateTransactionV2Mutation } from '../../queries/transactionv2';
import { ScrapeSite } from '../investment-form/InvestmentForm';
import { MdArrowRightAlt } from 'react-icons/md';

const validationSchema = Yup.object().shape({
  from: Yup.object({
    asset: Yup.string().required('From Asset is required'),
    priceLink: Yup.string().required('Price link is required'),
    amount: Yup.number().required('Amount is required'),
    price: Yup.number().required('Price is required'),
  }),
  to: Yup.object({
    asset: Yup.string().required('From Asset is required'),
    priceLink: Yup.string().required('Price link is required'),
    amount: Yup.number().required('Amount is required'),
    price: Yup.number().required('Price is required'),
  }),
  note: Yup.string().nullable().optional(),
  fees: Yup.number().min(0, 'Fees cannot be negative').optional(),
  feesCurrency: Yup.string().required(),
  date: Yup.date().required('Buy date is required'),
});

const TransactionV2Form = ({ editTransaction }: { editTransaction: GetTransactionV2Dto | null }) => {
  const toast = useToast();
  const history = useHistory();
  const queryClient = useQueryClient();
  const [priceLinkToHostname, setPriceLinkToHostname] = useState(
    editTransaction ? new URL(editTransaction.to.priceLink).hostname : ScrapeSite.CoinMarketCap
  );
  const [priceLinkFromHostname, setPriceLinkFromHostname] = useState(
    editTransaction ? new URL(editTransaction.from.priceLink).hostname : ScrapeSite.CoinMarketCap
  );

  const showSuccessToast = () => {
    showToast(toast, `Successfully ${editTransaction ? 'updated' : 'created'} transaction`);
  };

  const mutationCreate = useMutation(createTransactionV2Mutation, {
    onSuccess: () => {
      // queryClient.setQueryData(['INVESTMENT_QUERY_KEY', res.investment.id], res.investment); TODO
      queryClient.invalidateQueries([INVESTMENT_QUERY_KEY]);
      history.push('/dashboard');
      showSuccessToast();
    },
  });

  const mutationUpdate = useMutation(updateTransactionV2Mutation, {
    onSuccess: () => {
      // queryClient.setQueryData(['INVESTMENT_QUERY_KEY', res.investment.id], res.investment); TODO
      queryClient.invalidateQueries([INVESTMENT_QUERY_KEY]);
      history.push('/dashboard');
      showSuccessToast();
    },
  });

  const formik = useFormik({
    initialValues: {
      date: editTransaction ? new Date(editTransaction.date) : new Date(),
      from: {
        asset: editTransaction ? editTransaction.from.asset : '',
        priceLink: editTransaction ? editTransaction.from.priceLink : '/currencies/bitcoin/',
        amount: editTransaction ? editTransaction.from.amount : 0,
        price: editTransaction ? editTransaction.from.price : 0,
      },
      to: {
        asset: editTransaction ? editTransaction.to.asset : '',
        priceLink: editTransaction ? editTransaction.to.priceLink : '/currencies/ethereum/',
        amount: editTransaction ? editTransaction.to.amount : 0,
        price: editTransaction ? editTransaction.to.price : 0,
      },
      fees: editTransaction ? editTransaction.fees : 0,
      feesCurrency: editTransaction ? editTransaction.feesCurrency : '',
      note: editTransaction ? editTransaction.note : '',
    },
    validationSchema: validationSchema,
    onSubmit: (values: CreateTransactionV2Dto | UpdateTransactionV2Dto) => {
      values.date = dayjs(values.date).toDate();

      console.log('LA?');

      if (editTransaction) {
        const v = values as UpdateTransactionV2Dto;
        v.id = editTransaction.id;
        return mutationUpdate.mutateAsync(v);
      } else {
        return mutationCreate.mutateAsync(values as CreateTransactionV2Dto);
      }
    },
  });

  return (
    <form onSubmit={formik.handleSubmit}>
      <VStack spacing={4} align='flex-start'>
        <HStack width='100%' spacing='10px'>
          <VStack width='48%' align='end'>
            <VStack>
              <HStack width='100%'>
                <Heading size='lg'>From</Heading>
              </HStack>
              <FormikInput
                formik={formik}
                valueKey='from.asset'
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
                tooltip='Price of the asset when you converted it'
                type='number'
                required
              />
              <FormikInput
                formik={formik}
                valueKey='from.priceLink'
                label='Price link'
                tooltip='Link to the price of the asset'
                type='select-with-input'
                selectValues={Object.values(ScrapeSite)}
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
            <VStack>
              <HStack width='100%'>
                <Heading size='lg'>To</Heading>
              </HStack>
              <FormikInput
                formik={formik}
                valueKey='to.asset'
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
                tooltip='Price of the asset'
                type='number'
                required
              />
              <FormikInput
                formik={formik}
                valueKey='to.priceLink'
                label='Price link'
                tooltip='Link to the price of the asset'
                type='select-with-input'
                selectValues={Object.values(ScrapeSite)}
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
              valueKey='feesCurrency'
              label='Fees Currency'
              tooltip='Currency in which you paid the fees'
              type='text'
              required
            />
            <FormikInput formik={formik} valueKey='fees' label='Fees' tooltip='Fees amount' type='number' required />
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

export default TransactionV2Form;
