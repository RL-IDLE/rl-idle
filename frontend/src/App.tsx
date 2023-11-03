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
import { BalanceProvider } from './contexts/balance/BalanceProvider';
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import { env } from './env';

const stripePromise = loadStripe(env.VITE_STRIPE_PUBLIC_KEY);

function App() {
  const [isConnected, setIsConnected] = useState(socket.connected);
  const loadUser = useGameStore((state) => state.actions.loadUser);
  const loadShop = useGameStore((state) => state.actions.loadShop);
  const loadPrestige = useGameStore((state) => state.actions.loadPrestige);

  const options = {
    // passing the client secret obtained from the server
    clientSecret: '{{CLIENT_SECRET}}',
  };

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
        logger.debug('Trying to reconnect to server');
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
      <Elements stripe={stripePromise}>
        <BalanceProvider>
          <Balance />
          <Game />
          <Navbar />
          <PassivePopup />
          {!isConnected && <Loading />}
        </BalanceProvider>
      </Elements>
    </div>
  );
}

export default App;
