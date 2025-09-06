export class Terminal {
    container;
    constructor(containerId) {
        const el = document.getElementById(containerId);
        if (!el)
            throw new Error(`No element with id: ${containerId}`);
        this.container = el;
    }
}
