export type WallpaperSourceMode = 'both' | 'custom-only' | 'builtin-only';

export interface BraveWallpaper {
  readonly id: string;
  readonly filename: string;
  readonly author: string;
  readonly creditUrl: string;
  readonly isCustom?: boolean;
}

export const BRAVE_WALLPAPERS: readonly BraveWallpaper[] = [
  {
    id: 'ntp-2026-Q4-1',
    filename: './wallpapers/pascal-debrunner.jpg',
    author: 'Pascal Debrunner',
    creditUrl:
      'https://unsplash.com/photos/rugged-mountain-peaks-and-grassy-ridges-at-dawn-Z2720kCJg6I',
  },
  {
    id: 'ntp-2026-Q4-2',
    filename: './wallpapers/rafael-peier2.jpg',
    author: 'Rafael Peier',
    creditUrl:
      'https://unsplash.com/photos/sand-dunes-with-long-shadows-dESI6T4gaN4',
  },
  {
    id: 'ntp-2026-Q4-3',
    filename: './wallpapers/david-becker.jpg',
    author: 'David Becker',
    creditUrl:
      'https://unsplash.com/photos/vibrant-sunset-illuminates-ocean-waves-crashing-on-a-rocky-shore--ZQfwGY-RAo',
  },
  {
    id: 'ntp-2026-Q4-4',
    filename: './wallpapers/hunter-newton.jpg',
    author: 'Hunter Newton',
    creditUrl:
      'https://unsplash.com/photos/waterfall-and-rocky-stream-flow-through-a-lush-dark-forest-TWrKDYt-vVM',
  },
  {
    id: 'ntp-2026-Q4-5',
    filename: './wallpapers/andrew-svk.jpg',
    author: 'Andrew Svk',
    creditUrl:
      'https://unsplash.com/photos/a-mountain-range-with-a-pink-sky-in-the-background-150fZ07GQqs',
  },
  {
    id: 'ntp-2026-Q4-6',
    filename: './wallpapers/daniel-schwarz.jpg',
    author: 'Daniel Schwarz',
    creditUrl:
      'https://unsplash.com/photos/lake-surrounded-by-forested-mountains-under-a-blue-sky-ZeGQ22v9Zhk',
  },
  {
    id: 'ntp-2026-Q4-7',
    filename: './wallpapers/gabriele-merlino.jpg',
    author: 'Gabriele Merlino',
    creditUrl:
      'https://unsplash.com/photos/rowboats-on-clear-turquoise-water-fa5so58oDAI',
  },
  {
    id: 'ntp-2026-Q4-8',
    filename: './wallpapers/freestocks.jpg',
    author: 'Freestocks',
    creditUrl:
      'https://unsplash.com/photos/green-field-plains-under-cloudy-sky-Gqc1jl2kd1U',
  },
  {
    id: 'ntp-2026-Q4-9',
    filename: './wallpapers/ken-cheung.jpg',
    author: 'Ken Cheung',
    creditUrl:
      'https://unsplash.com/photos/a-view-of-a-mountain-range-at-sunset-75xPHEQBmvA',
  },
  {
    id: 'ntp-2026-Q4-10',
    filename: './wallpapers/cliford-mervil.jpg',
    author: 'Cliford Mervil',
    creditUrl:
      'https://unsplash.com/photos/scenic-view-of-snow-covered-mountains-under-cloudy-sky-XcfDcf5eT3k',
  },
  {
    id: 'ntp-2026-Q4-11',
    filename: './wallpapers/alex-azabache.jpg',
    author: 'Alex Azabache',
    creditUrl:
      'https://unsplash.com/photos/silhouette-of-palm-tree-near-body-of-water-during-sunset-V53o45uvZTA',
  },
  {
    id: 'ntp-2026-Q4-12',
    filename: './wallpapers/eberhard-grossgasteiger.jpg',
    author: 'Eberhard Grossgasteiger',
    creditUrl:
      'https://unsplash.com/photos/landscape-photography-of-high-rise-mountains-pBgnT4kh8d4',
  },
  {
    id: 'ntp-2026-Q4-13',
    filename: './wallpapers/luca-bravo.jpg',
    author: 'Luca Bravo',
    creditUrl:
      'https://unsplash.com/photos/aerial-photography-of-mountain-range-ESkw2ayO2As',
  },
  {
    id: 'ntp-2026-Q4-14',
    filename: './wallpapers/marek-piwnicki.jpg',
    author: 'Marek Piwnicki',
    creditUrl:
      'https://unsplash.com/photos/brown-rock-formation-under-blue-sky-during-daytime-r3i7H_2zKSo',
  },
  {
    id: 'ntp-2026-Q4-15',
    filename: './wallpapers/bailey-zindel.jpg',
    author: 'Bailey Zindel',
    creditUrl:
      'https://unsplash.com/photos/body-of-water-surrounded-by-trees-NRQV-hBF10M',
  },
  {
    id: 'ntp-2026-Q4-16',
    filename: './wallpapers/kalen-emsley.jpg',
    author: 'Kalen Emsley',
    creditUrl:
      'https://unsplash.com/photos/green-pine-trees-near-mountain-under-white-clouds-Bkci_8qcdvQ',
  },
  {
    id: 'ntp-2026-Q4-17',
    filename: './wallpapers/fabio-comparelli.jpg',
    author: 'Fabio Comparelli',
    creditUrl:
      'https://unsplash.com/photos/snow-covered-mountain-under-blue-sky-during-daytime-uq2E2V4LNc4',
  },
  {
    id: 'ntp-2026-Q4-18',
    filename: './wallpapers/vincentiu-solomon.jpg',
    author: 'Vincentiu Solomon',
    creditUrl:
      'https://unsplash.com/photos/silhouette-of-mountain-under-milky-way-ln5drpv_ImI',
  },
  {
    id: 'ntp-2026-Q4-19',
    filename: './wallpapers/tim-mossholder.jpg',
    author: 'Tim Mossholder',
    creditUrl:
      'https://unsplash.com/photos/green-trees-near-mountain-under-white-clouds-during-daytime-HhyB3Pq-t_4',
  },
  {
    id: 'ntp-2026-Q4-20',
    filename: './wallpapers/damon-on-road.jpg',
    author: 'Damon On Road',
    creditUrl:
      'https://unsplash.com/photos/gray-rock-formation-under-cloudy-sky-during-daytime-q7rV8m2v5fE',
  },
  {
    id: 'ntp-2026-Q4-21',
    filename: './wallpapers/simon-berger.jpg',
    author: 'Simon Berger',
    creditUrl:
      'https://unsplash.com/photos/landscape-photography-of-mountains-and-lake-twukN12EN7c',
  },
  {
    id: 'ntp-2026-Q4-22',
    filename: './wallpapers/samuel-ferrara.jpg',
    author: 'Samuel Ferrara',
    creditUrl:
      'https://unsplash.com/photos/body-of-water-surrounded-by-green-grass-covered-mountains-under-white-clouds-during-daytime-1527pjeb6jg',
  },
  {
    id: 'ntp-2026-Q4-23',
    filename: './wallpapers/benjamin-voros.jpg',
    author: 'Benjamin Voros',
    creditUrl:
      'https://unsplash.com/photos/snow-covered-mountain-phIFdC6lA4E',
  },
  {
    id: 'ntp-2026-Q4-24',
    filename: './wallpapers/matthew-smith.jpg',
    author: 'Matthew Smith',
    creditUrl:
      'https://unsplash.com/photos/body-of-water-between-green-mountains-under-blue-sky-during-daytime-R3LcfTvcGWY',
  },
  {
    id: 'ntp-2026-Q4-25',
    filename: './wallpapers/roberto-nickson.jpg',
    author: 'Roberto Nickson',
    creditUrl:
      'https://unsplash.com/photos/snow-covered-mountain-under-starry-night-emitzhhjt_4',
  },
  {
    id: 'ntp-2026-Q4-26',
    filename: './wallpapers/alessio-soggetti.jpg',
    author: 'Alessio Soggetti',
    creditUrl:
      'https://unsplash.com/photos/mountains-covered-with-snow-under-blue-sky-at-daytime-8-5k_o-Z_hI',
  },
  {
    id: 'ntp-2026-Q4-27',
    filename: './wallpapers/luca-micheli.jpg',
    author: 'Luca Micheli',
    creditUrl:
      'https://unsplash.com/photos/landscape-photography-of-trees-and-mountains-ruWwipn22z8',
  },
  {
    id: 'ntp-2026-Q4-28',
    filename: './wallpapers/pietro-de-grandi.jpg',
    author: 'Pietro De Grandi',
    creditUrl:
      'https://unsplash.com/photos/body-of-water-near-mountains-T7K4aEPoGGk',
  },
  {
    id: 'ntp-2026-Q4-29',
    filename: './wallpapers/john-towner.jpg',
    author: 'John Towner',
    creditUrl:
      'https://unsplash.com/photos/snowy-mountain-3wylDrjxH-E',
  },
  {
    id: 'ntp-2026-Q4-30',
    filename: './wallpapers/dan-meyers.jpg',
    author: 'Dan Meyers',
    creditUrl:
      'https://unsplash.com/photos/brown-rock-formation-surrounded-by-body-of-water-under-blue-sky-during-daytime-08hguhv4aP0',
  },
  {
    id: 'ntp-2026-Q4-31',
    filename: './wallpapers/jerry-zhang.jpg',
    author: 'Jerry Zhang',
    creditUrl:
      'https://unsplash.com/photos/mountain-covered-with-snow-under-blue-sky-during-daytime-ePpaQC2c10Q',
  },
  {
    id: 'ntp-2026-Q4-32',
    filename: './wallpapers/karl-anderson.jpg',
    author: 'Karl Anderson',
    creditUrl:
      'https://unsplash.com/photos/bird-eye-view-photography-of-trees-under-clouds-3P3NHlzGCp8',
  },
  {
    id: 'ntp-2026-Q4-33',
    filename: './wallpapers/alberto-restifo.jpg',
    author: 'Alberto Restifo',
    creditUrl:
      'https://unsplash.com/photos/rocky-mountain-under-white-clouds-during-daytime-cA2e0AQrycw',
  },
  {
    id: 'ntp-2026-Q4-34',
    filename: './wallpapers/casey-horner.jpg',
    author: 'Casey Horner',
    creditUrl:
      'https://unsplash.com/photos/green-trees-near-snow-covered-mountain-during-night-time-RmoWqDCqN2E',
  },
  {
    id: 'ntp-2026-Q4-35',
    filename: './wallpapers/dave-hoefler.jpg',
    author: 'Dave Hoefler',
    creditUrl:
      'https://unsplash.com/photos/foggy-mountain-summit-surrounded-by-clouds-okV5doZ4LzM',
  },
  {
    id: 'ntp-2026-Q4-36',
    filename: './wallpapers/joshua-sortino.jpg',
    author: 'Joshua Sortino',
    creditUrl:
      'https://unsplash.com/photos/silhouette-of-mountains-during-sunset-LvxCdbDb_vg',
  },
  {
    id: 'ntp-2026-Q4-37',
    filename: './wallpapers/kristopher-roller.jpg',
    author: 'Kristopher Roller',
    creditUrl:
      'https://unsplash.com/photos/milky-way-over-the-mountain-zepnJQycr4U',
  },
  {
    id: 'ntp-2026-Q4-38',
    filename: './wallpapers/neom.jpg',
    author: 'NEOM',
    creditUrl:
      'https://unsplash.com/photos/a-large-rock-formation-in-the-middle-of-a-desert-mI6s4tF04bU',
  },
  {
    id: 'ntp-2026-Q4-39',
    filename: './wallpapers/hendrik-cornelissen.jpg',
    author: 'Hendrik Cornelissen',
    creditUrl:
      'https://unsplash.com/photos/aerial-photography-of-mountain-with-snow-covered-during-daytime-jpTfZio6My4',
  },
  {
    id: 'ntp-2026-Q4-40',
    filename: './wallpapers/pedro-gomes.jpg',
    author: 'Pedro Gomes',
    creditUrl: 'https://unsplash.com/@mgomespedro',
  },
] as const;

export function buildWallpaperPool(
  mode: WallpaperSourceMode,
  customWallpapers: readonly BraveWallpaper[]
): readonly BraveWallpaper[] {
  if (mode === 'custom-only') {
    return customWallpapers;
  }
  if (mode === 'builtin-only') {
    return BRAVE_WALLPAPERS;
  }
  return [...customWallpapers, ...BRAVE_WALLPAPERS];
}

export function pickNextWallpaperFromPool(
  pool: readonly BraveWallpaper[],
  currentIndex?: number
): {
  readonly wallpaper: BraveWallpaper | null;
  readonly index: number;
} {
  const count = pool.length;
  if (count === 0) {
    return { wallpaper: null, index: 0 };
  }
  const nextIndex =
    typeof currentIndex === 'number'
      ? (currentIndex + 1) % count
      : Math.floor(Math.random() * count);

  return {
    wallpaper: pool[nextIndex] ?? pool[0] ?? null,
    index: nextIndex,
  };
}
