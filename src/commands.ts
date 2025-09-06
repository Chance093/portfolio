import { COMMAND_BUFFER_DELAY, SHUTDOWN_BUFFER_DELAY, SHUTDOWN_RENDER_DELAY } from "./constants";
import { commandsDescList, helpCommandList, shutdownLog } from "./content";
import { createElement, sleep } from "./utils";

type CommandHandler = () => void | Promise<void>;

export class Command {
  private window: HTMLElement;
  private currentInput?: HTMLInputElement;
  private command?: string;
  private handlers: Record<string, CommandHandler>;
  private inputHistory: string[];
  private inputHistoryIdx: number;
  private shutdownDelay: number;

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
      exit: () => this.execExit(),
      date: () => console.log("current date"),
      easymode: () => console.log("entering easy mode"),
    };

    this.inputHistory = [];
    this.inputHistoryIdx = 0;
    this.shutdownDelay = SHUTDOWN_RENDER_DELAY;
  }

  async execute(e: KeyboardEvent) {
    e.preventDefault();
    this.parseInput();

    await sleep(COMMAND_BUFFER_DELAY);

    if (this.command === "") return;
    const handler = this.handlers[this.command!] ?? (() => this.exec404());
    await handler();

    if (this.currentInput) this.currentInput.disabled = true;
    this.inputHistoryIdx = this.inputHistory.length;
    console.log(this.inputHistory, this.inputHistoryIdx);
  }

  // parse user input
  private parseInput() {
    const cmdLine = this.currentInput!.value.trim();
    this.inputHistory.push(cmdLine);
    const commands = cmdLine.split(" ");

    this.command = commands[0];
  }

  setCurrentInput(input: HTMLInputElement) {
    this.currentInput = input;
  }

  // set input value with arrow keys
  getPastInput(e: KeyboardEvent) {
    e.preventDefault();
    // go back in input history
    if (e.key === "ArrowUp") {
      // if back the furthest in history, set input to ""
      if (this.inputHistoryIdx <= 0) {
        this.currentInput!.value = this.inputHistory[0] ?? "";
        return;
      }

      this.inputHistoryIdx -= 1;
    }

    // go forward in input history
    else if (e.key === "ArrowDown") {
      // if forward the furthest in history, set input to ""
      if (this.inputHistoryIdx > this.inputHistory.length - 1) {
        this.currentInput!.value = "";
        return;
      }

      this.inputHistoryIdx += 1;
    }

    // set current input value to input history and keep cursor at the end
    const inputVal = this.inputHistory[this.inputHistoryIdx] ?? "";
    this.currentInput!.value = inputVal;
    const valueLength = inputVal.length;
    this.currentInput!.focus();
    this.currentInput?.setSelectionRange(valueLength, valueLength);
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

  private async execExit() {
    for (const log of shutdownLog) {
      this.computeDelay(log);
      await sleep(this.shutdownDelay);

      const pre = createElement("pre", ["intro"], log);
      this.window.appendChild(pre);
      this.window.scrollTop = this.window.scrollHeight;
    }

    await sleep(SHUTDOWN_BUFFER_DELAY);
    window.open("", "_self")!.close();
  }

  private computeDelay(log: string) {
    if (
      ["Stopping system", "Unmounting virtual", "Shutting down"].some((tag) =>
        log.includes(tag),
      )
    ) {
      this.shutdownDelay *= 8;
    }
    if (
      ["Killing remaining", "Deactivating swap", "Flushing file"].some((tag) =>
        log.includes(tag),
      )
    ) {
      this.shutdownDelay /= 8;
    }
  }
}
