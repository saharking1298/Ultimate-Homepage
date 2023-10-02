async function getCurrentTab() {
    return new Promise((resolve, reject) => {
        chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        if (chrome.runtime.lastError) {
            reject(chrome.runtime.lastError);
        }
        else {
            const currentTab = tabs[0];
            resolve(currentTab);
        }
        });
    });
}

class App {
    constructor () {
        this.manager = new DataManager();
        this.currentTab;
    }

    showShortcutEdit () {
        const shortcut = this.manager.getShortcut(this.currentTab.url);
        document.getElementById("shortcut-name-input").value = shortcut.name;
        document.getElementById("shortcut-creation").style.display = "none";
        document.getElementById("shortcut-edit").style.display = "block";
    }

    showShortcutCreation () {
        document.getElementById("shortcut-edit").style.display = "none";
        document.getElementById("shortcut-creation").style.display = "block";
    }

    async createShortcut () {
        await this.manager.setShortcut(this.currentTab.url, this.currentTab.title);
        log("Shortcut created successfully!");
        this.showShortcutEdit();
    }

    async renameShortcut () {
        const name = document.getElementById("shortcut-name-input").value;
        await this.manager.setShortcut(this.currentTab.url, name);
        log("Shortcut renamed successfully!");
    }

    async removeShortcut() {
        this.manager.removeShortcut(this.currentTab.url);
        log("Shortcut removed successfully!");
        this.showShortcutCreation();
    }

    async run () {
        // Initializing the application
        await this.manager.init();
        this.currentTab = await getCurrentTab();
        
        // Inserting data to the page
        document.getElementById("page-title-label").innerText = this.currentTab.title;

        // Checking if the wether current tab is saved to shortcuts
        const shortcut = this.manager.getShortcut(this.currentTab.url);

        // Showing the right panel
        if (shortcut) {
            this.showShortcutEdit();
        }
        else {
            this.showShortcutCreation();
        }
    }
}

const app = new App();

// defining button actions
document.getElementById("shortcut-create-btn").addEventListener("click", () => {app.createShortcut()});
document.getElementById("shortcut-rename-btn").addEventListener("click", () => {app.renameShortcut()});
document.getElementById("shortcut-remove-btn").addEventListener("click", () => {app.removeShortcut()});
document.getElementById("shortcut-name-input").addEventListener("focus", e => {e.target.select()});
document.getElementById("close-btn").addEventListener("click", () => {window.close()})

app.run();