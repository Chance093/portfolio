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
}
