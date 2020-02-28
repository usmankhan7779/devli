export class BetMetricsObject {
  bets: any[];
  lose_pct: number;
  win_pct: number;
  profit: number;
  max_ev: number;
  min_ev: number;
  max_kelly: number;
  min_kelly: number;

  constructor(data) {
    this.bets = data.bets || null;
    this.lose_pct = data.lose_pct || null;
    this.win_pct = data.win_pct || null;
    this.profit = data.profit || null;
    this.max_ev = data.max_ev || null;
    this.min_ev = data.min_ev || null;
    this.max_kelly = data.max_kelly || null;
    this.min_kelly = data.min_kelly || null;
  }

  reset() {
    this.bets = null;
    this.lose_pct = null;
    this.win_pct = null;
    this.profit = null;
    this.max_ev = null;
    this.min_ev = null;
    this.max_kelly = null;
    this.min_kelly = null;
  }


}
