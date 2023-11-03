import { useState, useEffect } from 'react';
import styles from './parameters.module.scss';
import { useUserStore } from '@/contexts/user.store';
import { IUser } from '@/types/user';

export default function Parameters() {
  const [popUp, setPopUp] = useState(false);
  const user = useUserStore((state) => state.user) as IUser;
  const updateUser = useUserStore((state) => state.updateUser);
  const [userToUpdate, setUserToUpdate] = useState({ ...user });
  const [err, setErr] = useState('' as any);

  const handleClick = () => {
    setPopUp(!popUp);
  };

  useEffect(() => {
    console.log(user);

    setUserToUpdate({ ...user });
  }, [user]);

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    try {
      await updateUser(userToUpdate);
      setErr('');
    } catch (err) {
      setErr(err?.json?.message);
    }
  };

  return (
    <div className={styles.params}>
      <div className="absolute top-0 right-0">
        <button onClick={handleClick}>Params</button>
      </div>
      {popUp && (
        <div className={styles.popup + ' p-3'}>
          <div className="pop-up-content">
            <h2 className={styles.header}>Parameters</h2>
            <p>speudo</p>

            <form
              onSubmit={(e) => handleSubmit(e)}
              className="flex flex-col gap-2"
            >
              <input
                type="text"
                placeholder={user.username ? user.username : 'username'}
                className="text-black"
                required
                onChange={(e) =>
                  setUserToUpdate({ ...userToUpdate, username: e.target.value })
                }
              />
              <input
                type="password"
                placeholder="password"
                className="text-black"
                required
                onChange={(e) =>
                  setUserToUpdate({ ...userToUpdate, password: e.target.value })
                }
              />
              {err && err !== '' && <p className="text-red-500">{err}</p>}
              <button type="submit" className="bg-white text-black p-5">
                Submit
              </button>
            </form>
            {/* {user?.username ? (
              <p>
                Username: <span>{user.username}</span>
              </p>
            ) : null} */}
            <button onClick={handleClick} className={styles.close}>
              CLOSE
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
