import { useState, useEffect } from 'react';
import styles from './parameters.module.scss';
import { useUserStore } from '@/contexts/user.store';
import { IUser } from '@/types/user';
// import { useUserStore } from '@/contexts/user.store';
import setting from '@/assets/setting_normal.png';
import Button from '../ui/Button';
import UpdateUser from './Params/UpdateUser';
import SignIn from './Params/SignIn';
import { cn } from '@/lib/utils';

export default function Parameters() {
  const [popUp, setPopUp] = useState(false);
  const user = useUserStore((state) => state.user) as IUser;
  const loadUser = useUserStore((state) => state.loadUser);
  const [userToUpdate, setUserToUpdate] = useState({ ...user });
  const [isAccount, setIsAccount] = useState(true);

  const handleClick = () => {
    setPopUp(!popUp);
  };

  useEffect(() => {
    console.log(user);

    setUserToUpdate({ ...user });
  }, [user]);

  // const loadUserFunc = async () => {
  //   await loadUser();
  // };

  return (
    <div className={styles.params}>
      <div className="absolute top-[95px] right-0">
        <Button noStyle onClick={handleClick}>
          <img src={setting} alt="setting" className="w-14 h-14" />
        </Button>
      </div>
      {popUp && (
        <div className="flex flex-col mt-36 pb-6 h-full w-full top-0 absolute">
          <div
            className={cn(
              'bg-gradient-to-t relative from-gradient-dark from-0% to-gradient-light to-100% justify-evenly flex touch-pan-y w-[calc(100%-40px)] self-center mb-2 rounded-xl p-1',
            )}
          >
            <button
              className={cn('text-white p-3 py-1 w-full rounded-[8px] z-10')}
              onClick={() => {
                // if (navAudio) {
                //   navAudio.currentTime = 0;
                //   navAudio.play();
                // }
                setIsAccount(true);
              }}
            >
              My Account
            </button>
            <button
              className={cn('text-white p-3 py-1 w-full rounded-[8px] z-10')}
              onClick={() => {
                // if (navAudio) {
                //   navAudio.currentTime = 0;
                //   navAudio.play();
                // }
                setIsAccount(false);
              }}
            >
              Sign In
            </button>
            <div
              className="bg-gradient-light border border-background absolute top-0 h-[calc(100%-8px)] w-[calc(50%-4px)] left-0 m-1 rounded-[8px] transition-all duration-200 ease-in"
              style={{
                transform: isAccount ? 'translateX(0%)' : 'translateX(100%)',
              }}
            ></div>
          </div>
          <div>
            <section
              className={cn(
                styles.content +
                  ' flex flex-col rounded-xl bg-gradient-to-t relative from-gradient-dark from-0% to-gradient-light to-100% mb-4',
                {
                  'after:!hidden': !isAccount,
                },
              )}
            >
              <h2 className={styles.header}>Parameters</h2>
              {!isAccount ? (
                <>
                  <p>pseudo</p>
                  <SignIn
                    loadUser={loadUser}
                    user={user}
                    userToSignIn={userToUpdate}
                    setUserToUpdate={setUserToUpdate}
                  />
                  <Button
                    className="mb-4"
                    onClick={() => {
                      localStorage.removeItem('userId');
                      loadUser();
                    }}
                  >
                    Disconnect
                  </Button>
                </>
              ) : (
                <>
                  {!user?.username ? (
                    <UpdateUser
                      loadUser={loadUser}
                      user={user}
                      signup={true}
                      userToUpdate={userToUpdate}
                      setUserToUpdate={setUserToUpdate}
                    />
                  ) : (
                    <UpdateUser
                      loadUser={loadUser}
                      user={user}
                      signup={false}
                      userToUpdate={userToUpdate}
                      setUserToUpdate={setUserToUpdate}
                    />
                  )}
                </>
              )}
            </section>
            {/* <Button onClick={loadUserFunc()}>update</Button> */}
            <Button
              onClick={handleClick}
              className="bg-gradient-to-t relative from-gradient-dark from-0% to-gradient-light to-100% justify-evenly flex touch-pan-y w-[calc(100%-40px)] self-center mb-2 rounded-xl p-1"
            >
              CLOSE
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
