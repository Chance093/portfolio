import { ascii, bootLog, commandsDescList, helpCommandList, shutdownLog } from "./content";
import type { Handlers } from "./definitions";
import { InputLine } from "./inputLine";
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

  getInputLine(renderer: Renderer, handlers: Handlers) {
    return new InputLine(renderer, handlers);
  }

  getNotFound(command: string) {
    const p = createElement(
      "p",
      ["output"],
      `${command}: command not found`,
    );

    return [p]
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
    const exitEls: HTMLElement[] = [];

    for (const log of shutdownLog) {
      const pre = createElement("pre", ["intro"], log);
      exitEls.push(pre);
    }

    return exitEls;
  }
}
