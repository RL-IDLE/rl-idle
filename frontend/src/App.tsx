import { useCallback, useEffect, useState } from 'react';

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
import { router } from './lib/api';
import { useUserStore } from './contexts/user.store';
import Version from './app/components/Version';
import PaymentValidation from './app/components/PaymentValidation';

const stripePromise = loadStripe(env.VITE_STRIPE_PUBLIC_KEY);

function App() {
  const [isConnected, setIsConnected] = useState(socket.connected);
  const loadUser = useGameStore((state) => state.actions.loadUser);
  const loadShop = useGameStore((state) => state.actions.loadShop);
  const loadPrestige = useGameStore((state) => state.actions.loadPrestige);
  const userId = useUserStore((state) => state.user?.id);
  const [paymentValidationReceived, setPaymentValidationReceived] = useState<
    false | number
  >(false);

  const handlePayment = useCallback(async () => {
    if (!userId) return;
    //? Get search params
    const query = window.location.search;
    const params = new URLSearchParams(query);
    const checkoutSessionId = params.get('checkout_session_id');
    if (!checkoutSessionId) return;
    const res = await router.user.confirmPayment({
      id: userId,
      checkoutSessionId,
    });
    loadUser();
    setPaymentValidationReceived(res.emeralds);
    //? Remove the searchparams
    params.delete('checkout_session_id');
    window.history.replaceState({}, '', `${window.location.pathname}`);
  }, [userId, loadUser]);

  const closePaymentValidation = useCallback(() => {
    setPaymentValidationReceived(false);
  }, []);

  useEffect(() => {
    //? Handle payment callback
    handlePayment();
  }, [handlePayment]);

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
      <Version />
      <Elements stripe={stripePromise}>
        <BalanceProvider>
          <Balance />
          <Game />
          <Navbar />
          <PassivePopup />
          {!isConnected && <Loading />}
        </BalanceProvider>
      </Elements>
      {paymentValidationReceived && (
        <PaymentValidation close={closePaymentValidation}>
          <p className="text-center text-xl self-center relative text-white flex flex-col">
            + {paymentValidationReceived} Emeralds !
          </p>
        </PaymentValidation>
      )}
    </div>
  );
}

export default App;
