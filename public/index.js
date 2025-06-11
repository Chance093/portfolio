"use strict";
async function renderTerminal() {
    const terminal = document.getElementById("terminal");
    if (!terminal)
        throw new Error("Terminal not set in HTML");
    await renderIntroText(terminal, 1);
    renderInputLine(terminal);
}
function renderInputLine(term) {
    // create input line elements
    const div = createElement("div", ["inputLine"]);
    const user = createElement("p", ["user"], "user@root  $");
    const input = createElement("input", ["input"]);
    input.setAttribute("type", "text");
    // append to each other
    div.appendChild(user);
    div.appendChild(input);
    term.appendChild(div);
    // focus cursor on input
    input.focus();
}
function createElement(el, classes, text) {
    const element = document.createElement(el);
    if (classes.length > 0) {
        element.classList.add(...classes);
    }
    if (text) {
        element.textContent = text;
    }
    return element;
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
renderTerminal();
