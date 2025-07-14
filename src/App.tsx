import './App.css';
import axios from 'axios';
import { useEffect, useState, useContext } from 'react';
import { v4 as uuidv4 } from 'uuid';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import AddCircleRounded from '@mui/icons-material/AddCircleRounded';

import type { ListType } from './types';
import { Login } from './pages/Login';
import { Register } from './pages/Register';
import {
  BG_DARK,
  BG_LIGHT,
  ThemeButton,
  ThemeContext
} from './context/ThemeContext';
import { ErrorContext } from './context/ErrorContext';
import { ListsContext } from './context/ListContext';
import { PageContext } from './context/PageContext';
import { ErrorMessage } from './components/ErrorMessage/ErrorMessage';
import { Lists } from './components/List/Lists';
import { LoadingSpinner } from './components/LoadingSpinner/LoadingSpinner';
import { responseOK } from './services/responseOK';

export const HOST_DIRECTORY = '/shopping-penguin';
const LOCAL_SERVER = 'http://localhost:8080';
const REMOTE_SERVER = 'https://shopping-penguin-server.onrender.com';
let shoppingServer: string = REMOTE_SERVER;
const DEBUG_USE_REMOTE = true;

function setupServerURL() {
  if (window.location.host.includes('localhost'))
    shoppingServer = DEBUG_USE_REMOTE ? REMOTE_SERVER : LOCAL_SERVER;
  if (window.location.host.includes('fiel.us')) shoppingServer = REMOTE_SERVER;
}

export default function App() {
  const { theme } = useContext(ThemeContext);
  const { showError } = useContext(ErrorContext);
  // const navigate = useNavigate();
  const { lists, setLists } = useContext(ListsContext);
  const { page, setPage } = useContext(PageContext);
  const [loading, setLoading] = useState(false);
  const [token, setToken] = useState(pullLocalToken());
  useEffect(() => {
    if (!token) pullLocalToken();
  });

  setupServerURL();

  function pullLocalToken(): string | null {
    const savedToken = localStorage.getItem('accessToken');
    // console.log('local token: ', savedToken);
    return savedToken ? savedToken : null;
  }

  function saveToken(token: string) {
    setToken(token);
    localStorage.setItem('accessToken', token);
  }

  const handleRegister = async (
    username: string,
    email: string,
    password: string
  ) => {
    try {
      setLoading(true);
      const roles = ['user'];
      const response = await axios.post(shoppingServer + '/api/auth/signup', {
        username,
        email,
        password,
        roles
      });
      setLoading(false);

      if (responseOK(response)) {
        localStorage.setItem('username', username);
        showError('Registration successful.', true);
        setPage('Login');
      } else {
        showError('Unable to register with that information.');
        console.error('Registration failed:', response.status);
      }
    } catch (error) {
      setLoading(false);
      showError('Unable to register with that information.');
      console.error('Registration failed:', error);
    }
  };

  const handleLogin = async (username: string, password: string) => {
    try {
      setLoading(true);
      const response = await axios.post(shoppingServer + '/api/auth/signin', {
        username,
        password
      });
      // console.log('response: ', response);
      setLoading(false);
      if (responseOK(response)) {
        saveToken(response.data.accessToken);
        localStorage.setItem('username', username);
        // showError('Login successful.', true);
        setPage('Home');
      } else {
        showError('Unable to login with that information.');
        console.error('Login failed:', response.status);
      }
    } catch (error) {
      setLoading(false);
      showError('Unable to login with that information. ');
      console.error('Login failed:', error);
    }
  };

  const handleLogout = () => {
    saveToken('');
    setLists([]);
    setPage('Login');
  };

  function createList() {
    const listJSON = `{"list":"New List","id":"${uuidv4()}","shown":"true","editList":"true","createCategory":"true","categories":[]}`;
    const newList: ListType = JSON.parse(listJSON);
    const newLists = new Array<ListType>(...lists);
    newLists.push(newList);
    // console.log('creating list: ', lists);
    setLists(newLists);
  }

  return (
    <div
      id="all"
      className={`${theme} w-full h-full text-[#08321a] dark:text-gray-200 flex flex-col gap-3 min-h-screen px-5 pt-5 bg-[${BG_LIGHT}] dark:bg-[${BG_DARK}]`}
    >
      <header className="flex justify-between items-center w-full">
        <div>
          {token && (
            <button
              type="button"
              onClick={() => handleLogout()}
              className="hidden md:flex items-center bg-blue-300 hover:bg-blue-400 focus:bg-blue-400 dark:bg-blue-700 dark:hover:bg-blue-600 dark:focus:bg-blue-600 px-3 rounded-md h-8.5"
            >
              Logout
            </button>
          )}
        </div>
        <div className="flex items-center">
          <img
            src="./images/penguin.svg"
            alt="Penguin logo."
            className="md:ml-5 w-16 md:w-20 lg:w-24"
          />
          <h1 className="text-3xl md:text-4xl lg:text-5xl">Shopping Penguin</h1>
          {token && (
            <Tooltip title="Create New List" disableInteractive arrow>
              <Button onClick={() => createList()} aria-label="Create new list">
                <AddCircleRounded />
              </Button>
            </Tooltip>
          )}
        </div>
        <div className="h-10">
          <div className="hidden md:flex ">
            <ThemeButton size={1} />
          </div>
        </div>
      </header>
      <ErrorMessage />
      <div id="primary" className="flex-1 mx-auto max-w-[1280px]">
        {page === 'Home' && (
          <Lists
            token={token}
            saveToken={saveToken}
            shoppingServer={shoppingServer}
            loading={loading}
            setLoading={setLoading}
          />
        )}
        {page === 'Login' && <Login onLogin={handleLogin} />}
        {page === 'Register' && <Register onRegister={handleRegister} />}
        {/* <Routes>
          <Route path="/" element={<Lists token={token} />} />
          <Route path="/login" element={<Login onLogin={handleLogin} />} />
          <Route
            path="/register"
            element={<Register onRegister={handleRegister} />}
          />
          <Route path="*" element={<NotFoundPage />} />
        </Routes> */}
      </div>
      {loading && <LoadingSpinner text="Connecting, please be patient..." />}
      <footer
        role="contentinfo"
        className="flex justify-between items-end mb-3"
      >
        <div>
          {token && (
            <button
              type="button"
              onClick={() => handleLogout()}
              className="flex md:hidden items-center bg-blue-300 hover:bg-blue-400 focus:bg-blue-400 dark:bg-blue-700 dark:hover:bg-blue-600 dark:focus:bg-blue-600 px-3 rounded-md h-8.5"
            >
              Logout
            </button>
          )}
        </div>
        <div>
          <a
            href="https://www.flaticon.com/free-icons/letter-f"
            title="letter f icons"
            className="text-center text-[8pt] text-gray-500"
          >
            <p>Letter f icons created by rashedul.islam - Flaticon</p>
          </a>
        </div>
        <div className="h-10">
          <div className="flex md:hidden">
            <ThemeButton size={1} />
          </div>
        </div>
      </footer>
    </div>
  );
}
