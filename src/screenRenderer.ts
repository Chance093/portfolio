import { Command } from "./commands";
import { BOOTLOG_RENDER_DELAY, INITIAL_BUFFER_DELAY } from "./constants";
import { ascii, bootLog } from "./content";
import { createElement, sleep } from "./utils";

export class ScreenRenderer {
  private window: HTMLElement;
  private bootDelay: number;

  constructor(window: HTMLElement) {
    this.window = window;
    this.bootDelay = BOOTLOG_RENDER_DELAY;
  }

  private renderAscii() {
    for (const line of ascii) {
      const pre = createElement("pre", [], line);
      this.window.appendChild(pre);
      this.window.scrollTop = this.window.scrollHeight;
    }
  }

  async boot(command: Command) {
    // add tiny sleep to prevent loading before browser load
    await sleep(INITIAL_BUFFER_DELAY);

    // load in all the bootlog info
    await this.renderBootlog();

    // create break between bootlog and ascii
    this.window.appendChild(createElement("br", []));

    // load in ascii picture
    this.renderAscii();

    // render first input line
    this.renderInputLine(command);
  }

  private computeDelay(log: string) {
    if (
      ["Loading drivers", "Mounting virtual", "Starting system"].some((tag) =>
        log.includes(tag),
      )
    ) {
      this.bootDelay *= 8;
    }
    if (
      ["Starting udev", "devpts", "Cleaning up"].some((tag) =>
        log.includes(tag),
      )
    ) {
      this.bootDelay /= 8;
    }
  }

  private async renderBootlog() {
    for (const log of bootLog) {
      this.computeDelay(log);
      await sleep(this.bootDelay);

      const pre = createElement("pre", ["intro"], log);
      this.window.appendChild(pre);
      this.window.scrollTop = this.window.scrollHeight;
    }
  }

  private renderInputLine(command: Command) {
    // create input line elements
    const line = createElement("div", ["inputLine"]);
    const prompt = createElement("p", ["user"], "[portfolio@chance ~]$ ");
    const input = createElement("input", ["input"]) as HTMLInputElement;
    input.type = "text";

    input.addEventListener("keydown", async (e) => {
      if (e.key === "ArrowUp" || e.key === "ArrowDown") {
        command.getPastInput(e);
        return;
      }

      if (e.key !== "Enter") return;
      await command.execute(e);
      this.renderInputLine(command);
    });

    line.append(prompt, input);
    this.window.appendChild(line);
    input.focus();
    command.setCurrentInput(input);
  }
}
