export interface GameData {
  backgroundVideo: string;
  enableMic: boolean;
  title: TitleData;
  characters: CharacterData[];
  zoneButtons: ZoneButtonData[];
}

export interface TitleData {
  texts: { text: string[] }[];
}

export interface CharacterData {
  key: string;
  name: string;
  role: string;
  position: {
    x: number;
    y: number;
  };
  origin?: {
    x: number;
    y: number;
  };
}

export interface ZoneButtonData {
  key: string;
  blocked?: boolean;
  position: {
    x: number;
    y: number;
  };
}

export function parseGameData(data: any) {
  const parsedData = {
    backgroundVideo: data["background-video"],
    enableMic: data["enable-mic"],
    title: data.title,
    characters: data.characters,
    zoneButtons: data["zone-buttons"],
  } as GameData;
  return parsedData;
}
