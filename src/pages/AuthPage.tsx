import { useState } from 'react';
import Login from '../components/auth/Login';
import Register from '../components/auth/Register';
import ErrorAuth from '../components/auth/ErrorAuth';
import useError from '../hooks/useError';

export default function AuthPage() {
  const [showLogin, setShowLogin] = useState<boolean>(true);
  const { error, setError } = useError(5000);

  return (
    <div className="relative flex justify-center mt-4">
      {error && <ErrorAuth error={error} />}
      {showLogin ? (
        <Login setShowLogin={setShowLogin} setError={setError} />
      ) : (
        <Register setShowLogin={setShowLogin} setError={setError} />
      )}
    </div>
  );
}
