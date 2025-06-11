import { ascii, bootLog } from "./content.js";

async function renderTerminal() {
  const terminal = document.getElementById("terminalWindow");
  if (!terminal) throw new Error("Terminal not set in HTML");

  await renderIntroText(terminal, 10);
  renderInputLine(terminal);
}

function renderInputLine(term: HTMLElement) {
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

function createElement(el: string, classes: string[], text?: string) {
  const element = document.createElement(el);

  if (classes.length > 0) {
    element.classList.add(...classes);
  }

  if (text) {
    element.textContent = text;
  }

  return element;
}

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function renderIntroText(el: HTMLElement, ms: number) {
  // add tiny sleep to prevent loading before browser load
  await sleep(200);

  // load in all the bootlog info
  for (let i = 0; i < bootLog.length; i++) {
    const log = bootLog[i];
    if (
      log.includes("Loading drivers") ||
      log.includes("Mounting virtual") ||
      log.includes("Starting system")
    ) {
      ms *= 8;
    }
    if (
      log.includes("Starting udev") ||
      log.includes("devpts") ||
      log.includes("Cleaning up")
    ) {
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

async function executeCommand(e: KeyboardEvent, term: HTMLElement) {
  const input = e.currentTarget as HTMLInputElement;
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
        console.log("help out");
        break;
      case "commands":
        console.log("show commands");
        break;
      default:
        defaultCommand(term, cmd);
        break;
    }

    input.readOnly = true;
    renderInputLine(term);
  }
}

// clears the terminal
function clearCommand(term: HTMLElement) {
  while (term.firstChild) {
    term.removeChild(term.firstChild);
  }
}

function defaultCommand(term: HTMLElement, cmd: string) {
  const p = createElement("p", ["output"], `${cmd}: command not found`);
  term.appendChild(p);
}

renderTerminal();
