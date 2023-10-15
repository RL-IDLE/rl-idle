import './App.css';
import { useEffect, useState } from 'react';

import { socket } from './lib/socket';
import Game from './app/components/Game';
import { useGameStore } from './contexts/game.store';

function App() {
  const [isConnected, setIsConnected] = useState(socket.connected);
  const loadUser = useGameStore((state) => state.actions.loadUser);

  useEffect(() => {
    function onConnect() {
      setIsConnected(true);
    }

    function onDisconnect() {
      setIsConnected(false);
    }

    socket.on('connect', onConnect);
    socket.on('disconnect', onDisconnect);

    return () => {
      socket.off('connect', onConnect);
      socket.off('disconnect', onDisconnect);
    };
  }, [loadUser]);

  useEffect(() => {
    loadUser();
  }, [loadUser]);

  return (
    <>
      <Game />
      {!isConnected && (
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
          <p>Connexion en cours</p>
        </div>
      )}
    </>
  );
}

export default App;
