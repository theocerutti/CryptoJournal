import React, { HTMLInputTypeAttribute, useCallback } from 'react';
import { GetUserDto } from '@shared/user';
import * as Yup from 'yup';
import { useFormik } from 'formik';
import { Button, FormControl, FormErrorMessage, FormLabel, HStack, Input, InputGroup, InputLeftElement, Textarea, Tooltip, VStack } from '@chakra-ui/react';
import dayjs from 'dayjs';
import { CryptoAddressType } from '../../utils/address';
import { setupYup } from '../../utils/yup';

type InputProps = {
  valueKey: keyof GetUserDto;
  label: string;
  type?: HTMLInputTypeAttribute;
  inputLeftElement?: string;
  disabled?: boolean;
  tooltip?: string;
  required?: boolean;
  placeholder?: string;
};

setupYup();
const validationSchema = Yup.object().shape({
  erc20Address: Yup.string().cryptoAddress(CryptoAddressType.ERC20, 'This is not an ERC20 Address').optional(),
  btcAddress: Yup.string().cryptoAddress(CryptoAddressType.BTC, 'This is not a BTC Address').optional(),
  email: Yup.string().email().required('Email is required'),
});

const UserForm = ({ user }: { user: GetUserDto }) => {
  const formik = useFormik({
    initialValues: {
      email: user.email,
      erc20Address: user.erc20Address || '',
      btcAddress: user.btcAddress || '',
    },
    validationSchema: validationSchema,
    onSubmit: (user: GetUserDto) => {

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
       placeholder = null,
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
            placeholder={placeholder}
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
    [formik.errors, formik.handleChange, formik.values],
  );

  return (
    <form onSubmit={formik.handleSubmit}>
      <VStack width='50%' spacing={4} align='flex-start'>
        <HStack width='100%' spacing='10px'>
          {addInput({
            valueKey: 'email',
            label: 'Email',
            tooltip: 'Your email address',
          })}
        </HStack>
        <HStack width='100%' spacing='10px'>
          {addInput({
            valueKey: 'erc20Address',
            label: 'ERC20 Address',
            tooltip: 'ERC20 Address',
          })}
        </HStack>
        <HStack width='100%' spacing='10px'>
          {addInput({
            valueKey: 'btcAddress',
            label: 'BTC Address',
            tooltip: 'BTC Address',
          })}
        </HStack>
        {formik.dirty === true && (
          <HStack justify='end' w='100%'>
            <Button
              isLoading={formik.isSubmitting}
              type='submit'
              colorScheme='blue'
              mr={3}
            >
              Update
            </Button>
          </HStack>
        )}
      </VStack>
    </form>
  );
};

export default UserForm;