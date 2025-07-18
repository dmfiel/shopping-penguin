import { useEffect, useState } from 'react';
import Button from '@mui/material/Button';
import Checkbox from '@mui/material/Checkbox';
import Tooltip from '@mui/material/Tooltip';
import AddCircleRounded from '@mui/icons-material/AddCircleRounded';
import DeleteForever from '@mui/icons-material/DeleteForever';
import EditRounded from '@mui/icons-material/EditRounded';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import Save from '@mui/icons-material/Save';
import Settings from '@mui/icons-material/Settings';
import { v4 as uuidv4 } from 'uuid';

import type {
  CategoryType,
  ItemType,
  CreateCategoryProps,
  CategoryProps
} from '../../types';
import { Item, CreateItem } from './Item';
import { catCountOpen } from '../../services/catCountOpen';

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
      list.createCategory = false;
      setCreate(false);
    }
  }
  function saveEndEdit() {
    const newCategory: CategoryType = {
      id: uuidv4(),
      category: '',
      items: new Array<ItemType>(),
      deleted: false,
      shown: true
    };
    list.createCategory = false;
    if (input) {
      newCategory.category = input;
      newCategory.created = new Date();
      newCategory.modified = new Date();
      newCategory.createItem = true;
      if (!list.categories) list.categories = [];
      list.modified = new Date();
      list.categories.push(newCategory);
      saveLists();
    }
    setCreate(false);
  }

  return (
    <div className="categorySelector ml-5 text-lg font-medium flex items-center cursor-pointer">
      <Checkbox
        checked={false}
        disabled={true}
        icon={<ExpandLess />}
        checkedIcon={<ExpandMore />}
      />
      <input
        placeholder="Category Name"
        autoFocus
        type="text"
        value={input}
        onChange={e => saveInput(e)}
        onBlur={() => saveEndEdit()}
        onKeyDown={e => inputKey(e)}
        maxLength={100}
        className="field-sizing-content min-w-12 px-2"
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
  const [create, setCreate] = useState<boolean>(cat.createItem || false);
  const [input, setInput] = useState<string>(cat.category);
  const [inputSave, setInputSave] = useState<string>(cat.category);
  const [showSettings, setShowSettings] = useState(false);

  // auto-hide the settings (delete button) to avoid accidents
  useEffect(() => {
    if (showSettings) {
      const timer = setTimeout(() => setShowSettings(false), 5000);
      return () => clearTimeout(timer);
    }
  }, [showSettings]);

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
      <div className="categorySelector ml-5 text-lg font-medium flex items-center cursor-pointer">
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
                  ' (' + catCountOpen(cat) + ')'}
              </span>
            </Tooltip>
          </h3>
        )}
        {edit && (
          <div className="flex">
            <input
              placeholder="Category Name"
              autoFocus
              type="text"
              value={input}
              onChange={e => saveInput(e)}
              onBlur={() => saveEndEdit()}
              onKeyDown={e => inputKey(e)}
              maxLength={100}
              className="field-sizing-content min-w-12 px-2"
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
        {!create && (
          <Tooltip title="Add Item" disableInteractive arrow>
            <Button
              onClick={() => {
                setCreate(true);
                setChecked(true);
              }}
            >
              <AddCircleRounded />
            </Button>
          </Tooltip>
        )}
        <Tooltip title="Settings" disableInteractive arrow>
          <Button onClick={() => setShowSettings(!showSettings)}>
            <Settings />
          </Button>
        </Tooltip>
        {showSettings && (
          <Tooltip title="Delete Category" disableInteractive arrow>
            <Button onClick={deleteCategory}>
              <DeleteForever />
            </Button>
          </Tooltip>
        )}
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
        cat.items
          .filter(item => !item.completed && !item.deleted)
          .map(item => (
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
