const { ipcRenderer } = require('electron');

// Ambil konfigurasi yang ada dari main process
window.onload = async () => {
  const config = await ipcRenderer.invoke('get-config');

  const mainUrlInput = document.getElementById('main-url');
  const externalUrlInput = document.getElementById('external-url');

  // Setel input URL dengan nilai yang ada di config.json
  mainUrlInput.value = config.mainDisplay;
  externalUrlInput.value = config.externalDisplay;

  // Simpan pengaturan ketika tombol save diklik
  document.getElementById('save-btn').addEventListener('click', () => {
    const newConfig = {
      mainDisplay: mainUrlInput.value,
      externalDisplay: externalUrlInput.value
    };
    ipcRenderer.send('save-settings', newConfig);  // Kirim konfigurasi baru ke main process
  });
};
