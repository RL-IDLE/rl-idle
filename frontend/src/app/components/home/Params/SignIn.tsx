import { useEffect, useState } from 'react';
import Button from '../../ui/Button';
import { useUserStore } from '@/contexts/user.store';
import { IUser } from '@/types/user';

export default function SignIn({
  user,
  loadUser,
  setIsAccount, // setIsLoading,
}: {
  user: IUser;
  loadUser: () => Promise<unknown>;
  setIsAccount: (isAccount: boolean) => void;
  // setIsLoading: (isLoading: boolean) => void;
}) {
  const [err, setErr] = useState('' as any);
  const signInUser = useUserStore((state) => state.signIn);
  const [userToSignIn, setUserToSignIn] = useState({ ...user });

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    // setIsLoading(true);
    e.preventDefault();
    try {
      await signInUser(userToSignIn);
      await loadUser();
      setErr('');
      // setIsLoading(false);
      setIsAccount(true);
    } catch (err) {
      setErr((err as { json: { message: string } })?.json?.message);
      // setIsLoading(false);
    }
  };
  useEffect(() => {
    setUserToSignIn({ ...user });
  }, [user]);
  return (
    <div className="update-user">
      <h2 className="text-white">Sign-in</h2>
      <form onSubmit={(e) => handleSubmit(e)} className="flex flex-col gap-2">
        <input
          type="text"
          placeholder={user.username ? user.username : 'username'}
          className="text-white bg-transparent border-2 border-[#465498] rounded-lg p-2 mt-2 :focus:border-[#465498] :focus-visible:outline-none bg-gradient-to-t relative from-gradient-dark from-0% to-gradient-light to-100%"
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
          className="text-white bg-transparent border-2 border-[#465498] rounded-lg p-2 mt-2 :focus:border-[#465498] :focus-visible:outline-none bg-gradient-to-t relative from-gradient-dark from-0% to-gradient-light to-100%"
          required
          onChange={(e) =>
            setUserToSignIn({
              ...userToSignIn,
              password: e.target.value,
            })
          }
        />
        {err && err !== '' && <p className="text-red-500">{err}</p>}
        <Button type="submit" className="w-full">
          Submit
        </Button>
      </form>
    </div>
  );
}
