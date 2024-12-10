// src/api/socket.js

import { useEffect, useState, useCallback } from 'react';

// Hook untuk mengelola koneksi WebSocket
export const useWebSocket = (url, onMessage, onError, onClose) => {
  const [socket, setSocket] = useState(null);
  const [isConnected, setIsConnected] = useState(false);

  const openSocket = useCallback(() => {
    const socket = new WebSocket(url);

    socket.onopen = () => {
      console.log('WebSocket terhubung');
      setIsConnected(true);
    };

    socket.onmessage = (event) => {
      const data = JSON.parse(event.data);
      onMessage(data);
    };

    socket.onerror = (error) => {
      console.error('WebSocket Error:', error);
      onError(error);
    };

    socket.onclose = () => {
      console.log('WebSocket terputus');
      setIsConnected(false);
      onClose();
    };

    setSocket(socket);

    // Cleanup socket saat komponen unmount
    return () => {
      socket.close();
    };
  }, [url, onMessage, onError, onClose]);

  useEffect(() => {
    const cleanupSocket = openSocket();

    return () => {
      cleanupSocket();
    };
  }, [openSocket]);

  return { socket, isConnected };
};
