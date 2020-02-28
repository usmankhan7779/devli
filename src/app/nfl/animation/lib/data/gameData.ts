import { GameDetailsData } from './gameDetailsData';
import { PlayData } from './playData';
import { PlayerData } from './playerData';

export interface GameData {
  players: PlayerData[];
  plays: PlayData[];
  game: GameDetailsData;
  box_score: any;
  recap: string;
  scoring_plays: PlayData[];
}
