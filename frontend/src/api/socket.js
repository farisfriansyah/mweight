import { useEffect, useState, useCallback } from 'react';

// Hook untuk mengelola koneksi WebSocket
export const useWebSocket = (url, onMessage, onError, onClose) => {
  const [socket, setSocket] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const [reconnectAttempts, setReconnectAttempts] = useState(0);

  const openSocket = useCallback(() => {
    const socket = new WebSocket(url);

    socket.onopen = () => {
      console.log('WebSocket terhubung');
      setIsConnected(true);
      setReconnectAttempts(0); // Reset reconnect attempts saat berhasil terhubung
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
      // Retry reconnect setelah beberapa detik jika koneksi terputus
      if (reconnectAttempts < 5) {
        const reconnectDelay = Math.min(1000 * (reconnectAttempts + 1), 5000); // Delay retry yang semakin meningkat
        setReconnectAttempts(prev => prev + 1);
        setTimeout(() => {
          openSocket(); // Coba membuka koneksi lagi
        }, reconnectDelay);
      }
    };

    setSocket(socket);

    // Cleanup socket saat komponen unmount
    return () => {
      socket.close();
    };
  }, [url, onMessage, onError, onClose, reconnectAttempts]);

  useEffect(() => {
    const cleanupSocket = openSocket();

    return () => {
      cleanupSocket();
    };
  }, [openSocket]);

  return { socket, isConnected, reconnectAttempts };
};
