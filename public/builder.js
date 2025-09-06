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
    getInputLine() {
        const line = createElement("div", ["inputLine"]);
        const prompt = createElement("p", ["user"], "[portfolio@chance ~]$ ");
        const input = createElement("input", ["input"]);
        input.type = "text";
        line.append(prompt, input);
        return [line, input];
    }
}
