import React from 'react';
import Select, { components } from 'react-select';
import {
  Flex,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Highlight,
  Image,
  Text,
  Tooltip,
  useToken,
} from '@chakra-ui/react';
import { getObjectValueFromDot } from '../../utils/object';
import { FixedSizeList as List } from 'react-window';

type FormikSelectProps = {
  formik: any;
  valueKey: string;
  label: string;
  required: boolean;
  tooltip?: string;
  placeholder?: string;
  mapValue?: (obj: any) => any;
  mapValueFormikOnChange?: (obj: any) => any;
  options: { value: any; label: string; logo?: string; description?: string; obj: any }[];
};

const NOPT_SEARCH = 8;
const ITEMS_PER_SCROLL_WINDOW = 4;

const { Option } = components;

const IconOption = (props: any) => {
  const {
    data: { label, iconUrl, description },
  } = props;

  return (
    <Option {...props}>
      <Flex alignItems='center'>
        {iconUrl && <Image pr='8px' style={{ width: '32px', height: '26px' }} src={iconUrl} />}
        <Highlight styles={{ px: '1', py: '1', bg: 'orange.100' }} query={props.selectProps.inputValue}>
          {label}
        </Highlight>
        {description && (
          <Flex justify='flex-end' width='100%'>
            <Text fontSize='sm' color='gray.500' as='cite'>
              {description}
            </Text>
          </Flex>
        )}
      </Flex>
    </Option>
  );
};

const height = 45;

const MenuList = (props: any) => {
  const { options, children, getValue } = props;
  const [value] = getValue();
  const initialOffset = options.indexOf(value) * height;

  if (children.length >= ITEMS_PER_SCROLL_WINDOW)
    return (
      <List
        height={height * ITEMS_PER_SCROLL_WINDOW + height / 2}
        itemCount={children.length}
        itemSize={height}
        initialScrollOffset={initialOffset}
        width='100%'
      >
        {({ index, style }) => <div style={style}>{children[index]}</div>}
      </List>
    );

  return <components.MenuList {...props}>{children}</components.MenuList>;
};

const ValueContainer = ({ children, ...props }: any) => {
  const selectedOption = props.getValue();
  const iconUrl = selectedOption && selectedOption.length > 0 ? selectedOption[0].iconUrl : null;

  return (
    <components.ValueContainer {...props}>
      <Flex alignItems='center'>
        {iconUrl && <Image pr='8px' style={{ width: '32px', height: '26px' }} src={iconUrl} />}
        {children}
      </Flex>
    </components.ValueContainer>
  );
};

const FormikSelect = ({
  formik,
  tooltip,
  mapValue = (v) => v,
  mapValueFormikOnChange = (v) => v,
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

  console.log(options);
  console.log(
    value,
    mapValue(value),
    options.find((opt) => opt.value === mapValue(value))
  );

  const input = (
    <Select
      options={options}
      value={options.find((opt) => opt.value === mapValue(value))}
      placeholder={placeholder}
      components={{ Option: IconOption, MenuList: MenuList, ValueContainer: ValueContainer }}
      menuPlacement='auto'
      isSearchable={options.length > NOPT_SEARCH}
      onChange={(e, event) =>
        formik.handleChange({ ...event, target: { name: valueKey, value: mapValueFormikOnChange(e.obj) } })
      }
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
