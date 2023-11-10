import { useEffect, useState } from 'react';
import styles from './parameters.module.scss';
import { useUserStore } from '@/contexts/user.store';
import { IUser } from '@/types/user';
import setting from '@/assets/setting_normal.png';
import Button from '../ui/Button';
import UpdateUser from './Params/UpdateUser';
import SignIn from './Params/SignIn';
import { cn } from '@/lib/utils';
// import loading from '@/assets/loading.gif';
import gradient from '@/assets/gradient.png';

export default function Parameters() {
  const [popUp, setPopUp] = useState(false);
  const user = useUserStore((state) => state.user) as IUser;
  const loadUser = useUserStore((state) => state.loadUser);
  const [userToUpdate, setUserToUpdate] = useState({ ...user });
  const [isAccount, setIsAccount] = useState(true);
  // const [isLoading, setIsLoading] = useState(false);

  const handleClick = () => {
    setPopUp(!popUp);
  };

  useEffect(() => {
    console.log(user);

    setUserToUpdate({ ...user });
  }, [user]);

  return (
    <div className={styles.params}>
      <div className="absolute bottom-[85px] right-0">
        <Button className="params" noStyle onClick={handleClick}>
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
                setIsAccount(true);
              }}
            >
              My Account
            </button>
            {/* eslint-disable-next-line @typescript-eslint/no-unnecessary-condition */}
            {user.username === null && (
              <>
                <button
                  className={cn(
                    'text-white p-3 py-1 w-full rounded-[8px] z-10',
                  )}
                  onClick={() => {
                    setIsAccount(false);
                  }}
                >
                  Sign In
                </button>
                <div
                  className="bg-gradient-light border border-background absolute top-0 h-[calc(100%-8px)] w-[calc(50%-4px)] left-0 m-1 rounded-[8px] transition-all duration-200 ease-in"
                  style={{
                    transform: isAccount
                      ? 'translateX(0%)'
                      : 'translateX(100%)',
                  }}
                ></div>
              </>
            )}
          </div>
          <div>
            <section
              className={cn(
                styles.content +
                  ' flex flex-col rounded-xl p-5 bg-gradient-to-t relative from-gradient-dark from-0% to-gradient-light to-100% mb-4',
                {
                  'after:!hidden': !isAccount,
                },
              )}
              style={{
                backgroundImage: `url(${gradient})`,
                backgroundSize: 'cover',
              }}
            >
              {/* {!isLoading ? (
                <> */}
              {!isAccount ? (
                <>
                  <SignIn
                    loadUser={loadUser}
                    user={user}
                    userToSignIn={userToUpdate}
                    setUserToSignIn={setUserToUpdate}
                    setIsAccount={setIsAccount}
                    // setIsLoading={setIsLoading}
                  />
                </>
              ) : (
                <>
                  {!user.username ? (
                    <>
                      <UpdateUser
                        loadUser={loadUser}
                        user={user}
                        signup={true}
                        userToUpdate={userToUpdate}
                        setUserToUpdate={setUserToUpdate}
                        // setIsLoading={setIsLoading}
                      />
                      <Button
                        className="w-full bg-red-800"
                        style={{
                          marginBottom: '1rem',
                          marginTop: 'auto',
                        }}
                        onClick={() => {
                          localStorage.removeItem('userId');
                          loadUser();
                          handleClick();
                        }}
                      >
                        Reset
                      </Button>
                    </>
                  ) : (
                    <>
                      <UpdateUser
                        loadUser={loadUser}
                        user={user}
                        signup={false}
                        userToUpdate={userToUpdate}
                        setUserToUpdate={setUserToUpdate}
                        // setIsLoading={setIsLoading}
                      />
                      <Button
                        className="mb-4"
                        onClick={() => {
                          localStorage.removeItem('userId');
                          loadUser();
                          handleClick();
                        }}
                      >
                        Disconnect
                      </Button>
                    </>
                  )}
                </>
              )}
              <p className="user-id text-white absolute bottom-1 right-3 text-[.60rem] opacity-60">
                {user.id && `User ID: ${user.id}`}
              </p>
              {/* </>
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <img width="40" src={loading} alt="" />
                </div>
              )} */}
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
