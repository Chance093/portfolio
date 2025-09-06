import { ascii, bootLog } from "./content";
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

  getInputLine() {
    const line = createElement("div", ["inputLine"]);
    const prompt = createElement("p", ["user"], "[portfolio@chance ~]$ ");
    const input = createElement("input", ["input"]) as HTMLInputElement;
    input.type = "text";

    line.append(prompt, input);

    return [line, input] as const;
  }
}
