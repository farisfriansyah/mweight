export const createWebSocketConnection = (onMessage, onError, onClose) => {
  const socket = new WebSocket('ws://localhost:3002');  // Pastikan URL WebSocket benar

  socket.onopen = () => {
    console.log('WebSocket terhubung');
  };

  socket.onmessage = (event) => {
    try {
      const data = JSON.parse(event.data);  // Mengurai data dari server WebSocket
      onMessage(data);  // Panggil callback untuk memperbarui state dengan data yang diterima
    } catch (error) {
      onError(new Error('Error saat menerima pesan: ' + error.message));
    }
  };

  socket.onerror = (error) => {
    console.error('WebSocket Error:', error);
    onError(error);  // Panggil callback untuk menangani error
  };

  socket.onclose = () => {
    console.log('WebSocket terputus');
    onClose();  // Menangani WebSocket yang terputus
  };

  return socket;  // Mengembalikan objek socket untuk pengelolaan lebih lanjut
};
