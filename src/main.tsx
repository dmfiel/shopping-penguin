import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.tsx';
import ErrorProvider from './context/ErrorContext.tsx';
import ThemeProvider from './context/ThemeContext.tsx';
import ListsProvider from './context/ListContext.tsx';
import PageProvider from './context/PageContext.tsx';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ErrorProvider>
      <ThemeProvider>
        <ListsProvider>
          <PageProvider>
            <App />
          </PageProvider>
        </ListsProvider>
      </ThemeProvider>
    </ErrorProvider>
  </StrictMode>
);

// import { BrowserRouter } from 'react-router-dom';
{
  /* <BrowserRouter> */
}
{
  /* </BrowserRouter> */
}
