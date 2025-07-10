import React, { useState, type ReactNode } from 'react';
import type { Pages } from '../types';

export const PageContext = React.createContext({
  page: 'Home',
  setPage: (_Page: Pages): void => undefined
});

function PageProvider({ children }: { children: ReactNode }) {
  const [page, setPage] = useState<Pages>('Home');

  return (
    <PageContext.Provider value={{ page, setPage }}>
      {children}
    </PageContext.Provider>
  );
}

export default PageProvider;
