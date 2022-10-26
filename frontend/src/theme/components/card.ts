import { mode, StyleFunctionProps } from '@chakra-ui/theme-tools';

export const cardStyles = {
  components: {
    Card: {
      baseStyle: (props: StyleFunctionProps) => ({
        p: '20px',
        display: 'flex',
        flexDirection: 'column',
        width: '100%',
        position: 'relative',
        borderRadius: '20px',
        minWidth: '0px',
        wordWrap: 'break-word',
        borderColor: mode('#ffffff', 'navy.800')(props),
        bg: mode('#ffffff', 'navy.800')(props),
        backgroundClip: 'border-box',
      }),
    },
  },
};
