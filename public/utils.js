export function createElement(el, classes, text) {
    const element = document.createElement(el);
    if (classes.length > 0) {
        element.classList.add(...classes);
    }
    if (text) {
        element.textContent = text;
    }
    return element;
}
export function sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}
