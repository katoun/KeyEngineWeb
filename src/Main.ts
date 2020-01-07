import { app, ipcMain, nativeImage, BrowserWindow, screen } from "electron";
import * as path from "path";

function windowBounds(): Electron.Rectangle
{
	const workAreaSize = screen.getPrimaryDisplay().workAreaSize;

	return {
		width: workAreaSize.width,
		height: workAreaSize.height,
		x: 0,
		y: 0,
	};
}

app.on("ready", () =>
{
	const bounds = windowBounds();
	let options: Electron.BrowserWindowConstructorOptions = {
		titleBarStyle: "hidden",
		resizable: true,
		minWidth: 800,
		minHeight: 600,
		width: bounds.width,
		height: bounds.height,
		x: bounds.x,
		y: bounds.y,
		show: false,
		webPreferences: {
			nodeIntegration: true,
			experimentalFeatures: true
		}
	};

	const window = new BrowserWindow(options);

	if (app.dock)
	{
		app.dock.setIcon(nativeImage.createFromPath("build/icon.png"));
	}
	else
	{
		window.setIcon(nativeImage.createFromPath("build/icon.png"));
	}

	//window.setMenuBarVisibility(false);
	window.loadFile(path.join(__dirname, "index.html"));

	window.webContents.on("did-finish-load", () =>
	{
		window.show();
		window.focus();
	});

	app.on("open-file", (_event, file) => window.webContents.send("change-working-directory", file));
});


app.on("window-all-closed", () => app.quit());
ipcMain.on("quit", app.quit);