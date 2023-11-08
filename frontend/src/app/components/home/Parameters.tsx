import { useState } from 'react';
import styles from './parameters.module.scss';
// import { useUserStore } from '@/contexts/user.store';
import setting from '@/assets/setting_normal.png';
import Button from '../ui/Button';

export default function Parameters() {
  const [popUp, setPopUp] = useState(false);
  // const user = useUserStore((state) => state.user);

  const handleClick = () => {
    setPopUp(!popUp);
  };

  return (
    <div className={styles.params}>
      <div className="absolute top-[95px] right-0">
        <Button noStyle onClick={handleClick}>
          <img src={setting} alt="setting" className="w-14 h-14" />
        </Button>
      </div>
      {popUp && (
        <div className={styles.popup}>
          <div className="pop-up-content">
            <h2 className={styles.header}>Parameters</h2>
            <p>pseudo</p>
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
