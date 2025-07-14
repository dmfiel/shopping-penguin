import { useState } from 'react';
import Checkbox from '@mui/material/Checkbox';
import Tooltip from '@mui/material/Tooltip';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';

import type { ItemCatType, ListType } from '../../types';
import { dateSubtract } from '../services/dateSubtract';
import { Item } from './Item';

export function CompletedItems({
  list,
  saveLists
}: {
  list: ListType;
  saveLists: () => void;
}) {
  const [checked, setChecked] = useState<boolean>(false);

  let itemCats = new Array<ItemCatType>();
  if (list.categories && list.categories.length > 0) {
    itemCats = list.categories.flatMap(
      cat =>
        cat.items &&
        cat.items
          .filter(item => item.completed && !item.deleted)
          .map(item => {
            const ic: ItemCatType = {
              item: item,
              cat: cat
            };
            return ic;
          })
    );
    // show the most recently completed first
    itemCats = itemCats.sort(
      (a, b) => -dateSubtract(a.item.lastCompleted, b.item.lastCompleted)
    );
  }

  if (!itemCats || itemCats.length === 0) return;

  return (
    <div className="categoryContainer">
      <div className="categorySelector text-lg font-medium flex items-center cursor-pointer">
        <Tooltip
          title={checked ? 'Hide Completed Items' : 'Show Completed'}
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
          <i>Completed Items</i>
        </h3>
      </div>
      {checked &&
        itemCats.map(({ item, cat }) => (
          <Item
            item={item}
            cat={cat}
            list={list}
            key={item.id}
            saveLists={saveLists}
          />
        ))}
    </div>
  );
}
