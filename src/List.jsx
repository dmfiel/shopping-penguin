import React, { useState } from 'react';
import { Checkbox, Button } from '@mui/material';
import {
  ExpandLess,
  ExpandMore,
  EditRounded,
  Save,
  AddCircleRounded,
  DeleteForever
} from '@mui/icons-material';

function RenderLists({ lists, saveLists }) {
  console.log('renderlist lists', lists);

  return (
    <div>
      {/* Lists: {props.lists.length} */}
      {lists.map(list => (
        <RenderList
          list={list}
          lists={lists}
          key={list.list}
          saveLists={saveLists}
        />
      ))}
    </div>
  );
}

function RenderList({ list, lists, saveLists }) {
  // console.log('Render Cat: ', cat);
  if (list.deleted) return;
  if (!list.shown) list.shown = true;
  const [checked, setChecked] = useState(list.shown);
  const [edit, setEdit] = useState(false);
  const [input, setInput] = useState(list.list);
  const [inputSave, setInputSave] = useState(list.list);
  const [create, setCreate] = useState(false);

  function onChangeHandler() {
    setChecked(!checked);
    list.shown = checked;
    saveLists();
  }

  function saveInput(e) {
    setInput(e.target.value);
  }
  function inputKey(e) {
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
    list.list = input;
    saveLists();
  }
  function deleteList() {
    list.deleted = true;
    saveLists();
  }

  return (
    <div className="listContainer">
      <div className="listSelector">
        <Checkbox
          checked={checked}
          onChange={onChangeHandler}
          icon={<ExpandLess />}
          checkedIcon={<ExpandMore />}
          label={input}
        />{' '}
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
          <div>
            <input
              autoFocus
              type="text"
              value={input}
              onChange={e => saveInput(e)}
              onBlur={() => saveEndEdit()}
              onKeyDown={e => inputKey(e)}
            />
            <Button>
              <Save
                onClick={() => {
                  saveEndEdit();
                }}
              />
            </Button>
          </div>
        )}
        {!edit && (
          <Button>
            <EditRounded
              onClick={() => {
                setInputSave(input);
                setEdit(true);
              }}
            />
          </Button>
        )}
        <Button>
          <AddCircleRounded disabled={create} onClick={() => setCreate(true)} />
        </Button>
        <Button>
          <DeleteForever onClick={deleteList} />
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
          <RenderCategory
            cat={cat}
            list={list}
            lists={lists}
            key={list.list + '::' + cat.category}
            saveLists={saveLists}
          />
        ))}
    </div>
  );
}

function CreateCategory({ list, saveLists, setCreate }) {
  const [input, setInput] = useState('');

  function saveInput(e) {
    setInput(e.target.value);
  }
  function inputKey(e) {
    if (e.key === 'Enter') {
      saveEndEdit();
    }
    if (e.key === 'Escape') {
      setCreate(false);
    }
  }
  function saveEndEdit() {
    let newCategory = {};
    newCategory.category = input;
    if (!list.categories) list.categories = [];
    list.categories.push(newCategory);
    saveLists();
    setCreate(false);
  }

  return (
    <div className="categorySelector">
      <Checkbox
        checked={false}
        disabled={true}
        icon={<ExpandLess />}
        checkedIcon={<ExpandMore />}
      />{' '}
      <input
        autoFocus
        type="text"
        value={input}
        onChange={e => saveInput(e)}
        onBlur={() => saveEndEdit()}
        onKeyDown={e => inputKey(e)}
      />
      <Button>
        <Save
          onClick={() => {
            saveEndEdit();
          }}
        />
      </Button>
    </div>
  );
}

function RenderCategory({ cat, list, lists, saveLists }) {
  // console.log('Render Cat: ', cat);
  if (cat.deleted) return;
  if (!cat.shown) cat.shown = true;
  const [checked, setChecked] = useState(cat.shown);
  const [edit, setEdit] = useState(false);
  const [input, setInput] = useState(cat.category);
  const [inputSave, setInputSave] = useState(cat.category);
  const [create, setCreate] = useState(false);

  function onChangeHandler() {
    setChecked(!checked);
    list.shown = checked;
    saveLists();
  }

  function saveInput(e) {
    setInput(e.target.value);
  }
  function inputKey(e) {
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
    cat.category = input;
    saveLists();
  }
  function deleteCategory() {
    cat.deleted = true;
    saveLists();
  }

  return (
    <div className="categoryContainer">
      <div className="categorySelector">
        <Checkbox
          checked={checked}
          onChange={onChangeHandler}
          icon={<ExpandLess />}
          checkedIcon={<ExpandMore />}
          label={cat.category}
        />
        {!edit && (
          <h3 className="category" onClick={onChangeHandler}>
            {input}
            {!checked && ' (' + cat.items.length + ')'}
          </h3>
        )}
        {edit && (
          <div>
            <input
              autoFocus
              type="text"
              value={input}
              onChange={e => saveInput(e)}
              onBlur={() => saveEndEdit()}
              onKeyDown={e => inputKey(e)}
            />

            <Button>
              <Save
                onClick={() => {
                  saveEndEdit();
                }}
              />
            </Button>
          </div>
        )}
        {!edit && (
          <Button>
            <EditRounded
              onClick={() => {
                setInputSave(input);
                setEdit(true);
              }}
            />
          </Button>
        )}
        <Button>
          <AddCircleRounded disabled={create} onClick={() => setCreate(true)} />
        </Button>
        <Button>
          <DeleteForever onClick={deleteCategory} />
        </Button>
      </div>
      {create && (
        <CreateItem
          cat={cat}
          list={list}
          lists={lists}
          saveLists={saveLists}
          setCreate={setCreate}
        />
      )}
      {checked &&
        cat.items &&
        cat.items.map(item => (
          <RenderItem
            item={item}
            cat={cat}
            list={list}
            lists={lists}
            key={list.list + '::' + cat.category + '::' + item.item}
            saveLists={saveLists}
          />
        ))}
    </div>
  );
}

function CreateItem({ cat, list, lists, saveLists, setCreate }) {
  const [input, setInput] = useState('');

  function saveInput(e) {
    setInput(e.target.value);
  }
  function inputKey(e) {
    if (e.key === 'Enter') {
      saveEndEdit();
    }
    if (e.key === 'Escape') {
      setCreate(false);
    }
  }
  function saveEndEdit() {
    let newItem = {};
    newItem.item = input;
    if (!cat.items) cat.items = [];
    cat.items.push(newItem);
    saveLists();
    setCreate(false);
  }

  return (
    <div className="item">
      <Checkbox disabled={true} />{' '}
      <input
        autoFocus
        type="text"
        value={input}
        onChange={e => saveInput(e)}
        onBlur={() => saveEndEdit()}
        onKeyDown={e => inputKey(e)}
      />
      <Button>
        <Save
          onClick={() => {
            saveEndEdit();
          }}
        />
      </Button>
    </div>
  );
}

function RenderItem({ item, saveLists }) {
  // unused params cat, list, lists,
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

  function saveInput(e) {
    setInput(e.target.value);
  }
  function inputKey(e) {
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
    item.item = input;
    saveLists();
  }
  function deleteItem() {
    item.deleted = true;
    saveLists();
  }
  return (
    <div className="item">
      <Checkbox checked={checked} onChange={onChangeHandler} label={input} />
      {!edit && <h4 onClick={onChangeHandler}>{input}</h4>}
      {edit && (
        <div>
          <input
            autoFocus
            type="text"
            value={input}
            onChange={e => saveInput(e)}
            onBlur={() => saveEndEdit()}
            onKeyDown={e => inputKey(e)}
          />
          <Button>
            <Save
              onClick={() => {
                saveEndEdit();
              }}
            />
          </Button>
        </div>
      )}
      {!edit && (
        <Button>
          <EditRounded
            onClick={() => {
              setInputSave(input);
              setEdit(true);
            }}
          />
        </Button>
      )}{' '}
      <Button>
        <DeleteForever onClick={deleteItem} />
      </Button>
    </div>
  );
}

export { RenderLists, RenderList };
