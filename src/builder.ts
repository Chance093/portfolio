import { ascii, bootLog } from "./content";
import { Renderer } from "./renderer";
import { createElement } from "./utils";

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

  getInputLine(renderer: Renderer) {
    return new InputLine(renderer);
  }
}

class InputLine {
  currentInput: HTMLInputElement;
  line: HTMLElement;

  constructor(private renderer: Renderer) {
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
    if (this.currentInput.value === "") return;

    console.log("executing command:", this.currentInput.value);
  }

  createNewInput() {
    const newInput = new InputLine(this.renderer);
    this.renderer.render([newInput.getLine()]);

    this.currentInput.disabled = true;
    newInput.getInput().focus();
  }
}
