export class NbaTeamStatsService {
  private preSelectedTeamSeason: number;
  constructor(
  ) { }

  getPreSelectedTeamSeason() {
    return this.preSelectedTeamSeason;
  }

  setPreSelectedTeamSeason(year: number | string) {
    this.preSelectedTeamSeason = parseInt((<string>year), 10);
  }

  removePreSelectedTeamSeason() {
    this.preSelectedTeamSeason = null;
  }
  

}

