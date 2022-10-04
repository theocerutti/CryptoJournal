import React, { HTMLInputTypeAttribute, useCallback, useEffect } from 'react';
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
  useToast,
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

type InputProps = {
  valueKey: keyof CreateInvestmentDto;
  label: string;
  type?: HTMLInputTypeAttribute;
  inputLeftElement?: string;
  disabled?: boolean;
  tooltip?: string;
  required?: boolean;
};

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
  const toast = useToast();
  const location = useLocation();
  const history = useHistory();
  const queryClient = useQueryClient();

  const isEditing = !!location.state;

  // @ts-ignore
  const editInvestment = location.state?.investment as GetInvestmentDto;

  const showSuccessToast = () => {
    toast({
      title: `Successfully ${isEditing ? 'updated' : 'created'} investment`,
      status: 'success',
      duration: 4500,
      position: 'bottom-right',
      isClosable: true,
    });
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
      buyDate: isEditing ? new Date(editInvestment.buyDate) : new Date(),
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

      if (isEditing) {
        const v = values as UpdateInvestmentDto;
        v.id = editInvestment.id;
        mutationUpdate.mutate(v);
      } else {
        mutationCreate.mutate(values as CreateInvestmentDto);
      }
    },
  });

  const addInput = useCallback(
    ({
      valueKey,
      label,
      type = 'text',
      inputLeftElement = null,
      disabled = false,
      tooltip = null,
      required = false,
    }: InputProps) => {
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
            disabled={disabled}
            onChange={formik.handleChange}
            size='sm'
          />
        );
      } else {
        if (type === 'date') {
          value = dayjs(value).format('YYYY-MM-DD');
        }

        input = (
          <Input
            id={valueKey}
            name={valueKey}
            type={type}
            variant='filled'
            placeholder='placeholder'
            disabled={disabled}
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
              color='grey.300'
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
    let holdings = 0;
    if (buyPrice !== null && investedAmount !== null && buyPrice !== 0)
      holdings = investedAmount / buyPrice;
    formik.setFieldValue('holdings', holdings);
    // eslint-disable-next-line
  }, [formik.values.buyPrice, formik.values.investedAmount]);

  return (
    <form onSubmit={formik.handleSubmit}>
      <VStack spacing={4} align='flex-start'>
        <HStack width='100%' spacing='10px'>
          {addInput({
            valueKey: 'name',
            label: 'Name',
            tooltip: 'Name of the investment (BTC, ETH, S&P500...)',
            required: true,
          })}
          {addInput({
            valueKey: 'investedAmount',
            label: 'Invested Amount',
            type: 'number',
            inputLeftElement: '$',
            required: true,
          })}
          {addInput({
            valueKey: 'holdings',
            label: 'Holdings',
            type: 'number',
            disabled: true,
            tooltip:
              "This field is automatically calculated using 'Invested Amount' and 'Buy Price'",
            required: true,
          })}
        </HStack>
        <HStack width='100%' spacing='10px'>
          {addInput({
            valueKey: 'buyPrice',
            label: 'Buy Price',
            type: 'number',
            inputLeftElement: '$',
            tooltip: 'Price of the investment when you bought it',
            required: true,
          })}
          {addInput({
            valueKey: 'buyDate',
            label: 'Buy Date',
            type: 'date',
            tooltip: 'Date when you bought the investment',
            required: true,
          })}
        </HStack>
        <HStack width='100%' spacing='10px'>
          {addInput({
            valueKey: 'sellPrice',
            label: 'Sell Price',
            type: 'number',
            inputLeftElement: '$',
            tooltip: 'Price of the investment when you sold it',
          })}
          {addInput({
            valueKey: 'sellDate',
            label: 'Sell Date',
            type: 'date',
            tooltip: 'Date when you sold the investment',
          })}
        </HStack>
        <Flex width='50%'>
          {addInput({
            valueKey: 'fees',
            label: 'Fees',
            type: 'number',
            inputLeftElement: '$',
            tooltip: 'Fees',
            required: true,
          })}
        </Flex>
        <HStack width='100%' spacing='10px'>
          {addInput({
            valueKey: 'priceLink',
            label: 'Price Link',
            type: 'url',
            tooltip: 'Link to the price of the investment',
            required: true,
          })}
          {addInput({
            valueKey: 'locationName',
            label: 'Location Name',
            tooltip: 'Name of the location where you bought the investment',
          })}
        </HStack>
        <HStack width='100%' spacing='10px'>
          {addInput({
            valueKey: 'primaryTag',
            label: 'Primary Tag',
            tooltip: 'Primary tag of the investment',
          })}
          {addInput({
            valueKey: 'secondaryTag',
            label: 'Secondary Tag',
            tooltip: 'Secondary tag of the investment',
          })}
        </HStack>
        <HStack width='100%' spacing='10px'>
          {addInput({
            valueKey: 'buyNote',
            label: 'Buy Note',
            type: 'textarea',
            tooltip: 'Note about the buy',
          })}
          {addInput({
            valueKey: 'sellNote',
            label: 'Sell Note',
            type: 'textarea',
            tooltip: 'Note about the sell',
          })}
        </HStack>

        <HStack justify='end' w='100%'>
          <Button
            onClick={() => history.push('/dashboard')}
            colorScheme='grey'
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
