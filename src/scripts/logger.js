const logDisplay = document.getElementById("log-display");

function log(text) {
    logDisplay.innerHTML += `<li>${text}</li>`;
}