import { useUserStore } from '@/contexts/user.store';
import { useState } from 'react';
import Button from '../../ui/Button';

export default function UpdateUser({
  user,
  loadUser,
  userToUpdate,
  setUserToUpdate,
  signup = false,
}) {
  const [err, setErr] = useState('' as string);
  const updateUser = useUserStore((state) => state.updateUser);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await updateUser(userToUpdate);
      await loadUser();
      setErr('');
    } catch (err) {
      setErr(err?.json?.message);
    }
  };

  return (
    <>
      {!signup && user.username && (
        <p>
          Username: <span>{user.username}</span>
        </p>
      )}
      <div className="update-user">
        <h2>{signup ? 'Sign-up' : 'My account'}</h2>
        <form onSubmit={(e) => handleSubmit(e)} className="flex flex-col gap-2">
          <input
            type="text"
            placeholder={user.username ? user.username : 'username'}
            className="text-black"
            required
            onChange={(e) =>
              setUserToUpdate({
                ...userToUpdate,
                username: e.target.value,
              })
            }
          />
          <input
            type="password"
            placeholder="password"
            className="text-black"
            required
            onChange={(e) =>
              setUserToUpdate({
                ...userToUpdate,
                password: e.target.value,
              })
            }
          />
          {err && err !== '' && <p className="text-red-500">{err}</p>}
          <Button type="submit">Submit</Button>
        </form>
      </div>
    </>
  );
}
