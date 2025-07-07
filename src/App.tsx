// import axios from 'axios';
import './App.css';
import { useEffect, useState, useReducer, useContext } from 'react';
import { Route, Routes, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';
import { Button, Tooltip } from '@mui/material';
import { AddCircleRounded } from '@mui/icons-material';

import type { ListType } from './types';
import { Lists } from './components/List/List';
import { Login } from './pages/Login';
import { NotFoundPage } from './pages/NotFoundPage';
import { ThemeButton, ThemeContext } from './context/ThemeContext';
import { ErrorContext } from './context/ErrorContext';
import { ErrorMessage } from './components/ErrorMessage/ErrorMessage';
import { Register } from './pages/Register';
import { ListsContext } from './context/ListContext';
export const SHOPPING_SERVER = 'http://localhost:8080';

export default function App() {
  const { theme } = useContext(ThemeContext);
  const { showError } = useContext(ErrorContext);
  const navigate = useNavigate();
  const { lists, setLists } = useContext(ListsContext);

  const [user, setUser] = useState(null);
  const [token, setToken] = useState(pullLocalToken());

  const forceUpdate = useReducer(() => ({}), 0)[1];

  useEffect(() => {
    if (!token) pullLocalToken();
  });

  function pullLocalToken(): string | null {
    const savedToken = localStorage.getItem('accessToken');
    console.log('local token: ', savedToken);
    return savedToken ? savedToken : null;
  }

  const handleRegister = async (
    username: string,
    email: string,
    password: string
  ) => {
    try {
      const roles = ['user'];
      const response = await axios.post(SHOPPING_SERVER + '/api/auth/signup', {
        username,
        email,
        password,
        roles
      });
      localStorage.setItem('username', username);
      showError('Registration successful.', true);
      navigate('/login');
    } catch (error) {
      showError('Unable to register with that information.');
      console.error('Registration failed:', error);
    }
  };

  const handleLogin = async (username: string, password: string) => {
    try {
      const response = await axios.post(SHOPPING_SERVER + '/api/auth/signin', {
        username,
        password
      });
      console.log('response: ', response);
      setToken(response.data.accessToken);
      localStorage.setItem('accessToken', response.data.accessToken);
      showError('Login successful.', true);
      navigate('/');
    } catch (error) {
      showError('Unable to login with that information. ');
      console.error('Login failed:', error);
    }
  };

  function createList() {
    const listJSON = `{"list":"New List","id":"${uuidv4()}","shown":"true","categories":[]}`;
    const newList: ListType = JSON.parse(listJSON);
    const newLists = new Array<ListType>(...lists);
    newLists.push(newList);
    console.log('creating list: ', lists);
    setLists(newLists);
  }

  return (
    <div
      id="all"
      className={`${theme} w-full h-full    dark:text-gray-200 flex flex-col gap-3 min-h-screen px-5 pt-5 bg-[#d0e5d9] text-[#08321a] dark:bg-[#202422]`}
    >
      <header className="flex justify-between items-center w-full">
        <div></div>
        <div className="flex items-center">
          <img
            src="../src/images/penguin.svg"
            alt="Penguin logo."
            className="md:ml-5 w-16 md:w-20 lg:w-24"
          />
          <h1 className="text-3xl md:text-4xl lg:text-5xl">Shopping Penguin</h1>
          <Tooltip title="Create New List" disableInteractive>
            <Button onClick={() => createList()} aria-label="Create new list">
              <AddCircleRounded />
            </Button>
          </Tooltip>
        </div>
        <div className="h-10">
          <ThemeButton size={1} />
        </div>
      </header>
      <ErrorMessage />
      <div id="primary" className="flex-1 mx-auto max-w-[1280px]">
        <Routes>
          <Route path="/" element={<Lists token={token} />} />
          <Route path="/login" element={<Login onLogin={handleLogin} />} />
          <Route
            path="/register"
            element={<Register onRegister={handleRegister} />}
          />
          {/* <Route path="/category/:strCategory" element={<Category />} />
        <Route path="/search/:searchText" element={<Search />} />
        <Route path="/recipe/:idMeal" element={<Recipe />} /> */}
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </div>
      <footer role="contentinfo">
        <a
          href="https://www.flaticon.com/free-icons/letter-f"
          title="letter f icons"
          className="text-center text-[8pt] text-gray-500"
        >
          <p>Letter f icons created by rashedul.islam - Flaticon</p>
        </a>
      </footer>
    </div>
  );
}
