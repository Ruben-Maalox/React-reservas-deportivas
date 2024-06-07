export interface NewPasswordProps {
  showForgottenPassword: (shouldShow: boolean) => void;
  setError: (showError: string) => void;
}

export default function NewPassword({ showForgottenPassword, setError }: NewPasswordProps) {
  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget;
    const email = (form.email as HTMLInputElement).value;
    const token = (form.token as HTMLInputElement).value;
    const newPassword = (form.password as HTMLInputElement).value;

    fetch(`${import.meta.env.VITE_API_URL}/reset-password`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, token, newPassword }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.ok) {
          showForgottenPassword(false);
        }
        if (data.error) {
          setError(data.error);
        }
      });
  };

  return (
    <form className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4 w-full max-w-md mx-auto" onSubmit={handleSubmit}>
      <div className="flex items-center justify-center">
        <img src="/src/assets/images/logoMenosTransparencia.png" alt="logo" className="mb-10 w-2/3 sm:w-1/2 md:w-1/2" />
      </div>

      <h2 className="text-2xl text-center mb-4 font-bold">Restablecer contraseña</h2>

      <div className="mb-4">
        <input
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          name="email"
          type="email"
          placeholder="Email"
        />
      </div>

      <div className="mb-4">
        <input
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          name="token"
          type="text"
          placeholder="Token password"
        />
      </div>

      <div className="mb-4">
        <input
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
          name="password"
          type="password"
          placeholder="Contraseña *"
          required
        />
      </div>

      <div className="flex flex-col items-center justify-center mt-3">
        <button className="w-full sm:w-2/3 bg-orange-400 hover:bg-orange-600 text-white font-bold py-2 px-4 rounded-full animate-pulse">
          Restablecer
        </button>
      </div>
    </form>
  );
}
