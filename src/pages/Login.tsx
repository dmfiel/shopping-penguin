import { useContext, useEffect, useState } from 'react';
import { PageContext } from '../context/PageContext';
// import { useNavigate } from 'react-router-dom';

export function Login({
  onLogin
}: {
  onLogin: (username: string, password: string) => Promise<void>;
}) {
  const { setPage } = useContext(PageContext);
  const [username, setUsername] = useState(
    localStorage.getItem('username') || ''
  );
  const [password, setPassword] = useState('');
  // const navigate = useNavigate();

  useEffect(() => {
    if (username && username.length > 0)
      document.getElementById('password')?.focus();
  }, []);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onLogin(username, password);
  };

  return (
    <div className="border rounded-lg bg-gray-200 dark:bg-gray-800 p-7">
      <form onSubmit={handleSubmit} className="flex gap-3">
        <input
          autoFocus
          type="text"
          placeholder="Username"
          value={username}
          onChange={e => setUsername(e.target.value)}
          maxLength={100}
          className="border rounded-md py-1 px-2 w-24 min-w-24 bg-gray-300 dark:bg-gray-800 dark:text-gray-300"
        />
        <input
          id="password"
          type="password"
          placeholder="Password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          maxLength={100}
          className="border rounded-md py-1 px-2 w-24 min-w-24 bg-gray-300 dark:bg-gray-800 dark:text-gray-300"
        />
        <button
          type="submit"
          className="bg-blue-300 hover:bg-blue-400 focus:bg-blue-400 dark:bg-blue-700 dark:hover:bg-blue-600 dark:focus:bg-blue-600 px-3 rounded-md"
        >
          Login
        </button>
      </form>
      <button
        type="button"
        onClick={() => setPage('Register')}
        className="bg-blue-300 hover:bg-blue-400 focus:bg-blue-400 dark:bg-blue-700 dark:hover:bg-blue-600 dark:focus:bg-blue-600 px-3 rounded-md h-8.5 mt-7"
      >
        Register New Account
      </button>
    </div>
  );
}
