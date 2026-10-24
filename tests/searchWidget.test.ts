import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { DEFAULT_SETTINGS } from '../src/core/models/Settings';
import { type ISearchProvider } from '../src/core/ports/ISearchProvider';
import { SearchWidget } from '../src/ui/components/SearchWidget';

class MockNode {
  public tagName: string;
  public className: string = '';
  public textContent: string = '';
  public hidden: boolean = false;
  public value: string = '';
  public attributes: Record<string, string> = {};
  public children: MockNode[] = [];
  public listeners: Record<string, Function[]> = {};

  constructor(tagName: string) {
    this.tagName = tagName;
  }

  public setAttribute(name: string, val: string): void {
    this.attributes[name] = val;
  }

  public appendChild(child: MockNode): MockNode {
    this.children.push(child);
    return child;
  }

  public addEventListener(event: string, fn: Function): void {
    this.listeners[event] = this.listeners[event] || [];
    this.listeners[event]!.push(fn);
  }

  public focus(): void {}
  public select(): void {}
  public blur(): void {}

  public querySelector(selector: string): MockNode | null {
    if (selector === 'input') {
      const findInput = (node: MockNode): MockNode | null => {
        if (node.tagName === 'input') return node;
        for (const c of node.children) {
          const res = findInput(c);
          if (res) return res;
        }
        return null;
      };
      return findInput(this);
    }
    return null;
  }
}

describe('SearchWidget', () => {
  const originalDocument = globalThis.document;
  const mockSearchProvider: ISearchProvider = {
    search: vi.fn(),
  };

  beforeEach(() => {
    globalThis.document = {
      createElement: (tag: string) =>
        new MockNode(tag) as unknown as HTMLElement,
      createElementNS: (_ns: string, tag: string) =>
        new MockNode(tag) as unknown as SVGSVGElement,
      addEventListener: vi.fn(),
    } as unknown as Document;
  });

  afterEach(() => {
    globalThis.document = originalDocument;
  });

  it('renders visible search bar when showSearch is true', () => {
    const widget = new SearchWidget(mockSearchProvider, {
      ...DEFAULT_SETTINGS,
      showSearch: true,
    });
    const el = widget.getElement();
    expect(el.hidden).toBe(false);
  });

  it('hides search bar when showSearch is false', () => {
    const widget = new SearchWidget(mockSearchProvider, {
      ...DEFAULT_SETTINGS,
      showSearch: false,
    });
    const el = widget.getElement();
    expect(el.hidden).toBe(true);
  });

  it('focuses input element when focus is called on visible widget', () => {
    const widget = new SearchWidget(mockSearchProvider, {
      ...DEFAULT_SETTINGS,
      showSearch: true,
    });
    const el = widget.getElement();
    const input = el.querySelector('input');
    const focusSpy = vi.spyOn(input!, 'focus');

    widget.focus();
    expect(focusSpy).toHaveBeenCalledTimes(1);
  });

  it('does not focus input when widget is hidden', () => {
    const widget = new SearchWidget(mockSearchProvider, {
      ...DEFAULT_SETTINGS,
      showSearch: false,
    });
    const el = widget.getElement();
    const input = el.querySelector('input');
    const focusSpy = vi.spyOn(input!, 'focus');

    widget.focus();
    expect(focusSpy).not.toHaveBeenCalled();
  });

  it('updates visibility dynamically when settings change', () => {
    const widget = new SearchWidget(mockSearchProvider, {
      ...DEFAULT_SETTINGS,
      showSearch: true,
    });
    expect(widget.getElement().hidden).toBe(false);

    widget.updateSettings({
      ...DEFAULT_SETTINGS,
      showSearch: false,
    });
    expect(widget.getElement().hidden).toBe(true);

    widget.updateSettings({
      ...DEFAULT_SETTINGS,
      showSearch: true,
    });
    expect(widget.getElement().hidden).toBe(false);
  });
});
