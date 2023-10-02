const charLimit = 18;

function render (data) {
    const display = document.getElementById("shortcuts-display");
    for (let item of data) {
        let name = item.name;
        if (name.length > charLimit) {
            name = name.substring(0, charLimit) + "...";
        }
        display.innerHTML += `<div class="shortcut-card"><a href="${item.url}" target="_blank"><div class="shortcut-image"><img src="https://s2.googleusercontent.com/s2/favicons?sz=32&domain_url=${item.url}" alt=${name}"></div><span>${name}</span></a></div>`;
    }
};

async function run () {
    const manager = new DataManager();
    await manager.init();

    render(manager.shortcuts);
}

run();