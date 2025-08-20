import type { CategoryType } from '../types';

export function catCountOpen(cat: CategoryType): number {
  return (
    cat &&
    cat.items &&
    cat.items.filter(item => item && !item.completed && !item.deleted).length
  );
}
