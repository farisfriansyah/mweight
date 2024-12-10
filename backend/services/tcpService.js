const net = require('net');
let vehicleWeight = null; // Menyimpan data berat kendaraan

// Fungsi untuk memulai koneksi TCP
exports.startTcpConnection = (host, port) => {
  const client = new net.Socket();

  client.connect(port, host, () => {
    console.log(`Terhubung ke server TCP di ${host}:${port}`);
  });

  client.on('data', (data) => {
    // Menyimpan data berat kendaraan yang diterima
    vehicleWeight = data.toString().trim();
    console.log('Data berat kendaraan diterima:', vehicleWeight);
  });

  client.on('close', () => {
    console.log('Koneksi TCP ditutup');
  });

  client.on('error', (err) => {
    console.error('Error koneksi TCP:', err);
  });
};

// Fungsi untuk mengambil data berat kendaraan
exports.getVehicleWeight = () => {
  return vehicleWeight; // Mengembalikan data berat kendaraan yang diterima
};
