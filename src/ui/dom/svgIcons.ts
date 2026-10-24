import { type WeatherIconKind } from '../../core/models/Weather';

const SVG_NS = 'http://www.w3.org/2000/svg';

function createSvgRoot(size: number, className?: string): SVGSVGElement {
  const svg = document.createElementNS(SVG_NS, 'svg');
  svg.setAttribute('viewBox', '0 0 24 24');
  svg.setAttribute('width', `${size}`);
  svg.setAttribute('height', `${size}`);
  svg.setAttribute('fill', 'none');
  svg.setAttribute('stroke', 'currentColor');
  svg.setAttribute('stroke-width', '1.8');
  svg.setAttribute('stroke-linecap', 'round');
  svg.setAttribute('stroke-linejoin', 'round');
  svg.setAttribute('aria-hidden', 'true');
  if (className) {
    svg.setAttribute('class', className);
  }
  return svg;
}

function appendPath(svg: SVGSVGElement, d: string): void {
  const path = document.createElementNS(SVG_NS, 'path');
  path.setAttribute('d', d);
  svg.appendChild(path);
}

function appendCircle(
  svg: SVGSVGElement,
  cx: string,
  cy: string,
  r: string
): void {
  const circle = document.createElementNS(SVG_NS, 'circle');
  circle.setAttribute('cx', cx);
  circle.setAttribute('cy', cy);
  circle.setAttribute('r', r);
  svg.appendChild(circle);
}

export function createWeatherIconSvg(
  kind: WeatherIconKind,
  size: number = 28
): SVGSVGElement {
  const svg = createSvgRoot(size, `weather-icon weather-icon--${kind}`);

  switch (kind) {
    case 'clear-day':
      appendCircle(svg, '12', '12', '4');
      appendPath(
        svg,
        'M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41'
      );
      break;
    case 'clear-night':
      appendPath(svg, 'M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z');
      break;
    case 'partly-cloudy':
      appendPath(svg, 'M12 2v2M4.93 4.93l1.41 1.41M20 12h2M17.66 6.34l1.41-1.41');
      appendPath(svg, 'M8 13a4 4 0 0 1 6.7-2.9');
      appendPath(svg, 'M17.5 19H9a5 5 0 1 1 1.8-9.66A4.5 4.5 0 1 1 17.5 19Z');
      break;
    case 'cloudy':
      appendPath(svg, 'M17.5 19H9a6 6 0 1 1 1.8-11.72A5 5 0 1 1 17.5 19Z');
      break;
    case 'fog':
      appendPath(svg, 'M4 14h16M4 18h12M6 10h14');
      break;
    case 'drizzle':
      appendPath(svg, 'M17.5 15H9a5 5 0 1 1 1.8-9.66A4.5 4.5 0 1 1 17.5 15Z');
      appendPath(svg, 'M8 19v2M12 18v2M16 19v2');
      break;
    case 'rain':
      appendPath(svg, 'M17.5 15H9a5 5 0 1 1 1.8-9.66A4.5 4.5 0 1 1 17.5 15Z');
      appendPath(svg, 'M8 18l-1 3M12 18l-1 3M16 18l-1 3');
      break;
    case 'snow':
      appendPath(svg, 'M17.5 15H9a5 5 0 1 1 1.8-9.66A4.5 4.5 0 1 1 17.5 15Z');
      appendPath(svg, 'M8 19h.01M12 18h.01M16 19h.01M10 21h.01M14 21h.01');
      break;
    case 'thunderstorm':
      appendPath(svg, 'M17.5 15H9a5 5 0 1 1 1.8-9.66A4.5 4.5 0 1 1 17.5 15Z');
      appendPath(svg, 'M13 15l-2 4h3l-2 4');
      break;
  }

  return svg;
}

export type UiIconKind =
  | 'location'
  | 'refresh'
  | 'settings'
  | 'close'
  | 'search'
  | 'arrow-right'
  | 'plus'
  | 'sunrise'
  | 'sunset';

export function createUiIconSvg(
  kind: UiIconKind,
  size: number = 18
): SVGSVGElement {
  const svg = createSvgRoot(size, `ui-icon ui-icon--${kind}`);

  switch (kind) {
    case 'location':
      appendPath(svg, 'M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z');
      appendCircle(svg, '12', '10', '3');
      break;
    case 'refresh':
      appendPath(svg, 'M21 12a9 9 0 1 1-2.64-6.36L21 8');
      appendPath(svg, 'M21 3v5h-5');
      break;
    case 'settings':
      appendCircle(svg, '12', '12', '3');
      appendPath(
        svg,
        'M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z'
      );
      break;
    case 'close':
      appendPath(svg, 'M18 6 6 18M6 6l12 12');
      break;
    case 'search':
      appendCircle(svg, '11', '11', '7');
      appendPath(svg, 'm20 20-3.85-3.85');
      break;
    case 'arrow-right':
      appendPath(svg, 'M5 12h14M13 6l6 6-6 6');
      break;
    case 'plus':
      appendPath(svg, 'M12 5v14M5 12h14');
      break;
    case 'sunrise':
      appendPath(svg, 'M12 2v6M9 5l3-3 3 3M4 18h16M6 22h12');
      appendPath(svg, 'M8 18a4 4 0 0 1 8 0');
      break;
    case 'sunset':
      appendPath(svg, 'M12 2v6M9 5l3 3 3-3M4 18h16M6 22h12');
      appendPath(svg, 'M8 18a4 4 0 0 1 8 0');
      break;
  }

  return svg;
}
