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
} from '../../queries/investments';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import dayjs from 'dayjs';
import { useHistory } from 'react-router-dom';
import { CreateInvestmentDto } from '@shared/investment/create-investment.dto';

const validationSchema = Yup.object().shape({
  buyDate: Yup.date().required('Buy date is required'),
  sellDate: Yup.date().nullable().optional(),
  buyPrice: Yup.number()
    .min(0, 'Buy price cannot be negative')
    .required('Buy price is required'),
  sellPrice: Yup.number().min(0, 'Sell price cannot be negative').optional(),
  buyNote: Yup.string().optional(),
  sellNote: Yup.string().optional(),
  name: Yup.string().required('Name is required'),
  fees: Yup.number().min(0, 'Fees cannot be negative').optional(),
  investedAmount: Yup.number()
    .min(0, 'Invested amount cannot be negative')
    .required('Invested amount is required'),
  holdings: Yup.number().min(0).required('Holdings are required'),
  locationName: Yup.string().optional(),
  primaryTag: Yup.string().optional(),
  secondaryTag: Yup.string().optional(),
  priceLink: Yup.string()
    .url("This link doesn't seems to be an url")
    .required('Price link is required'),
});

const InvestmentForm = () => {
  const history = useHistory();
  const queryClient = useQueryClient();

  const mutation = useMutation(createInvestmentMutation, {
    onSuccess: () => {
      // queryClient.setQueryData(['INVESTMENT_QUERY_KEY', res.investment.id], res.investment); TODO
      queryClient.invalidateQueries([INVESTMENT_QUERY_KEY]);
      history.push('/dashboard');
    },
  });

  const formik = useFormik({
    initialValues: {
      buyDate: null,
      sellDate: null,
      buyPrice: 0,
      sellPrice: 0,
      buyNote: '',
      sellNote: '',
      name: 'BTC',
      fees: 0,
      investedAmount: 0,
      holdings: 0,
      locationName: 'Binance',
      primaryTag: 'Crypto',
      secondaryTag: 'Bitcoin',
      priceLink: 'https://www.binance.com/en/trade/BTC_USDT',
    },
    validationSchema: validationSchema,
    onSubmit: (values: CreateInvestmentDto) => {
      values.buyDate = dayjs(values.buyDate).toDate();
      if (values.sellDate) values.sellDate = dayjs(values.sellDate).toDate();
      else delete values.sellDate;
      console.log('sent values: ', values);
      mutation.mutate(values);
    },
  });

  const addInput = (
    valueKey: keyof CreateInvestmentDto,
    label: string,
    type: string = 'text',
    inputLeftElement: string | null = null
  ) => {
    let input: JSX.Element;

    if (type === 'textarea') {
      input = (
        <Textarea
          id={valueKey}
          name={valueKey}
          // @ts-ignore
          value={formik.values[valueKey] || ''}
          onChange={formik.handleChange}
          size='sm'
        />
      );
    } else {
      input = (
        <Input
          id={valueKey}
          name={valueKey}
          type={type}
          variant='filled'
          onChange={formik.handleChange}
          // @ts-ignore
          value={formik.values[valueKey]}
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
          <Button colorScheme='gray' mr={3}>
            Close
          </Button>
          <Button
            isLoading={formik.isSubmitting}
            type='submit'
            colorScheme='blue'
            mr={3}
          >
            Add
          </Button>
        </HStack>
      </VStack>
    </form>
  );
};

export default InvestmentForm;
