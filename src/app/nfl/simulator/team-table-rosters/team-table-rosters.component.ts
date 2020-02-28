import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-team-table-rosters',
  templateUrl: './team-table-rosters.component.html',
  styleUrls: ['./team-table-rosters.component.scss']
})
export class TeamTableRostersComponent implements OnInit {
  teamData = {passing: [], rushing: [], receiving: []};
  constructor() { }

  ngOnInit() {
    this.teamData.passing = [
      {name: 'Zach Mettenberger', rating: 74, depth: 'QB 1', snaps: 400, att: 325,
        comp: 300, compP: 95, yards: 3125, yardsPerAtt: 15, td: 28, ints: 6},
      {name: 'Zach Mettenberger', rating: 95, depth: 'QB 2', snaps: 400, att: 325,
        comp: 300, compP: 95, yards: 3125, yardsPerAtt: 15, td: 28, ints: 6},
      {name: 'Zach Mettenberger', rating: 56, depth: 'QB 3', snaps: 400, att: 325,
        comp: 300, compP: 95, yards: 3125, yardsPerAtt: 15, td: 28, ints: 6}
    ];

    this.teamData.rushing = [
      {name: 'Devonta Freeman', rating: 74, depth: 'RB 1', snaps: 300,
        att: 123, yards: 1232, yardsPerAtt: 10, ypg: 10, long: 40, td: 28},
      {name: 'Devonta Freeman', rating: 55, depth: 'RB 2', snaps: 300,
        att: 123, yards: 1232, yardsPerAtt: 10, ypg: 10, long: 40, td: 28},
      {name: 'Devonta Freeman', rating: 89, depth: 'RB 3', snaps: 300,
        att: 123, yards: 1232, yardsPerAtt: 10, ypg: 10, long: 40, td: 28},
    ];

    this.teamData.receiving = [
      {name: 'Devonta Freeman', rating: 66, depth: 'RB 1', snaps: 300,
        targets: 123, receptions: 24, yards: 2311, catchP: 20, ypc: 5, long: 40, td: 28},
      {name: 'Devonta Freeman', rating: 88, depth: 'RB 2', snaps: 300,
        targets: 123, receptions: 24, yards: 2311, catchP: 20, ypc: 5, long: 40, td: 28},
      {name: 'Devonta Freeman', rating: 99, depth: 'RB 3', snaps: 300,
        targets: 123, receptions: 24, yards: 2311, catchP: 20, ypc: 5, long: 40, td: 28}
    ];
  }

}
