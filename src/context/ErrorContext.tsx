import React, { useState, type ReactNode } from 'react';

export const ErrorContext = React.createContext({
  errorMessage: '',
  showError: (
    _errorMessage: string,
    _success?: boolean,
    _noClear?: boolean
  ): void => undefined,
  isSuccess: false
});

function ErrorProvider({ children }: { children: ReactNode }) {
  const [errorMessage, setError] = useState<string>('');
  const [isSuccess, setSuccess] = useState<boolean>(false);
  const [clearTimer, setClearTimer] = useState(0);

  function showError(
    message: string,
    success?: boolean,
    noClear?: boolean
  ): void {
    if (clearTimer) {
      clearTimeout(clearTimer);
    }
    // clear the message after this timeout
    if (!noClear)
      setClearTimer(
        setTimeout(() => setError(''), success === true ? 1000 : 5000)
      );

    setError(message);
    setSuccess(success === true);
  }

  return (
    <ErrorContext.Provider value={{ errorMessage, showError, isSuccess }}>
      {children}
    </ErrorContext.Provider>
  );
}

export default ErrorProvider;
