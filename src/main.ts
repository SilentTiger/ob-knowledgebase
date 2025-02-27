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

        // 注册文件切换事件监听器
        this.registerEvent(
            this.app.workspace.on('file-open', (file) => {
                // 检查侧边栏是否可见
                if (this.isSidebarVisible() && file) {
                    // 获取并打印文件内容
                    this.printFileContent(file);
                }
            })
        );
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

    /**
     * 检查侧边栏是否可见
     * @returns 侧边栏是否可见
     */
    private isSidebarVisible(): boolean {
        const leaves = this.app.workspace.getLeavesOfType(VIEW_TYPE_SIDEBAR);
        if (leaves.length === 0) {
            return false;
        }
        
        // 检查叶子是否在当前工作区中可见
        for (const leaf of leaves) {
            if (leaf.view && leaf.view.containerEl.isShown()) {
                return true;
            }
        }
        
        return false;
    }

    /**
     * 获取并打印文件内容
     * @param file 打开的文件
     */
    private async printFileContent(file: any) {
        try {
            if (file && file.path) {
                // 获取文件内容
                const content = await this.app.vault.read(file);
                console.log(`文件 ${file.path} 的内容:`);
                console.log(content);
            }
        } catch (error) {
            console.error('读取文件内容时出错:', error);
        }
    }
}