import {SimpleBet} from './simple-bet';
import {SimpleChoice} from './simple-choice';

export class Bet {

  // Back-End
  away_probability: number;
  bets: SimpleBet[];
  home_probability: number;
  title: string;
  type: string;

  // Front-End
  selectedSimpleBet: SimpleBet;
  selectedSimpleChoice: SimpleChoice;

}
