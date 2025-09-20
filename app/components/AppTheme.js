'use client';

import * as React from 'react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { CssBaseline } from '@mui/material';

// Create theme context
const ThemeModeContext = React.createContext({
  mode: 'light',
  setMode: () => {},
});

export const useThemeMode = () => React.useContext(ThemeModeContext);

// Create a basic Material-UI theme
const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
    background: {
      default: '#ffffff',
      paper: '#f5f5f5',
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontSize: '2.5rem',
      fontWeight: 600,
    },
    h2: {
      fontSize: '2rem',
      fontWeight: 600,
    },
    h3: {
      fontSize: '1.75rem',
      fontWeight: 600,
    },
    h4: {
      fontSize: '1.5rem',
      fontWeight: 600,
    },
    h5: {
      fontSize: '1.25rem',
      fontWeight: 600,
    },
    h6: {
      fontSize: '1rem',
      fontWeight: 600,
    },
  },
  shape: {
    borderRadius: 8,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          borderRadius: 8,
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
        },
      },
    },
  },
});

// Dark theme variant
const darkTheme = createTheme({
  ...theme,
  palette: {
    mode: 'dark',
    primary: {
      main: '#90caf9',
    },
    secondary: {
      main: '#f48fb1',
    },
    background: {
      default: '#121212',
      paper: '#1e1e1e',
    },
    text: {
      primary: '#ffffff',
      secondary: 'rgba(255, 255, 255, 0.7)',
    },
  },
});

export default function AppTheme({ children, ...props }) {
  const [mode, setMode] = React.useState('light');
  const [isHydrated, setIsHydrated] = React.useState(false);
  
  // Handle hydration to prevent SSR/client mismatch
  React.useEffect(() => {
    setIsHydrated(true);
  }, []);
  
  // Determine theme based on mode
  const getTheme = React.useCallback((themeMode) => {
    if (themeMode === 'system' && isHydrated) {
      // Only check system preference after hydration
      const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
      return prefersDark ? darkTheme : theme;
    }
    return themeMode === 'dark' ? darkTheme : theme;
  }, [isHydrated]);

  const selectedTheme = getTheme(mode);

  return (
    <div suppressHydrationWarning>
      <ThemeModeContext.Provider value={{ mode, setMode }}>
        <ThemeProvider theme={selectedTheme}>
          <CssBaseline />
          {children}
        </ThemeProvider>
      </ThemeModeContext.Provider>
    </div>
  );
}