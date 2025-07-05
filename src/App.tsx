// import axios from 'axios';
import './App.css';
import { useEffect, useState, useReducer } from 'react';
import { Route, Routes } from 'react-router-dom';
import axios from 'axios';
import type { ListType } from './types';
import { Lists } from './components/List/List';
import { Login } from './pages/Login';
import { NotFoundPage } from './pages/NotFoundPage';
const SHOPPING_SERVER = 'http://localhost:8080';

export default function App() {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(() => {
    const savedToken = localStorage.getItem('token');
    return savedToken ? savedToken : null;
  });
  const [lists, setLists] = useState<ListType[]>([]);
  const forceUpdate = useReducer(() => ({}), 0)[1];
  useEffect(() => {
    fetchLists();
  }, []);

  const handleRegister = async (username: string, password: string) => {
    try {
      const response = await axios.post(SHOPPING_SERVER + '/api/auth/signup', {
        username,
        password
      });
      setToken(response.data.token);
      localStorage.setItem('token', response.data.token);
    } catch (error) {
      console.error('Registration failed:', error);
    }
  };

  const handleLogin = async (username: string, password: string) => {
    try {
      const response = await axios.post(SHOPPING_SERVER + '/api/auth/signin', {
        username,
        password
      });
      setToken(response.data.token);
      localStorage.setItem('token', response.data.token);
    } catch (error) {
      console.error('Login failed:', error);
    }
  };

  const fetchLists = () => {
    // console.log('fetching lists');
    try {
      let listJSON = localStorage.getItem('shoppingLists');
      console.log(listJSON);
      if (!listJSON || listJSON === '[]')
        listJSON =
          '[{"list":"Grocery Store","id":"0","shown":"true","categories":[{"id":"1","category":"Produce","items":[{"id":"2","item":"Apples"},{"id":"3","item":"Potatoes"}]}]}]';

      setLists(JSON.parse(listJSON));
      console.log(JSON.parse(listJSON));
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
      <header className="flex items-center mx-auto w-fit">
        <img
          src="../src/images/penguin.svg"
          alt="Penguin logo."
          className="md:ml-5 w-16 md:w-20 lg:w-24"
        />
        <h1 className="text-3xl md:text-4xl lg:text-5xl">Shopping Penguin</h1>
      </header>
      <Routes>
        {/* <Route path="/" element={<HomePage />} /> */}
        <Route path="/login" element={<Login onLogin={handleLogin} />} />
        {/* <Route path="/category/:strCategory" element={<Category />} />
        <Route path="/search/:searchText" element={<Search />} />
        <Route path="/recipe/:idMeal" element={<Recipe />} /> */}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
      {lists && <Lists lists={lists} saveLists={saveLists} />}
    </div>
  );
}
