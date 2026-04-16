import { RouterProvider } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ThemeProvider, createTheme, CssBaseline } from '@mui/material';
import { RequestsApiProvider } from './api/RequestsApiContext';
import { getRequests, updateRequestStatus } from './api/requests.api';
import { router } from './router';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: { retry: 1 },
  },
});

const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#7C3AED',
      light: '#A78BFA',
      dark: '#5B21B6',
      contrastText: '#ffffff',
    },
    secondary: {
      main: '#F3F0FF',
      contrastText: '#7C3AED',
    },
    warning: {
      main: '#FFA630',
      contrastText: '#ffffff',
    },
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: { borderRadius: 8, textTransform: 'none', fontWeight: 600 },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: { borderRadius: 6, fontWeight: 500, minWidth: 90, justifyContent: 'center' },
      },
    },
    MuiTableHead: {
      styleOverrides: {
        root: {
          '& .MuiTableCell-root': {
            fontWeight: 600,
            backgroundColor: '#F3F0FF',
            color: '#5B21B6',
          },
        },
      },
    },
  },
});

// La implementación concreta se ensambla acá — un solo lugar
const requestsApi = { getRequests, updateRequestStatus };

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <RequestsApiProvider api={requestsApi}>
          <RouterProvider router={router} />
        </RequestsApiProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}
