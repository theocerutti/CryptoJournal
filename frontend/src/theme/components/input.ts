import { mode, StyleFunctionProps } from '@chakra-ui/theme-tools';

export const inputStyles = {
  components: {
    Input: {
      baseStyle: {
        field: {
          fontWeight: 400,
          borderRadius: '8px',
        },
      },
      variants: {
        filled: (props: StyleFunctionProps) => {
          console.log(props);
          return {
            field: {
              color: mode('grey.700', 'secondaryGray.400')(props),
            },
          };
        },
        main: (props: StyleFunctionProps) => ({
          field: {
            bg: mode('transparent', 'navy.800')(props),
            border: '1px solid',
            color: mode('secondaryGray.900', 'white')(props),
            borderColor: mode('secondaryGray.100', 'whiteAlpha.100')(props),
            borderRadius: '16px',
            fontSize: 'sm',
            p: '20px',
            _placeholder: { color: 'secondaryGray.400' },
          },
        }),
        auth: (props: StyleFunctionProps) => ({
          field: {
            fontWeight: '500',
            color: mode('navy.700', 'white')(props),
            bg: mode('transparent', 'transparent')(props),
            border: '1px solid',
            borderColor: mode(
              'secondaryGray.100',
              'rgba(135, 140, 189, 0.3)'
            )(props),
            borderRadius: '16px',
            _placeholder: { color: 'secondaryGray.600', fontWeight: '400' },
          },
        }),
        search: () => ({
          field: {
            border: 'none',
            py: '11px',
            borderRadius: 'inherit',
            _placeholder: { color: 'secondaryGray.600' },
          },
        }),
      },
    },

    NumberInput: {
      baseStyle: {
        field: {
          fontWeight: 400,
        },
      },
      variants: {
        main: () => ({
          field: {
            bg: 'transparent',
            border: '1px solid',
            borderColor: 'secondaryGray.100',
            borderRadius: '16px',
            _placeholder: { color: 'secondaryGray.600' },
          },
        }),
        auth: () => ({
          field: {
            bg: 'transparent',
            border: '1px solid',
            borderColor: 'secondaryGray.100',
            borderRadius: '16px',
            _placeholder: { color: 'secondaryGray.600' },
          },
        }),
        search: () => ({
          field: {
            border: 'none',
            py: '11px',
            borderRadius: 'inherit',
            _placeholder: { color: 'secondaryGray.600' },
          },
        }),
      },
    },

    Select: {
      baseStyle: {
        field: {
          fontWeight: 400,
        },
      },
      variants: {
        main: (props: StyleFunctionProps) => ({
          field: {
            bg: mode('transparent', 'navy.800')(props),
            border: '1px solid',
            color: 'secondaryGray.600',
            borderColor: mode('secondaryGray.100', 'whiteAlpha.100')(props),
            borderRadius: '16px',
            _placeholder: { color: 'secondaryGray.600' },
          },
          icon: {
            color: 'secondaryGray.600',
          },
        }),
        subtle: () => ({
          box: {
            width: 'unset',
          },
          field: {
            bg: 'transparent',
            border: '0px solid',
            color: 'secondaryGray.600',
            borderColor: 'transparent',
            width: 'max-content',
            _placeholder: { color: 'secondaryGray.600' },
          },
          icon: {
            color: 'secondaryGray.600',
          },
        }),
        auth: () => ({
          field: {
            bg: 'transparent',
            border: '1px solid',

            borderColor: 'secondaryGray.100',
            borderRadius: '16px',
            _placeholder: { color: 'secondaryGray.600' },
          },
        }),
        search: () => ({
          field: {
            border: 'none',
            py: '11px',
            borderRadius: 'inherit',
            _placeholder: { color: 'secondaryGray.600' },
          },
        }),
      },
    },
  },
};
