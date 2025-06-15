import {
  ascii,
  bootLog,
  commandsDescList,
  helpCommandList,
} from "./content.js";
import { createElement, sleep } from "./utils.js";

const BOOTLOG_RENDER_DELAY = 10;
const INITIAL_BUFFER_DELAY = 200;
const COMMAND_BUFFER_DELAY = 50;

class Terminal {
  private window: HTMLElement;
  private bootDelay: number;
  private Command: Command;

  constructor() {
    const window = document.getElementById("terminalWindow");
    if (!window) throw new Error("no window");

    this.window = window;
    this.bootDelay = BOOTLOG_RENDER_DELAY;
    this.Command = new Command(this.window);
  }

  async boot() {
    // add tiny sleep to prevent loading before browser load
    await sleep(INITIAL_BUFFER_DELAY);

    // load in all the bootlog info
    await this.renderBootlog();

    // create break between bootlog and ascii
    this.window.appendChild(createElement("br", []));

    // load in ascii picture
    this.renderAscii();

    // render first input line
    this.renderInputLine();
  }

  private async renderBootlog() {
    for (const log of bootLog) {
      this.computeDelay(log);
      await sleep(this.bootDelay);

      const pre = createElement("pre", ["intro"], log);
      this.window.appendChild(pre);
      this.window.scrollTop = this.window.scrollHeight;
    }
  }

  private computeDelay(log: string) {
    if (
      ["Loading drivers", "Mounting virtual", "Starting system"].some((tag) =>
        log.includes(tag),
      )
    ) {
      this.bootDelay *= 8;
    }
    if (
      ["Starting udev", "devpts", "Cleaning up"].some((tag) =>
        log.includes(tag),
      )
    ) {
      this.bootDelay /= 8;
    }
  }

  private renderAscii() {
    for (const line of ascii) {
      const pre = createElement("pre", [], line);
      this.window.appendChild(pre);
      this.window.scrollTop = this.window.scrollHeight;
    }
  }

  private renderInputLine() {
    // create input line elements
    const line = createElement("div", ["inputLine"]);
    const prompt = createElement("p", ["user"], "[portfolio@chance ~]$ ");
    const input = createElement("input", ["input"]) as HTMLInputElement;
    input.type = "text";

    input.addEventListener("keydown", async (e) => {
      if (e.key !== "Enter") return;
      await this.Command.execute(e);
      this.renderInputLine();
    });

    line.append(prompt, input);
    this.window.appendChild(line);
    input.focus();
  }
}

type CommandHandler = () => void | Promise<void>;

class Command {
  private window: HTMLElement;
  private currentInput?: HTMLInputElement;
  private command?: string;
  private handlers: Record<string, CommandHandler>;

  constructor(window: HTMLElement) {
    this.window = window;
    this.currentInput = undefined;
    this.command = undefined;

    this.handlers = {
      ls: () => console.log("list"),
      cd: () => console.log("change dir"),
      cat: () => console.log("concatenate"),
      clear: () => this.execClear(),
      help: () => this.execHelp(),
      commands: () => this.execCommands(),
      theme: () => console.log("themes"),
      pwd: () => console.log("print working dir"),
      exit: () => console.log("exit terminal"),
      date: () => console.log("date"),
      easymode: () => console.log("entering easy mode"),
    };
  }

  async execute(e: KeyboardEvent) {
    e.preventDefault();
    this.parseInput(e);

    await sleep(COMMAND_BUFFER_DELAY);

    if (this.command === "") return;
    const handler = this.handlers[this.command!] ?? (() => this.exec404());
    await handler();

    if (this.currentInput) this.currentInput.disabled = true;
  }

  // parse user input
  private parseInput(e: KeyboardEvent) {
    this.currentInput = e.currentTarget as HTMLInputElement;
    const commands = this.currentInput.value.trim().split(" ");

    this.command = commands[0];
  }

  // clears the terminal
  private execClear() {
    while (this.window.firstChild) {
      this.window.removeChild(this.window.firstChild);
    }
  }

  // display command not found
  private exec404() {
    const p = createElement(
      "p",
      ["output"],
      `${this.command}: command not found`,
    );
    this.window.appendChild(p);
  }

  // display help and welcome message
  // TODO: Highlight ls and commands for user to see better
  private execHelp() {
    const div = createElement("div", ["output", "help"]);
    for (const paragraph of helpCommandList) {
      const p = createElement("p", [], paragraph);
      div.appendChild(p);
    }

    this.window.appendChild(div);
  }

  // display all usable commands
  private execCommands() {
    const ul = createElement("ul", ["output", "commandsList"]);
    for (const cmdDesc of commandsDescList) {
      const li = createElement("li", [], cmdDesc);
      ul.appendChild(li);
    }

    this.window.appendChild(ul);
  }
}

async function renderTerminal() {
  const terminal = new Terminal();
  terminal.boot();
}

renderTerminal();
