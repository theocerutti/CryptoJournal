import React from 'react';
import { useFormik } from 'formik';
import {
  Button,
  Flex,
  FormControl,
  FormErrorMessage,
  FormLabel,
  HStack,
  Input,
  InputGroup,
  InputLeftElement,
  Textarea,
  VStack,
} from '@chakra-ui/react';
import * as Yup from 'yup';
import {
  createInvestmentMutation,
  INVESTMENT_QUERY_KEY,
  updateInvestmentMutation,
} from '../../queries/investments';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import dayjs from 'dayjs';
import { useHistory, useLocation } from 'react-router-dom';
import {
  CreateInvestmentDto,
  GetInvestmentDto,
  UpdateInvestmentDto,
} from '@shared/investment';

const validationSchema = Yup.object().shape({
  buyDate: Yup.date().required('Buy date is required'),
  sellDate: Yup.date().nullable().optional(),
  buyPrice: Yup.number()
    .min(0, 'Buy price cannot be negative')
    .required('Buy price is required'),
  sellPrice: Yup.number()
    .nullable()
    .min(0, 'Sell price cannot be negative')
    .optional(),
  buyNote: Yup.string().nullable().optional(),
  sellNote: Yup.string().nullable().optional(),
  name: Yup.string().required('Name is required'),
  fees: Yup.number().min(0, 'Fees cannot be negative').optional(),
  investedAmount: Yup.number()
    .min(0, 'Invested amount cannot be negative')
    .required('Invested amount is required'),
  holdings: Yup.number().min(0).required('Holdings are required'),
  locationName: Yup.string().nullable().optional(),
  primaryTag: Yup.string().nullable().optional(),
  secondaryTag: Yup.string().nullable().optional(),
  priceLink: Yup.string()
    .url("This link doesn't seems to be an url")
    .required('Price link is required'),
});

const InvestmentForm = () => {
  const location = useLocation();
  const history = useHistory();
  const queryClient = useQueryClient();

  const isEditing = location.state !== undefined;
  // @ts-ignore
  const editInvestment = location.state?.investment as GetInvestmentDto;

  const mutationCreate = useMutation(createInvestmentMutation, {
    onSuccess: () => {
      // queryClient.setQueryData(['INVESTMENT_QUERY_KEY', res.investment.id], res.investment); TODO
      queryClient.invalidateQueries([INVESTMENT_QUERY_KEY]);
      history.push('/dashboard');
    },
  });

  const mutationUpdate = useMutation(updateInvestmentMutation, {
    onSuccess: () => {
      // queryClient.setQueryData(['INVESTMENT_QUERY_KEY', res.investment.id], res.investment); TODO
      queryClient.invalidateQueries([INVESTMENT_QUERY_KEY]);
      history.push('/dashboard');
    },
  });

  const formik = useFormik({
    initialValues: {
      buyDate: isEditing ? new Date(editInvestment.buyDate) : null,
      sellDate: isEditing
        ? editInvestment.sellDate === null
          ? null
          : new Date(editInvestment.sellDate)
        : null,
      buyPrice: isEditing ? editInvestment.buyPrice : 0,
      sellPrice: isEditing ? editInvestment.sellPrice : null,
      buyNote: isEditing ? editInvestment.buyNote : null,
      sellNote: isEditing ? editInvestment.sellNote : null,
      name: isEditing ? editInvestment.name : 'BTC',
      fees: isEditing ? editInvestment.fees : 0,
      investedAmount: isEditing ? editInvestment.investedAmount : 0,
      holdings: isEditing ? editInvestment.holdings : 0,
      locationName: isEditing ? editInvestment.locationName : 'Binance',
      primaryTag: isEditing ? editInvestment.primaryTag : 'Crypto',
      secondaryTag: isEditing ? editInvestment.secondaryTag : 'Bitcoin',
      priceLink: isEditing
        ? editInvestment.priceLink
        : 'https://coinmarketcap.com/currencies/bitcoin/',
    },
    validationSchema: validationSchema,
    onSubmit: (values: CreateInvestmentDto | UpdateInvestmentDto) => {
      values.buyDate = dayjs(values.buyDate).toDate();
      values.sellDate = dayjs(values.sellDate).toDate();

      if (isEditing) mutationCreate.mutate(values as CreateInvestmentDto);
      else mutationUpdate.mutate(values as UpdateInvestmentDto);
    },
  });

  const addInput = (
    valueKey: keyof CreateInvestmentDto,
    label: string,
    type: string = 'text',
    inputLeftElement: string | null = null
  ) => {
    let input: JSX.Element;
    let value = formik.values[valueKey] === null ? '' : formik.values[valueKey];

    if (type === 'textarea') {
      input = (
        <Textarea
          id={valueKey}
          name={valueKey}
          // @ts-ignore
          value={value || ''}
          onChange={formik.handleChange}
          size='sm'
        />
      );
    } else {
      if (type === 'date') value = dayjs(value).format('YYYY-MM-DD');

      input = (
        <Input
          id={valueKey}
          name={valueKey}
          type={type}
          variant='filled'
          onChange={formik.handleChange}
          // @ts-ignore
          value={value}
        />
      );
    }

    // @ts-ignore
    const isError: boolean = !!formik.errors[valueKey];

    return (
      // @ts-ignore
      <FormControl isInvalid={isError}>
        <FormLabel htmlFor={valueKey}>{label}</FormLabel>
        {type !== 'textarea' && inputLeftElement ? (
          <InputGroup>
            <InputLeftElement
              pointerEvents='none'
              color='gray.300'
              fontSize='1.2em'
              children='$'
            />
            {input}
          </InputGroup>
        ) : (
          input
        )}

        {isError && (
          <FormErrorMessage>
            {/* @ts-ignore */}
            {formik.errors[valueKey] || 'Error'}
          </FormErrorMessage>
        )}
      </FormControl>
    );
  };

  return (
    <form onSubmit={formik.handleSubmit}>
      <VStack spacing={4} align='flex-start'>
        <HStack width='100%' spacing='10px'>
          {addInput('name', 'Name')}
          {addInput('investedAmount', 'Invested Amount', 'number', '$')}
          {addInput('holdings', 'Holdings', 'number')}
        </HStack>
        <HStack width='100%' spacing='10px'>
          {addInput('buyPrice', 'Buy Price', 'number', '$')}
          {addInput('buyDate', 'Buy Date', 'date')}
        </HStack>
        <HStack width='100%' spacing='10px'>
          {addInput('sellPrice', 'Sell Price', 'number', '$')}
          {addInput('sellDate', 'Sell Date', 'date')}
        </HStack>
        <Flex width='50%'>{addInput('fees', 'Fees', 'number', '$')}</Flex>
        <HStack width='100%' spacing='10px'>
          {addInput('priceLink', 'Price Link', 'url')}
          {addInput('locationName', 'Location Name')}
        </HStack>
        <HStack width='100%' spacing='10px'>
          {addInput('primaryTag', 'Primary Tag')}
          {addInput('secondaryTag', 'Secondary Tag')}
        </HStack>
        <HStack width='100%' spacing='10px'>
          {addInput('buyNote', 'Buy Note', 'textarea')}
          {addInput('sellNote', 'Sell Note', 'textarea')}
        </HStack>

        <HStack justify='end' w='100%'>
          <Button
            onClick={() => history.push('/dashboard')}
            colorScheme='gray'
            mr={3}
          >
            Close
          </Button>
          <Button
            isLoading={formik.isSubmitting}
            type='submit'
            colorScheme='blue'
            mr={3}
          >
            {isEditing ? 'Update' : 'Add'}
          </Button>
        </HStack>
      </VStack>
    </form>
  );
};

export default InvestmentForm;
