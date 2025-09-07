import { ascii, bootLog } from "./content";
import { createElement } from "./utils";
export class Builder {
    getBootLog() {
        const bootlogEls = [];
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
        const asciiEls = [];
        for (const asc of ascii) {
            const el = createElement("pre", [], asc);
            asciiEls.push(el);
        }
        return asciiEls;
    }
    getInputLine(renderer) {
        return new InputLine(renderer);
    }
}
class InputLine {
    renderer;
    currentInput;
    line;
    constructor(renderer) {
        this.renderer = renderer;
        const prompt = createElement("p", ["user"], "[portfolio@chance ~]$ ");
        this.line = createElement("div", ["inputLine"]);
        this.currentInput = createElement("input", ["input"]);
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
    async onInputKeydown(e) {
        if (e.key === "ArrowUp" || e.key === "ArrowDown") {
            this.getPastInput(e);
            return;
        }
        else if (e.key === "Enter") {
            await this.executeCommand(e);
            this.createNewInput();
        }
    }
    getPastInput(e) {
        if (e.key === "ArrowUp") {
            console.log("up");
        }
        else if (e.key === "ArrowDown") {
            console.log("down");
        }
    }
    async executeCommand(e) {
        e.preventDefault();
        if (this.currentInput.value === "")
            return;
        console.log("executing command:", this.currentInput.value);
    }
    createNewInput() {
        const newInput = new InputLine(this.renderer);
        this.renderer.render([newInput.getLine()]);
        this.currentInput.disabled = true;
        newInput.getInput().focus();
    }
}
