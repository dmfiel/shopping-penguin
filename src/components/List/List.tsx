import { useEffect, useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { Checkbox, Button, Tooltip } from '@mui/material';
import Tooltip from '@mui/material/Tooltip';
import Checkbox from '@mui/material/Checkbox';
import Button from '@mui/material/Button';
import AddCircleRounded from '@mui/icons-material/AddCircleRounded';
import DeleteForever from '@mui/icons-material/DeleteForever';
import EditRounded from '@mui/icons-material/EditRounded';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import Save from '@mui/icons-material/Save';
import Settings from '@mui/icons-material/Settings';

import { Category, CreateCategory } from './Category';
import type { ItemCatType, ListProps, ListType } from '../../types';

import { Item } from './Item';
import { catCountOpen } from '../services/catCountOpen';

export function List({ list, saveLists }: ListProps) {
  const [checked, setChecked] = useState<boolean>(list.shown);
  const [edit, setEdit] = useState<boolean>(list.editList || false);
  const [input, setInput] = useState<string>(list.list);
  const [inputSave, setInputSave] = useState<string>(list.list);
  const [create, setCreate] = useState<boolean>(list.createCategory || false);
  const [showSettings, setShowSettings] = useState(false);

  // auto-hide the settings (delete button) to avoid accidents
  useEffect(() => {
    if (showSettings) {
      const timer = setTimeout(() => setShowSettings(false), 5000);
      return () => clearTimeout(timer);
    }
  }, [showSettings]);

  // console.log('in List', list);

  if (list.deleted === undefined) list.deleted = false;
  if (list.shown === undefined) list.shown = true;
  if (list.deleted) return;

  let itemCats = new Array<ItemCatType>();
  if (list.categories && list.categories.length > 0) {
    itemCats = list.categories.flatMap(
      cat =>
        cat.items &&
        cat.items
          .filter(item => item.completed)
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

  function dateSubtract(a?: Date, b?: Date) {
    if (!a || !b) return 0;
    try {
      const diff = new Date(a).getTime() - new Date(b).getTime();
      return diff;
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (err) {
      console.log(err);
      return 0;
    }
  }

  function onChangeHandler() {
    list.shown = !checked;
    setChecked(!checked);
    if (!list.created) list.created = new Date();
    list.modified = new Date();

    saveLists();
  }

  function saveInput(e: React.ChangeEvent<HTMLInputElement>) {
    setInput(e.target.value);
  }

  function inputKey(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Enter') {
      saveEndEdit();
    }
    if (e.key === 'Escape') {
      setInput(inputSave);
      setEdit(false);
    }
  }

  function saveEndEdit() {
    setEdit(false);
    if (input) list.list = input;
    if (!list.created) list.created = new Date();
    list.modified = new Date();
    list.editList = false;
    saveLists();
  }

  function deleteList() {
    list.deleted = true;
    if (!list.created) list.created = new Date();
    list.modified = new Date();

    saveLists();
  }

  return (
    <div className="listContainer">
      <div className="listSelector mt-2.5 text-2xl font-medium flex items-center cursor-pointer">
        <Tooltip
          title={checked ? 'Hide List' : 'Show List'}
          disableInteractive
          arrow
        >
          <Checkbox
            checked={checked}
            onChange={onChangeHandler}
            icon={<ExpandLess />}
            checkedIcon={<ExpandMore />}
            // label={list.list}
          />
        </Tooltip>
        {!edit && (
          <h2 className="list" onClick={onChangeHandler}>
            <span>{input}</span>
            <Tooltip title="Count of hidden items" disableInteractive arrow>
              <span>
                {!checked &&
                  list.categories &&
                  list.categories.length > 0 &&
                  ' (' +
                    list.categories
                      .map(cat => catCountOpen(cat))
                      .reduce((total, cat) => total + cat) +
                    ')'}
              </span>
            </Tooltip>
          </h2>
        )}
        {edit && (
          <div className="flex">
            <input
              autoFocus
              type="text"
              value={input === 'New List' ? '' : input}
              onChange={e => saveInput(e)}
              onBlur={() => saveEndEdit()}
              onKeyDown={e => inputKey(e)}
              maxLength={100}
              className="field-sizing-content min-w-12"
            />
            <Button
              onClick={() => {
                saveEndEdit();
              }}
            >
              <Save />
            </Button>
          </div>
        )}
        {!edit && (
          <Tooltip title="Edit List" disableInteractive arrow>
            <Button
              onClick={() => {
                setInputSave(input);
                setEdit(true);
              }}
            >
              <EditRounded />
            </Button>
          </Tooltip>
        )}
        <Tooltip title="Add Category" disableInteractive arrow>
          <Button disabled={create} onClick={() => setCreate(true)}>
            <AddCircleRounded />
          </Button>
        </Tooltip>
        <Tooltip title="Settings" disableInteractive arrow>
          <Button onClick={() => setShowSettings(!showSettings)}>
            <Settings />
          </Button>
        </Tooltip>
        {showSettings && (
          <Tooltip title="Delete List" disableInteractive arrow>
            <Button onClick={deleteList}>
              <DeleteForever />
            </Button>
          </Tooltip>
        )}
      </div>
      {!edit && create && (
        <CreateCategory
          list={list}
          saveLists={saveLists}
          setCreate={setCreate}
        />
      )}
      {checked &&
        list.categories &&
        list.categories.length > 0 &&
        list.categories
          .filter(cat => catCountOpen(cat) > 0 || cat.createItem)
          .map(cat => (
            <Category
              cat={cat}
              list={list}
              key={cat.id}
              saveLists={saveLists}
            />
          ))}
      {checked && <EmptyCategories list={list} saveLists={saveLists} />}
      {checked && (
        <CompletedItems itemCats={itemCats} list={list} saveLists={saveLists} />
      )}
    </div>
  );
}

function CompletedItems({
  itemCats,
  list,
  saveLists
}: {
  itemCats: ItemCatType[];
  list: ListType;
  saveLists: () => void;
}) {
  const [checked, setChecked] = useState<boolean>(false);

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

function EmptyCategories({
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
    .filter(cat => catCountOpen(cat) === 0 && !cat.createItem)
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
