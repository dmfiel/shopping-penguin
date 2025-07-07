import React, { useState, type ReactNode } from 'react';
import type { ListType } from '../types';

export const ListsContext = React.createContext({
  lists: new Array<ListType>(),
  setLists: (_lists: ListType[]): void => undefined
});

function ListsProvider({ children }: { children: ReactNode }) {
  const [lists, setLists] = useState<ListType[]>(new Array<ListType>());

  return (
    <ListsContext.Provider value={{ lists, setLists }}>
      {children}
    </ListsContext.Provider>
  );
}

export default ListsProvider;
