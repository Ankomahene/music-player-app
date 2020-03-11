// Modules
require('dotenv').config({ path: __dirname + '/.env' });
const { app, BrowserWindow, ipcMain, Menu } = require('electron');
const windowStateKeeper = require('electron-window-state');

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow;

// Create a new BrowserWindow when `app` is ready
function createWindow() {
	// Win state keeper
	let state = windowStateKeeper({
		defaultWidth: 900,
		defaultHeight: 700
	});

	mainWindow = new BrowserWindow({
		x: state.x,
		y: state.y,
		width: state.width,
		height: state.height,
		minWidth: 850,
		maxWidth: 950,
		minHeight: 500,
		webPreferences: {
			nodeIntegration: true
		}
	});

	// Load index.html into the new BrowserWindow
	mainWindow.loadFile('renderer/main.html');

	// Creating menu
	const menu = Menu.buildFromTemplate(mainMenuTemplate);
	Menu.setApplicationMenu(menu);

	// Manage new window state
	state.manage(mainWindow);

	// Open DevTools - Remove for PRODUCTION!
	mainWindow.webContents.openDevTools();

	// Listen for window being closed
	mainWindow.on('closed', () => {
		mainWindow = null;
	});
}

// Electron `app` is ready
app.on('ready', createWindow);

// Quit when all windows are closed - (Not macOS - Darwin)
app.on('window-all-closed', () => {
	if (process.platform !== 'darwin') app.quit();
});

// When app icon is clicked and app is running, (macOS) recreate the BrowserWindow
app.on('activate', () => {
	if (mainWindow === null) createWindow();
});

// create menu template
const mainMenuTemplate = [];

// if mac, add empty object to menu
if (process.platform === 'darwin') {
	mainMenuTemplate.unshift({});
}

// add developer tools item when not in production
if (process.env.NODE_ENV !== 'production') {
	mainMenuTemplate.push({
		label: 'Developer Tools',
		submenu: [
			{
				label: 'Toggle DevTools',
				accelerator: process.platform == 'darwin' ? 'Command+I' : 'Ctrl+I',
				click(item, focusedWindow) {
					focusedWindow.toggleDevTools();
				}
			},
			{
				role: 'reload'
			}
		]
	});
}
