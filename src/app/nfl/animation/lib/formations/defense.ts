import { Formation } from './formation';

/**
 * Basic 4-3
 *
 * @export
 * @class Defense1
 * @extends {Formation}
 */
export class Defense1 extends Formation {
  protected positions = [
    { fromBall: 3, lateral: 20, position: ['CB'] },
    { fromBall: 6, lateral: 10.5, position: ['OLB'] },
    { fromBall: 3, lateral: 6.5, position: ['DE'] },
    { fromBall: 3, lateral: 2.5, position: ['DT', 'NT'] },
    { fromBall: 23, lateral: 2.5, position: ['S', 'FS', 'SS'] },
    { fromBall: 10, lateral: 0, position: ['ILB', 'OLB'] },
    { fromBall: 3, lateral: -2.5, position: ['DT', 'NT'] },
    { fromBall: 3, lateral: -6.5, position: ['DE'] },
    { fromBall: 6, lateral: -10.5, position: ['OLB'] },
    { fromBall: 20, lateral: -10.5, position: ['S', 'FS', 'SS'] },
    { fromBall: 3, lateral: -24, position: ['CB'] }
  ];
}

/**
 * Basic 3-4
 *
 * @export
 * @class Defense2
 * @extends {Formation}
 */
export class Defense2 extends Formation {
  protected positions = [
    { fromBall: 3, lateral: 20, position: ['CB'] },
    { fromBall: 6, lateral: 11, position: ['OLB'] },
    { fromBall: 3, lateral: 7, position: ['DE'] },
    { fromBall: 9, lateral: 3.5, position: ['ILB', 'OLB'] },
    { fromBall: 21, lateral: 3, position: ['S', 'FS', 'SS'] },
    { fromBall: 3, lateral: 0, position: ['DT', 'NT'] },
    { fromBall: 9, lateral: -3.5, position: ['ILB', 'OLB'] },
    { fromBall: 3, lateral: -7, position: ['DE'] },
    { fromBall: 6, lateral: -11, position: ['OLB'] },
    { fromBall: 18, lateral: -11, position: ['S', 'FS', 'SS'] },
    { fromBall: 3, lateral: -24, position: ['CB'] }
  ];
}
