import { useState } from 'react';
import { Checkbox, Button } from '@mui/material';
import { Category, CreateCategory } from './Category';
import type { ListProps, ListsProps } from '../../types';
import {
  ExpandLess,
  ExpandMore,
  EditRounded,
  Save,
  AddCircleRounded,
  DeleteForever
} from '@mui/icons-material';

export function Lists({ lists, saveLists }: ListsProps) {
  console.log('in Lists', lists.length, lists);
  return (
    <div className="mx-auto">
      {lists &&
        lists.length > 0 &&
        lists.map(list => (
          <List list={list} lists={lists} key={list.id} saveLists={saveLists} />
        ))}
    </div>
  );
}

export function List({ list, saveLists }: ListProps) {
  const [checked, setChecked] = useState<boolean>(list.shown);
  const [edit, setEdit] = useState<boolean>(false);
  const [input, setInput] = useState<string>(list.list);
  const [inputSave, setInputSave] = useState<string>(list.list);
  const [create, setCreate] = useState<boolean>(false);

  console.log('in List', list);

  if (list.deleted) return;
  if (!list.shown) list.shown = true;

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
    if (input) list.list = input;
    saveLists();
  }
  function deleteList() {
    list.deleted = true;
    saveLists();
  }

  return (
    <div className="listContainer">
      <div className="listSelector mt-2.5 text-2xl font-medium flex items-center cursor-pointer">
        <Checkbox
          checked={checked}
          onChange={onChangeHandler}
          icon={<ExpandLess />}
          checkedIcon={<ExpandMore />}
          // label={list.list}
        />
        {!edit && (
          <h2 className="list" onClick={onChangeHandler}>
            <span>{input}</span>
            {!checked &&
              ' (' +
                list.categories
                  .map(cat => (cat.items ? cat.items.length : 0))
                  .reduce((total, cat) => total + cat) +
                ')'}
          </h2>
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
        )}
        <Button disabled={create} onClick={() => setCreate(true)}>
          <AddCircleRounded />
        </Button>
        <Button onClick={deleteList}>
          <DeleteForever />
        </Button>
      </div>
      {create && (
        <CreateCategory
          list={list}
          saveLists={saveLists}
          setCreate={setCreate}
        />
      )}
      {checked &&
        list.categories &&
        list.categories.map(cat => (
          <Category cat={cat} list={list} key={cat.id} saveLists={saveLists} />
        ))}
    </div>
  );
}
