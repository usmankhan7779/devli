import { Formation } from './formation';

/**
 * Basic I formation.
 */
export class RunningOffense1 extends Formation {
  protected positions = [
    { fromBall: 1, lateral: -20, position: ['WR'] },
    { fromBall: 1, lateral: -8, position: ['OT'] },
    { fromBall: 1, lateral: -4, position: ['G'] },
    { fromBall: 1, lateral: 0, position: ['C'] },
    { fromBall: 5.5, lateral: 0, position: ['QB'] },
    { fromBall: 10, lateral: 0, position: ['RB'] },
    { fromBall: 14.5, lateral: 0, position: ['RB'] },
    { fromBall: 1, lateral: 4, position: ['G'] },
    { fromBall: 1, lateral: 8, position: ['OT'] },
    { fromBall: 1, lateral: 12, position: ['TE'] },
    { fromBall: 5.5, lateral: 24, position: ['WR'] }
  ];
}

/**
 * I formation, fullback offset weakside.
 */
export class RunningOffense2 extends Formation {
  protected positions = [
    { fromBall: 1, lateral: -20, position: ['WR'] },
    { fromBall: 1, lateral: -8, position: ['OT'] },
    { fromBall: 1, lateral: -4, position: ['G'] },
    { fromBall: 10, lateral: -4, position: ['RB'] },
    { fromBall: 1, lateral: 0, position: ['C'] },
    { fromBall: 5.5, lateral: 0, position: ['QB'] },
    { fromBall: 14.5, lateral: 0, position: ['RB'] },
    { fromBall: 1, lateral: 4, position: ['G'] },
    { fromBall: 1, lateral: 8, position: ['OT'] },
    { fromBall: 1, lateral: 12, position: ['TE'] },
    { fromBall: 5.5, lateral: 24, position: ['WR'] }
  ];
}

/**
 * Typical singleback
 */
export class PassingOffense1 extends Formation {
  protected positions = [
    { fromBall: 1, lateral: -24, position: ['WR'] },
    { fromBall: 5.5, lateral: -18, position: ['WR'] },
    { fromBall: 1, lateral: -8, position: ['OT'] },
    { fromBall: 1, lateral: -4, position: ['G'] },
    { fromBall: 1, lateral: 0, position: ['C'] },
    { fromBall: 5.5, lateral: 0, position: ['QB'] },
    { fromBall: 14.5, lateral: 0, position: ['RB'] },
    { fromBall: 1, lateral: 4, position: ['G'] },
    { fromBall: 1, lateral: 8, position: ['OT'] },
    { fromBall: 1, lateral: 12, position: ['TE'] },
    { fromBall: 5.5, lateral: 24, position: ['WR'] }
  ];
}

/**
 * Spread
 */
export class PassingOffense2 extends Formation {
  protected positions = [
    { fromBall: 1, lateral: -24, position: ['WR'] },
    { fromBall: 5.5, lateral: -18, position: ['WR'] },
    { fromBall: 1, lateral: -8, position: ['OT'] },
    { fromBall: 1, lateral: -4, position: ['G'] },
    { fromBall: 1, lateral: 0, position: ['C'] },
    { fromBall: 5.5, lateral: 0, position: ['QB'] },
    { fromBall: 14.5, lateral: 0, position: ['RB'] },
    { fromBall: 1, lateral: 4, position: ['G'] },
    { fromBall: 1, lateral: 8, position: ['OT'] },
    { fromBall: 5.5, lateral: 14, position: ['TE'] },
    { fromBall: 5.5, lateral: 24, position: ['WR'] }
  ];
}

/**
 * H-back
 */
export class PassingOffense3 extends Formation {
  protected positions = [
    { fromBall: 1, lateral: -24, position: ['WR'] },
    { fromBall: 5.5, lateral: -12, position: ['TE'] },
    { fromBall: 1, lateral: -8, position: ['OT'] },
    { fromBall: 1, lateral: -4, position: ['G'] },
    { fromBall: 1, lateral: 0, position: ['C'] },
    { fromBall: 5.5, lateral: 0, position: ['QB'] },
    { fromBall: 14.5, lateral: 0, position: ['RB'] },
    { fromBall: 1, lateral: 4, position: ['G'] },
    { fromBall: 1, lateral: 8, position: ['OT'] },
    { fromBall: 1, lateral: 12, position: ['TE'] },
    { fromBall: 5.5, lateral: 24, position: ['WR'] }
  ];
}
