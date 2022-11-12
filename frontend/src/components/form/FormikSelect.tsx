import React from 'react';
import Select from 'react-select';
import { FormControl, FormErrorMessage, FormLabel, Tooltip, useToken } from '@chakra-ui/react';
import { getObjectValueFromDot } from '../../utils/object';

type FormikSelectProps = {
  formik: any;
  valueKey: string;
  label: string;
  required: boolean;
  tooltip?: string;
  placeholder?: string;
  mapValue: (obj: any) => any;
  options: { value: any; label: string; obj: any }[];
};

const FormikSelect = ({
  formik,
  tooltip,
  mapValue,
  label,
  valueKey,
  required,
  options,
  placeholder,
}: FormikSelectProps) => {
  const value = getObjectValueFromDot(formik.values, valueKey);
  const error = getObjectValueFromDot(formik.errors, valueKey);
  const isError: boolean = !!error;
  const [bg, bgFocused, border, bgHover] = useToken('colors', ['grey.200', 'whiteAlpha.100', 'brand.500', 'grey.400']);

  const input = (
    <Select
      options={options}
      value={options.find((opt) => opt.value === mapValue(value))}
      placeholder={placeholder}
      menuPlacement='auto'
      isSearchable={false}
      onChange={(e, event) => formik.handleChange({ ...event, target: { name: valueKey, value: e.obj } })}
      styles={{
        control: (styles, { isFocused, menuIsOpen }) => ({
          ...styles,
          border: isFocused ? `1px solid ${border}` : 'none',
          borderRadius: '0.375rem',
          backgroundColor: isFocused ? bgFocused : bg,
          '&:hover': {
            backgroundColor: menuIsOpen ? bgFocused : bgHover,
          },
        }),
        container: (provided) => ({
          ...provided,
          border: 'none',
          width: '100%',
        }),
        indicatorSeparator: () => ({ display: 'none' }),
        menu: (provided) => ({ ...provided, zIndex: 9999 }),
      }}
    />
  );

  return (
    <FormControl isRequired={required} isInvalid={isError}>
      <FormLabel htmlFor={valueKey}>{label}</FormLabel>
      {tooltip !== null ? (
        <Tooltip label={tooltip} placement='top'>
          <span tabIndex={0}>{input}</span>
        </Tooltip>
      ) : (
        input
      )}

      {isError && typeof error !== 'object' && (
        <FormErrorMessage>
          {/* @ts-ignore */}
          {error || 'Error'}
        </FormErrorMessage>
      )}
    </FormControl>
  );
};

export default FormikSelect;
