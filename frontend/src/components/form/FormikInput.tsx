import React, { HTMLInputTypeAttribute } from 'react';
import {
  FormControl,
  FormErrorMessage,
  FormLabel,
  Input,
  InputGroup,
  InputLeftElement,
  Textarea,
  Tooltip,
} from '@chakra-ui/react';
import dayjs from 'dayjs';

type MixedInputProps = {
  valueKey: any;
  label: string;
  formik: any;
  type?: HTMLInputTypeAttribute;
  inputLeftElement?: string;
  disabled?: boolean;
  tooltip?: string;
  required?: boolean;
  placeholder?: string;
};

const FormikInput = ({
  valueKey,
  label,
  type = 'text',
  inputLeftElement = null,
  disabled = false,
  tooltip = null,
  required = false,
  placeholder = null,
  formik,
}: MixedInputProps) => {
  let input: JSX.Element;
  let value = formik.values[valueKey] === null ? '' : formik.values[valueKey];

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
};

export default FormikInput;
