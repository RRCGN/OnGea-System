// TODO: Not Working to load in ./components/App.js

const BASE_COLOR_PALETTE = {
  palette: {
    primary: {
      light: '#ffff72',
      main: '#ffdf43',
      dark: '#c8b900',
      contrastText: '#000000'
    },
    secondary: {
      light: '#514aac',
      main: '#18227c',
      dark: '#00004f',
      contrastText: '#ffffff'
    }
  }
}

export const MUI_THEME_STYLE = {
  palette: BASE_COLOR_PALETTE.palette,
  typography: {
    // Use the system font instead of the default Roboto font.
    fontFamily: [
      '-apple-system',
      'BlinkMacSystemFont',
      '"Segoe UI"',
      'Roboto',
      '"Helvetica Neue"',
      'Arial',
      'sans-serif',
      '"Apple Color Emoji"',
      '"Segoe UI Emoji"',
      '"Segoe UI Symbol"',
    ].join(','),
  },
  overrides: {
    MuiButton: {
      root: {
        borderRadius: 0
      }
    },
    MuiListItemSecondaryAction: {
      root: {
        right: '17px'
      }
    },
    MuiTabs: {
      indicator: {
        height: '100%',
        zIndex: 0
      },
      root: {
        backgroundColor: BASE_COLOR_PALETTE.palette.primary.main
      },
      flexContainer: {
        zIndex: 1,
        position: 'relative'
      }
    },
    MuiTab: {
      root: {
        maxWidth: '100%',
        textTransform: 'none',
        fontSize: '1rem'
      },
      selected: {
        color: '#fff'
      },
      fullWidth: {
        flexBasis: 0
      },
      labelContainer: {
        paddingLeft: '12px !important',
        paddingRight: '12px !important'
      }
    },
    MuiFormControl:{
      root: {
        minWidth: '100%',
        marginBottom: '1em',
      }
    },
    MuiInput: {
      underline: {
        '&::before': {
          borderBottom: '2px solid rgba(110, 110, 110, 0.42)'
        },
        borderBottom: '0'
      }
    },
    SortingControl: {
      sortLabelText: {
        fontWeight: 600,
        fontSize: '1.2em',
        color: BASE_COLOR_PALETTE.palette.secondary.main
      }
    }
  }
};

export const Styles = {
  TabSlide: {
    padding: 20,
    display: 'block'
  },
  Tab: {
    color: '#333',
    textTransform: 'none',
    fontWeight: '400',
    fontSize: '.8em'
  }
};