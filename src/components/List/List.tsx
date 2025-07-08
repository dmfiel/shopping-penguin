import { useContext, useEffect, useReducer, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios, { AxiosError } from 'axios';
import { v4 as uuidv4 } from 'uuid';
import { Checkbox, Button, Tooltip } from '@mui/material';
import {
  ExpandLess,
  ExpandMore,
  EditRounded,
  Save,
  AddCircleRounded,
  DeleteForever
} from '@mui/icons-material';

import { Category, CreateCategory } from './Category';
import type { ListProps, ListsProps, ListType } from '../../types';
import { SHOPPING_SERVER } from '../../App';
import { ErrorContext } from '../../context/ErrorContext';
import { ListsContext } from '../../context/ListContext';

export function Lists({ token }: ListsProps) {
  const { lists, setLists } = useContext(ListsContext);
  const navigate = useNavigate();
  const { showError } = useContext(ErrorContext);
  const [status, setStatus] = useState<number | undefined>(0);

  // console.log('in Lists', lists.length, lists);

  useEffect(() => {
    if (!lists || lists.length === 0) fetchLists();
  }, []);

  async function fetchLists() {
    // console.log('fetching lists');
    try {
      if (!token) {
        console.log('No token found, going to login');
        navigate('/login');
        return;
      }

      // pull lists from Mongo
      const response = await axios.get(SHOPPING_SERVER + '/api/lists', {
        headers: { Authorization: token }
      });

      setStatus(response.status);
      // console.log('/lists response: ', response);
      setLists(response.data.lists);
      // showError('Successfully read lists from database.', true);
    } catch (error) {
      const newStatus = (error as AxiosError).status;
      setStatus(newStatus);
      switch (newStatus) {
        case 404:
          showError('No list found for user.');
          setLists([]);
          break;
        case 401:
          showError('Expired token, please login.');
          navigate('/login');
          break;
        case 403:
          showError('No token provided, please login.');
          navigate('/login');
          break;
        case 500:
        default:
          showError('Error getting lists from database.');
          break;
      }
      console.error('Error fetching lists:', error);
    }
  }

  async function pushLists(listJSON: string) {
    // console.log('Saving lists to DB');
    try {
      if (!token) {
        console.log('No token found, going to login');
        navigate('/login');
        return;
      }

      // console.log('saving listJSON:', listJSON);
      // save lists into Mongo
      const response = await axios.post(SHOPPING_SERVER + '/api/lists', lists, {
        headers: { Authorization: token }
      });

      setStatus(response.status);
      // console.log('/lists response: ', response);
      // showError('Successfully saved lists into database.', true);
    } catch (error) {
      const newStatus = (error as AxiosError).status;
      setStatus(newStatus);
      switch (newStatus) {
        case 401:
          showError('Expired token, please login.');
          navigate('/login');
          break;
        case 403:
          showError('No token provided, please login.');
          navigate('/login');
          break;
        case 500:
        default:
          showError('Error saving lists into database.');
          break;
      }
      console.error('Error saving lists:', error);
    }
  }

  function getLocalLists() {
    let listJSON = localStorage.getItem('shoppingLists');
    // console.log(listJSON);
    if (listJSON) {
      setLists(JSON.parse(listJSON));
      // console.log(JSON.parse(listJSON));
      // showError('Loaded lists from local storage.', true);
    } else {
      showError('No lists found in local storage.');
    }
  }

  useEffect(() => {
    if (status === 404) getLocalLists();
  }, [status]);

  function createList() {
    const listJSON = `{"list":"New List","id":"${uuidv4()}","shown":"true","categories":[]}`;
    const newList: ListType = JSON.parse(listJSON);
    const newLists = new Array<ListType>(...lists);
    newLists.push(newList);
    // console.log('creating list: ', lists);
    setLists(newLists);
  }

  function sampleData() {
    const listJSON =
      '[{"list":"Grocery Store","id":"0","shown":"true","categories":[{"id":"1","category":"Produce","items":[{"id":"2","item":"Apples"},{"id":"3","item":"Potatoes"}]}]}]';
    setLists(JSON.parse(listJSON));
  }

  function saveLists() {
    if (!lists || lists.length === 0) return;
    // console.log('savelists lists: ', lists);
    const listJSON = JSON.stringify(lists);
    localStorage.setItem('shoppingLists', listJSON);
    pushLists(listJSON);
    forceUpdate();
  }

  const forceUpdate = useReducer(() => ({}), 0)[1];

  useEffect(() => saveLists(), [lists]);

  return (
    <div className="mx-auto">
      {!lists ||
        (lists.length === 0 && (
          <div className="flex flex-col gap-3">
            <h1 className="text-center">
              You don't have any lists.
              <br />
              How would you like to proceed?
            </h1>
            <button
              type="button"
              className="bg-blue-300 hover:bg-blue-400 focus:bg-blue-400 dark:bg-blue-700 dark:hover:bg-blue-600 dark:focus:bg-blue-600 px-3 rounded-md"
              onClick={() => createList()}
            >
              Create a new list
            </button>
            <button
              type="button"
              className="bg-blue-300 hover:bg-blue-400 focus:bg-blue-400 dark:bg-blue-700 dark:hover:bg-blue-600 dark:focus:bg-blue-600 px-3 rounded-md"
              onClick={() => sampleData()}
            >
              Load some sample data
            </button>
          </div>
        ))}
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

  if (list.deleted) return;

  // console.log('in List', list);

  function onChangeHandler() {
    list.shown = !checked;
    setChecked(!checked);
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
                      .map(cat =>
                        cat.items && cat.items.length > 0
                          ? cat.items.filter(
                              item => !item.completed && !item.deleted
                            ).length
                          : 0
                      )
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
        <Tooltip title="Delete List" disableInteractive arrow>
          <Button onClick={deleteList}>
            <DeleteForever />
          </Button>
        </Tooltip>
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
        list.categories.length > 0 &&
        list.categories.map(cat => (
          <Category cat={cat} list={list} key={cat.id} saveLists={saveLists} />
        ))}
    </div>
  );
}
