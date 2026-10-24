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
    id: 'ntp-brave-01',
    filename: './wallpapers/alex-oviedo.jpg',
    author: 'Alex Oviedo',
    creditUrl: 'https://unsplash.com/@alexoviedo',
  },
  {
    id: 'ntp-brave-02',
    filename: './wallpapers/andrew-svk.jpg',
    author: 'Andrew Svk',
    creditUrl: 'https://unsplash.com/@andrew_svk',
  },
  {
    id: 'ntp-brave-03',
    filename: './wallpapers/anton-volnuhin.jpg',
    author: 'Anton Volnuhin',
    creditUrl: 'https://unsplash.com/@volnuhin',
  },
  {
    id: 'ntp-brave-04',
    filename: './wallpapers/benjamin-hibbert.jpg',
    author: 'Benjamin Hibbert',
    creditUrl: 'https://unsplash.com/@benjaminhibbert',
  },
  {
    id: 'ntp-brave-05',
    filename: './wallpapers/damian-kamp.jpg',
    author: 'Damian Kamp',
    creditUrl: 'https://unsplash.com/@damiankamp',
  },
  {
    id: 'ntp-brave-06',
    filename: './wallpapers/daniel-olah.jpg',
    author: 'Daniel Olah',
    creditUrl: 'https://unsplash.com/@daneshmand',
  },
  {
    id: 'ntp-brave-07',
    filename: './wallpapers/daniel-schwarz.jpg',
    author: 'Daniel Schwarz',
    creditUrl: 'https://unsplash.com/@danielschwarz',
  },
  {
    id: 'ntp-brave-08',
    filename: './wallpapers/daniil-komov.jpg',
    author: 'Daniil Komov',
    creditUrl: 'https://unsplash.com/@daniilkomov',
  },
  {
    id: 'ntp-brave-09',
    filename: './wallpapers/daniil-silantev.jpg',
    author: 'Daniil Silantev',
    creditUrl: 'https://unsplash.com/@silverfox',
  },
  {
    id: 'ntp-brave-10',
    filename: './wallpapers/david-becker.jpg',
    author: 'David Becker',
    creditUrl: 'https://unsplash.com/@davidbecker',
  },
  {
    id: 'ntp-brave-11',
    filename: './wallpapers/david-clode.jpg',
    author: 'David Clode',
    creditUrl: 'https://unsplash.com/@davidclode',
  },
  {
    id: 'ntp-brave-12',
    filename: './wallpapers/elizabeth-gottwald.jpg',
    author: 'Elizabeth Gottwald',
    creditUrl: 'https://unsplash.com/@elizabethgottwald',
  },
  {
    id: 'ntp-brave-13',
    filename: './wallpapers/fabio-sasso.jpg',
    author: 'Fabio Sasso',
    creditUrl: 'https://unsplash.com/@abduzeedo',
  },
  {
    id: 'ntp-brave-14',
    filename: './wallpapers/fer-troulik.jpg',
    author: 'Fer Troulik',
    creditUrl: 'https://unsplash.com/@fertroulik',
  },
  {
    id: 'ntp-brave-15',
    filename: './wallpapers/freestocks.jpg',
    author: 'freestocks',
    creditUrl: 'https://unsplash.com/@freestocks',
  },
  {
    id: 'ntp-brave-16',
    filename: './wallpapers/fudo-jahic.jpg',
    author: 'Fudo Jahic',
    creditUrl: 'https://unsplash.com/@fudojahic',
  },
  {
    id: 'ntp-brave-17',
    filename: './wallpapers/gabriele-merlino.jpg',
    author: 'Gabriele Merlino',
    creditUrl: 'https://unsplash.com/@gabrielemerlino',
  },
  {
    id: 'ntp-brave-18',
    filename: './wallpapers/hunter-newton.jpg',
    author: 'Hunter Newton',
    creditUrl: 'https://unsplash.com/@hunter_newton',
  },
  {
    id: 'ntp-brave-19',
    filename: './wallpapers/john-murphey.jpg',
    author: 'John Murphey',
    creditUrl: 'https://unsplash.com/@johnmurphey',
  },
  {
    id: 'ntp-brave-20',
    filename: './wallpapers/juho-luomala.jpg',
    author: 'Juho Luomala',
    creditUrl: 'https://unsplash.com/@juholuomala',
  },
  {
    id: 'ntp-brave-21',
    filename: './wallpapers/ken-cheung.jpg',
    author: 'Ken Cheung',
    creditUrl: 'https://unsplash.com/@kencheungphoto',
  },
  {
    id: 'ntp-brave-22',
    filename: './wallpapers/kristaps-ungurs.jpg',
    author: 'Kristaps Ungurs',
    creditUrl: 'https://unsplash.com/@kristapsungurs',
  },
  {
    id: 'ntp-brave-23',
    filename: './wallpapers/lukasz-rawa.jpg',
    author: 'Lukasz Rawa',
    creditUrl: 'https://unsplash.com/@lukaszrawa',
  },
  {
    id: 'ntp-brave-24',
    filename: './wallpapers/massimiliano-morosinotto.jpg',
    author: 'Massimiliano Morosinotto',
    creditUrl: 'https://unsplash.com/@massimilianomorosinotto',
  },
  {
    id: 'ntp-brave-25',
    filename: './wallpapers/matteo-menardi.jpg',
    author: 'Matteo Menardi',
    creditUrl: 'https://unsplash.com/@matteomenardi',
  },
  {
    id: 'ntp-brave-26',
    filename: './wallpapers/mike-hindle.jpg',
    author: 'Mike Hindle',
    creditUrl: 'https://unsplash.com/@mikehindle',
  },
  {
    id: 'ntp-brave-27',
    filename: './wallpapers/milad-fakurian.jpg',
    author: 'Milad Fakurian',
    creditUrl: 'https://unsplash.com/@fakurian',
  },
  {
    id: 'ntp-brave-28',
    filename: './wallpapers/mogli-maureal.jpg',
    author: 'Mogli Maureal',
    creditUrl: 'https://unsplash.com/@moglimaureal',
  },
  {
    id: 'ntp-brave-29',
    filename: './wallpapers/neom.jpg',
    author: 'NEOM',
    creditUrl: 'https://unsplash.com/@neom',
  },
  {
    id: 'ntp-brave-30',
    filename: './wallpapers/ngoc-nguyen-phuong.jpg',
    author: 'Ngoc Nguyen Phuong',
    creditUrl: 'https://unsplash.com/@ngocnguyenphuong',
  },
  {
    id: 'ntp-brave-31',
    filename: './wallpapers/nicholas-stankus.jpg',
    author: 'Nicholas Stankus',
    creditUrl: 'https://unsplash.com/@nicholasstankus',
  },
  {
    id: 'ntp-brave-32',
    filename: './wallpapers/oliver-plattner.jpg',
    author: 'Oliver Plattner',
    creditUrl: 'https://unsplash.com/@oliverplattner',
  },
  {
    id: 'ntp-brave-33',
    filename: './wallpapers/pascal-debrunner.jpg',
    author: 'Pascal Debrunner',
    creditUrl: 'https://unsplash.com/@pascaldebrunner',
  },
  {
    id: 'ntp-brave-34',
    filename: './wallpapers/pascal-debrunner2.jpg',
    author: 'Pascal Debrunner',
    creditUrl: 'https://unsplash.com/@pascaldebrunner',
  },
  {
    id: 'ntp-brave-35',
    filename: './wallpapers/pedro-gomes.jpg',
    author: 'Pedro Gomes',
    creditUrl: 'https://unsplash.com/@mgomespedro',
  },
  {
    id: 'ntp-brave-36',
    filename: './wallpapers/rafael-peier.jpg',
    author: 'Rafael Peier',
    creditUrl: 'https://unsplash.com/@rafaelpeier',
  },
  {
    id: 'ntp-brave-37',
    filename: './wallpapers/rafael-peier2.jpg',
    author: 'Rafael Peier',
    creditUrl: 'https://unsplash.com/@rafaelpeier',
  },
  {
    id: 'ntp-brave-38',
    filename: './wallpapers/tom-moser.jpg',
    author: 'Tom Moser',
    creditUrl: 'https://unsplash.com/@tommoser',
  },
  {
    id: 'ntp-brave-39',
    filename: './wallpapers/veli-batuhan.jpg',
    author: 'Veli Batuhan',
    creditUrl: 'https://unsplash.com/@velibatuhan',
  },
  {
    id: 'ntp-brave-40',
    filename: './wallpapers/xiao-lou.jpg',
    author: 'Xiao Lou',
    creditUrl: 'https://unsplash.com/@xiaolou',
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
