export interface ElementOptions {
  readonly className?: string;
  readonly textContent?: string;
  readonly attrs?: Readonly<Record<string, string>>;
}

export function createEl<K extends keyof HTMLElementTagNameMap>(
  tag: K,
  options: ElementOptions = {},
  children: readonly Node[] = []
): HTMLElementTagNameMap[K] {
  const element = document.createElement(tag);
  if (options.className) {
    element.className = options.className;
  }
  if (options.textContent !== undefined) {
    element.textContent = options.textContent;
  }
  if (options.attrs) {
    for (const [key, val] of Object.entries(options.attrs)) {
      element.setAttribute(key, val);
    }
  }
  for (const child of children) {
    element.appendChild(child);
  }
  return element;
}

export function clearChildren(element: Element): void {
  while (element.firstChild) {
    element.removeChild(element.firstChild);
  }
}
