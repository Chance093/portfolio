import { COMMAND_BUFFER_DELAY } from "./constants";
import type { Handlers } from "./definitions";
import { Renderer } from "./renderer";
import { createElement, sleep } from "./utils";

export class InputLine {
  currentInput: HTMLInputElement;
  line: HTMLElement;
  static inputHistory: string[] = [];
  static inputHistoryIdx: number = 0;

  constructor(private renderer: Renderer, private handlers: Handlers) {
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
      if (InputLine.inputHistoryIdx <= 0) {
        this.currentInput.value = InputLine.inputHistory[0] ?? "";
        return;
      }
      InputLine.inputHistoryIdx -= 1;
    } else if (e.key === "ArrowDown") {
      if (InputLine.inputHistoryIdx > InputLine.inputHistory.length - 1) {
        this.currentInput.value = "";
        return;
      }
    }

    // set current input value to input history and keep cursor at the end
    const inputVal = InputLine.inputHistory[InputLine.inputHistoryIdx] ?? "";
    this.currentInput.value = inputVal;
    const valueLength = inputVal.length;
    this.currentInput.focus();
    this.currentInput.setSelectionRange(valueLength, valueLength);
  }

  async executeCommand(e: KeyboardEvent) {
    e.preventDefault();

    await sleep(COMMAND_BUFFER_DELAY);
    const command = this.getCommand();

    if (command === "") return;
    const handler = this.handlers[command] ?? this.handlers["execNotFound"];
    await handler();

    if (this.currentInput) this.currentInput.disabled = true;

    InputLine.addToInputHistory(command);
  }

  createNewInput() {
    const newInput = new InputLine(this.renderer, this.handlers);
    this.renderer.render([newInput.getLine()]);

    this.currentInput.disabled = true;
    newInput.getInput().focus();
    this.currentInput = newInput.getInput();
  }

  private getCommand() {
    const cmdLine = this.currentInput.value.trim()
    const commands = cmdLine.split(" ");

    return commands[0];
  }

  private static addToInputHistory(command: string) {
    this.inputHistory.push(command)
    this.inputHistoryIdx = InputLine.inputHistory.length;
  }
}
