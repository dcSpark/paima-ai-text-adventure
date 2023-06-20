import { createTheme } from '@mui/material';

declare module '@mui/material/styles' {
  interface BreakpointOverrides {
    xs: false;
    sm: true;
    md: true;
    lg: true;
    xl: false;
  }
  interface TypographyVariantsOptions {
    sender: React.CSSProperties;
  }
}

// Update the Typography's variant prop options
declare module '@mui/material/Typography' {
  interface TypographyPropsVariantOverrides {
    sender: true;
    h3: false;
  }
}

export const theme = createTheme({
  breakpoints: {
    values: {
      sm: 480, // 360p
      md: 640, // 480p
      lg: 1280, // 720p
    },
  },
  palette: {
    primary: {
      main: '#f29dff',
      light: '#f9ceff',
    },
    secondary: {
      main: '#871F78',
    },
  },
  typography: {
    fontFamily: ['Play', 'Inter', 'Arial', 'sans-serif'].join(','),
    h1: {
      fontSize: 32,
      color: '#f9ceff',
      fontWeight: 800,
    },
    h2: {
      textAlign: 'center',
      fontWeight: 400,
      fontSize: '1.375rem',
      lineHeight: '1.5625rem',
    },
    body1: {
      fontWeight: 400,
      fontSize: '0.875rem',
      lineHeight: '1.125rem',
    },
    caption: {
      fontWeight: 600,
      fontSize: '1rem',
      lineHeight: '1.5em',
    },
    sender: {
      fontWeight: 400,
      fontSize: '0.75rem',
      lineHeight: '1.5em',
    },
    button: {
      fontStyle: 'normal',
      fontWeight: 700,
      fontSize: 18,
      color: '#871F78',
      textTransform: 'none',
    },
  },
  components: {
    MuiTypography: {
      defaultProps: {
        variantMapping: {
          caption: 'p',
        },
      },
    },
    MuiTableCell: {
      styleOverrides: {
        head: {
          backgroundColor: 'transparent',
          fontWeight: 700,
          fontSize: '14px',
          color: 'white',
          opacity: 0.6,
        },
        body: {
          fontWeight: 700,
          fontSize: '16px',
          color: 'white',
        },
      },
    },
    MuiTablePagination: {
      styleOverrides: {
        toolbar: {
          fontWeight: 500,
          fontSize: '16px',
          color: 'white',
        },
        select: { fontWeight: 700 },
      },
    },
    MuiSelect: {
      styleOverrides: {
        icon: { color: 'white' },
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        input: {
          color: 'white',
          fontWeight: 700,
          fontSize: '18px',
        },
        notchedOutline: {
          borderColor: 'white',
          padding: '0 10px',
        },
      },
    },
    MuiInputLabel: {
      styleOverrides: {
        root: {
          color: 'white',
          opacity: 0.6,
          fontWeight: 700,
        },
      },
    },
    MuiFormControlLabel: {
      styleOverrides: {
        label: {
          fontWeight: 700,
          fontSize: '14px',
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          backgroundColor: '#fbcd56',
          color: 'black',
          fontSize: '1.125rem',
          fontWeight: 700,
          minWidth: '200px',
          height: '3rem',
        },
      },
    },
    MuiCssBaseline: {
      styleOverrides: {
        '.Mui-disabled': {
          opacity: '0.7 !important',
          color: '#ffffff !important',
          '-webkit-text-fill-color': '#ffffff !important',
        },
      },
    },
  },
});
