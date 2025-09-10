import { Renderer } from "./renderer";
import { Builder } from "./builder";
import { BOOTLOG_RENDER_DELAY, SHUTDOWN_BUFFER_DELAY } from "./constants";
import { sleep } from "./utils";

export type CommandHandler = () => void | Promise<void>;

export class Executor {
  private builder: Builder;
  private renderer: Renderer;
  private handlers: Record<string, CommandHandler>

  constructor(container: HTMLElement) {
    this.builder = new Builder();
    this.renderer = new Renderer(container);

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
      execNotFound: () => this.execNotFound(),
    };
  }

  async boot() {
    const bootLog = this.builder.getBootLog();
    const breakEl = this.builder.getBreakEl();
    const ascii = this.builder.getAscii();
    const inputLine = this.builder.getInputLine(this.renderer, this.handlers);

    await this.renderer.renderWithDelay(bootLog, BOOTLOG_RENDER_DELAY);
    this.renderer.render(breakEl);
    this.renderer.render(ascii);
    this.renderer.render([inputLine.getLine()]);

    inputLine.getInput().focus();
  }

  private execClear() {
    this.renderer.clearScreen();
  }

  private execNotFound() {
    const notFound = this.builder.getNotFound("command");
    this.renderer.render(notFound);
  }

  private execHelp() {
    const help = this.builder.getHelp();
    this.renderer.render(help);
  }

  private execCommands() {
    const commands = this.builder.getCommands();
    this.renderer.render(commands);
  }

  private async execExit() {
    const exit = this.builder.getExit();
    this.renderer.renderWithDelay(exit, 8)

    await sleep(SHUTDOWN_BUFFER_DELAY);
    window.open("", "_self")!.close();
  }
}
