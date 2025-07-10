import { useContext, useState } from 'react';
import { PageContext } from '../context/PageContext';
// import { useNavigate } from 'react-router-dom';

export function Register({
  onRegister
}: {
  onRegister: (
    username: string,
    email: string,
    password: string
  ) => Promise<void>;
}) {
  const { setPage } = useContext(PageContext);
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  // const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onRegister(username, email, password);
  };

  return (
    <div className="border rounded-lg bg-gray-200 dark:bg-gray-800 p-7">
      <form onSubmit={handleSubmit} className="flex flex-col gap-3">
        <input
          autoFocus
          type="text"
          placeholder="Username"
          value={username}
          onChange={e => setUsername(e.target.value)}
          maxLength={100}
          className="border rounded-md py-1 px-2 w-50 min-w-24 bg-gray-300 dark:bg-gray-800 dark:text-gray-300"
        />{' '}
        <input
          type="email"
          placeholder="Email Address"
          value={email}
          onChange={e => setEmail(e.target.value)}
          maxLength={255}
          className="border rounded-md py-1 px-2 w-50 min-w-24 bg-gray-300 dark:bg-gray-800 dark:text-gray-300"
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          maxLength={100}
          className="border rounded-md py-1 px-2 w-50 min-w-24 bg-gray-300 dark:bg-gray-800 dark:text-gray-300"
        />
        <button
          type="submit"
          className="bg-blue-300 hover:bg-blue-400 focus:bg-blue-400 dark:bg-blue-700 dark:hover:bg-blue-600 dark:focus:bg-blue-600 px-3 rounded-md h-8.5"
        >
          Register
        </button>
      </form>
      <button
        type="button"
        onClick={() => setPage('Login')}
        className="bg-blue-300 hover:bg-blue-400 focus:bg-blue-400 dark:bg-blue-700 dark:hover:bg-blue-600 dark:focus:bg-blue-600 px-3 rounded-md h-8.5 mt-7"
      >
        Login
      </button>
    </div>
  );
}
