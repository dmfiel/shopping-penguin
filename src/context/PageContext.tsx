import React, { useState, type ReactNode } from 'react';
import type { Pages } from '../types';

// eslint-disable-next-line react-refresh/only-export-components
export const PageContext = React.createContext({
  page: 'Home',
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  setPage: (_page: Pages): void => undefined
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
