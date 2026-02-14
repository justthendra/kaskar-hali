const { app, BrowserWindow, Menu } = require('electron');
const path = require('path');

let mainWindow;

function createWindow() {
    mainWindow = new BrowserWindow({
        width: 1280,
        height: 800,
        titleBarStyle: 'hidden', // Başlık çubuğunu gizler (içerik yukarı kayar)
        titleBarOverlay: {
            color: '#ffffff', // Arka plan rengi (Light mod için)
            symbolColor: '#000000', // İkon rengi
            height: 30 // Yükseklik
        },
        icon: path.join(__dirname, '../public/kaskar.png'),
        webPreferences: {
            nodeIntegration: false,
            contextIsolation: true,
        }
    });

    // Production URL (Bunu canlı sitenizin URL'si ile değiştirmelisiniz)
    const adminUrl = 'https://kaskarhali.com/admin/dashboard';

    // Geliştirme ortamında localhost, production'da canlı URL
    const startUrl = process.env.ELECTRON_START_URL || adminUrl;

    mainWindow.loadURL(startUrl);

    // Üst menüyü gizle (Daha modern görünüm için)
    Menu.setApplicationMenu(null);

    mainWindow.on('closed', function () {
        mainWindow = null;
    });
}

app.on('ready', createWindow);

app.on('window-all-closed', function () {
    if (process.platform !== 'darwin') app.quit();
});

app.on('activate', function () {
    if (mainWindow === null) createWindow();
});
