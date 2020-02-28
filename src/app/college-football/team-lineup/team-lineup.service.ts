import { Subject } from 'rxjs';

export class TeamLineupService {
  teamLineupYearWasChanged = new Subject<any>();
  constructor(
  ) { }

  changeTeamLineupYear(data, year) {
    this.teamLineupYearWasChanged.next({data, year});
  }
}
