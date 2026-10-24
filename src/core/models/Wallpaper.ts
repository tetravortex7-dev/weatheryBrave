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
      'https://unsplash.com/photos/a-sandbar-snakes-through-the-turquoise-ocean-water-gzMBvmSl95U',
  },
  {
    id: 'ntp-2026-Q4-10',
    filename: './wallpapers/kristaps-ungurs.jpg',
    author: 'Kristaps Ungurs',
    creditUrl:
      'https://unsplash.com/photos/dark-lake-surrounded-by-vibrant-green-forest-aerial-view-bVy49uEJbpw',
  },
  {
    id: 'ntp-2026-Q4-11',
    filename: './wallpapers/john-murphey.jpg',
    author: 'John Murphey',
    creditUrl:
      'https://unsplash.com/photos/the-sun-is-setting-over-the-sand-dunes-Mag-3qz3gko',
  },
  {
    id: 'ntp-2026-Q4-12',
    filename: './wallpapers/fudo-jahic.jpg',
    author: 'Fudo Jahic',
    creditUrl:
      'https://unsplash.com/photos/brown-rock-formation-under-blue-sky-during-daytime-PQf2Vv7xWjo',
  },
  {
    id: 'ntp-2026-Q4-13',
    filename: './wallpapers/benjamin-hibbert.jpg',
    author: 'Benjamin Hibbert',
    creditUrl:
      'https://unsplash.com/photos/rugged-coastal-rock-formations-with-waves-crashing-4IH2rRlCnKs',
  },
  {
    id: 'ntp-2026-Q4-14',
    filename: './wallpapers/juho-luomala.jpg',
    author: 'Juho Luomala',
    creditUrl:
      'https://unsplash.com/photos/aurora-borealis-over-a-snowy-forest-road-pzBTqFBmEJc',
  },
  {
    id: 'ntp-2026-Q4-15',
    filename: './wallpapers/pascal-debrunner2.jpg',
    author: 'Pascal Debrunner',
    creditUrl:
      'https://unsplash.com/photos/wildflowers-by-glacial-mountain-lake-d7Bvh_2cFnA',
  },
  {
    id: 'ntp-2026-Q4-16',
    filename: './wallpapers/fer-troulik.jpg',
    author: 'Fer Troulik',
    creditUrl:
      'https://unsplash.com/photos/modern-building-facade-with-vertical-fins-and-a-glass-walkway-4Pf98CHLUzg',
  },
  {
    id: 'ntp-2026-Q4-17',
    filename: './wallpapers/mike-hindle.jpg',
    author: 'Mike Hindle',
    creditUrl:
      'https://unsplash.com/photos/a-black-and-white-photo-of-a-spiral-staircase-tjafmz6trWg',
  },
  {
    id: 'ntp-2026-Q4-18',
    filename: './wallpapers/tom-moser.jpg',
    author: 'Tom Moser',
    creditUrl:
      'https://unsplash.com/photos/a-city-with-many-buildings-uR6VahqorEk',
  },
  {
    id: 'ntp-2026-Q4-19',
    filename: './wallpapers/oliver-plattner.jpg',
    author: 'Oliver Plattner',
    creditUrl:
      'https://unsplash.com/photos/golden-gate-bridge-in-san-francisco-Plt0vHDRb9U',
  },
  {
    id: 'ntp-2026-Q4-20',
    filename: './wallpapers/massimiliano-morosinotto.jpg',
    author: 'Massimiliano Morosinotto',
    creditUrl:
      'https://unsplash.com/photos/low-angle-photography-of-buildings-YMPUJexvNa8',
  },
  {
    id: 'ntp-2026-Q4-21',
    filename: './wallpapers/anton-volnuhin.jpg',
    author: 'Anton Volnuhin',
    creditUrl:
      'https://unsplash.com/photos/a-shadow-of-a-building-on-a-wall-N8ucHGuZtUs',
  },
  {
    id: 'ntp-2026-Q4-22',
    filename: './wallpapers/rafael-peier.jpg',
    author: 'Rafael Peier',
    creditUrl:
      'https://unsplash.com/photos/close-up-of-vibrant-orange-flower-petals-with-dew-drops-S1vS1KgQCug',
  },
  {
    id: 'ntp-2026-Q4-23',
    filename: './wallpapers/neom.jpg',
    author: 'Neom',
    creditUrl:
      'https://unsplash.com/photos/a-large-group-of-fish-swimming-over-a-coral-reef-bOMVTvE2QFU',
  },
  {
    id: 'ntp-2026-Q4-24',
    filename: './wallpapers/david-clode.jpg',
    author: 'David Clode',
    creditUrl:
      'https://unsplash.com/photos/a-chameleons-colorful-tail-curled-into-a-spiral-on-black-oGmKb2DJHfA',
  },
  {
    id: 'ntp-2026-Q4-25',
    filename: './wallpapers/elizabeth-gottwald.jpg',
    author: 'Elizabeth Gottwald',
    creditUrl:
      'https://unsplash.com/photos/white-and-pink-herons-in-beach-IpbnuyBWQqY',
  },
  {
    id: 'ntp-2026-Q4-26',
    filename: './wallpapers/ngoc-nguyen-phuong.jpg',
    author: 'Ngoc Nguyen Phuong',
    creditUrl:
      'https://unsplash.com/photos/variegated-leaf-among-lush-green-foliage-M6BMH-9Aj8Q',
  },
  {
    id: 'ntp-2026-Q4-27',
    filename: './wallpapers/daniil-komov.jpg',
    author: 'Daniil Komov',
    creditUrl:
      'https://unsplash.com/photos/a-small-bird-sitting-on-top-of-a-dry-grass-dSZyPg9rCRA',
  },
  {
    id: 'ntp-2026-Q4-28',
    filename: './wallpapers/fabio-sasso.jpg',
    author: 'Fabio Sasso',
    creditUrl:
      'https://unsplash.com/photos/sunset-over-a-lake-seen-through-silhouetted-forest-trees-T_YG9paUo5I',
  },
  {
    id: 'ntp-2026-Q4-29',
    filename: './wallpapers/lukasz-rawa.jpg',
    author: 'Lukasz Rawa',
    creditUrl:
      'https://unsplash.com/photos/dark-green-leaves-with-red-veins-CdA2yxbG1hg',
  },
  {
    id: 'ntp-2026-Q4-30',
    filename: './wallpapers/damian-kamp.jpg',
    author: 'Damian Kamp',
    creditUrl:
      'https://unsplash.com/photos/dynamic-blue-ocean-waves-with-white-foam-and-motion-blur-NFALS3IsNBg',
  },
  {
    id: 'ntp-2026-Q4-31',
    filename: './wallpapers/xiao-lou.jpg',
    author: 'Xiao Lou',
    creditUrl:
      'https://unsplash.com/photos/abstract-blue-ice-formations-create-a-textured-pattern-rBDQ9WrnvUA',
  },
  {
    id: 'ntp-2026-Q4-32',
    filename: './wallpapers/veli-batuhan.jpg',
    author: 'Veli Batuhan Aytaç',
    creditUrl:
      'https://unsplash.com/photos/abstract-iridescent-curves-on-a-black-background-p-8ZW6wy1QM',
  },
  {
    id: 'ntp-2026-Q4-33',
    filename: './wallpapers/daniil-silantev.jpg',
    author: 'Daniil Silantev',
    creditUrl:
      'https://unsplash.com/photos/sunset-reflects-over-water-with-tall-grass-in-focus-xUfATl0k8Cg',
  },
  {
    id: 'ntp-2026-Q4-34',
    filename: './wallpapers/milad-fakurian.jpg',
    author: 'Milad Fakurian',
    creditUrl:
      'https://unsplash.com/photos/abstract-purple-and-pink-gradient-waves-nY14Fs8pxT8',
  },
  {
    id: 'ntp-2026-Q4-35',
    filename: './wallpapers/daniel-olah.jpg',
    author: 'Daniel Olah',
    creditUrl:
      'https://unsplash.com/photos/sand-dunes-under-starry-night-sky-6KQETG8J-zI',
  },
  {
    id: 'ntp-2026-Q4-36',
    filename: './wallpapers/alex-oviedo.jpg',
    author: 'Alex Oviedo',
    creditUrl: 'https://alexovi.com/',
  },
  {
    id: 'ntp-2026-Q4-37',
    filename: './wallpapers/mogli-maureal.jpg',
    author: 'Mogli Maureal',
    creditUrl: 'https://www.themogli.com/',
  },
  {
    id: 'ntp-2026-Q4-38',
    filename: './wallpapers/nicholas-stankus.jpg',
    author: 'Nicholas Stankus',
    creditUrl: 'https://www.nixter.net/',
  },
  {
    id: 'ntp-2026-Q4-39',
    filename: './wallpapers/matteo-menardi.jpg',
    author: 'Matteo Menardi',
    creditUrl: 'https://matteomenardimenego.com/',
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

