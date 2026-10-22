export type ThemeId =
  | 'brave-dark'
  | 'midnight-oled'
  | 'nordic-frost'
  | 'solar-warm'
  | 'clean-light'
  | 'auto-system';

export interface ThemeMeta {
  readonly id: ThemeId;
  readonly label: string;
  readonly description: string;
  readonly previewBg: string;
  readonly previewAccent: string;
}

export const THEME_REGISTRY: readonly ThemeMeta[] = [
  {
    id: 'brave-dark',
    label: 'Brave Dark',
    description: 'Deep carbon slate inspired by Brave UI',
    previewBg: '#121318',
    previewAccent: '#ff5500',
  },
  {
    id: 'midnight-oled',
    label: 'Midnight OLED',
    description: 'True black background for zero-glow OLED displays',
    previewBg: '#000000',
    previewAccent: '#38bdf8',
  },
  {
    id: 'nordic-frost',
    label: 'Nordic Frost',
    description: 'Calm arctic slate palette with soft cyan accents',
    previewBg: '#2e3440',
    previewAccent: '#88c0d0',
  },
  {
    id: 'solar-warm',
    label: 'Solar Warm',
    description: 'Low-glare warm paper palette for comfortable daylight',
    previewBg: '#f6f1e7',
    previewAccent: '#d97706',
  },
  {
    id: 'clean-light',
    label: 'Clean Light',
    description: 'Crisp high-contrast minimalist daylight theme',
    previewBg: '#f8fafc',
    previewAccent: '#2563eb',
  },
  {
    id: 'auto-system',
    label: 'Auto System',
    description: 'Follows your OS dark/light preference automatically',
    previewBg: '#1e293b',
    previewAccent: '#8b5cf6',
  },
] as const;

export function isValidThemeId(value: unknown): value is ThemeId {
  return (
    typeof value === 'string' &&
    THEME_REGISTRY.some((theme) => theme.id === value)
  );
}
