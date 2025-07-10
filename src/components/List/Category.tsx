import { useState } from 'react';
// import { Checkbox, Button, Tooltip } from '@mui/material';
import Checkbox from '@mui/material/Checkbox';
import Tooltip from '@mui/material/Tooltip';
import Button from '@mui/material/Button';
import AddCircleRounded from '@mui/icons-material/AddCircleRounded';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import EditRounded from '@mui/icons-material/EditRounded';
import Save from '@mui/icons-material/Save';
import DeleteForever from '@mui/icons-material/DeleteForever';
import { v4 as uuidv4 } from 'uuid';

import type {
  CategoryType,
  ItemType,
  CreateCategoryProps,
  CategoryProps
} from '../../types';
import { Item, CreateItem } from './Item';

export function CreateCategory({
  list,
  saveLists,
  setCreate
}: CreateCategoryProps) {
  const [input, setInput] = useState('');

  function saveInput(e: React.ChangeEvent<HTMLInputElement>) {
    setInput(e.target.value);
  }
  function inputKey(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Enter') {
      saveEndEdit();
    }
    if (e.key === 'Escape') {
      setCreate(false);
    }
  }
  function saveEndEdit() {
    let newCategory: CategoryType = {
      id: uuidv4(),
      category: '',
      items: new Array<ItemType>(),
      deleted: false,
      shown: true
    };
    if (input) {
      newCategory.category = input;
      newCategory.created = new Date();
      newCategory.modified = new Date();
      if (!list.categories) list.categories = [];
      list.modified = new Date();
      list.categories.push(newCategory);

      saveLists();
    }
    setCreate(false);
  }

  return (
    <div className="categorySelector text-lg font-medium flex items-center cursor-pointer">
      <Checkbox
        checked={false}
        disabled={true}
        icon={<ExpandLess />}
        checkedIcon={<ExpandMore />}
      />
      <input
        autoFocus
        type="text"
        value={input}
        onChange={e => saveInput(e)}
        onBlur={() => saveEndEdit()}
        onKeyDown={e => inputKey(e)}
        maxLength={100}
        className="field-sizing-content min-w-12"
      />
      <Tooltip title="Save Category" disableInteractive arrow>
        <Button
          onClick={() => {
            saveEndEdit();
          }}
        >
          <Save />
        </Button>
      </Tooltip>
    </div>
  );
}

export function Category({ cat, list, saveLists }: CategoryProps) {
  const [checked, setChecked] = useState<boolean>(cat.shown);
  const [edit, setEdit] = useState<boolean>(false);
  const [create, setCreate] = useState<boolean>(false);
  const [input, setInput] = useState<string>(cat.category);
  const [inputSave, setInputSave] = useState<string>(cat.category);

  if (cat.deleted === undefined) cat.deleted = false;
  if (cat.shown === undefined) cat.shown = true;
  if (cat.deleted) return;

  function onChangeHandler() {
    cat.shown = !checked;
    setChecked(!checked);
    if (!cat.created) cat.created = new Date();
    cat.modified = new Date();
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
    if (!cat.created) cat.created = new Date();
    cat.modified = new Date();
    list.modified = new Date();
    if (input) cat.category = input;

    saveLists();
  }
  function deleteCategory() {
    cat.deleted = true;
    if (!cat.created) cat.created = new Date();
    cat.modified = new Date();
    list.modified = new Date();

    saveLists();
  }

  return (
    <div className="categoryContainer">
      <div className="categorySelector text-lg font-medium flex items-center cursor-pointer">
        <Tooltip
          title={checked ? 'Hide Category' : 'Show Category'}
          disableInteractive
          arrow
        >
          <Checkbox
            checked={checked}
            onChange={onChangeHandler}
            icon={<ExpandLess />}
            checkedIcon={<ExpandMore />}
            // label={cat.category}
          />
        </Tooltip>
        {!edit && (
          <h3 className="category" onClick={onChangeHandler}>
            {input}
            <Tooltip title="Count of hidden items" disableInteractive arrow>
              <span>
                {!checked &&
                  cat.items &&
                  cat.items.length > 0 &&
                  ' (' +
                    cat.items.filter(
                      item => item && !item.completed && !item.deleted
                    ).length +
                    ')'}
              </span>
            </Tooltip>
          </h3>
        )}
        {edit && (
          <div className="flex">
            <input
              autoFocus
              type="text"
              value={input}
              onChange={e => saveInput(e)}
              onBlur={() => saveEndEdit()}
              onKeyDown={e => inputKey(e)}
              maxLength={100}
              className="field-sizing-content min-w-12"
            />

            <Tooltip title="Save Category" disableInteractive arrow>
              <Button
                onClick={() => {
                  saveEndEdit();
                }}
              >
                <Save />
              </Button>
            </Tooltip>
          </div>
        )}
        {!edit && (
          <Tooltip title="Edit Category" disableInteractive arrow>
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
        <Tooltip title="Add Item" disableInteractive arrow>
          <Button disabled={create} onClick={() => setCreate(true)}>
            <AddCircleRounded />
          </Button>
        </Tooltip>
        <Tooltip title="Delete Category" disableInteractive arrow>
          <Button onClick={deleteCategory}>
            <DeleteForever />
          </Button>
        </Tooltip>
      </div>
      {create && (
        <CreateItem
          cat={cat}
          list={list}
          saveLists={saveLists}
          setCreate={setCreate}
        />
      )}
      {checked &&
        cat.items &&
        cat.items.length > 0 &&
        cat.items.map(item => (
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
