import { useState } from 'react';
import styles from './parameters.module.scss';
// import { useUserStore } from '@/contexts/user.store';

export default function Parameters() {
  const [popUp, setPopUp] = useState(false);
  // const user = useUserStore((state) => state.user);

  const handleClick = () => {
    setPopUp(!popUp);
  };

  return (
    <div className={styles.params}>
      <div className="absolute top-0 right-0">
        <button onClick={handleClick}>Params</button>
      </div>
      {popUp && (
        <div className={styles.popup}>
          <div className="pop-up-content">
            <h2 className={styles.header}>Parameters</h2>
            <p>speudo</p>
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
