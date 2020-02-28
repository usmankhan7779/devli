import {Component, OnDestroy, OnInit} from '@angular/core';
import {BetsService} from './bets.service';
import {Subscription} from 'rxjs';
import {Bet} from './bet/bet';
import {SimpleBet} from './bet/simple-bet';

@Component({
  selector: 'app-nfl-bets',
  templateUrl: './bets.component.html',
  styleUrls: ['./bets.component.scss']
})
export class BetsComponent implements OnInit {
  options: any;
  options2: any;
  options3: any;
  options4: any;
  options5: any;
  options6: any;
  options7: any;
  options8: any;
  bets: Bet[];

  private routeSubscription: Subscription;

  constructor(private betsService: BetsService) {
    // Defaults
    this.options = [
      {name: '1', title: 'Base Model', value: true},
      {name: '2', title: 'ML Consenus', value: true},
      {name: '3', title: 'Boosted Regressor', value: true},
      {name: '4', title: 'Random Forest', value: false},
      {name: '5', title: 'Naive Bayes', value: true},
      {name: '6', title: 'Linear Regression', value: false}
    ];

    this.options2 = [
      {name: '1', title: 'Bovada', value: true},
      {name: '2', title: 'BetOnline', value: true},
      {name: '3', title: 'Bookmaker', value: true},
      {name: '4', title: 'Sportsbook.ag', value: false},
      {name: '5', title: 'GT Bets', value: true},
      {name: '6', title: '5Dimes', value: false},
      {name: '6', title: 'BetDSI', value: false},
      {name: '6', title: 'Pinnacle', value: false}
    ];

    this.options3 = [
      {name: '1', title: 'Game Bets', value: true},
      {name: '2', title: 'Team Bets', value: true},
      {name: '3', title: 'Hitter Props', value: true},
      {name: '4', title: 'Pitcher Props', value: false},
      {name: '5', title: 'Game Props', value: true},
    ];

    // No multi-select
    this.options4 = [
      {name: '1', title: 'Home Run', value: true},
      {name: '2', title: 'Total H, R, RBI', value: true},
      {name: '3', title: 'Most H, R, RBI Between Players', value: true},
      {name: '4', title: 'Record a Hit', value: false}
    ];

    this.options5 = [
      {name: '1', title: 'ATL at LAD', value: true},
      {name: '2', title: 'NYY at PHI', value: true},
      {name: '3', title: 'NYY at PHI', value: true},
      {name: '4', title: 'NYY at PHI', value: false},

      {name: '5', title: 'NYY at PHI', value: true},
      {name: '6', title: 'NYY at PHI', value: true},
      {name: '7', title: 'NYY at PHI', value: true},
      {name: '8', title: 'NYY at PHI', value: false},

      {name: '9', title: 'NYY at PHI', value: true},
      {name: '10', title: 'NYY at PHI', value: true},
      {name: '11', title: 'NYY at PHI', value: true},
      {name: '12', title: 'NYY at PHI', value: false},

      {name: '13', title: 'NYY at PHI', value: true},
      {name: '14', title: 'NYY at PHI', value: true},
      {name: '15', title: 'NYY at PHI', value: true},
      {name: '16', title: 'NYY at PHI', value: false}
    ];

    this.options6 = [
      {name: '1', title: '90%', value: true},
      {name: '2', title: '80%', value: false},
      {name: '3', title: '70%', value: false},
      {name: '4', title: '60%', value: true},
      {name: '5', title: '50%', value: false},
      {name: '6', title: '40%', value: false},
      {name: '7', title: '30%', value: false},
      {name: '8', title: '20%', value: true},
      {name: '9', title: '10%', value: false},
    ];

    this.options7 = [
      {name: '1', title: '2', value: true},
      {name: '2', title: '1,75', value: false},
      {name: '3', title: '1,5', value: false},
      {name: '4', title: '1,25', value: true},
      {name: '5', title: '1', value: false},
      {name: '6', title: '0,75', value: false},
      {name: '7', title: '0,5', value: false},
      {name: '8', title: '0,25', value: true},
      {name: '9', title: '0', value: false},
      {name: '10', title: '-0,25', value: false},
      {name: '11', title: '-0,5', value: false},
      {name: '12', title: '-0,75', value: true},
      {name: '13', title: '-1', value: false},
      {name: '14', title: '-1,25', value: false},
      {name: '15', title: '-1,5', value: false},
      {name: '16', title: '-1,75', value: true},
      {name: '17', title: '-2', value: false}
    ];

    this.options8 = [
      {name: '1', title: '5', value: true},
      {name: '2', title: '4', value: false},
      {name: '3', title: '3', value: true},
      {name: '4', title: '2', value: true},
      {name: '5', title: '1', value: false},
      {name: '6', title: '0', value: false}
    ];


  }

  ngOnInit() {
    this.betsService.nflBets()
    .subscribe(bets => this.afterDataReceived(bets));
  }

  private afterDataReceived(bets: Bet[]) {
    this.bets = bets;

  }

}
