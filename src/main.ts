import { App, Plugin, PluginManifest } from 'obsidian';

interface MyPluginSettings {
    mySetting: string;
}

const DEFAULT_SETTINGS: MyPluginSettings = {
    mySetting: 'default'
}

export default class MyPlugin extends Plugin {
    settings: MyPluginSettings;

    constructor(app: App, manifest: PluginManifest) {
        super(app, manifest);
        this.settings = DEFAULT_SETTINGS;
    }

    async onload() {
        await this.loadSettings();
        
        this.addCommand({
            id: 'sample-command',
            name: 'Sample Command',
            callback: () => {
                new (window as any).Notice('Hello from MyPlugin!');
            }
        });
    }

    async onunload() {
        console.log('Unloading plugin');
    }

    async loadSettings() {
        this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
    }

    async saveSettings() {
        await this.saveData(this.settings);
    }
}