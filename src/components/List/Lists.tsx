import { useContext, useEffect, useReducer, useState } from 'react';
// import { useNavigate } from 'react-router-dom';
import axios, { AxiosError } from 'axios';
import { v4 as uuidv4 } from 'uuid';

import type { ListsProps, ListType } from '../../types';

import { ErrorContext } from '../../context/ErrorContext';
import { ListsContext } from '../../context/ListContext';
import { PageContext } from '../../context/PageContext';
import { responseOK } from '../../services/responseOK';
import { List } from './List';

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
  const [listsModDate, setListsModDate] = useState<string>('');

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
        setListsModDate(response.data.updatedAt);
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

  async function checkListsModDate(): Promise<boolean> {
    try {
      if (!token) {
        console.log('No token found, going to login');
        setPage('Login');
        return false;
      }

      // pull lists modification date from Mongo
      const response = await axios.get(shoppingServer + '/api/listsmod', {
        headers: { Authorization: token }
      });

      if (responseOK(response)) {
        return response.data.updatedAt === listsModDate;
      } else throw new Error();
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
      return false;
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
      // check to make sure we have the latest copy from the database
      if (!(await checkListsModDate())) {
        showError('Getting updated lists, please re-do your change.');
        lists.push({
          id: 'refresh',
          list: '',
          categories: [],
          deleted: true,
          shown: false
        });
        setLists(lists);

        await fetchLists();
        setLoading(false);
        return;
      }
      // console.log('saving listJSON:', listJSON);
      // save lists into Mongo
      const response = await axios.post(shoppingServer + '/api/lists', lists, {
        headers: { Authorization: token }
      });
      setLoading(false);

      setStatus(response.status);
      if (responseOK(response)) {
        // showError('Successfully saved lists into database.', true);
        setListsModDate(response.data.updatedAt);
        if (response.data.accessToken) saveToken(response.data.accessToken);
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
        lists
          .filter(list => !list.deleted)
          .map(list => (
            <List
              list={list}
              lists={lists}
              key={list.id}
              saveLists={saveLists}
            />
          ))}
    </div>
  );
}
