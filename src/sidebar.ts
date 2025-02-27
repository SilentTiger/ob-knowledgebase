import { ItemView, WorkspaceLeaf } from 'obsidian';

export const VIEW_TYPE_SIDEBAR = 'my-plugin-sidebar';

export class SidebarView extends ItemView {
  constructor(leaf: WorkspaceLeaf) {
    super(leaf);
  }

  getViewType(): string {
    return VIEW_TYPE_SIDEBAR;
  }

  getDisplayText(): string {
    return 'My Plugin Sidebar';
  }

  async onOpen() {
    const container = this.containerEl.children[1];
    container.empty();
    container.createEl('h4', { text: 'My Plugin Sidebar' });
    container.createEl('p', { 
      text: 'This is the custom sidebar for My Plugin.'
    });
  }

  async onClose() {}
}