export default function ReservationsErrors() {
  return (
    <div
      className="absolute top-0 right-0 m-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg shadow-lg w-1/6"
      role="alert"
    >
      <strong className="font-bold block mb-2">Error!</strong>
      <span className="block sm:inline">No puedes reservar esa pista!</span>
    </div>
  );
}
