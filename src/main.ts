import { App, Plugin, PluginManifest } from 'obsidian';
import { SidebarView, VIEW_TYPE_SIDEBAR } from './sidebar';

interface MyPluginSettings {
    mySetting: string;
}

const DEFAULT_SETTINGS: MyPluginSettings = {
    mySetting: 'default'
}

export default class MyPlugin extends Plugin {
    settings: MyPluginSettings;
    sidebarView!: SidebarView;

    constructor(app: App, manifest: PluginManifest) {
        super(app, manifest);
        this.settings = DEFAULT_SETTINGS;
    }

    async onload() {
        await this.loadSettings();
        
        // 注册侧边栏视图
        this.registerView(
            VIEW_TYPE_SIDEBAR,
            (leaf) => new SidebarView(leaf)
        );

        // 添加快捷键命令
        this.addCommand({
            id: 'open-sidebar',
            name: 'Open Sidebar',
            hotkeys: [{ modifiers: ["Mod", "Shift"], key: "L" }],
            callback: () => {
                this.activateSidebar();
            }
        });

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

    private activateSidebar() {
        const { workspace } = this.app;
        
        let leaf = workspace.getLeavesOfType(VIEW_TYPE_SIDEBAR)[0];
        if (!leaf) {
            const newLeaf = workspace.getRightLeaf(false);
            if (!newLeaf) {
                console.error('无法创建右侧边栏');
                return;
            }
            leaf = newLeaf;
            leaf.setViewState({
                type: VIEW_TYPE_SIDEBAR,
                active: true
            });
        }
        if (leaf) {
            workspace.revealLeaf(leaf);
        }
    }

    async loadSettings() {
        this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
    }

    async saveSettings() {
        await this.saveData(this.settings);
    }
}