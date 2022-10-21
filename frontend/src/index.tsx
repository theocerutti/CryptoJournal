import React from 'react';
import { createRoot } from 'react-dom/client';
import './assets/css/App.css';
import { BrowserRouter } from 'react-router-dom';
import { ChakraProvider } from '@chakra-ui/react';
import theme from './theme/theme';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import App from './App';
import InjectAxiosInterceptors from './InjectAxiosInterceptors';
import 'utils/yup.ts';

const queryClient = new QueryClient();

const container = document.getElementById('root');
createRoot(container).render(
  <QueryClientProvider client={queryClient}>
    <ChakraProvider theme={theme}>
      <React.StrictMode>
        <BrowserRouter>
          <InjectAxiosInterceptors />
          <App />
        </BrowserRouter>
      </React.StrictMode>
    </ChakraProvider>
  </QueryClientProvider>
);
