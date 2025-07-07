import { useState } from 'react';
import { Checkbox, Button, Tooltip } from '@mui/material';
import { Item, CreateItem } from './Item';
import type {
  CategoryType,
  ItemType,
  CreateCategoryProps,
  CategoryProps
} from '../../types';
import {
  ExpandLess,
  ExpandMore,
  EditRounded,
  Save,
  AddCircleRounded,
  DeleteForever
} from '@mui/icons-material';
import { v4 as uuidv4 } from 'uuid';

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
      shown: true,
      checked: false
    };
    if (input) {
      newCategory.category = input;
      if (!list.categories) list.categories = [];
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
        className="field-sizing-content min-w-12"
      />
      <Tooltip title="Save Category" disableInteractive>
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
  if (cat.deleted) return;
  if (!cat.shown) cat.shown = true;
  const [checked, setChecked] = useState<boolean>(cat.shown);
  const [edit, setEdit] = useState<boolean>(false);
  const [create, setCreate] = useState<boolean>(false);
  const [input, setInput] = useState<string>(cat.category);
  const [inputSave, setInputSave] = useState<string>(cat.category);

  function onChangeHandler() {
    setChecked(!checked);
    list.shown = checked;
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
    if (input) cat.category = input;
    saveLists();
  }
  function deleteCategory() {
    cat.deleted = true;
    saveLists();
  }

  return (
    <div className="categoryContainer">
      <div className="categorySelector text-lg font-medium flex items-center cursor-pointer">
        <Tooltip
          title={checked ? 'Hide Category' : 'Show Category'}
          disableInteractive
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
            <Tooltip title="Count of hidden items" disableInteractive>
              <span>{!checked && ' (' + cat.items.length + ')'}</span>
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
              className="field-sizing-content min-w-12"
            />

            <Tooltip title="Save Category" disableInteractive>
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
          <Tooltip title="Edit Category" disableInteractive>
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
        <Tooltip title="Add Item" disableInteractive>
          <Button disabled={create} onClick={() => setCreate(true)}>
            <AddCircleRounded />
          </Button>
        </Tooltip>
        <Tooltip title="Delete Category" disableInteractive>
          <Button onClick={deleteCategory}>
            <DeleteForever />
          </Button>
        </Tooltip>
      </div>
      {create && (
        <CreateItem cat={cat} saveLists={saveLists} setCreate={setCreate} />
      )}
      {checked &&
        cat.items &&
        cat.items.map(item => (
          <Item item={item} cat={cat} key={item.id} saveLists={saveLists} />
        ))}
    </div>
  );
}
