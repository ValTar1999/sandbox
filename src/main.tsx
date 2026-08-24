import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { QueryClientProvider } from '@tanstack/react-query';
import './index.css';
import App from './App.tsx';
import { queryClient } from './api/queryClient';
import { startMockBackend } from './server/browser';

const render = () => {
  createRoot(document.getElementById('root')!).render(
    <StrictMode>
      <QueryClientProvider client={queryClient}>
        <BrowserRouter basename="/sandbox">
          <App />
        </BrowserRouter>
      </QueryClientProvider>
    </StrictMode>
  );
};

// Rendering has to wait for the worker, otherwise the first queries leave the
// page before the mock can answer them. A failed start still renders the app.
startMockBackend()
  .catch((error) => {
    console.error('[mock backend] failed to start', error);
  })
  .finally(render);
