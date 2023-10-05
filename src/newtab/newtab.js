const display = document.getElementById("shortcuts-display");
const charLimit = 18;

class App {
    constructor () {
        this.manager = new DataManager();
    }

    render () {
        const that = this;

        for (let item of this.manager.shortcuts) {
            let name = item.name;
            if (name.length > charLimit) {
                name = name.substring(0, charLimit) + "...";
            }
            display.innerHTML += `<div class="shortcut-card"><a href="${item.url}"><div class="shortcut-image"><img src="https://s2.googleusercontent.com/s2/favicons?sz=32&domain_url=${item.url}" alt=${name}"></div><span>${name}</span></a></div>`;
        }
    
        const images = document.getElementsByTagName("img");
        for (let i = 0; i < images.length; i++) {
            images[i].onload = function () {
                if (this.naturalWidth === 16 && this.naturalHeight === 16) {
                    const parent = this.parentElement;
                    this.remove();
                    parent.innerHTML += `<div class="missing-image">${that.manager.shortcuts[i].name[0]}</div>`;
                }
            }
        }
    };

    async run () {
        await this.manager.init();
        this.render();
    }
}

const app = new App();
app.run();