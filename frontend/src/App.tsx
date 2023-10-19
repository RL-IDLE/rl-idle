import { useEffect, useState } from 'react';

import { socket } from './lib/socket';
import Game from './app/components/Game';
import { useGameStore } from './contexts/game.store';
import Navbar from './components/Navbar';
import 'swiper/css';
import { logger } from './lib/logger';
import Loading from './components/Loading';

function App() {
  const [isConnected, setIsConnected] = useState(socket.connected);
  const loadUser = useGameStore((state) => state.actions.loadUser);
  const loadShop = useGameStore((state) => state.actions.loadShop);

  useEffect(() => {
    function onConnect() {
      logger.debug('Connected to server');
      setIsConnected(true);
    }

    function onDisconnect() {
      logger.debug('Disconnected from server');
      setIsConnected(false);
      //? Try reconnecting to the server every 5 seconds
      setTimeout(() => {
        socket.connect();
      }, 3000);
    }

    socket.on('connect', onConnect);
    socket.on('disconnect', onDisconnect);
    socket.on('reconnect', onConnect);

    return () => {
      socket.off('connect', onConnect);
      socket.off('disconnect', onDisconnect);
      socket.off('reconnect', onConnect);
    };
  }, []);

  useEffect(() => {
    loadUser();
    loadShop();
  }, [loadUser, loadShop]);

  return (
    <div className="flex flex-col flex-1 w-screen">
      <Game />
      <Navbar />
      {!isConnected && <Loading />}
    </div>
  );
}

export default App;
