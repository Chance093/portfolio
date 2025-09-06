import { Command } from "./commands";
import { ScreenRenderer } from "./screenRenderer";
class Terminal {
    screenRenderer;
    command;
    constructor() {
        const window = document.getElementById("terminalWindow");
        if (!window)
            throw new Error("no window");
        this.screenRenderer = new ScreenRenderer(window);
        this.command = new Command(window);
    }
    async boot() {
        await this.screenRenderer.boot(this.command);
    }
}
async function renderTerminal() {
    const terminal = new Terminal();
    await terminal.boot();
}
renderTerminal();
