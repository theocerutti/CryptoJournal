import React from 'react';
import { useFormik } from 'formik';
import { Button, HStack, useToast, VStack } from '@chakra-ui/react';
import * as Yup from 'yup';
import { INVESTMENT_QUERY_KEY } from '../../queries/investments';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import dayjs from 'dayjs';
import { useHistory } from 'react-router-dom';
import { UpdateInvestmentDto } from '@shared/investment';
import { CreateTransactionDto, GetTransactionDto, UpdateTransactionDto } from '@shared/transaction';
import FormikInput from '../../components/form/FormikInput';
import { showToast } from '../../utils/toast';
import { createTransactionMutation, updateTransactionMutation } from '../../queries/transactions';

const validationSchema = Yup.object().shape({
  date: Yup.date().required('Buy date is required'),
  amount: Yup.number().min(0, 'Amount cannot be negative').required('Amount is required'),
  fees: Yup.number().min(0, 'Fees cannot be negative').optional(),
  from: Yup.string().required('From is required'),
  toBank: Yup.boolean(),
  fromBank: Yup.boolean(),
  to: Yup.string().required('To is required'),
});

const TransactionForm = ({ editTransaction }: { editTransaction: GetTransactionDto | null }) => {
  const toast = useToast();
  const history = useHistory();
  const queryClient = useQueryClient();

  const showSuccessToast = () => {
    showToast(toast, `Successfully ${editTransaction ? 'updated' : 'created'} transaction`);
  };

  const mutationCreate = useMutation(createTransactionMutation, {
    onSuccess: () => {
      // queryClient.setQueryData(['INVESTMENT_QUERY_KEY', res.investment.id], res.investment); TODO
      queryClient.invalidateQueries([INVESTMENT_QUERY_KEY]);
      history.push('/dashboard');
      showSuccessToast();
    },
  });

  const mutationUpdate = useMutation(updateTransactionMutation, {
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
      from: editTransaction ? editTransaction.from : '',
      to: editTransaction ? editTransaction.to : '',
      fees: editTransaction ? editTransaction.fees : 0,
      amount: editTransaction ? editTransaction.amount : 0,
      toBank: editTransaction ? editTransaction.toBank : false,
      fromBank: editTransaction ? editTransaction.fromBank : false,
    },
    validationSchema: validationSchema,
    onSubmit: (values: CreateTransactionDto | UpdateTransactionDto) => {
      values.date = dayjs(values.date).toDate();

      if (editTransaction) {
        const v = values as UpdateInvestmentDto;
        v.id = editTransaction.id;
        mutationUpdate.mutate(v);
      } else {
        mutationCreate.mutate(values as CreateTransactionDto);
      }
    },
  });

  return (
    <form onSubmit={formik.handleSubmit}>
      <VStack spacing={4} align='flex-start'>
        <HStack width='50%' spacing='10px'>
          <FormikInput
            formik={formik}
            valueKey='amount'
            label='Amount'
            tooltip='Amount of money invested'
            type='number'
            inputLeftElement='$'
            required
          />
          <FormikInput
            formik={formik}
            valueKey='fees'
            label='Fees'
            tooltip='Fees paid for the transaction'
            type='number'
            inputLeftElement='$'
            required
          />
        </HStack>
        <HStack width='50%' spacing='10px'>
          <FormikInput
            formik={formik}
            valueKey='date'
            label='Date'
            tooltip='Date of the transaction'
            type='date'
            required
          />
        </HStack>
        <HStack width='50%' spacing='10px'>
          <FormikInput
            formik={formik}
            valueKey='fromBank'
            tooltip='Make sure to check this box if you receive this transaction to your bank!'
            label='From Bank'
            type='checkbox'
          />
          <FormikInput
            formik={formik}
            valueKey='toBank'
            tooltip='Make sure to check this box if you send this transaction to your bank!'
            label='To Bank'
            type='checkbox'
          />
        </HStack>
        <HStack width='50%' spacing='10px'>
          <FormikInput formik={formik} valueKey='from' label='From' tooltip='From' required />
          <FormikInput formik={formik} valueKey='to' label='To' tooltip='To' required />
        </HStack>

        <HStack justify='end' w='100%'>
          <Button onClick={() => history.push('/dashboard')} colorScheme='grey' mr={3}>
            Close
          </Button>
          <Button isLoading={formik.isSubmitting} type='submit' colorScheme='blue' mr={3}>
            {editTransaction ? 'Update' : 'Add'}
          </Button>
        </HStack>
      </VStack>
    </form>
  );
};

export default TransactionForm;
