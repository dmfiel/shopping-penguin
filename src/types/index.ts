export type ListType = {
  id: string;
  list: string;
  categories: CategoryType[];
  deleted: boolean;
  shown: boolean;
  checked: boolean;
};

export type CategoryType = {
  id: string;
  category: string;
  items: ItemType[];
  deleted: boolean;
  shown: boolean;
  checked: boolean;
};

export type ItemType = {
  id: string;
  item: string;
  completed: boolean;
  deleted: boolean;
};

export interface ListsProps {
  token: string | null;
}

export interface ListProps {
  list: ListType;
  lists: ListType[];
  saveLists: () => void;
}

export interface CreateCategoryProps {
  list: ListType;
  saveLists: () => void;
  setCreate: (create: boolean) => void;
}

export interface CategoryProps {
  cat: CategoryType;
  list: ListType;
  saveLists: () => void;
}

export interface CreateItemProps {
  cat: CategoryType;
  saveLists: () => void;
  setCreate: (create: boolean) => void;
}

export interface ItemProps {
  item: ItemType;
  cat: CategoryType;
  saveLists: () => void;
}
