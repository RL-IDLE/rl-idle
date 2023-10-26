import { useEffect, useState } from 'react';

import { socket } from './lib/socket';
import Game from './app/components/Game';
import { useGameStore } from './contexts/game.store';
import 'swiper/css';
import { logger } from './lib/logger';
import Loading from './app/components/Loading';
import Navbar from './app/components/Navbar';
import Balance from './app/components/Balance';
import './app.scss';
import PassivePopup from './app/components/PassivePopup';
import { BalanceProvider } from './contexts/BalanceContext';

function App() {
  const [isConnected, setIsConnected] = useState(socket.connected);
  const loadUser = useGameStore((state) => state.actions.loadUser);
  const loadShop = useGameStore((state) => state.actions.loadShop);
  const loadPrestige = useGameStore((state) => state.actions.loadPrestige);

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
    loadPrestige();
  }, [loadUser, loadShop, loadPrestige]);

  return (
    <div className="flex flex-col flex-1 w-full h-screen overflow-hidden">
      <BalanceProvider>
        <Balance />
        <Game />
        <Navbar />
        <PassivePopup />
        {!isConnected && <Loading />}
      </BalanceProvider>
    </div>
  );
}

export default App;
