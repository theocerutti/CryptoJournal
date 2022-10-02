import React, { useCallback, useEffect } from 'react';
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
  Tooltip,
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

  const isEditing = location.state !== null;

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

  const addInput = useCallback(
    (
      valueKey: keyof CreateInvestmentDto,
      label: string,
      type: string = 'text',
      inputLeftElement: string | null = null,
      disable: boolean = false,
      tooltip: string = null,
      required: boolean = false
    ) => {
      let input: JSX.Element;
      let value =
        formik.values[valueKey] === null ? '' : formik.values[valueKey];

      if (type === 'textarea') {
        input = (
          <Textarea
            id={valueKey}
            name={valueKey}
            // @ts-ignore
            value={value || ''}
            disabled={disable}
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
            disabled={disable}
            onChange={formik.handleChange}
            // @ts-ignore
            value={value}
          />
        );
      }

      const isError: boolean = !!formik.errors[valueKey];

      const inputContainer =
        type !== 'textarea' && inputLeftElement ? (
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
        );

      const form = (
        <FormControl isRequired={required} isInvalid={isError}>
          <FormLabel htmlFor={valueKey}>{label}</FormLabel>
          {tooltip !== null ? (
            <Tooltip label={tooltip} placement='top'>
              <span tabIndex={0}>{inputContainer}</span>
            </Tooltip>
          ) : (
            inputContainer
          )}

          {isError && (
            <FormErrorMessage>
              {/* @ts-ignore */}
              {formik.errors[valueKey] || 'Error'}
            </FormErrorMessage>
          )}
        </FormControl>
      );

      return form;
    },
    [formik.errors, formik.handleChange, formik.values]
  );

  useEffect(() => {
    const { buyPrice, investedAmount } = formik.values;
    if (buyPrice !== null && investedAmount !== null) {
      formik.setFieldValue('holdings', investedAmount / buyPrice);
    }
    // @eslint-disable-next-line
  }, [formik.values.buyPrice, formik.values.investedAmount]);

  return (
    <form onSubmit={formik.handleSubmit}>
      <VStack spacing={4} align='flex-start'>
        <HStack width='100%' spacing='10px'>
          {addInput(
            'name',
            'Name',
            'text',
            null,
            false,
            'Name of the investment (BTC, ETH, S&P500...)',
            true
          )}
          {addInput(
            'investedAmount',
            'Invested Amount',
            'number',
            '$',
            false,
            null,
            true
          )}
          {addInput(
            'holdings',
            'Holdings',
            'number',
            null,
            true,
            "This field is automatically calculated using 'Invested Amount' and 'Buy Price'",
            true
          )}
        </HStack>
        <HStack width='100%' spacing='10px'>
          {addInput(
            'buyPrice',
            'Buy Price',
            'number',
            '$',
            false,
            'Price of the investment when you bought it',
            true
          )}
          {addInput(
            'buyDate',
            'Buy Date',
            'date',
            null,
            false,
            'Date when you bought the investment',
            true
          )}
        </HStack>
        <HStack width='100%' spacing='10px'>
          {addInput(
            'sellPrice',
            'Sell Price',
            'number',
            '$',
            false,
            'Price of the investment when you sold it',
            false
          )}
          {addInput(
            'sellDate',
            'Sell Date',
            'date',
            null,
            false,
            'Date when you sold the investment',
            false
          )}
        </HStack>
        <Flex width='50%'>
          {addInput('fees', 'Fees', 'number', '$', false, 'Fees', true)}
        </Flex>
        <HStack width='100%' spacing='10px'>
          {addInput(
            'priceLink',
            'Price Link',
            'url',
            null,
            false,
            'Link to the price of the investment',
            true
          )}
          {addInput(
            'locationName',
            'Location Name',
            'text',
            null,
            false,
            'Name of the location where you bought the investment',
            false
          )}
        </HStack>
        <HStack width='100%' spacing='10px'>
          {addInput(
            'primaryTag',
            'Primary Tag',
            'text',
            null,
            false,
            'Primary tag of the investment',
            false
          )}
          {addInput(
            'secondaryTag',
            'Secondary Tag',
            'text',
            null,
            false,
            'Secondary tag of the investment',
            false
          )}
        </HStack>
        <HStack width='100%' spacing='10px'>
          {addInput(
            'buyNote',
            'Buy Note',
            'textarea',
            null,
            false,
            'Note about the buy',
            false
          )}
          {addInput(
            'sellNote',
            'Sell Note',
            'textarea',
            null,
            false,
            'Note about the sell',
            false
          )}
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
