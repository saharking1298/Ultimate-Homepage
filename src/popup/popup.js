const fileDialog = document.getElementById("file-dialog");
const buttons = {
    shortcutCreation: document.getElementById("shortcut-create-btn"),
    shortcutRename: document.getElementById("shortcut-rename-btn"),
    shortcutRemove: document.getElementById("shortcut-remove-btn"),
    import: document.getElementById("import-btn"),
    export: document.getElementById("export-btn"),
    reset: document.getElementById("reset-btn"),
    close: document.getElementById("close-btn")
};

function download(filename, content) {
    const element = document.createElement('a');
    element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(content));
    element.setAttribute('download', filename);

    element.style.display = 'none';
    document.body.appendChild(element);

    element.click();

    document.body.removeChild(element);
}

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
        this.session = {
            resetWarning: true
        };
        this.currentTab = null;
    }

    exportData () {
        download("homepage.json", JSON.stringify(this.manager.shortcuts, null, 2));
        log("Exported data successfully!")
    }

    importData () {
        fileDialog.click();
    }

    resetData () {
        if (this.session.resetWarning) {
            document.getElementById("reset-btn").innerText = "Press Again To Reset";
            this.session.resetWarning = false;
        }
        else {
            this.manager.removeAllShortcuts();
            buttons.reset.style.display = "none";
            log("Reset homepage successfully!")
        }
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
document.getElementById("shortcut-name-input").addEventListener("focus", e => {e.target.select()});
buttons.shortcutCreation.addEventListener("click", () => {app.createShortcut()});
buttons.shortcutRename.addEventListener("click", () => {app.renameShortcut()});
buttons.shortcutRemove.addEventListener("click", () => {app.removeShortcut()});
buttons.close.addEventListener("click", () => {window.close()});
buttons.import.addEventListener("click", () => {app.importData()});
buttons.export.addEventListener("click", () => {app.exportData()});
buttons.reset.addEventListener("click", () => {app.resetData()});
fileDialog.addEventListener("change", () => {
    const file = fileDialog.files[0];
    if (file.name.endsWith(".json")) {
        const reader = new FileReader();
        reader.onload = () => {
            try {
                const data = JSON.parse(reader.result);
                console.log(data);
                app.manager.setShortcuts(data);
                log("Imported homepage successfully!")
            }
            catch {
                log("Error importing corrupted JSON file!");
            }
        };
        reader.readAsText(file);
    }
    else {
        log("Error importing non-JSON file!");
    }
});

app.run();