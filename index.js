const { app, BrowserWindow, screen, ipcMain } = require('electron');
const fs = require('fs');
const path = require('path');

const configPath = path.join(__dirname, 'config.json');
let mainDisplay = '';
let externalDisplay = '';

// Fungsi untuk membaca konfigurasi dari config.json
async function readConfig() {
  try {
    const data = await fs.promises.readFile(configPath, 'utf8');
    const config = JSON.parse(data);
    mainDisplay = config.mainDisplay || '';
    externalDisplay = config.externalDisplay || '';
  } catch (err) {
    console.error('Gagal membaca config.json:', err);
  }
}

app.on('ready', async () => {
  await readConfig();  // Pastikan config.json sudah dibaca sebelum aplikasi dijalankan

  const displays = screen.getAllDisplays();

  // Layar utama (PC)
  let mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    fullscreen: false,  // Jangan fullscreen untuk UI
    show: false,  // Jendela UI dimulai dalam keadaan tersembunyi
    webPreferences: {
      nodeIntegration: false,
      preload: path.join(__dirname, 'renderer.js')  // Menentukan renderer.js untuk komunikasi IPC
    }
  });
  mainWindow.loadFile('UI.html'); // Memuat UI.html untuk antarmuka pengguna

  // Menampilkan UI setelah dimuat
  mainWindow.once('ready-to-show', () => {
    mainWindow.show();  // Menampilkan jendela UI
    mainWindow.minimize();  // Menyembunyikan jendela UI dengan minimize
  });

  // Jendela untuk layar utama
  let mainWindowDisplay = new BrowserWindow({
    width: 800,
    height: 600,
    fullscreen: true,
    webPreferences: {
      nodeIntegration: false
    }
  });
  
  if (mainDisplay) {
    mainWindowDisplay.loadURL(mainDisplay);  // Memuat URL untuk layar utama
  }

  // Coba buat window di layar eksternal jika sudah ada
  if (displays.length > 1 && externalDisplay) {
    createExternalWindow(displays[1]);  // Memastikan URL eksternal sudah terisi
  }

  // Dengarkan event ketika layar baru ditambahkan
  screen.on('display-added', (event, newDisplay) => {
    if (!externalWindow) {
      createExternalWindow(newDisplay);
    }
  });

  // Dengarkan event ketika layar dilepas
  screen.on('display-removed', (event, oldDisplay) => {
    if (externalWindow) {
      externalWindow.close(); // Tutup jendela eksternal
      externalWindow = null;  // Reset referensi externalWindow
    }
  });
});

// Fungsi untuk membuat jendela di monitor eksternal
function createExternalWindow(display) {
  let externalWindow = new BrowserWindow({
    x: display.bounds.x,
    y: display.bounds.y,
    width: display.bounds.width,
    height: display.bounds.height,
    fullscreen: true,
    webPreferences: {
      nodeIntegration: false
    }
  });

  if (externalDisplay) {
    externalWindow.loadURL(externalDisplay);  // Memuat URL untuk layar eksternal
  }
}

// IPC untuk mendapatkan URL dari config.json
ipcMain.handle('get-config', () => {
  return { mainDisplay, externalDisplay };  // Mengembalikan URL yang disimpan di config.json
});

ipcMain.handle('get-displays', () => {
  const displays = screen.getAllDisplays();
  // console.log('Daftar monitor yang terhubung:', displays);
  return displays.map((display, index) => ({
    name: display.label || `Monitor ${index + 1}`,
    bounds: display.bounds,
  }));
});

// IPC untuk menyimpan pengaturan
ipcMain.on('save-settings', (event, newConfig) => {
  mainDisplay = newConfig.mainDisplay;
  externalDisplay = newConfig.externalDisplay;

  // Simpan konfigurasi ke config.json
  const newConfigJson = {
    mainDisplay,
    externalDisplay
  };

  fs.writeFile(configPath, JSON.stringify(newConfigJson, null, 2), (err) => {
    if (err) {
      console.error('Gagal menyimpan konfigurasi:', err);
    } else {
      console.log('Konfigurasi berhasil disimpan');
    }
  });
});

// Restart software ketika menerima perintah dari renderer process
ipcMain.on('restart-software', () => {
  app.relaunch(); // Relaunch aplikasi
  app.exit(0); // Keluar dari aplikasi
});

// Tutup software ketika menerima perintah dari renderer process
ipcMain.on('close-software', () => {
  app.quit();
});