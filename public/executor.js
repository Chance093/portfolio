import { Renderer } from "./renderer";
import { Builder } from "./builder";
import { BOOTLOG_DELAY_FLAGS, BOOTLOG_RENDER_DELAY, SHUTDOWN_BUFFER_DELAY, SHUTDOWN_DELAY_FLAGS, SHUTDOWN_RENDER_DELAY } from "./constants";
import { sleep } from "./utils";
export class Executor {
    builder;
    renderer;
    handlers;
    constructor(container) {
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
        await this.renderer.renderWithScatteredDelay(bootLog, BOOTLOG_RENDER_DELAY, BOOTLOG_DELAY_FLAGS);
        this.renderer.render(breakEl);
        this.renderer.render(ascii);
        this.renderer.render([inputLine.getLine()]);
        inputLine.getInput().focus();
    }
    execClear() {
        this.renderer.clearScreen();
    }
    execNotFound() {
        const notFound = this.builder.getNotFound("command");
        this.renderer.render(notFound);
    }
    execHelp() {
        const help = this.builder.getHelp();
        this.renderer.render(help);
    }
    execCommands() {
        const commands = this.builder.getCommands();
        this.renderer.render(commands);
    }
    async execExit() {
        const exit = this.builder.getExit();
        await this.renderer.renderWithScatteredDelay(exit, SHUTDOWN_RENDER_DELAY, SHUTDOWN_DELAY_FLAGS);
        await sleep(SHUTDOWN_BUFFER_DELAY);
        window.open("", "_self").close();
    }
}
