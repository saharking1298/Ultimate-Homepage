const backup = [
    {name: "N12", url: "https://www.n12.co.il/"},
    {name: "ynet", url: "https://www.ynet.co.il/home/0,7340,L-8,00.html/"},
    {name: "walla", url: "https://www.walla.co.il/"},
    {name: "Leonardo AI", url: "https://app.leonardo.ai/"},
    {name: "PhotoPea", url: "https://www.photopea.com/"},
];

function render (data) {
    const display = document.getElementById("shortcuts-display");
    for (let item of data) {
        display.innerHTML += `<div class="shortcut-card"><a href="${item.url}" target="_blank"><div class="shortcut-image"><img src="https://s2.googleusercontent.com/s2/favicons?sz=32&domain_url=${item.url}" alt=${item.name}"></div><span>${item.name}</span></a></div>`;
    }
};

async function run () {
    const manager = new DataManager();
    await manager.init();
    // await manager.removeAllShortcut();
    // await manager.setShortcuts(backup);

    render(manager.shortcuts);
}

run();