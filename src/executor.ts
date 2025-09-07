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
    const inputLine = this.builder.getInputLine(this.renderer);

    await this.renderer.renderWithDelay(bootLog, BOOTLOG_RENDER_DELAY);
    this.renderer.render(breakEl);
    this.renderer.render(ascii);
    this.renderer.render([inputLine.getLine()]);

    inputLine.getInput().focus();
  }
}
