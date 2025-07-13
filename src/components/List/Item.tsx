import { useState } from 'react';
// import { Checkbox, Button, Tooltip } from '@mui/material';
import Checkbox from '@mui/material/Checkbox';
import Tooltip from '@mui/material/Tooltip';
import Button from '@mui/material/Button';
import EditRounded from '@mui/icons-material/EditRounded';
import Save from '@mui/icons-material/Save';
import DeleteForever from '@mui/icons-material/DeleteForever';
import { v4 as uuidv4 } from 'uuid';

import type { ItemType, ItemProps, CreateItemProps } from '../../types';

export function CreateItem({
  cat,
  list,
  saveLists,
  setCreate
}: CreateItemProps) {
  const [input, setInput] = useState('');

  function saveInput(e: React.ChangeEvent<HTMLInputElement>) {
    setInput(e.target.value);
  }
  function inputKey(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Enter') {
      saveEndEdit();
    }
    if (e.key === 'Escape') {
      cat.createItem = false;

      setCreate(false);
    }
  }
  function saveEndEdit() {
    const newItem: ItemType = {
      id: uuidv4(),
      item: '',
      deleted: false,
      completed: false
    };
    if (input) {
      newItem.item = input;
      newItem.created = new Date();
      newItem.modified = new Date();
      newItem.countCompleted = 0;
      cat.modified = new Date();
      list.modified = new Date();
      if (!cat.items) cat.items = [];
      cat.items.push(newItem);
      // create another new item after saving this one
      // ToDo: make this an option later
      cat.createItem = true;
      setInput('');
      saveLists();
    } else {
      cat.createItem = false;
      setCreate(false);
    }
  }

  return (
    <div className="item ml-5 text-base font-normal flex items-center cursor-pointer">
      <Checkbox disabled={true} />{' '}
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
      <Tooltip title="Save Item" disableInteractive arrow>
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

export function Item({ item, cat, list, saveLists }: ItemProps) {
  const [checked, setChecked] = useState(item.completed || false);
  const [edit, setEdit] = useState(false);
  const [input, setInput] = useState(item.item);
  const [inputSave, setInputSave] = useState(item.item);

  if (item.deleted) return;
  // console.log('Render Item: ', item);

  function onChangeHandler() {
    item.completed = !checked;
    setChecked(!checked);
    if (!item.created) item.created = new Date();
    item.modified = new Date();
    if (item.completed) {
      item.countCompleted = (item.countCompleted || 0) + 1;
      item.lastCompleted = new Date();
      if (!item.firstCompleted) item.firstCompleted = new Date();
    }
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
    if (input) item.item = input;
    if (!item.created) item.created = new Date();
    item.modified = new Date();
    cat.modified = new Date();
    list.modified = new Date();

    saveLists();
  }
  function deleteItem() {
    item.deleted = true;
    if (!item.created) item.created = new Date();
    item.modified = new Date();
    cat.modified = new Date();
    list.modified = new Date();

    saveLists();
  }
  return (
    <div className="item ml-5 text-base font-normal flex items-center cursor-pointer">
      {/* label={input} */}
      <Tooltip
        title={checked ? 'Mark as Not Done' : 'Mark as Done'}
        disableInteractive
        arrow
      >
        <Checkbox checked={checked} onChange={onChangeHandler} />
      </Tooltip>
      {/* disabled, too easy to click to mark as Done
      onClick={onChangeHandler} */}
      {!edit && <h4>{input}</h4>}
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
          <Tooltip title="Save Item" disableInteractive arrow>
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
        <Tooltip title="Edit Item" disableInteractive arrow>
          <Button
            onClick={() => {
              setInputSave(input);
              setEdit(true);
            }}
          >
            <EditRounded />
          </Button>
        </Tooltip>
      )}{' '}
      <Tooltip title="Delete Item" disableInteractive arrow>
        <Button onClick={deleteItem}>
          <DeleteForever />
        </Button>
      </Tooltip>
    </div>
  );
}
