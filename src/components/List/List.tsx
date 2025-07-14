import { useContext, useEffect, useReducer, useState } from 'react';
// import { useNavigate } from 'react-router-dom';
import axios, { AxiosError } from 'axios';
import { v4 as uuidv4 } from 'uuid';
// import { Checkbox, Button, Tooltip } from '@mui/material';
import Tooltip from '@mui/material/Tooltip';
import Checkbox from '@mui/material/Checkbox';
import Button from '@mui/material/Button';
import AddCircleRounded from '@mui/icons-material/AddCircleRounded';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import EditRounded from '@mui/icons-material/EditRounded';
import Save from '@mui/icons-material/Save';
import DeleteForever from '@mui/icons-material/DeleteForever';

import { Category, CreateCategory } from './Category';
import type { ItemCatType, ListProps, ListsProps, ListType } from '../../types';

import { ErrorContext } from '../../context/ErrorContext';
import { ListsContext } from '../../context/ListContext';
import { responseOK } from '../services/responseOK';
import { PageContext } from '../../context/PageContext';
import { Item } from './Item';
import { catCountOpen } from '../services/catCountOpen';

export function Lists({
  token,
  saveToken,
  shoppingServer,
  loading,
  setLoading
}: ListsProps) {
  const { lists, setLists } = useContext(ListsContext);
  const { setPage } = useContext(PageContext);
  // const navigate = useNavigate();
  const { showError } = useContext(ErrorContext);
  const [status, setStatus] = useState<number | undefined>(0);

  // console.log('in Lists', lists && lists.length, lists);

  useEffect(() => {
    if (!lists || lists.length === 0) fetchLists();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function fetchLists() {
    // console.log('fetching lists');
    try {
      if (!token) {
        console.log('No token found, going to login');
        setPage('Login');
        return;
      }

      setLoading(true);
      // pull lists from Mongo
      const response = await axios.get(shoppingServer + '/api/lists', {
        headers: { Authorization: token }
      });
      setLoading(false);

      setStatus(response.status);
      if (responseOK(response)) {
        // console.log('/lists response: ', response.data.lists);
        setLists(response.data.lists);
        saveToken(response.data.accessToken);
      } else throw new Error();
      // showError('Successfully read lists from database.', true);
    } catch (error) {
      setLoading(false);

      const newStatus = (error as AxiosError).status;
      setStatus(newStatus);
      switch (newStatus) {
        case 404:
          showError('No list found for user.');
          setLists([]);
          break;
        case 401:
          showError('Expired token, please login.');
          setPage('Login');
          break;
        case 403:
          showError('No token provided, please login.');
          setPage('Login');
          break;
        case 500:
        default:
          showError('Error getting lists from database.');
          break;
      }
      console.error('Error fetching lists:', error);
    }
  }

  async function pushLists() {
    // console.log('Saving lists to DB');
    try {
      if (!token) {
        console.log('No token found, going to login');
        setPage('Login');
        return;
      }

      setLoading(true);
      // console.log('saving listJSON:', listJSON);
      // save lists into Mongo
      const response = await axios.post(shoppingServer + '/api/lists', lists, {
        headers: { Authorization: token }
      });
      setLoading(false);

      setStatus(response.status);
      if (responseOK(response)) {
        // showError('Successfully saved lists into database.', true);
      } else throw new Error();
    } catch (error) {
      setLoading(false);
      const newStatus = (error as AxiosError).status;
      setStatus(newStatus);
      switch (newStatus) {
        case 401:
          showError('Expired token, please login.');
          setPage('Login');
          break;
        case 403:
          showError('No token provided, please login.');
          setPage('Login');
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
    const username = localStorage.getItem('username') || '';
    const listJSON = localStorage.getItem('shoppingLists:' + username);
    // console.log(listJSON);
    if (listJSON) {
      const newLists = JSON.parse(listJSON);
      if (newLists && newLists.length > 0) setLists(newLists);
      // console.log(JSON.parse(listJSON));
      // showError('Loaded lists from local storage.', true);
    } else {
      // showError('No lists found in local storage.');
    }
  }

  useEffect(() => {
    if (status === 404) getLocalLists();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status]);

  function createList() {
    const listJSON = `{"list":"New List","id":"${uuidv4()}","shown":"true","editList":"true","createCategory":"true","categories":[]}`;
    const newList: ListType = JSON.parse(listJSON);
    newList.created = new Date();
    newList.modified = new Date();
    const newLists = new Array<ListType>(...lists);
    newLists.push(newList);
    // console.log('creating list: ', lists);
    setLists(newLists);
  }

  function sampleData() {
    const listJSON =
      '[{"list":"Grocery Store","id":"0","shown":"true","categories":[{"id":"1","category":"Produce","items":[{"id":"2","item":"Apples"},{"id":"3","item":"Potatoes"}]}]}]';
    let newLists: ListType[] = JSON.parse(listJSON);
    newLists = newLists.map(list => {
      list.created = new Date();
      list.modified = new Date();
      return list;
    });
    setLists(newLists);
  }

  function saveLists() {
    if (!lists || lists.length === 0) return;
    // console.log('savelists lists: ', lists);
    const listJSON = JSON.stringify(lists);
    const username = localStorage.getItem('username') || '';
    localStorage.setItem('shoppingLists:' + username, listJSON);
    pushLists();
    forceUpdate();
  }

  const forceUpdate = useReducer(() => ({}), 0)[1];

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => saveLists(), [lists]);

  return (
    <div className="mx-auto">
      {!loading && (!lists || lists.length === 0) && (
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
      )}
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
  const [edit, setEdit] = useState<boolean>(list.editList || false);
  const [input, setInput] = useState<string>(list.list);
  const [inputSave, setInputSave] = useState<string>(list.list);
  const [create, setCreate] = useState<boolean>(list.createCategory || false);
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
        <Tooltip title="Delete List" disableInteractive arrow>
          <Button onClick={deleteList}>
            <DeleteForever />
          </Button>
        </Tooltip>
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
      <EmptyCategories list={list} saveLists={saveLists} />
      <CompletedItems itemCats={itemCats} list={list} saveLists={saveLists} />
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
