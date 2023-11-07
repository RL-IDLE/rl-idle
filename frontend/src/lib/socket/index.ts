import { io } from 'socket.io-client';
import { env } from '../../env';

const URL = env.VITE_API_URL;

export const initialSocket = io(URL, {
  timeout: 10000, // 10 seconds
});

type IEmitQueue = {
  args: Parameters<(typeof initialSocket)['emit']>;
}[];

export const socket = {
  connected: initialSocket.connected,
  connect: () => {
    initialSocket.connect();
  },
  disconnect: () => {
    initialSocket.disconnect();
  },
  on: (...args: Parameters<(typeof initialSocket)['on']>) => {
    initialSocket.on(...args);
  },
  off: (...args: Parameters<(typeof initialSocket)['off']>) => {
    initialSocket.off(...args);
  },
  //* Override the emit method to execute in queue
  _emitQueue: [] as IEmitQueue,
  _isEmitting: false,
  emit: async (...args: Parameters<(typeof initialSocket)['emit']>) => {
    socket._emitQueue.push({ args });
    await socket._executeEmitInQueue();
  },
  _executeEmitInQueue: async () => {
    if (socket._isEmitting) return;
    if (socket._emitQueue.length) {
      if (socket._emitQueue.length > 100) {
        console.error('Socket queue is very long, your connection may be slow');
      }
      socket._isEmitting = true;
      const { args } = socket._emitQueue.shift()!;
      await new Promise((resolve) => initialSocket.emit(...args, resolve));
      socket._isEmitting = false;
      await socket._executeEmitInQueue();
    }
  },
};
