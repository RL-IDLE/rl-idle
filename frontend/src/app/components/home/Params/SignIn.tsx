import { useState } from 'react';
import Button from '../../ui/Button';
import { useUserStore } from '@/contexts/user.store';

export default function SignIn({
  user,
  loadUser,
  userToSignIn,
  setUserToSignIn,
}) {
  const [err, setErr] = useState('' as any);
  const signInUser = useUserStore((state) => state.signIn);

  const handleSubmit = async (e: React.FormEvent<HTMLInputElement>) => {
    e.preventDefault();
    try {
      await signInUser(userToSignIn);
      console.log('userToSignIn', userToSignIn);
      await loadUser();
      setErr('');
      setUserToSignIn({
        username: '',
        password: '',
      });
    } catch (err) {
      setErr(err?.json?.message);
    }
  };

  return (
    <div className="update-user">
      <h2>SignIn</h2>
      <form onSubmit={(e) => handleSubmit(e)} className="flex flex-col gap-2">
        <input
          type="text"
          placeholder={user.username ? user.username : 'username'}
          className="text-black"
          required
          onChange={(e) =>
            setUserToSignIn({
              ...userToSignIn,
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
            setUserToSignIn({
              ...userToSignIn,
              password: e.target.value,
            })
          }
        />
        {err && err !== '' && <p className="text-red-500">{err}</p>}
        <Button type="submit">Submit</Button>
      </form>
    </div>
  );
}
