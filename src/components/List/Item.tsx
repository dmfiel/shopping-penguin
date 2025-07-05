import { useState } from 'react';
import { Checkbox, Button } from '@mui/material';
import type { ItemType, ItemProps, CreateItemProps } from '../../types';
import { EditRounded, Save, DeleteForever } from '@mui/icons-material';
import { v4 as uuidv4 } from 'uuid';

export function CreateItem({ cat, saveLists, setCreate }: CreateItemProps) {
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
    let newItem: ItemType = {
      id: uuidv4(),
      item: '',
      deleted: false,
      completed: false
    };
    if (input) {
      newItem.item = input;
      if (!cat.items) cat.items = [];
      cat.items.push(newItem);
      saveLists();
    }
    setCreate(false);
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
  );
}

export function Item({ item, saveLists }: ItemProps) {
  if (item.deleted) return;
  if (!item.completed) item.completed = false;
  const [checked, setChecked] = useState(item.completed);
  const [edit, setEdit] = useState(false);
  const [input, setInput] = useState(item.item);
  const [inputSave, setInputSave] = useState(item.item);
  // console.log('Render Item: ', item);

  function onChangeHandler() {
    setChecked(!checked);
    item.completed = checked;
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
    saveLists();
  }
  function deleteItem() {
    item.deleted = true;
    saveLists();
  }
  return (
    <div className="item ml-5 text-base font-normal flex items-center cursor-pointer">
      {/* label={input} */}
      <Checkbox checked={checked} onChange={onChangeHandler} />
      {!edit && <h4 onClick={onChangeHandler}>{input}</h4>}
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
        <Button
          onClick={() => {
            setInputSave(input);
            setEdit(true);
          }}
        >
          <EditRounded />
        </Button>
      )}{' '}
      <Button onClick={deleteItem}>
        <DeleteForever />
      </Button>
    </div>
  );
}
