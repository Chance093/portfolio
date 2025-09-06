import { sleep } from "./utils";
export class Renderer {
    container;
    constructor(container) {
        this.container = container;
    }
    render(elements) {
        for (const el of elements) {
            this.container.appendChild(el);
            this.container.scrollTop = this.container.scrollHeight;
        }
    }
    async renderWithDelay(elements, delay) {
        for (const el of elements) {
            await sleep(delay);
            this.container.appendChild(el);
            this.container.scrollTop = this.container.scrollHeight;
        }
    }
}
