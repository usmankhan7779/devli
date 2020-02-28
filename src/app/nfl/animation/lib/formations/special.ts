import { Formation } from './formation';

export class KickOff extends Formation {
  protected positions = [
    { fromBall: 5, lateral: 0, position: ['K'] },
    { fromBall: 2, lateral: -4, position: ['LB', 'OLB', 'ILB'] },
    { fromBall: 2, lateral: 4, position: ['RB'] },
    { fromBall: 2, lateral: -8, position: ['S', 'SS'] },
    { fromBall: 2, lateral: 8, position: ['CB'] },
    { fromBall: 2, lateral: -12, position: ['CB'] },
    { fromBall: 2, lateral: 12, position: ['DB'] },
    { fromBall: 2, lateral: -16, position: ['S', 'SS'] },
    { fromBall: 2, lateral: 16, position: ['LB', 'OLB', 'ILB'] },
    { fromBall: 2, lateral: -20, position: ['LB', 'OLB', 'ILB'] },
    { fromBall: 2, lateral: 20, position: ['RB'] }
  ];
}

export class KickOffReturn extends Formation {
  protected positions = [
    { fromBall: 58, lateral: -8, position: ['WR'] },
    { fromBall: 58, lateral: 8, position: ['WR'] },
    { fromBall: 17, lateral: 0, position: ['RB'] },
    { fromBall: 17, lateral: -8, position: ['QT'] },
    { fromBall: 17, lateral: 8, position: ['LB', 'OLB', 'ILB'] },
    { fromBall: 17, lateral: -16, position: ['RB'] },
    { fromBall: 17, lateral: 16, position: ['LB', 'OLB', 'ILB'] },
    { fromBall: 35, lateral: -12, position: ['CB'] },
    { fromBall: 35, lateral: 12, position: ['CB'] },
    { fromBall: 45, lateral: -8, position: ['S', 'SS'] },
    { fromBall: 45, lateral: 8, position: ['S', 'SS'] }
  ];
}

export class ExtraPointKick extends Formation {
  protected positions = [
    { fromBall: 0, lateral: 0, position: ['C'] },
    { fromBall: 0.5, lateral: -3, position: ['G'] },
    { fromBall: 0.5, lateral: 3, position: ['G'] },
    { fromBall: 1, lateral: -6, position: ['T', 'UNK'] },
    { fromBall: 1, lateral: 6, position: ['T', 'UNK'] },
    { fromBall: 1.5, lateral: -9, position: ['TE', 'T'] },
    { fromBall: 1.5, lateral: 9, position: ['TE', 'T'] },
    { fromBall: 3, lateral: -12, position: ['RB'] },
    { fromBall: 3, lateral: 12, position: ['RB'] },
    { fromBall: 6, lateral: -2, position: ['P', 'UNK', 'HLD'] },
    { fromBall: 10, lateral: 0, position: ['K'] }
  ];
}

export class ExtraPointKickDefense extends Formation {
  protected positions = [
    { fromBall: 5, lateral: 0, position: ['DT'] },
    { fromBall: 5, lateral: -5, position: ['DT'] },
    { fromBall: 5, lateral: 5, position: ['DT'] },
    { fromBall: 5, lateral: -10, position: ['LB', 'OLB', 'ILB'] },
    { fromBall: 5, lateral: 10, position: ['LB', 'OLB', 'ILB'] },
    { fromBall: 5, lateral: -15, position: ['LB', 'OLB', 'ILB'] },
    { fromBall: 5, lateral: 15, position: ['LB', 'OLB', 'ILB'] },
    { fromBall: 12, lateral: -12, position: ['S', 'SS'] },
    { fromBall: 12, lateral: 12, position: ['S', 'SS'] },
    { fromBall: 12, lateral: -6, position: ['CB'] },
    { fromBall: 12, lateral: 6, position: ['CB'] }
  ];
}

export class Punt extends Formation {
  protected positions = [
    { fromBall: 1, lateral: -24, position: ['WR', 'TE'] },
    { fromBall: 1, lateral: -10, position: ['OT'] },
    { fromBall: 1, lateral: -5, position: ['G'] },
    { fromBall: 1, lateral: 0, position: ['C'] },
    { fromBall: 15, lateral: 0, position: ['P'] },
    { fromBall: 1, lateral: 5, position: ['G'] },
    { fromBall: 1, lateral: 10, position: ['OT'] },
    { fromBall: 1, lateral: 24, position: ['WR', 'TE'] },
    { fromBall: 5, lateral: -7, position: ['RB'] },
    { fromBall: 8, lateral: 4, position: ['RB'] },
    { fromBall: 4, lateral: 11, position: ['RB'] }
  ];
}

export class PuntDefense extends Formation {
  protected positions = [
    { fromBall: 3, lateral: 24, position: ['CB'] },
    { fromBall: 3, lateral: 16, position: ['CB'] },
    { fromBall: 3, lateral: 8, position: ['WR'] },
    { fromBall: 8, lateral: 7, position: ['TE'] },
    { fromBall: 3, lateral: 4, position: ['RB'] },
    { fromBall: 3, lateral: 0, position: ['DE'] },
    { fromBall: 26, lateral: 0, position: ['PR'] },
    { fromBall: 3, lateral: -4, position: ['DE'] },
    { fromBall: 3, lateral: -8, position: ['RB'] },
    { fromBall: 3, lateral: -16, position: ['RB'] },
    { fromBall: 3, lateral: -24, position: ['WR'] }
  ];
}
