import { Component, OnInit } from '@angular/core';
import { TitleService } from '../../../shared/services/title.service';
import { ActivatedRoute } from '@angular/router';
import { BreadcrumbService } from '../../../shared/components/breadcrumb/breadcrumb.service';
 
import { DropdownService } from '../../../shared/components/dropdown/dropdown.service';
import { SpinnerService } from '../../../shared/components/spinner/spinner.service';
import { CommonService } from '../../../shared/services/common.service';
 
import * as _ from 'lodash';
import { SortingService } from '../../../shared/services/sorting.service';
import { SchemaService } from '../../../shared/services/schema.service';
import { NflService } from 'app/nfl/nfl.service';
import { TeamService } from 'app/nfl/teams/team.service';
import { TeamRankingsService } from 'app/nfl/teams/team-rankings/team-rankings.service';


@Component({
  selector: 'app-nba-team-stats',
  templateUrl: './nba-team-stats.component.html',
  styleUrls: ['./nba-team-stats.component.scss']
})
export class NbaTeamStatsComponent implements OnInit {
  readonly teamLeadersDictionary = [
    'Passing',
    'Rushing',
    'Receiving',
    'Tackles',
    'Interceptions',
    'Field Goals'
  ];
  isCollapsed: boolean;
  dropdownCollapsed: boolean;
  isDefaultSeason: boolean;
  data;
  ratingConfig: any;
  ddData: any;
  pageTitle;
  set_title;
  params: {
    team_name: string
    year?: string
  };
  hasData: boolean;
  breadcrumbs = [];


  
  offenseSorting = {
     
    sortByTeamStats: 'date',
    sortOrderTeamStats: 'asc',
  };

  defenseSorting = {
    sortByTeamStats: 'date',
    sortOrderTeamStats: 'asc',
  };

  spSorting = {
    sortByTeamStats: 'name',
    sortOrderTeamStats: 'asc',
  };

  customSortFns = {
    sortByQbsPassYDS: this.customSort.bind(this, 'season_stats.passing_yards'),
    sortByWrsRecYDS: this.customSort.bind(this, 'season_stats.receiving_yards'),
    sortByRbsRecYDS: this.customSort.bind(this, 'season_stats.rushing_yards'),
    sortBySptsPuntRetPercentage: this.customSort.bind(this, 'season_stats.punt_return_percentage'),
    defFns: {
      tackles: this.customSort.bind(this, 'season_stats.tackles'),
      tackles_per_game: this.customSort.bind(this, 'season_stats.tackles_per_game'),
      solo_tackles: this.customSort.bind(this, 'season_stats.solo_tackles'),
      solo_tackles_per_game: this.customSort.bind(this, 'season_stats.solo_tackles_per_game'),
      assisted_tackles: this.customSort.bind(this, 'season_stats.assisted_tackles'),
      assisted_tackles_per_game: this.customSort.bind(this, 'season_stats.assisted_tackles_per_game'),
      tackles_for_loss: this.customSort.bind(this, 'season_stats.tackles_for_loss'),
      sacks: this.customSort.bind(this, 'season_stats.sacks'),
      sacks_per_game: this.customSort.bind(this, 'season_stats.sacks_per_game'),
      sack_yards: this.customSort.bind(this, 'season_stats.sack_yards'),
      quarterback_hits: this.customSort.bind(this, 'season_stats.quarterback_hits'),
      passes_defended: this.customSort.bind(this, 'season_stats.passes_defended'),
      passes_defended_per_game: this.customSort.bind(this, 'season_stats.passes_defended_per_game'),
      fumbles_forced: this.customSort.bind(this, 'season_stats.fumbles_forced'),
      fumbles_recovered: this.customSort.bind(this, 'season_stats.fumbles_recovered'),
      fumble_return_yards: this.customSort.bind(this, 'season_stats.fumble_return_yards'),
      fumble_return_touchdowns: this.customSort.bind(this, 'season_stats.fumble_return_touchdowns'),
      interceptions: this.customSort.bind(this, 'season_stats.interceptions'),
      interceptions_per_game: this.customSort.bind(this, 'season_stats.interceptions_per_game'),
      interception_return_yards: this.customSort.bind(this, 'season_stats.interception_return_yards'),
      interception_return_touchdowns: this.customSort.bind(this, 'season_stats.interception_return_touchdowns'),
      snaps: this.customSort.bind(this, 'season_stats.snaps'),
      snaps_percentage: this.customSort.bind(this, 'season_stats.snaps_percentage'),
    }
  };

  posSorting = {
    sortByQbs: this.customSortFns.sortByQbsPassYDS,
    sortOrderQbs: 'desc',
    sortByRbs: this.customSortFns.sortByRbsRecYDS,
    sortOrderRbs: 'desc',
    sortByWrs: this.customSortFns.sortByWrsRecYDS,
    sortOrderWrs: 'desc',
    sortByTes: 'season_stats.receiving_yards',
    sortOrderTes: 'desc',
    sortByFgs: 'season_stats.field_goals_made',
    sortOrderFgs: 'asc',
    sortByPss: 'season_stats.snaps',
    sortOrderPss: 'desc',
    sortByDefs: 'season_stats.snaps',
    sortOrderDefs: 'desc',
    sortBySpts: this.customSortFns.sortBySptsPuntRetPercentage,
    sortOrderSpts: 'desc',

  };

  constructor(
    private title: TitleService,
    private route: ActivatedRoute,
    private breadcrumbService: BreadcrumbService,
    private nflService: NflService,
    private dropdownService: DropdownService,
    private spinnerService: SpinnerService,
    private commonService: CommonService,
    private teamService: TeamService,
    private sortingService: SortingService,
    private schemaService: SchemaService,
    private teamRankingsService: TeamRankingsService
  ) { 
    this.ratingConfig = this.teamRankingsService.ratingConfig;
    this.route.params.subscribe(params => {
      this.params = {
        team_name: params.team_name.replace('-team-stats', ''),
      };
      this.handleResponse(this.route.snapshot.data['pageData']);     
    });

 
     
  }

  ngOnInit() {
  
  }

  getActiveTab(getAsName = false) {
    for (const key in this.ddData.tabs) {
      if (this.ddData.tabs.hasOwnProperty(key) && this.ddData.tabs[key]) {
        if (getAsName) {
          return key === 'all' ? 'All' : key.toUpperCase();
        }
        return key;
      }
    }
    return null;
  }

  onYearDdChange(season) {
    if (this.params.year === season.year) {
      return;
    }
    this.spinnerService.handleAPICall(this.teamService.getNbaTeamStatsData(this.params.team_name, season.year))
      .subscribe(res => {
        this.handleResponse(res, season.year);
      });
  }

  handleYear(year) {
    return this.nflService.handleYear(year);
  }

  onTabClick(position) {
    for (const key in this.ddData.tabs) {
      if (this.ddData.tabs.hasOwnProperty(key) && this.ddData.tabs[key]) {
        this.ddData.tabs[key] = false;
      }
    }
    this.ddData.tabs[position] = true;
  }

  onTeamRatingsTabClick(tab) {
    for (const key in this.ddData.teamRatingsTableDDs) {
      if (this.ddData.teamRatingsTableDDs.hasOwnProperty(key) && this.ddData.teamRatingsTableDDs[key]) {
        this.ddData.teamRatingsTableDDs[key] = false;
      }
    }
    this.ddData.teamRatingsTableDDs[tab] = true;
  }
  




  private handleResponse(data, year?) {
    this.data = data;
    this.checkData();
    // if (data.team_leaders) {
    //   this.data.team_leaders = _.groupBy(data.team_leaders, 'type');
    // }
    this.params.year = year || this.data.nav.matchup_season;
    if (!this.ddData) {
      this.ddData = this.getDDdObject();
      this.ddData.seasons = this.data.seasons_dropdown;
    }
    this.isDefaultSeason = this.nflService.checkIfDefaultSeason(this.params.year, this.data.seasons_dropdown);
    this.schemaService.addSchema([
        this.commonService.generateDatasetSchema(
        this.data.page_heading,
        `${this.data.nav.team_name_full} full team.` +
        ' Player names on the team, team stats, team rankings, team game logs, offensive stats, defensive stats.',
        `${this.data.nav.team_name_full} team stats,` +
        ` ${this.data.nav.team_name_full} sports team,` +
        ` ${this.data.nav.team_name_full} team players`,
        `https://www.lineups.com${this.data.nav.team_schedule_route}`,
        'Dataset',
      ),
      {
        '@context': 'http://schema.org',
        '@type': 'SportsTeam',
        'name': this.data.nav.team_name_full,
        'sport': 'American Football',

        'description': `${this.data.nav.team_name_full} full team.` +
          ' Player names on the team, team stats, team rankings, team game logs, offensive stats, defensive stats.',

        'url': `https://www.lineups.com${this.data.nav.team_schedule_route}`,

        'memberOf': [
          {
            '@type': 'SportsOrganization',
            'name': 'NBA'
          },{
            '@type': 'SportsOrganization',
            'name': this.data.nav.team_conference,
          },{
            '@type': 'SportsOrganization',
            'name': `${this.data.nav.team_conference} ${this.data.nav.team_division}`
          }
        ],
        'coach': {
          '@type': 'Person',
          'name': this.data.team_header.head_coach
        }
         
      }
    ]);
    // this.breadcrumbService.changeBreadcrumbs([
    //   {label: 'NBA', url: '/nba'},
    //   {label: 'NBA Team Stats', url: '/nba/team-stats'},
    //   {label: this.data.team_name_full, url: this.data.nav.team_stats_route},
    // ]);


    // this.pageTitle = this.data.page_data.heading;
    
    // this.title.setTitle(this.data.page_data.page_title);
    if ( this.data.heading ==  ""){
      
      this.pageTitle = this.data.nav.team_name_full
    }
    else if (this.data.heading !== ""){
      this.pageTitle = this.data.heading
       
    }
    console.log(this.pageTitle)
    if( this.data.page_title == ""){
      this.set_title = this.data.nav.team_name_full  
   
    }
    else if ( this.data.page_data !== ""){
      this.set_title = this.data.page_data
     
    }
    console.log(this.set_title)
    this.title.setTitle(this.set_title);
  
    this.breadcrumbService.changeBreadcrumbs(this.breadcrumbs)

    this.breadcrumbs =[
      {label: 'NBA', url: '/nba'},
      {label: 'NBA Team Stats', url: '/nba/team-stats'},
      {label: this.pageTitle, url: `/nba/team-stats/${this.params.team_name}`
    }
       
    ];

 
    // this.title.setTitle('Milwaukee Bucks Depth Chart 2020');
   
  }
 
  private generateMembers(prop, role) {
    let data;
    try {
      data = this.data[prop].map((player => {
        return {
          '@type': 'OrganizationRole',
          'member': {
            '@type': 'Person',
            'name': player.name,
            'url': 'https://www.lineups.com' + player.profile_url,
          },
          'roleName': role
        }
      }));
    } catch (e) {
      console.error('Error: generateMembers', prop, role, e);
      data = [];
    }
    return data;
  }

  private getDDdObject() {
    return {
      tabs: {
        'all': true,
        'team-stats': false,
        'player-stats': false
      },
      teamRatingsTableDDs: {
        'rank': true,
        '#': false
      }
    };
  }

  getLeader(leaderType) {
    let leader;
    try {
      leader = this.data.team_leaders[leaderType][0];
    } catch (err) {
      // console.error('No Such leader key in team_leaders object', leaderType);
    }
    return leader;
  }

  onSortOrder(model, sortBy, sortOrder, mode, $event) {
    if (mode === 'by') {
      this[model][sortBy] = $event;
    } else if (mode === 'order') {
      this[model][sortOrder] = $event;
    }
  }

  customSort(sortBy, row) {
    return this.sortingService.customSort(sortBy, row, (value) => {
      if (typeof value === 'string' && value.indexOf(',') !== -1) {
        return parseFloat(value.replace(/,/g, ''));
      }
      return parseFloat(value) || 0;
    });
  }

  checkData() {
    try {
      console.log('checking data');
      this.hasData = !!(this.data.team_offensive_stats.length );
      // && this.data.quarterback_stats.length && this.data.running_back_stats.length
    } catch (e) {
      this.hasData = false;
    }
  }
}
