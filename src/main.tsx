import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import './index.css';
import App from './App.tsx';
import ErrorProvider from './context/ErrorContext.tsx';
import ThemeProvider from './context/ThemeContext.tsx';
import ListsProvider from './context/ListContext.tsx';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <ErrorProvider>
        <ThemeProvider>
          <ListsProvider>
            <App />
          </ListsProvider>
        </ThemeProvider>
      </ErrorProvider>
    </BrowserRouter>
  </StrictMode>
);
