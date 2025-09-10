import { COMMAND_BUFFER_DELAY } from "./constants";
import { ascii, bootLog, commandsDescList, helpCommandList, shutdownLog } from "./content";
import { createElement, sleep } from "./utils";
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
    getInputLine(renderer, handlers) {
        return new InputLine(renderer, handlers);
    }
    getNotFound(command) {
        const p = createElement("p", ["output"], `${command}: command not found`);
        return [p];
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
        const exitEls = [];
        for (const log of shutdownLog) {
            const pre = createElement("pre", ["intro"], log);
            exitEls.push(pre);
        }
        return exitEls;
    }
}
class InputLine {
    renderer;
    handlers;
    currentInput;
    line;
    static inputHistory = [];
    static inputHistoryIdx = 0;
    constructor(renderer, handlers) {
        this.renderer = renderer;
        this.handlers = handlers;
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
            if (InputLine.inputHistoryIdx <= 0) {
                this.currentInput.value = InputLine.inputHistory[0] ?? "";
                return;
            }
            InputLine.inputHistoryIdx -= 1;
        }
        else if (e.key === "ArrowDown") {
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
    async executeCommand(e) {
        e.preventDefault();
        await sleep(COMMAND_BUFFER_DELAY);
        const command = this.getCommand();
        if (command === "")
            return;
        const handler = this.handlers[command] ?? this.handlers["execNotFound"];
        await handler();
        if (this.currentInput)
            this.currentInput.disabled = true;
        InputLine.addToInputHistory(command);
    }
    createNewInput() {
        const newInput = new InputLine(this.renderer, this.handlers);
        this.renderer.render([newInput.getLine()]);
        this.currentInput.disabled = true;
        newInput.getInput().focus();
    }
    getCommand() {
        const cmdLine = this.currentInput.value.trim();
        const commands = cmdLine.split(" ");
        return commands[0];
    }
    static addToInputHistory(command) {
        this.inputHistory.push(command);
        this.inputHistoryIdx = InputLine.inputHistory.length;
    }
}
