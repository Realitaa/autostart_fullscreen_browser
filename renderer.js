const { ipcRenderer } = require('electron');

// Fungsi untuk menambahkan log ke log-container
function addLog(message) {
  const logContainer = document.getElementById('log-container');
  const logMessage = document.createElement('p');
  logMessage.textContent = message;
  logContainer.appendChild(logMessage);
  logContainer.scrollTop = logContainer.scrollHeight; // Scroll otomatis ke bawah
}

// Ambil konfigurasi yang ada dari main process
window.onload = async () => {
  const config = await ipcRenderer.invoke('get-config');

  const mainUrlInput = document.getElementById('main-url');
  const externalUrlInput = document.getElementById('external-url');

  // Setel input URL dengan nilai yang ada di config.json
  mainUrlInput.value = config.mainDisplay;
  externalUrlInput.value = config.externalDisplay;

  // Tambahkan log bahwa sistem berhasil dijalankan
  addLog('Sistem Berhasil Dijalankan.');

  // Simpan pengaturan ketika tombol save diklik
  document.getElementById('save-btn').addEventListener('click', () => {
    const newConfig = {
      mainDisplay: mainUrlInput.value,
      externalDisplay: externalUrlInput.value
    };
    ipcRenderer.send('save-settings', newConfig);  // Kirim konfigurasi baru ke main process

    addLog('Pengaturan Berhasil Disimpan.'); // Tambahkan log
  });

  // Restart software ketika tombol restart diklik
  document.getElementById('restart-btn').addEventListener('click', () => {
    ipcRenderer.send('restart-software'); // Kirim perintah restart ke main process
    addLog('Sistem Sedang Dijalankan Ulang.'); // Tambahkan log
  });

  // Tutup software ketika tombol close diklik
  document.getElementById('close-btn').addEventListener('click', () => {
    ipcRenderer.send('close-software'); // Kirim perintah close ke main process
    addLog('Sistem Ditutup.'); // Tambahkan log
  });
};

async function loadDisplayNames() {
  try {
    const displays = await ipcRenderer.invoke('get-displays');

    const mainUrlLabel = document.querySelector('label[for="main-url"]');
    const externalUrlLabel = document.querySelector('label[for="external-url"]');

    if (displays.length > 0) {
      mainUrlLabel.textContent = `URL Layar Utama (${displays[0].name}):`;
    }
    if (displays.length > 1) {
      externalUrlLabel.textContent = `URL Layar Eksternal (${displays[1].name}):`;
    }
  } catch (error) {
    console.error('Gagal memuat nama monitor:', error);
  }
}

loadDisplayNames();