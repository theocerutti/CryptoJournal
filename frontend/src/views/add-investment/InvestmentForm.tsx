import React, { useEffect } from 'react';
import { useFormik } from 'formik';
import { Button, HStack, useToast, VStack } from '@chakra-ui/react';
import * as Yup from 'yup';
import { createInvestmentMutation, INVESTMENT_QUERY_KEY, updateInvestmentMutation } from '../../queries/investments';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import dayjs from 'dayjs';
import { useHistory } from 'react-router-dom';
import { CreateInvestmentDto, GetInvestmentDto, UpdateInvestmentDto } from '@shared/investment';
import FormikInput from '../../components/form/FormikInput';
import { showToast } from '../../utils/toast';

const validationSchema = Yup.object().shape({
  buyDate: Yup.date().required('Buy date is required'),
  sellDate: Yup.date().nullable().optional(),
  buyPrice: Yup.number().min(0, 'Buy price cannot be negative').required('Buy price is required'),
  sellPrice: Yup.number().nullable().min(0, 'Sell price cannot be negative').optional(),
  buyNote: Yup.string().nullable().optional(),
  sellNote: Yup.string().nullable().optional(),
  name: Yup.string().required('Name is required'),
  fees: Yup.number().min(0, 'Fees cannot be negative').optional(),
  investedAmount: Yup.number().min(0, 'Invested amount cannot be negative').required('Invested amount is required'),
  holdings: Yup.number().min(0).required('Holdings are required'),
  locationName: Yup.string().nullable().optional(),
  primaryTag: Yup.string().nullable().optional(),
  secondaryTag: Yup.string().nullable().optional(),
  priceLink: Yup.string().url("This link doesn't seems to be an url").required('Price link is required'),
});

const InvestmentForm = ({ editInvestment }: { editInvestment: GetInvestmentDto | null }) => {
  const toast = useToast();
  const history = useHistory();
  const queryClient = useQueryClient();

  const showSuccessToast = () => {
    showToast(toast, `Successfully ${editInvestment ? 'updated' : 'created'} investment`);
  };

  const mutationCreate = useMutation(createInvestmentMutation, {
    onSuccess: () => {
      // queryClient.setQueryData(['INVESTMENT_QUERY_KEY', res.investment.id], res.investment); TODO
      queryClient.invalidateQueries([INVESTMENT_QUERY_KEY]);
      history.push('/dashboard');
      showSuccessToast();
    },
  });

  const mutationUpdate = useMutation(updateInvestmentMutation, {
    onSuccess: () => {
      // queryClient.setQueryData(['INVESTMENT_QUERY_KEY', res.investment.id], res.investment); TODO
      queryClient.invalidateQueries([INVESTMENT_QUERY_KEY]);
      history.push('/dashboard');
      showSuccessToast();
    },
  });

  const formik = useFormik({
    initialValues: {
      buyDate: editInvestment ? new Date(editInvestment.buyDate) : new Date(),
      sellDate: editInvestment ? (editInvestment.sellDate === null ? null : new Date(editInvestment.sellDate)) : null,
      // @ts-ignore
      type: editInvestment ? editInvestment.type : 'NONE',
      buyPrice: editInvestment ? editInvestment.buyPrice : 0,
      sellPrice: editInvestment ? editInvestment.sellPrice : null,
      buyNote: editInvestment ? editInvestment.buyNote : null,
      sellNote: editInvestment ? editInvestment.sellNote : null,
      name: editInvestment ? editInvestment.name : 'BTC',
      fees: editInvestment ? editInvestment.fees : 0,
      investedAmount: editInvestment ? editInvestment.investedAmount : 0,
      holdings: editInvestment ? editInvestment.holdings : 0,
      locationName: editInvestment ? editInvestment.locationName : 'Binance',
      primaryTag: editInvestment ? editInvestment.primaryTag : 'Crypto',
      secondaryTag: editInvestment ? editInvestment.secondaryTag : 'Bitcoin',
      priceLink: editInvestment ? editInvestment.priceLink : 'https://coinmarketcap.com/currencies/bitcoin/',
    },
    validationSchema: validationSchema,
    onSubmit: (values: CreateInvestmentDto | UpdateInvestmentDto) => {
      values.buyDate = dayjs(values.buyDate).toDate();
      values.sellDate = dayjs(values.sellDate).toDate();

      if (editInvestment) {
        const v = values as UpdateInvestmentDto;
        v.id = editInvestment.id;
        mutationUpdate.mutate(v);
      } else {
        mutationCreate.mutate(values as CreateInvestmentDto);
      }
    },
  });

  useEffect(() => {
    const { buyPrice, investedAmount } = formik.values;
    let holdings = 0;
    if (buyPrice !== null && investedAmount !== null && buyPrice !== 0) holdings = investedAmount / buyPrice;
    formik.setFieldValue('holdings', holdings);
    // eslint-disable-next-line
  }, [formik.values.buyPrice, formik.values.investedAmount]);

  return (
    <form onSubmit={formik.handleSubmit}>
      <VStack spacing={4} align='flex-start'>
        <HStack width='100%' spacing='10px'>
          <FormikInput
            formik={formik}
            valueKey='name'
            label='Name'
            tooltip='Name of the investment (BTC, ETH, S&P500...)'
            required
          />
          <FormikInput
            formik={formik}
            valueKey='investedAmount'
            label='Invested amount'
            tooltip='Amount of money invested'
            type='number'
            inputLeftElement='$'
            required
          />
          <FormikInput
            formik={formik}
            valueKey='holdings'
            label='Holdings'
            tooltip="This field is automatically calculated using 'Invested Amount' and 'Buy Price'"
            type='number'
            disabled
            required
          />
        </HStack>
        <HStack width='100%' spacing='10px'>
          <FormikInput
            formik={formik}
            valueKey='buyPrice'
            label='Buy price'
            tooltip='Price at which you bought the investment'
            type='number'
            inputLeftElement='$'
            required
          />
          <FormikInput
            formik={formik}
            valueKey='buyDate'
            label='Buy date'
            tooltip='Date at which you bought the investment'
            type='date'
            required
          />
        </HStack>
        <HStack width='100%' spacing='10px'>
          <FormikInput
            formik={formik}
            valueKey='sellPrice'
            label='Sell price'
            tooltip='Price at which you sold the investment'
            type='number'
            inputLeftElement='$'
          />
          <FormikInput
            formik={formik}
            valueKey='sellDate'
            label='Sell date'
            tooltip='Date at which you sold the investment'
            type='date'
          />
        </HStack>
        <HStack width='100%' spacing='10px'>
          <FormikInput
            formik={formik}
            valueKey='fees'
            label='Fees'
            tooltip='Fees paid for the investment'
            type='number'
            inputLeftElement='$'
            required
          />
          <FormikInput
            formik={formik}
            valueKey='type'
            label='Investment Type'
            tooltip='Specify Type of the investment'
            type='select'
            selectValues={['NONE', 'GIFT']}
            required
          />
        </HStack>
        <HStack width='100%' spacing='10px'>
          <FormikInput
            formik={formik}
            valueKey='priceLink'
            label='Price link'
            tooltip='Link to the price of the investment'
            type='url'
            required
          />
          <FormikInput
            formik={formik}
            valueKey='locationName'
            label='Location Name'
            tooltip='Name of the location where you bought the investment'
          />
        </HStack>
        <HStack width='100%' spacing='10px'>
          <FormikInput
            formik={formik}
            valueKey='primaryTag'
            label='Primary tag'
            tooltip='Primary tag of the investment'
          />
          <FormikInput
            formik={formik}
            valueKey='secondaryTag'
            label='Secondary tag'
            tooltip='Secondary tag of the investment'
          />
        </HStack>
        <HStack width='100%' spacing='10px'>
          <FormikInput
            formik={formik}
            valueKey='buyNote'
            label='Buy note'
            tooltip='Note about the buy'
            type='textarea'
          />
          <FormikInput
            formik={formik}
            valueKey='sellNote'
            label='Sell note'
            tooltip='Note about the sell'
            type='textarea'
          />
        </HStack>

        <HStack justify='end' w='100%'>
          <Button onClick={() => history.push('/dashboard')} colorScheme='grey' mr={3}>
            Close
          </Button>
          <Button isLoading={formik.isSubmitting} type='submit' colorScheme='blue' mr={3}>
            {editInvestment ? 'Update' : 'Add'}
          </Button>
        </HStack>
      </VStack>
    </form>
  );
};

export default InvestmentForm;
