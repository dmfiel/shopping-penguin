export type Pages = 'Home' | 'Login' | 'Register';

export type ListType = {
  id: string;
  list: string;
  categories: CategoryType[];
  deleted: boolean;
  shown: boolean;
  created?: Date;
  modified?: Date;
};

export type CategoryType = {
  id: string;
  category: string;
  items: ItemType[];
  deleted: boolean;
  shown: boolean;
  created?: Date;
  modified?: Date;
};

export type ItemType = {
  id: string;
  item: string;
  completed: boolean;
  deleted: boolean;
  created?: Date;
  modified?: Date;
  firstCompleted?: Date;
  lastCompleted?: Date;
  countCompleted?: number;
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
  list: ListType;
  saveLists: () => void;
  setCreate: (create: boolean) => void;
}

export interface ItemProps {
  item: ItemType;
  cat: CategoryType;
  list: ListType;
  saveLists: () => void;
}
