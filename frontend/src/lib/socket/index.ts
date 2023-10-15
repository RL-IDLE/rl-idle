import { io } from 'socket.io-client';
import { env } from '../../env';

const URL = env.VITE_API_URL;

export const socket = io(URL);
