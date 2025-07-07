import { useContext } from 'react';
import { ErrorContext } from '../../context/ErrorContext';

export function ErrorMessage() {
  const { errorMessage, isSuccess } = useContext(ErrorContext);

  if (!errorMessage) return;

  if (isSuccess)
    return (
      <div
        id="success"
        className="text-base lg:text-3xl text-center box-border"
        aria-live="polite"
      >
        {errorMessage}
      </div>
    );
  else
    return (
      <div
        id="error"
        className="text-base lg:text-3xl text-red-500 text-center box-border"
        aria-live="polite"
      >
        {errorMessage}
      </div>
    );
}
