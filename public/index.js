import { bootLog } from "./content.js";
async function renderTerminal() {
    const terminal = document.getElementById("terminalWindow");
    if (!terminal)
        throw new Error("Terminal not set in HTML");
    await renderIntroText(terminal, 30);
    renderInputLine(terminal);
}
function renderInputLine(term) {
    // create input line elements
    const div = createElement("div", ["inputLine"]);
    const user = createElement("p", ["user"], "[portfolio@chance ~]$ ");
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
    for (let i = 0; i < bootLog.length; i++) {
        const log = bootLog[i];
        if (log.includes("Loading drivers") || log.includes("Mounting virtual") || log.includes("Starting system")) {
            ms *= 8;
        }
        if (log.includes("Starting udev") || log.includes("devpts") || log.includes("Cleaning up")) {
            ms /= 8;
        }
        await sleep(ms);
        const pre = createElement("pre", ["intro"], bootLog[i]);
        el.appendChild(pre);
    }
}
renderTerminal();
