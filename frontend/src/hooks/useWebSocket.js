// mweight/frontend/src/hooks/useApi.js
import { useEffect, useState } from 'react';

const useWebSocket = (url) => {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const socket = new WebSocket(url);

    socket.onmessage = (event) => {
      try {
        const parsedData = JSON.parse(event.data);
        setData(parsedData);
      } catch (err) {
        console.error('Error parsing WebSocket data:', err);
      }
    };

    socket.onerror = (err) => setError(err.message);

    socket.onclose = () => console.log('WebSocket disconnected');

    return () => socket.close();
  }, [url]);

  return { data, error };
};

export default useWebSocket;
