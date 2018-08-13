const electron = require('electron');

let win = null;
function createWindow() {
    win = new electron.BrowserWindow({width: 1600, height: 900});
    win.loadFile('index.html');

    win.on('closed', () => {win = 0;});
}

electron.app.on('ready', createWindow);
electron.app.on('window-all-closed', () => {
    electron.app.quit();
});
