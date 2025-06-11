"use strict";
async function renderPage() {
    const terminal = document.getElementById("terminal");
    if (!terminal) {
        throw new Error("Terminal not set in HTML");
    }
    terminal.textContent += "\n\n";
    await renderIntroText(terminal, 70);
    renderInputLine(terminal);
}
function sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}
async function renderIntroText(el, ms) {
    const TEXT = "Type the command help";
    for (let i = 0; i < TEXT.length; i++) {
        await sleep(ms);
        el.textContent += TEXT[i];
    }
}
function renderInputLine(el) {
    const div = document.createElement("div");
    div.classList.add("inputLine");
    const user = document.createElement("p");
    user.textContent = "user@root  $";
    user.classList.add("user");
    div.appendChild(user);
    const input = document.createElement("input");
    input.setAttribute("type", "text");
    input.classList.add("input");
    div.appendChild(input);
    el.appendChild(div);
    input.focus();
}
renderPage();
