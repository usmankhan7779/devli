import { Component, Input, OnInit } from '@angular/core';
import * as _ from 'lodash';
import { SimulatorMetricsService } from './simulator-metrics.service';
import { CommonService } from '../../../shared/services/common.service';
import { SimulatorService } from '../simulator.service';
import { DropdownService } from '../../../shared/components/dropdown/dropdown.service';

@Component({
  selector: 'app-simulator-metrics',
  templateUrl: './simulator-metrics.component.html',
  styleUrls: ['./simulator-metrics.component.scss']
})
export class SimulatorMetricsComponent implements OnInit {
  awayTeamDropdowns: any;
  homeTeamDropdowns: any;
  preselectedTeams = false;
  activeHome;
  activeAway;
  availableViews = this.simulatorService.availableViews;
  @Input() activeView: string;
  @Input() stadium: string;
  @Input() set dropdowns(val) {
    if (_.isEmpty(val)) {
      return;
    }
    if (!this.awayTeamDropdowns || !this.homeTeamDropdowns) {
      this.preselectedTeams = true;
    }
    this.awayTeamDropdowns = _.cloneDeep(val);
    this.homeTeamDropdowns = _.cloneDeep(val);
    if (this.preselectedTeams) {
      this.awayTeamDropdowns.teams[0].selected = true;
      this.homeTeamDropdowns.teams[1].selected = true;

      this.activeAway = this.awayTeamDropdowns.teams[0];
      this.activeHome = this.homeTeamDropdowns.teams[1];

      this.awayTeamDropdowns.seasons[0].selected = true;
      this.homeTeamDropdowns.seasons[0].selected = true;
      this.homeTeamDropdowns.weather[0].selected = true;

      const preselectedView = this.simulatorService.getPreselectedView();
      const preselectedTeamInfo = this.simulatorService.getPreselectedTeamData();

      this.simulatorService.removePreselectedView();
      this.simulatorService.removePreselectedTeamData();

      if (preselectedTeamInfo) {
        this.dropdownService.selectActiveItems(this.homeTeamDropdowns.teams, [preselectedTeamInfo.home], 'id');
        this.dropdownService.selectActiveItems(this.awayTeamDropdowns.teams, [preselectedTeamInfo.away], 'id');
      }
      this.onDropdownChange(preselectedView !== 'results');
      if (preselectedView) {
        this.onViewChange(preselectedView);
      }
    }
  };

  constructor(
    private simulatorMetricsService: SimulatorMetricsService,
    private simulatorService: SimulatorService,
    private commonService: CommonService,
    private dropdownService: DropdownService
  ) { }

  ngOnInit() {

  }

  onDropdownChange(updateData = true) {
    this.simulatorMetricsService.changeMetrics(this.homeTeamDropdowns, this.awayTeamDropdowns, {
      weather: this.homeTeamDropdowns.weather
    }, updateData);
    this.activeHome = this.commonService.getActiveCheckBoxItems(this.homeTeamDropdowns.teams, '', true)[0];
    this.activeAway = this.commonService.getActiveCheckBoxItems(this.awayTeamDropdowns.teams, '', true)[0];
    this.homeTeamDropdowns.teams = this.homeTeamDropdowns.teams.map(this.hideActiveId.bind(null, this.activeAway.id));
    this.awayTeamDropdowns.teams = this.awayTeamDropdowns.teams.map(this.hideActiveId.bind(null, this.activeHome.id));
  }

  private hideActiveId(id, item) {
    item.hidden = item.id === id;
    return item;
  }

  onViewChange(view) {
    if (this.activeView === view) {
      return;
    }
    this.simulatorService.onViewChange(view);
  }

  onWatchGameClick() {
    this.simulatorService.onWatchGameClick();
  }
}
