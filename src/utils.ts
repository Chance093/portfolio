export function createElement(el: string, classes: string[], text?: string) {
  const element = document.createElement(el);

  if (classes.length > 0) {
    element.classList.add(...classes);
  }

  if (text) {
    element.textContent = text;
  }

  return element;
}

export function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
