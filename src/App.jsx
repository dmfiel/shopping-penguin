// import axios from 'axios';
import { useEffect, useState, useReducer } from 'react';
import { RenderLists, RenderList } from './List.jsx';
import './App.css';
import Button from '@mui/material/Button';

export default function App() {
  const [lists, setLists] = useState([]);
  const forceUpdate = useReducer(() => ({}), 0)[1];
  useEffect(() => {
    fetchLists();
  }, []);

  const fetchLists = () => {
    console.log('fetching lists');
    try {
      // const res = await axios.get('http://localhost:5000/api/lists', '');
      // setLists(res.data);
      let listJSON = localStorage.getItem('shoppingLists');
      if (!listJSON || listJSON === '[]')
        listJSON =
          '{"lists":[{"list":"Grocery Store","categories":[{"category":"Produce","items":[{"item":"Apples"},{"item":"Potatoes"}]}]}]}';
      setLists(JSON.parse(listJSON));
    } catch (error) {
      console.error('Error fetching lists:', error);
    }
  };

  const saveLists = () => {
    console.log('savelists lists: ', lists);
    localStorage.setItem('shoppingLists', JSON.stringify(lists));
    forceUpdate();
  };

  return (
    <div>
      <header>
        <h1>Shopping Penguin</h1>
        <img
          src="../src/images/penguin.svg"
          width="100px"
          alt="Penguin logo."
        />
      </header>
      {lists && lists.lists && (
        <RenderLists lists={lists.lists} saveLists={saveLists} />
      )}
    </div>
  );
}
