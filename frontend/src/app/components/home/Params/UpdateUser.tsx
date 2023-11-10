import { useUserStore } from '@/contexts/user.store';
import { useEffect, useState } from 'react';
import Button from '../../ui/Button';
import { IUser } from '@/types/user';

export default function UpdateUser({
  user,
  loadUser,
  // setIsLoading,
  signup = false,
}: {
  user: IUser;
  loadUser: () => Promise<unknown>;
  // setIsLoading: (isLoading: boolean) => void;
  signup?: boolean;
}) {
  const [err, setErr] = useState('' as string);
  const updateUser = useUserStore((state) => state.updateUser);
  const [userToUpdate, setUserToUpdate] = useState({ ...user });

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    // setIsLoading(true);
    e.preventDefault();
    try {
      await updateUser(userToUpdate);
      await loadUser();
      // setIsLoading(false);

      setErr('');
    } catch (err) {
      setErr((err as { json: { message: string } })?.json?.message);
      // setIsLoading(false);
    }
  };
  useEffect(() => {
    setUserToUpdate({ ...user });
  }, [user]);
  return (
    <>
      <div className="update-user">
        <div className="flex w-full justify-between mb-3">
          <h2 className="text-white">{signup ? 'Sign-up' : 'My account'}</h2>
          {!signup && user.username && (
            <p className="text-white">
              <span>{user.username}</span>
            </p>
          )}
        </div>
        <form onSubmit={(e) => handleSubmit(e)} className="flex flex-col gap-2">
          <input
            type="text"
            placeholder={user.username ? user.username : 'username'}
            className="text-white bg-transparent border-2 border-[#465498] rounded-lg p-2 mt-2 :focus:border-[#465498] :focus-visible:outline-none bg-gradient-to-t relative from-gradient-dark from-0% to-gradient-light to-100%"
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
            className="text-white bg-transparent border-2 border-[#465498] rounded-lg p-2 mt-2 :focus:border-[#465498] :focus-visible:outline-none bg-gradient-to-t relative from-gradient-dark from-0% to-gradient-light to-100%"
            required
            onChange={(e) =>
              setUserToUpdate({
                ...userToUpdate,
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
    </>
  );
}
