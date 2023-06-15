import { createTheme } from '@mui/material';

declare module '@mui/material/styles' {
  interface BreakpointOverrides {
    xs: false;
    sm: true;
    md: true;
    lg: true;
    xl: false;
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
    fontFamily: ['Inter', 'Arial', 'sans-serif'].join(','),
    h1: {
      fontSize: 32,
      color: '#f9ceff',
      fontWeight: 800,
    },
    caption: {
      fontWeight: 600,
      fontSize: '1rem',
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
    MuiDialog: {
      styleOverrides: {
        paper: {
          backgroundColor: '#f9ceff',
          border: '10px solid rgb(135, 31, 120, 0.5)',
        },
      },
    },
  },
});
