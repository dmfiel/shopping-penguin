import { useState } from 'react';
import Checkbox from '@mui/material/Checkbox';
import Tooltip from '@mui/material/Tooltip';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';

import type { ListType } from '../../types';
import { catCountOpen } from '../../services/catCountOpen';
import { Category } from './Category';

export function EmptyCategories({
  list,
  saveLists
}: {
  list: ListType;
  saveLists: () => void;
}) {
  const [checked, setChecked] = useState<boolean>(false);
  // console.log('in empty cats');
  if (!list.categories || list.categories.length === 0) return;
  // console.log(list);
  const cats = list.categories
    .filter(cat => catCountOpen(cat) === 0 && !cat.createItem && !cat.deleted)
    .sort((a, b) => (a.category > b.category ? 1 : -1));
  // console.log(cats);
  if (!cats || cats.length === 0) return;

  return (
    <div className="categoryContainer">
      <div className="categorySelector text-lg font-medium flex items-center cursor-pointer">
        <Tooltip
          title={checked ? 'Hide Empty Categories' : 'Show Empty Categories'}
          disableInteractive
          arrow
        >
          <Checkbox
            checked={checked}
            onChange={() => setChecked(!checked)}
            icon={<ExpandLess />}
            checkedIcon={<ExpandMore />}
            // label={cat.category}
          />
        </Tooltip>
        <h3 className="category">
          <i>Empty Categories</i>
        </h3>
      </div>
      {checked &&
        cats.map(cat => (
          <Category cat={cat} list={list} key={cat.id} saveLists={saveLists} />
        ))}
    </div>
  );
}
