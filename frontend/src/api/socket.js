// mweight/frontend/src/api/socket.js
const connectWebSocket = (onMessage, onError) => {
  const WS_URL = process.env.REACT_APP_WS_URL || 'ws://10.88.67.70:3002';
  const socket = new WebSocket(WS_URL);

  socket.onopen = () => {
    console.log('WebSocket Connected');
  };

  socket.onmessage = (event) => {
    try {
      const data = JSON.parse(event.data);
      onMessage(data);
    } catch (err) {
      console.error('Error parsing WebSocket data:', err);
    }
  };

  socket.onclose = () => {
    console.log('WebSocket Disconnected. Reconnecting...');
    setTimeout(() => connectWebSocket(onMessage, onError), 5000); // Retry on disconnect
  };

  socket.onerror = (error) => {
    console.error('WebSocket Error:', error);
    onError && onError(error);
  };
};

export default connectWebSocket;
