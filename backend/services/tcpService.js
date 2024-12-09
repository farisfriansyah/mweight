const net = require('net');
let vehicleWeight = '';

// Fungsi untuk mengambil berat kendaraan
const getVehicleWeight = () => vehicleWeight;

// Fungsi untuk memulai koneksi TCP dan menerima data berat kendaraan
const startTcpConnection = (host, port) => {
  const tcpClient = new net.Socket();

  // Menghubungkan ke server TCP
  tcpClient.connect(port, host, () => {
    console.log('Terhubung ke server TCP');
  });

  // Mendengarkan data dari server TCP
  tcpClient.on('data', (data) => {
    vehicleWeight = data.toString().trim();  // Menyimpan data berat kendaraan
    console.log('Berat Kendaraan diterima:', vehicleWeight);
  });

  // Menangani error dan penutupan koneksi
  tcpClient.on('error', (error) => {
    console.error('Error TCP:', error);
  });

  tcpClient.on('close', () => {
    console.log('Terputus dari server TCP');
  });
};

module.exports = { getVehicleWeight, startTcpConnection };
