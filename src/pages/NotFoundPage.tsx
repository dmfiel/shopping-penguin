// import { useLocation, useNavigate } from 'react-router-dom';
import { ErrorContext } from '../context/ErrorContext';
import { useContext } from 'react';

export function NotFoundPage() {
  // const navigate = useNavigate();
  const { showError } = useContext(ErrorContext);
  // const location = useLocation();
  showError("Sorry, I can't find that page.", false, true);
  return (
    <div className="flex flex-col gap-10 my-10 mx-auto items-center text-center">
      {/* <button
        className="text-black bg-blue-300 hover:text-blue-700 hover:bg-blue-200 px-2  rounded-md w-fit"
        title="Back"
        onClick={() => navigate(-1)}
      >
        Go Back
      </button> */}
      {/* {location.pathname} */}
    </div>
  );
}
