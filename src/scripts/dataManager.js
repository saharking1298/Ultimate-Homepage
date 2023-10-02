class DataManager {
    constructor () {
        this.settings = {
            theme: "light"
        };
        this.shortcuts = [];
    }

    async saveData () {
        await chrome.storage.sync.set({
            settings: this.settings,
            shortcuts: this.shortcuts
        });
    }

    async loadData () {
        const data = await chrome.storage.sync.get(["settings", "shortcuts"]);
        if (data.settings && data.shortcuts) {
            this.settings = data.settings;
            this.shortcuts = data.shortcuts;
        }
        else {
            await this.saveData(); 
        }
    }

    getShortcut(url) {
        return this.shortcuts.find(item => {
            if (item.url === url)
                return item;
        });
    }

    async setShortcuts(shortcuts) {
        for (let shortcut of shortcuts) {
            await this.setShortcut(shortcut.url, shortcut.name, false);
        }
        await this.saveData();
    }

    async setShortcut(url, name, save = true) {
        const shortcut = this.getShortcut(url);
        if (shortcut) {
            shortcut.name = name;
        }
        else {
            this.shortcuts.push({url, name})
        }
        if (save) {
            await this.saveData();
        } 
    }

    async removeShortcut(url) {
        const index = this.shortcuts.findIndex(item => item.url === url);
        if (index !== -1) {
            this.shortcuts.splice(index, 1)
            await this.saveData();
        }
    }

    async removeAllShortcuts() {
        this.shortcuts = [];
        await this.saveData();
    }

    async setSetting (name, value) {
        if (name in this.settings) {
            this.settings[name] = value;
            await this.saveData();
        }
    }

    async init () {
        await this.loadData();
    }
}