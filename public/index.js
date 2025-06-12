import { ascii, bootLog } from "./content.js";
async function renderTerminal() {
    const terminal = document.getElementById("terminalWindow");
    if (!terminal)
        throw new Error("Terminal not set in HTML");
    await renderIntroText(terminal, 10);
    renderInputLine(terminal);
}
function renderInputLine(term) {
    // create input line elements
    const div = createElement("div", ["inputLine"]);
    const user = createElement("p", ["user"], "[portfolio@chance ~]$ ");
    const input = createElement("input", ["input"]);
    input.setAttribute("type", "text");
    input.addEventListener("keydown", (e) => executeCommand(e, term));
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
    // add tiny sleep to prevent loading before browser load
    await sleep(200);
    // load in all the bootlog info
    for (let i = 0; i < bootLog.length; i++) {
        const log = bootLog[i];
        if (log.includes("Loading drivers") ||
            log.includes("Mounting virtual") ||
            log.includes("Starting system")) {
            ms *= 8;
        }
        if (log.includes("Starting udev") ||
            log.includes("devpts") ||
            log.includes("Cleaning up")) {
            ms /= 8;
        }
        await sleep(ms);
        const pre = createElement("pre", ["intro"], log);
        el.appendChild(pre);
        el.scrollTop = el.scrollHeight;
    }
    // create break between bootlog and ascii
    const breakEl = createElement("br", []);
    el.appendChild(breakEl);
    // load in ascii picture
    for (let i = 0; i < ascii.length; i++) {
        const pre = createElement("pre", [], ascii[i]);
        el.appendChild(pre);
        el.scrollTop = el.scrollHeight;
    }
}
async function executeCommand(e, term) {
    const input = e.currentTarget;
    if (e.key === "Enter") {
        e.preventDefault();
        const cmdLine = input.value.trim();
        const commands = cmdLine.split(" ");
        const cmd = commands[0];
        await sleep(100);
        switch (cmd) {
            case "ls":
                console.log("list");
                break;
            case "cd":
                console.log("change directory");
                break;
            case "cat":
                console.log("concatenate");
                break;
            case "clear":
                clearCommand(term);
                break;
            case "help":
                helpCommand(term);
                break;
            case "commands":
                listCommandsCommand(term);
                break;
            default:
                defaultCommand(term, cmd);
                break;
        }
        input.disabled = true;
        renderInputLine(term);
    }
}
// clears the terminal
function clearCommand(term) {
    while (term.firstChild) {
        term.removeChild(term.firstChild);
    }
}
function defaultCommand(term, cmd) {
    const p = createElement("p", ["output"], `${cmd}: command not found`);
    term.appendChild(p);
}
// TODO: Highlight ls and commands for user to see better
function helpCommand(term) {
    const div = createElement("div", ["output", "help"]);
    const p1 = createElement("p", [], "Welcome to my terminal portfolio. Here you can explore my projects, view my code samples, and learn more about my skills all through a command-line interface.");
    const p2 = createElement("p", [], "If you’re comfortable with a UNIX-style terminal, try running `ls` to list the available directories and files.");
    const p3 = createElement("p", [], "If you’re new to this interface or want to see all the commands that are available, type `commands` and press Enter to view a full list of supported commands.");
    const p4 = createElement("p", [], "If you find navigating terminals to be too difficult, check out the `easymode` command I made.");
    const p5 = createElement("p", [], "Feel free to leave feedback by opening an issue on the GitHub repo or emailing me at chance.dev093@gmail.com.");
    div.appendChild(p1);
    div.appendChild(p2);
    div.appendChild(p3);
    div.appendChild(p4);
    div.appendChild(p5);
    term.appendChild(div);
}
function listCommandsCommand(term) {
    const ul = createElement("ul", ["output", "commandsList"]);
    const li1 = createElement("li", [], "* ls - Lists the files and directories in the current directory.");
    const li2 = createElement("li", [], "* cd <dir> - Changes the current directory to <dir>. Use `cd ..` to go up one level.");
    const li3 = createElement("li", [], "* cat <file> - Prints the contents of <file> to the terminal.");
    const li4 = createElement("li", [], "* clear - Clears all text from the terminal window.");
    const li5 = createElement("li", [], "* help - Shows a brief introduction and usage tips.");
    const li6 = createElement("li", [], "* commands - Displays a full list of available commands.");
    const li7 = createElement("li", [], "* easymode - Enables “easy navigation” mode—use your arrow keys and Enter to browse directories and open files without typing commands.");
    ul.appendChild(li1);
    ul.appendChild(li2);
    ul.appendChild(li3);
    ul.appendChild(li4);
    ul.appendChild(li5);
    ul.appendChild(li6);
    ul.appendChild(li7);
    term.appendChild(ul);
}
renderTerminal();
