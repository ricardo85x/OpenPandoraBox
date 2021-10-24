export type IAppColor =
  | 'white'
  | 'yellow'
  | 'green'
  | 'red'
  | 'blue'
  | 'pink'
  | 'orange';
export type IAppLauchers =
  | 'retroarch'
  | 'Drastic'
  | 'MupenFz'
  | 'openBor'
  | 'openBor old'
  | 'PPSSPP'
  | 'Reicast';

interface IThemeSettings {
  settingsBackgroundImg: string;
  historyBackgroundImg: string;
  searchBackgroundImg: string;
  colorButton_A: IAppColor;
  colorButton_B: IAppColor;
  colorButton_C: IAppColor;
  colorButton_D: IAppColor;
  colorButton_E: IAppColor;
  colorButton_F: IAppColor;
  themeColor: IAppColor;
}

export interface IAppSettings {
  RETROARCH_CONFIG: string;
  RETROARCH_APK_ID: string;
  BASE_ROOM_DIR: string;
  CORE_DIR: string;
  THEME: IThemeSettings;
  PLATFORMS: {
    [key: string]: {
      title: string;
      backgroundImg: string;
      core: {
        choices: string[];
        default: number;
      };
      enabled: boolean;
      launcher: IAppLauchers;
    };
  };
}

export interface IMenuItem {
  type: string;
  text: string;
  title: string;
  path?: string;
  background?: string;
}

export interface IKeyEvent {
  keyCode: number;
}

export interface IKeyMap {
  leftKeyCode: number[];
  rightKeyCode: number[];
  upKeyCode: number[];
  downKeyCode: number[];

  P1_COIN: number[]; // 7
  P1_START: number[]; // 2
  P1_A: number[]; // u
  P1_B: number[]; // i
  P1_C: number[]; // j
  P1_D: number[]; // k
  P1_E: number[]; // o
  P1_F: number[]; // l
  P1_UP: number[]; // w
  P1_DOWN: number[]; // s
  P1_LEFT: number[]; // a
  P1_RIGHT: number[]; // d

  P2_COIN: number[]; // 1
  P2_START: number[]; // 4 - WHAT
  P2_A: number[]; // 4 - WHAT
  P2_B: number[]; // 5
  P2_C: number[]; // 1
  P2_D: number[]; // 2
  P2_E: number[]; // 6
  P2_F: number[]; // 3
  P2_UP: number[]; //
  P2_DOWN: number[];
  P2_LEFT: number[];
  P2_RIGHT: number[];
}

export interface IRomCustom {
  platform: string;
  id: number;
  name: string;
  path: string;
  thumbnail: string;
  image: string;
  video: string;
  desc: string;
  romName?: string;
  normalizedName?: string;
  gameId: number;
  loadVideo: boolean;
  platformTitle: string;
  selected?: boolean;
}

export type IRomPlatform = Omit<
  IRomCustom,
  'gameId' | 'platform' | 'platformTitle'
>;

export type IRomSearch = Omit<IRomCustom, 'normalizedName'>;

// export type IRomSearch = Partial<Omit<
//   IRomCustom, 'normalizedName' | 'selected'
// >> & {
//   romName?: string
// }

export interface IGameList {
  lang: string;
  region: string;
  path: string;
  name: string;
  desc: string;
  rating: string;
  releasedate: string;
  developer: string;
  publisher: string;
  genre: string;
  players: string;
  image: string;
  thumbnail: string;
  video: string;
}

export interface KeyboardKeyProps {
  key: string;
  x: number;
  y: number;
  type: string;
  size: number;
  selected: boolean;
}
