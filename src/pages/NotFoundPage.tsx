import { useNavigate } from 'react-router-dom';
import { ErrorMessage } from '../components/ErrorMessage/ErrorMessage';

export function NotFoundPage() {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col gap-10 my-10 mx-auto items-center text-center">
      <ErrorMessage text="Sorry, I can't find that page." />
      <h1>
        Please use the navigation bar or&nbsp;
        <button
          className="text-black bg-blue-300 hover:text-blue-700 hover:bg-blue-200 px-2  rounded-md w-fit"
          title="Back"
          onClick={() => navigate(-1)}
        >
          Go Back
        </button>
      </h1>
    </div>
  );
}
