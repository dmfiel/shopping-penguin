import { useState } from 'react';

export function Register({
  onRegister
}: {
  onRegister: (
    username: string,
    email: string,
    password: string
  ) => Promise<void>;
}) {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onRegister(username, email, password);
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-3">
      <input
        autoFocus
        type="text"
        placeholder="Username"
        value={username}
        onChange={e => setUsername(e.target.value)}
        className="border rounded-md py-1 px-2 w-24 min-w-24 dark:bg-gray-800 dark:text-gray-300"
      />{' '}
      <input
        type="email"
        placeholder="Email Address"
        value={email}
        onChange={e => setEmail(e.target.value)}
        className="border rounded-md py-1 px-2 w-24 min-w-24 dark:bg-gray-800 dark:text-gray-300"
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={e => setPassword(e.target.value)}
        className="border rounded-md py-1 px-2 w-24 min-w-24 dark:bg-gray-800 dark:text-gray-300"
      />
      <button
        type="submit"
        className="bg-blue-300 hover:bg-blue-400 focus:bg-blue-400 dark:bg-blue-700 dark:hover:bg-blue-600 dark:focus:bg-blue-600 px-3 rounded-md"
      >
        Register
      </button>
    </form>
  );
}
