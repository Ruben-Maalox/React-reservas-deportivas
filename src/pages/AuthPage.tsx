import { useState } from 'react';
import Login from '../components/auth/Login';
import Register from '../components/auth/Register';
import ErrorAuth from '../components/auth/ErrorAuth';
import useError from '../hooks/useError';
import ForgottenPassword from '../components/auth/ForgottenPassword';

export default function AuthPage() {
  const [showLogin, setShowLogin] = useState<boolean>(true);
  const [showForgottenPassword, setShowForgottenPasword] = useState<boolean>(false);
  const { error, setError } = useError(2000);

  const handleShowForgottenPassword = (shouldShow: boolean) => {
    setShowForgottenPasword(shouldShow);
  };

  return (
    <div className="relative flex justify-center mt-4">
      {error && <ErrorAuth error={error} />}
      {!showForgottenPassword ? (
        showLogin ? (
          <Login setShowLogin={setShowLogin} setError={setError} showForgottenPassword={handleShowForgottenPassword} />
        ) : (
          <Register setShowLogin={setShowLogin} setError={setError} />
        )
      ) : (
        <ForgottenPassword showForgottenPassword={handleShowForgottenPassword} setError={setError} />
      )}
    </div>
  );
}
