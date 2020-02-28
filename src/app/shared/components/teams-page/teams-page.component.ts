import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import * as _ from 'lodash';
import { CommonService } from '../../services/common.service';
import { SchemaService } from '../../services/schema.service';


@Component({
  selector: 'app-teams-page',
  templateUrl: './teams-page.component.html',
  styleUrls: ['./teams-page.component.scss']
})
export class TeamsPageComponent implements OnInit {
  teamsData;
  filteredTeamsData;
  league;
  ddData;
  filterVal: string;

  @ViewChild('searchInput', {static: false}) searchInput;

  constructor(
    private route: ActivatedRoute,
    private commonService: CommonService,
    private schemaService: SchemaService
  ) { }

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.teamsData = this.route.snapshot.data['teamsData'];
      this.filteredTeamsData = this.route.snapshot.data['teamsData'].data;
      this.league = this.route.snapshot.data['league'];
      if (this.league === 'college-football') {
        const keys = _.groupBy(this.teamsData.data, 'conference_name');
        this.ddData = {
          conference: Object.keys(keys).map(val => {
            return {
              name: val,
              selected: true
            }
          })
        };
        this.teamsData.data = Object.keys(keys).map(item => {
          return {
            heading: item,
            divisions: keys[item]
          };
        });
        this.filteredTeamsData = this.teamsData.data.slice(0);
      } else if (this.league === 'nba') {
        this.schemaService.addSchema([this.commonService.generateDatasetSchema(
          'NBA Teams',
          // tslint:disable-next-line:max-line-length
          'List of all 30 NBA Teams with links to their lineup, roster, matchup and schedule. Teams are organized into divisions and conferences.',
          'nba teams, list of nba teams',
          'https://www.lineups.com/nba/teams',
          'Dataset'
        ), ...this.generateNbaTeamsSchema()]);
      } else if (this.league === 'nfl') {
        this.schemaService.addSchema([this.commonService.generateDatasetSchema(
          'NFL Teams',
          // tslint:disable-next-line:max-line-length
          'List of all NFL Teams with links to their depth chart, matchup, roster, matchup and schedule. Teams are organized into divisions and conferences.',
          'nfl teams, list of nfl teams',
          'https://www.lineups.com/nfl/teams',
          'Dataset'
        ), ...this.generateNflTeamsSchema()]);
      }
    });
  }

  onDdChange() {
    this.searchInput.clearSearchModel();
    this.ddData.activeConferences =  this.commonService.getActiveCheckBoxItems(this.ddData.conference, 'name');
    this.filteredTeamsData = this.getFilteredDataByConf();
  }

  filterByName(filterVal) {
    this.filterVal = filterVal;
    return this.filterTeams(this.getFilteredDataByConf(), filterVal);
  }

  updateTeams(data) {
    this.filteredTeamsData = data;
  }

  private getFilteredDataByConf() {
    if (this.ddData.activeConferences) {
      return this.teamsData.data.filter(value => _.includes(this.ddData.activeConferences, value.heading));
    }
    return this.teamsData.data.slice(0);
  }

  private filterTeams(data, filterVal) {
    const dataToFilter = _.cloneDeep(data);
    dataToFilter.forEach((conf) => {
      conf.divisions.forEach(div => {
        div.teams = div.teams.filter(item => item.full_name.toLowerCase().indexOf(filterVal.toLowerCase()) !== -1)
      });
      conf.divisions = conf.divisions.filter(div => div.teams.length);
    });
    return dataToFilter.filter((item) => {
      return item.divisions.length;
    });
  }

  private generateNbaTeamsSchema(): any[] {
    const teamsSchema = [];
    for (const conf of this.filteredTeamsData) {
      for (const division of conf.divisions) {
        for (const team of division.teams) {
          teamsSchema.push({
            '@context': 'http://schema.org',
            '@type': 'SportsTeam',
            'name': team.team_name_full,
            'sport': 'Basketball',
            'url': `https://www.lineups.com${team.team_lineup_route}`,
            'memberOf': [
              {
                '@type': 'SportsOrganization',
                'name': 'NBA'
              },
              {
                '@type': 'SportsOrganization',
                'name': conf.heading,
              },
              {
                '@type': 'SportsOrganization',
                'name': division.heading
              }
            ]
          });
        }
      }
    }
    return teamsSchema;
  }

  private generateNflTeamsSchema(): any[] {
    const teamsSchema = [];
    for (const conf of this.filteredTeamsData) {
      for (const division of conf.divisions) {
        for (const team of division.teams) {
          teamsSchema.push({
            '@context': 'http://schema.org',
            '@type': 'SportsTeam',
            'name': team.team_name_full,
            'sport': 'American Football',
            'url': `https://www.lineups.com${team.team_depth_chart_route}`,
            'memberOf': [
              {
                '@type': 'SportsOrganization',
                'name': 'NFL'
              },
              {
                '@type': 'SportsOrganization',
                'name': conf.heading,
              },
              {
                '@type': 'SportsOrganization',
                'name': division.heading
              }
            ]
          });
        }
      }
    }
    return teamsSchema;
  }

}
