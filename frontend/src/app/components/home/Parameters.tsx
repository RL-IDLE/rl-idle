import { useState, useEffect } from 'react';
import styles from './parameters.module.scss';
import { useUserStore } from '@/contexts/user.store';
import { IUser } from '@/types/user';
// import { useUserStore } from '@/contexts/user.store';
import setting from '@/assets/setting_normal.png';
import Button from '../ui/Button';
import UpdateUser from './Params/UpdateUser';
import SignIn from './Params/SignIn';

export default function Parameters() {
  const [popUp, setPopUp] = useState(false);
  const user = useUserStore((state) => state.user) as IUser;
  const loadUser = useUserStore((state) => state.loadUser);
  const [userToUpdate, setUserToUpdate] = useState({ ...user });

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
        <div className={styles.popup + ' p-3'}>
          <div className="pop-up-content">
            <h2 className={styles.header}>Parameters</h2>

            <div className="sign-in">
              <form action=""></form>
            </div>
            <p>pseudo</p>
            {user?.username && <UpdateUser loadUser={loadUser} user={user} />}
            {!user?.username && (
              <>
                <SignIn />
                <hr />
                <UpdateUser
                  loadUser={loadUser}
                  user={user}
                  signup={true}
                  userToUpdate={userToUpdate}
                  setUserToUpdate={setUserToUpdate}
                />
              </>
            )}
            <Button
              className="mb-4"
              onClick={() => {
                localStorage.removeItem('userId');
                loadUser();
              }}
            >
              Disconnect
            </Button>
            {/* <Button onClick={loadUserFunc()}>update</Button> */}
            <Button onClick={handleClick} className={styles.close}>
              CLOSE
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
