import React, { HTMLInputTypeAttribute, MouseEventHandler } from 'react';
import {
  Checkbox,
  FormControl,
  FormErrorMessage,
  FormLabel,
  HStack,
  Input,
  InputGroup,
  InputLeftElement,
  Select,
  Textarea,
  Tooltip,
} from '@chakra-ui/react';
import dayjs from 'dayjs';

type MixedInputProps = {
  valueKey: any;
  label: string;
  formik: any;
  type?: HTMLInputTypeAttribute | 'text' | 'select-with-input' | 'textarea';
  selectValues?: string[];
  selectValue?: string;
  onSelectChange?: (event: React.ChangeEvent<HTMLSelectElement>) => void;
  formatSelectValue?: (s: string) => string;
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
  selectValues = null,
  onSelectChange = null,
  formatSelectValue = null,
  selectValue = null,
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
  } else if (type == 'select-with-input') {
    input = (
      <HStack width='100%'>
        <Select
          onChange={onSelectChange}
          style={{ borderBottomRightRadius: 0, borderTopRightRadius: 0 }}
          variant='filled'
          value={selectValue}
        >
          {selectValues.map((v) => (
            <option key={v} value={v}>
              {formatSelectValue ? formatSelectValue(v) : v}
            </option>
          ))}
        </Select>
        <Input
          id={valueKey}
          name={valueKey}
          type={type}
          variant='filled'
          placeholder={placeholder}
          disabled={disabled}
          style={{ borderTopLeftRadius: 0, borderBottomLeftRadius: 0, marginLeft: 0 }}
          onChange={formik.handleChange}
          // @ts-ignore
          value={value}
        />
      </HStack>
    );
  } else if (type === 'checkbox') {
    input = (
      <Checkbox id={valueKey} name={valueKey} isDisabled={disabled} onChange={formik.handleChange} value={value}>
        {label}
      </Checkbox>
    );
  } else if (type === 'select') {
    input = (
      <Select
        id={valueKey}
        name={valueKey}
        disabled={disabled}
        onChange={formik.handleChange}
        value={value}
        placeholder={placeholder}
        variant='filled'
      >
        {selectValues.map((v) => (
          <option key={v} value={v}>
            {v}
          </option>
        ))}
      </Select>
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
        <InputLeftElement pointerEvents='none' color='grey.300' fontSize='1.2em' children='$' />
        {input}
      </InputGroup>
    ) : (
      input
    );

  return (
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
};

export default FormikInput;
