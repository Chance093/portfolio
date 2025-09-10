import type { DelayFlags } from "./definitions";
import { sleep } from "./utils";

export class Renderer {
  constructor(private container: HTMLElement) { }

  render(elements: HTMLElement[]) {
    for (const el of elements) {
      this.container.appendChild(el);
      this.container.scrollTop = this.container.scrollHeight;
    }
  }

  async renderWithDelay(elements: HTMLElement[], delay: number) {
    for (const el of elements) {
      await sleep(delay)
      this.container.appendChild(el);
      this.container.scrollTop = this.container.scrollHeight;
    }
  }

  async renderWithScatteredDelay(elements: HTMLElement[], delay: number, flags: DelayFlags) {
    for (const el of elements) {
      if (flags.slow.some((tag) => el.innerText.includes(tag))) {
        delay *= 8;
      }

      if (flags.fast.some((tag) => el.innerText.includes(tag))) {
        delay /= 8;
      }

      this.container.appendChild(el);
      this.container.scrollTop = this.container.scrollHeight;
      await sleep(delay);
    }
  }

  clearScreen() {
    while (this.container.firstChild) {
      this.container.removeChild(this.container.firstChild);
    }
  }
}
