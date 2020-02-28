import { PlayPlayerData } from './playPlayerData';

export interface PlayData {
  note?: string;
  third_down_att?: number;
  third_down_failed?: number;
  drive_id?: number;
  fourth_down_att?: number;
  timeout?: number;
  time?: string;
  pos_team_id?: string;
  penalty_first_down?: number;
  fourth_down_failed?: number;
  yardline?: string;
  penalty_yds?: number;
  rushing_first_down?: number;
  id?: number;
  passing_first_down?: number;
  first_down?: number;
  gsis_id?: string;
  third_down_conv?: number;
  fourth_down_conv?: number;
  play_id?: number;
  penalty?: number;
  description?: string;
  down?: number;
  time_updated?: string;
  xp_aborted?: number;
  yards_to_go?: number;
  time_inserted?: string;
  play_players?: PlayPlayerData[];
  endScore?: { [team: string]: number };
  startScore?: { [team: string]: number };
}
