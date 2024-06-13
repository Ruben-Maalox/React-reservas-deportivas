export interface ErrorAuthProps {
  error: string;
}

export default function ErrorAuth({ error }: ErrorAuthProps) {
  return (
    <div
      className="absolute top-0 right-0 m-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg shadow-lg w-full sm:w-3/4 md:w-1/2 lg:w-1/3 xl:w-1/4 mx-auto sm:mx-0"
      role="alert"
    >
      <strong className="font-bold block mb-2">Error!</strong>
      <span className="block sm:inline">{error}</span>
    </div>
  );
}
