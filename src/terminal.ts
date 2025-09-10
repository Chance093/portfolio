export class Terminal {
  readonly container: HTMLElement;

  constructor(containerId: string) {
    const el = document.getElementById(containerId);
    if (!el) throw new Error(`No element with id: ${containerId}`);
    this.container = el;
  }
}
