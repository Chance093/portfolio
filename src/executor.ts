import { Renderer } from "./renderer";
import { Builder } from "./builder";
import { BOOTLOG_RENDER_DELAY } from "./constants";

export class Executor {
  private builder: Builder;
  private renderer: Renderer;

  constructor(container: HTMLElement) {
    this.builder = new Builder();
    this.renderer = new Renderer(container);
  }

  async boot() {
    const bootLog = this.builder.getBootLog();
    const breakEl = this.builder.getBreakEl();
    const ascii = this.builder.getAscii();
    const [inputLine, input] = this.builder.getInputLine();

    input.addEventListener("keydown", (e) => this.onInputKeydown(e, input));

    await this.renderer.renderWithDelay(bootLog, BOOTLOG_RENDER_DELAY);
    this.renderer.render(breakEl);
    this.renderer.render(ascii);
    this.renderer.render([inputLine]);

    input.focus();
  }

  async onInputKeydown(e: KeyboardEvent, input: HTMLInputElement) {
    if (e.key === "ArrowUp" || e.key === "ArrowDown") {
      this.getPastInput(e);
      return;
    }

    if (e.key !== "Enter") return;
    await this.executeCommand(e);
    this.renderer.render([input])
  }

  getPastInput(e: KeyboardEvent) {
    return;
  }

  async executeCommand(e: KeyboardEvent) {
    console.log("executing");
  }
}
