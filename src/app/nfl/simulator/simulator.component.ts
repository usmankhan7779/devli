import { Component, OnDestroy, OnInit } from '@angular/core';
import { SimulatorService } from './simulator.service';
import { CommonService } from '../../shared/services/common.service';
import { Subscription } from 'rxjs';
import { SimulatorMetricsService } from './simulator-metrics/simulator-metrics.service';
import { TeamTableSwappableService } from './team-table-swappable/team-table-swappable.service';
import * as _ from 'lodash';
import { SpinnerService } from '../../shared/components/spinner/spinner.service';
import { Router } from '@angular/router';
import { AuthService } from '../../auth/auth.service';

@Component({
  selector: 'app-simulator',
  templateUrl: './simulator.component.html',
  styleUrls: ['./simulator.component.scss']
})
export class SimulatorComponent implements OnInit, OnDestroy {
  dropdowns;
  activeDropdownValues;
  historicTeamSlimData;
  simResultsData;
  isIframe: boolean;
  viewChangedSubscription: Subscription;
  simulatorMetricsSubscription: Subscription;
  onPlayerSwapSubscription: Subscription;
  gameClickSubscription: Subscription;
  activeView = 'game';
  availableViews = this.simulatorService.availableViews;
  topTabs = [
    {
      label: 'Team Slim',
      id: 0
    },
    {
      label: 'Historic Team Slim',
      id: 1
    },
    {
      label: 'Fantasy Team Slim',
      id: 2
    }
  ];
  activeTab = this.topTabs[1];

  constructor(
    private simulatorService: SimulatorService,
    private spinnerService: SpinnerService,
    private commonService: CommonService,
    private simulatorMetricsService: SimulatorMetricsService,
    private teamTableSwappableService: TeamTableSwappableService,
    private authService: AuthService,
    private router: Router
  ) { }

  ngOnInit() {
    this.isIframe = this.commonService.openedInIframe();
    this.viewChangedSubscription = this.simulatorService.viewHasBeenChanged
      .subscribe((view: string) => {
        if (view === this.availableViews[1]) {
          if (!this.historicTeamSlimData) {
            this.getHistoricTeamSlimData(() => {
              this.getSimResData(() => {
                this.activeView = view;
                this.scrollToZero();
              })
            })
          } else {
            this.getSimResData(() => {
              this.activeView = view;
              this.scrollToZero();
            })
          }
        } else {
          this.getHistoricTeamSlimData(() => {
            this.activeView = view;
            this.scrollToZero();
          })
        }
      });

    this.simulatorMetricsSubscription = this.simulatorMetricsService.simulatorMetricsChanged
      .subscribe((data: {homeActiveMetrics: any, awayActiveMetrics: any, generalActiveMetrics: any, updateData: boolean}) => {
        this.activeDropdownValues = {
          home: data.homeActiveMetrics,
          away: data.awayActiveMetrics,
          general: data.generalActiveMetrics
        };
        if (data.updateData) {
          if (this.activeView === this.availableViews[1]) {
            this.getSimResData();
          } else {
            this.getHistoricTeamSlimData();
          }
        }
      });

    this.gameClickSubscription = this.simulatorService.watchGameWasClicked
      .subscribe(() => {
        this.onWatchGameClick();
      });

    this.onPlayerSwapSubscription = this.teamTableSwappableService.onPlayersSwap
      .subscribe((data: {team: any, originalPlayer: any, newPlayer: any}) => {
        const historicTeamSlimData = _.clone(this.historicTeamSlimData);
        const originalPlayerIndex = _.findIndex(historicTeamSlimData[data.team].players, {player_id: data.originalPlayer.player_id});
        const newPlayerIndex = _.findIndex(historicTeamSlimData[data.team].swaps, {player_id: data.newPlayer.player_id});
        historicTeamSlimData[data.team].swaps[newPlayerIndex] = data.originalPlayer;
        historicTeamSlimData[data.team].players[originalPlayerIndex] = data.newPlayer;
        this.historicTeamSlimData = historicTeamSlimData;
      });

    this.initActions();
  }

  ngOnDestroy() {
    this.viewChangedSubscription.unsubscribe();
    this.gameClickSubscription.unsubscribe();
    this.simulatorMetricsSubscription.unsubscribe();
    this.onPlayerSwapSubscription.unsubscribe();
  }

  onWatchGameClick() {
    console.log('historicTeamSlimData', this.historicTeamSlimData);
    this.simulatorService.watchGameRequest(this.activeDropdownValues, this.historicTeamSlimData)
      .subscribe((res: {uuid: string}) => {
        this.router.navigate(['/nfl', 'watch-simulation', res.uuid]);
      });
  }

  onSimResClick() {
    this.getSimResData(() => {
      this.activeView = this.availableViews[1];
      this.scrollToZero();
    });
  }

  onTabClick(tab) {
    this.activeTab = tab;
  }

  getSimResData(callback?) {
    try {
      const homeTeamName = this.activeDropdownValues.home.teams.id;
      const homeTeamSeason = this.activeDropdownValues.home.seasons.name;
      const awayTeamName = this.activeDropdownValues.away.teams.id;
      const awayTeamSeason = this.activeDropdownValues.away.seasons.name;
      this.spinnerService.handleAPICall(this.simulatorService.getBoxScore(homeTeamName, homeTeamSeason, awayTeamName, awayTeamSeason))
        .subscribe(data => {
          this.simResultsData = data;
          if (callback) {
            callback();
          }
        });
    } catch (err) {
    }
  }
  getHistoricTeamSlimData(callback?) {
    try {
      const homeTeamName = this.activeDropdownValues.home.teams.id;
      const homeTeamSeason = this.activeDropdownValues.home.seasons.name;
      const awayTeamName = this.activeDropdownValues.away.teams.id;
      const awayTeamSeason = this.activeDropdownValues.away.seasons.name;
      this.spinnerService.handleAPICall(this.simulatorService.getSimulation(homeTeamName, homeTeamSeason, awayTeamName, awayTeamSeason))
        .subscribe(data => {
          this.historicTeamSlimData = data;
          if (callback) {
            callback();
          }
        });
    } catch (err) {
      console.error(err);
    }
  }

  private initActions() {
    this.simulatorService.getDropdownValues()
      .subscribe(res => {
        const dropdowns = {};
        dropdowns['seasons'] = this.commonService.prepareDDItems(res['seasons'], true, false);
        dropdowns['weather'] = this.commonService.prepareDDItems(res['weather'], true, false);
        dropdowns['teams'] = this.commonService.prepareDDItems(res['teams'], false, false, true).sort((a, b) =>{
          const teamNameA = a.name.toUpperCase();
          const teamNameB = b.name.toUpperCase();
          return (teamNameA < teamNameB) ? -1 : (teamNameA > teamNameB) ? 1 : 0;
        });
        dropdowns['tactic'] = this.commonService.prepareDDItems(['Offense', 'Defense'], true, false);
        this.dropdowns = dropdowns;
        if (this.commonService.isBrowser()) {
          setTimeout(() => {
            this.authService.showLoginPopup({
              loginHeader: 'Login to Continue',
              blockUserActivity: true
            });
          }, 15000);
        }
      });
  }

  private scrollToZero() {
    this.commonService.scrollTopPage();
  }
}
