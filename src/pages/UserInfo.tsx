import { useAuthProvider } from '../context/useAuthProvider';

export default function UserInfo() {
  const { user } = useAuthProvider();
  return (
    <div>
      <h2>User Info</h2>
      <p>Name: {user?.name}</p>
      <p>Email: {user?.email}</p>
    </div>
  );
}
