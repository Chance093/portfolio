import { COMMAND_BUFFER_DELAY } from "./constants";
import { ascii, bootLog, commandsDescList, helpCommandList, shutdownLog } from "./content";
import { CommandHandler } from "./executor";
import { Renderer } from "./renderer";
import { createElement, sleep } from "./utils";

export class Builder {
  getBootLog() {
    const bootlogEls: HTMLElement[] = [];
    for (const log of bootLog) {
      const el = createElement("pre", ["intro"], log);
      bootlogEls.push(el);
    }

    return bootlogEls;
  }

  getBreakEl() {
    const breakEl = createElement("br", []);
    return [breakEl];
  }

  getAscii() {
    const asciiEls: HTMLElement[] = [];
    for (const asc of ascii) {
      const el = createElement("pre", [], asc);
      asciiEls.push(el);
    }

    return asciiEls;
  }

  getInputLine(renderer: Renderer, handlers: Record<string, CommandHandler>) {
    return new InputLine(renderer, handlers);
  }

  getNotFound(command: string) {
    const p = createElement(
      "p",
      ["output"],
      `${command}: command not found`,
    );

    return [p]
  }

  getHelp() {
    const div = createElement("div", ["output", "help"]);
    for (const paragraph of helpCommandList) {
      const p = createElement("p", [], paragraph);
      div.appendChild(p);
    }

    return [div];
  }

  getCommands() {
    const ul = createElement("ul", ["output", "commandsList"]);
    for (const cmdDesc of commandsDescList) {
      const li = createElement("li", [], cmdDesc);
      ul.appendChild(li);
    }

    return [ul];
  }

  getExit() {
    const exitEls: HTMLElement[] = [];

    for (const log of shutdownLog) {
      const pre = createElement("pre", ["intro"], log);
      exitEls.push(pre);
    }

    return exitEls;
  }
}

class InputLine {
  currentInput: HTMLInputElement;
  line: HTMLElement;

  constructor(private renderer: Renderer, private handlers: Record<string, CommandHandler>) {
    const prompt = createElement("p", ["user"], "[portfolio@chance ~]$ ");
    this.line = createElement("div", ["inputLine"]);
    this.currentInput = createElement("input", ["input"]) as HTMLInputElement;
    this.currentInput.type = "text";

    this.line.append(prompt, this.currentInput);

    this.currentInput.addEventListener("keydown", (e) => this.onInputKeydown(e));
  }

  getInput() {
    return this.currentInput;
  }

  getLine() {
    return this.line;
  }

  private async onInputKeydown(e: KeyboardEvent) {
    if (e.key === "ArrowUp" || e.key === "ArrowDown") {
      this.getPastInput(e);
      return;
    } else if (e.key === "Enter") {
      await this.executeCommand(e);
      this.createNewInput();
    }
  }

  private getPastInput(e: KeyboardEvent) {
    if (e.key === "ArrowUp") {
      console.log("up");
    } else if (e.key === "ArrowDown") {
      console.log("down");
    }
  }

  async executeCommand(e: KeyboardEvent) {
    e.preventDefault();

    await sleep(COMMAND_BUFFER_DELAY);
    const command = this.parseInput();

    if (command === "") return;
    const handler = this.handlers[command] ?? this.handlers["execNotFound"];
    await handler();

    if (this.currentInput) this.currentInput.disabled = true;
  }

  createNewInput() {
    const newInput = new InputLine(this.renderer, this.handlers);
    this.renderer.render([newInput.getLine()]);

    this.currentInput.disabled = true;
    newInput.getInput().focus();
  }

  private parseInput() {
    const cmdLine = this.currentInput.value.trim()
    const commands = cmdLine.split(" ");

    return commands[0];
  }
}
