// mweight/backend/services/tcpService.js

const net = require('net');
let vehicleWeight = null; // Menyimpan data berat kendaraan
let client = null;
let retryAttempts = 0;
const maxRetryAttempts = 5; // Maksimum percobaan retry
const retryDelay = 5000; // Delay 5 detik antara percobaan retry

// Fungsi untuk memulai koneksi TCP
exports.startTcpConnection = (host, port) => {
  const connectTcp = () => {
    client = new net.Socket();

    client.connect(port, host, () => {
      console.log(`Terhubung ke server TCP di ${host}:${port}`); // Perbaiki template string
      retryAttempts = 0; // Reset retry jika koneksi berhasil
    });

    client.on('data', (data) => {
      // Menyimpan data berat kendaraan yang diterima
      vehicleWeight = data.toString().trim();
      console.log('Data berat kendaraan diterima:', vehicleWeight);
    });

    client.on('close', () => {
      console.log('Koneksi TCP ditutup');
      retryConnection(); // Coba untuk reconnect
    });

    client.on('error', (err) => {
      console.error('Error koneksi TCP:', err);
      retryConnection(); // Coba untuk reconnect jika terjadi error
    });
  };

  // Fungsi untuk mencoba reconnect setelah koneksi terputus
  const retryConnection = () => {
    if (retryAttempts < maxRetryAttempts) {
      console.log(`Mencoba reconnect... (Percobaan: ${retryAttempts + 1})`); // Perbaiki template string
      retryAttempts++;
      setTimeout(() => {
        connectTcp(); // Coba reconnect setelah delay
      }, retryDelay);
    } else {
      console.error('Gagal reconnect setelah beberapa percobaan.');
    }
  };

  connectTcp(); // Pertama kali mencoba menghubungkan
};

// Fungsi untuk mengambil data berat kendaraan
exports.getVehicleWeight = () => {
  return vehicleWeight; // Mengembalikan data berat kendaraan yang diterima
};

// Fungsi untuk menghentikan koneksi TCP (jika perlu)
exports.stopTcpConnection = () => {
  if (client) {
    client.end(() => {
      console.log('Koneksi TCP ditutup');
    });
  }
};
