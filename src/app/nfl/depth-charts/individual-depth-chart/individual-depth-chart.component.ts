import { Component, HostListener, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { BreadcrumbService } from '../../../shared/components/breadcrumb/breadcrumb.service';
import { DepthChartService } from '../depth-chart.service';
import { NflService } from '../../nfl.service';
import { CommonService } from '../../../shared/services/common.service';
import { DropdownService } from '../../../shared/components/dropdown/dropdown.service';
import { TitleService } from '../../../shared/services/title.service';
import * as _ from 'lodash';
import { SpinnerService } from '../../../shared/components/spinner/spinner.service';
import { SchemaService } from '../../../shared/services/schema.service';
import { Meta } from '@angular/platform-browser';

@Component({
  selector: 'app-individual-depth-chart',
  templateUrl: './individual-depth-chart.component.html',
  styleUrls: ['./individual-depth-chart.component.scss']
})
export class IndividualDepthChartComponent implements OnInit, OnDestroy {
  readonly hoverBreakpoint = 1280  - 1; // screen min res  - 1
  readonly chartColors = [
    {
      backgroundColor: '#ffa1b6',
      borderColor: '#ffa1b6',
      pointBackgroundColor: '#ffa1b6',
      pointBorderColor: '#fff',
      pointHoverBackgroundColor: '#fff',
      pointHoverBorderColor: '#ffa1b6'
    },
    {
      backgroundColor: '#87c8f3',
      borderColor: '#87c8f3',
      pointBackgroundColor: '#87c8f3',
      pointBorderColor: '#fff',
      pointHoverBackgroundColor: '#fff',
      pointHoverBorderColor: '#87c8f3'
    }
  ];
  readonly chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    showTooltips: false,
    tooltips: {
      enabled: false
    },
    legend: {
      display: true,
      position: 'top',
      onClick: null,
      // labels: {
      //   padding: 25
      // }
    },
    scales: {
      yAxes: [{
        ticks: {
          display: false,
          beginAtZero: true
          // callback: (value) => {
          //   return '  ' + (Math.round(parseFloat(value) * 100) / 100);
          // }
        }
      }],
      xAxes: [{
        gridLines: {
          offsetGridLines: true,
        },
        ticks: {
          autoSkip : false,
          // maxRotation: 0,
          callback: (value, index) => {
            if (this.commonService.isBrowser() && window.innerWidth < 1700) {
              return 'Wk ' + value.split(' ')[1];
            }
            return value;
          }
        }
      }]
    },
    plugins: {
      datalabels: {
        align: 'center',
        color: 'black',
        display: function(context) {
          return context.dataset.data[context.dataIndex] > 0;
        },
        font: {
          weight: 'normal'
        },
        formatter: null
      }
    },
  };

  readonly maxOffenseTableLength = 5;
  offenseDictionarySkillPos = ['LWR', 'TE', 'SWR', 'RWR', 'QB', 'RB'];
  offenseDictionaryOLine = ['LT', 'LG', 'C', 'RG', 'RT'];
  offenseDictionary: any;
  defenseDictionary: any;
  offenseDictionaryArr: any[];
  defenseDictionaryArr: any[];
  currentWeek;
  pageTitle: string;
  isDefaultSeason: boolean;
  offensePlayersData: any[];
  defensePlayersData: any[];
  offensePlayersTableColArr: any[];
  // offenseSorting sorting Start
  offenseSorting = {
    sortByQBs: 'order',
    sortOrderQBs: 'asc',
    sortByRBs: 'order',
    sortOrderRBs: 'asc',
    sortByWRs: 'order',
    sortOrderWRs: 'asc',
    sortByTEs: 'order',
    sortOrderTEs: 'asc',
    sortByOLs: 'order',
    sortOrderOLs: 'asc'
  };
  // offenseSorting sorting End

  activeOffense: any;

  // defenseSorting sorting Start
  defenseSorting = {
    sortByDLs: 'order',
    sortOrderDLs: 'asc',
    sortByLBs: 'order',
    sortOrderLBs: 'asc',
    sortByDBs: 'order',
    sortOrderDBs: 'asc',
  };
  // defenseSorting sorting End

  // lastWeekLineupSorting sorting Start
  lastWeekLineupSorting = {
    sortByQBs: 'order',
    sortOrderQBs: 'asc',
    sortByRBs: 'order',
    sortOrderRBs: 'asc',
    sortByWRs: 'order',
    sortOrderWRs: 'asc',
    sortByTEs: 'order',
    sortOrderTEs: 'asc',
    sortByOLs: 'order',
    sortOrderOLs: 'asc'
  };
  // lastWeekLineupSorting sorting End

  depthChart: any;
  dropdownCollapsed: boolean;
  params: {year?: string, team_name: string};
  dropdownValues: any = {
    mainTab: [
      {
        name: 'All',
        selected: true
      },
      {
        name: 'Offense',
        selected: false
      },
      {
        name: 'Defense',
        selected: false
      }
    ],
    offenseTabs: [
      {
        name: 'Skill Positions',
        value: 'skill',
        selected: true
      },
      {
        name: 'O-Line',
        value: 'o-line',
        selected: false
      }
    ],
    depthChart: [
      {
        name: 'All',
        value: 'all',
        selected: true
      },
      {
        name: 'Offense Stats',
        value: 'offense',
        selected: false
      },
      {
        name: 'Defense Stats',
        value: 'defense',
        selected: false
      }
    ],
    season: [
      {
        name: 'Season',
        value: 'season'
      },
      {
        name: 'Last 3',
        value: 'last3'
      },
      {
        name: 'Last 5',
        value: 'last5'
      },
      {
        name: 'Last 8',
        value: 'last8'
      }
    ]
  };

  hide2018Elements: boolean;

  dropdownActiveValues = {
    mainTab: this.dropdownValues.mainTab[0],
    season: this.dropdownValues.season[0],
    depthChart: this.dropdownValues.depthChart[0],
    offenseTabs: this.dropdownValues.offenseTabs[0]
  };

  @HostListener('window:resize', ['$event']) onResize(event) {
    if (event.target.innerWidth <= this.hoverBreakpoint && this.activeOffense) {
      this.activeOffense = null;
    }
  }

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private commonService: CommonService,
    private breadcrumbService: BreadcrumbService,
    private depthChartService: DepthChartService,
    private dropdownService: DropdownService,
    private title: TitleService,
    private spinnerService: SpinnerService,
    private meta: Meta,
    private schemaService: SchemaService,
    private nflService: NflService
  ) { }

  ngOnInit() {
    this.currentWeek = this.nflService.getCurrentWeek();
    this.route.params.subscribe((params: Params) => {
      this.params = {
        team_name: params.team_name
      };
      this.handleResponse(this.route.snapshot.data['depthChart']);
    });
  }

  handleResponse(data, year?) {
    this.depthChart = data;
    if (this.depthChart.offensive_positions && this.depthChart.defensive_positions) {
      this.offenseDictionary = this.depthChart.offensive_positions;
      this.offenseDictionaryArr = this.depthChart.offense_dictionary_order;
      this.defenseDictionary = this.depthChart.defensive_positions;
      this.defenseDictionaryArr = this.depthChart.defense_dictionary_order;
    }

    this.params.year = year || this.depthChartService.getPreSelectedTeamSeason() ||
      this.nflService.getDefaultSeason(this.depthChart.seasons_dropdown);
    this.depthChartService.removePreSelectedTeamSeason();
    this.offensePlayersData = this.generateOffensePlayersData();
    this.defensePlayersData = this.generateDefensePlayersData();
    this.isDefaultSeason = this.nflService.checkIfDefaultSeason(this.params.year, this.depthChart.seasons_dropdown);
    this.pageTitle = this.depthChart.heading;
    if (this.depthChart.meta) {
      this.meta.removeTag('name="description"');
      this.meta.addTag({ name: 'description', content: this.depthChart.meta });
    }
    if (this.depthChart.page_title) {
      this.title.setTitle(this.depthChart.page_title);
    } else {
      this.title.setTitle(`${this.depthChart.header.team_name} Depth Chart ${this.params.year}`);
    }
    this.setSchema();
    this.breadcrumbService.changeBreadcrumbs([
      {label: 'NFL', url: '/nfl'},
      {label: 'Teams', url: '/nfl/teams'},
      {label: 'Depth Charts', url: '/nfl/depth-charts'},
      {
        label: this.nflService.handleYear(this.params.year),
        url: '/nfl',
        key: this.isDefaultSeason ? null : '/nfl/year',
        year: this.params.year
      },
      {
        label: this.pageTitle,
        url: `/nfl/depth-charts/${this.params.team_name}`
      }
    ]);
  }

  ngOnDestroy() {
    this.meta.removeTag('name="description"');
  }

  onYearDdChange(season) {
    if (season.year === 2018) {
      this.hide2018Elements = true;
      this.dropdownValues.mainTab = this.dropdownValues.mainTab.map(item => {
        item.selected = item.name === 'Offense';
        return item;
      });
    } else {
      this.dropdownValues.mainTab = this.dropdownValues.mainTab.map(item => {
        item.selected = item.name === 'All';
        return item;
      });
      this.hide2018Elements = false;
    }
    this.dropdownValues.offenseTabs = this.dropdownValues.offenseTabs.map(item => {
      item.selected = item.value === 'skill';
      return item;
    });
    this.dropdownValues.depthChart = this.dropdownValues.depthChart.map(item => {
      item.selected = item.value === 'all';
      return item;
    });
    this.dropdownActiveValues.mainTab = _.find(this.dropdownValues.mainTab, {selected: true});
    this.dropdownActiveValues.offenseTabs = this.commonService.getActiveCheckBoxItems(this.dropdownValues.offenseTabs, null, true)[0];
    this.dropdownActiveValues.depthChart = this.commonService.getActiveCheckBoxItems(this.dropdownValues.depthChart, null, true)[0];

    this.spinnerService.handleAPICall(this.depthChartService.getIndividualDepthChart(this.params.team_name, season.year))
      .subscribe(res => {
        this.handleResponse(res, season.year);
      });
  }

  onTabGroupClick(prop, tab) {
    if (tab) {
      this.dropdownValues[prop].forEach(item => {
        item.selected = tab.name === item.name;
      });
    }
    this.dropdownActiveValues[prop] = this.commonService.getActiveCheckBoxItems(this.dropdownValues[prop], null, true)[0];
    if (prop === 'mainTab') {
      this.onTabGroupClick('depthChart', _.find(this.dropdownValues.depthChart, {
        value: tab ? tab.name.toLowerCase() : this.dropdownActiveValues[prop].name.toLowerCase()
      }));
    }
    if (prop === 'offenseTabs') {
      this.activeOffense = null;
    }
  }

  performActionOnBreadcrumbClick(breadcrumb) {
    if (breadcrumb.key && breadcrumb.key === '/nfl/year' && breadcrumb.year) {
      this.nflService.setPreSelectedGatewaySeason(breadcrumb.year);
    }
  }

  onSortOrder(model, sortBy, sortOrder, mode, $event) {
    if (mode === 'by') {
      this[model][sortBy] = $event;
    } else if (mode === 'order') {
      this[model][sortOrder] = $event;
    }
  }

  onDropdownItemSelect(dropdown: string, selectedValue: string) {
    let selectedItem;
    for (const ddItem of this.dropdownValues[dropdown]) {
      if (ddItem.value === selectedValue) {
        selectedItem = ddItem;
      }
    }
    this.dropdownActiveValues[dropdown] = selectedItem;
  }

  isDefenseSchemaFourThree() {
    return this.depthChart.defensive_scheme === '4-3';
  }

  defineIfLongName(player) {
    if (!player) {
      return false;
    }
    return (player.name.length + (player.fantasy_position_depth_order || player.depth_order).toString().length) > 18;
  }

  onPosMouseOver(isDefense, position, player) {
    if (isDefense || !this.allowHoverFunctionality()) {
      return;
    }
    if (
      (!this.activeOffense || !this.activeOffense.player ||
        (player && this.activeOffense.player && this.activeOffense.player.id !== player.id)) ||
      ((!player && !this.activeOffense.player && this.activeOffense.position !== position) || (!player && this.activeOffense.player))) {
      this.activeOffense = {position, player, dataset: this.prepareBarChartDataSet(player)};
      return;
    }
  }

  private generateOffensePlayersData() {
    let res: any = [];
    for (const key in this.depthChart.offense_depth_chart) {
      if (this.depthChart.offense_depth_chart.hasOwnProperty(key)) {
        res.push(...this.depthChart.offense_depth_chart[key].season)
      }
    }
    res = _.groupBy(res, 'depth_position');

    const offenseTableLength = Math.max.apply(Math, Object.keys(res)
      .map((prop) => res[prop].length));
    this.offensePlayersTableColArr = new Array(
      (offenseTableLength >= this.maxOffenseTableLength ? this.maxOffenseTableLength : offenseTableLength)
    );
    return res
  }

  private generateDefensePlayersData() {
    let res: any = [];
    const allowedProps = [
      'defensive_backs',
      'defensive_line',
      'linebackers'
    ];
    for (const key in this.depthChart.defense_depth_chart) {
      if (this.depthChart.defense_depth_chart.hasOwnProperty(key) && _.includes(allowedProps, key)) {
        res.push(...this.depthChart.defense_depth_chart[key].season)
      }
    }
    res = _.groupBy(res, 'depth_position');
    return res
  }

  private prepareBarChartDataSet(player) {
    if (!player) {
      return false;
    }
    return {
      data: [
        {
          data: player.snaps_by_week || [],
          backgroundColor: '#ffa1b6',
          borderColor: '#ffa1b6',
          label: 'SNAPS/G'
        },
        {
          data: player.snap_percentage_by_week || [],
          backgroundColor: '#87c8f3',
          borderColor: '#87c8f3',
          label: 'SNAP %'
        }
      ],
      dates: player.snap_dates
    };
  }

  allowHoverFunctionality() {
    return this.commonService.isBrowser() && window.innerWidth > this.hoverBreakpoint;
  }

  getActiveImageItemClass(posType, position, className = '', activeClassName = 'image-item-active-hover') {
    if (posType === 'defense' || !this.activeOffense || !this.activeOffense.position || this.activeOffense.player) {
      return '' + className;
    }
    if (position === this.activeOffense.position) {
      return activeClassName + ' ' + className;
    }
    return '' + className;
  }

  private setSchema() {
    this.schemaService.addSchema([{
        '@context': 'http://schema.org',
        '@type': 'SportsTeam',
        'name': this.depthChart.nav.team_name_full,
        'sport': 'American Football',

        'url': `https://www.lineups.com${this.depthChart.nav.team_depth_chart_route}`,

        'memberOf': [
          {
            '@type': 'SportsOrganization',
            'name': 'NFL'
          },{
            '@type': 'SportsOrganization',
            'name': this.depthChart.nav.team_conference,
          },{
            '@type': 'SportsOrganization',
            'name': `${this.depthChart.nav.team_conference} ${this.depthChart.nav.team_division}`
          }
        ],
        'member': this.generateMembers()
      }, this.commonService.generateDatasetSchema(
        `${this.depthChart.nav.team_name_full} Depth Charts`,
      // tslint:disable-next-line:max-line-length
      `${this.depthChart.nav.team_name_full} team roster. Player names on the team depth charts, player rating, player number, player position, player rating, player stats.`,
      `${this.depthChart.nav.team_name_full} depth charts, ${this.depthChart.nav.team_name_full} players`,
      `https://www.lineups.com${this.depthChart.nav.team_depth_chart_route}`,
      'Dataset'
    )]);
  }

  private generateMembers() {
    let players = [];
    for (const key in this.depthChart.offense_depth_chart) {
      if (this.depthChart.offense_depth_chart.hasOwnProperty(key) && this.depthChart.offense_depth_chart[key].season) {
        players = _.concat(players, this.depthChart.offense_depth_chart[key].season.map(this.getPlayerData));
      }
    }
    for (const key in this.depthChart.defense_depth_chart) {
      if (this.depthChart.defense_depth_chart.hasOwnProperty(key) && this.depthChart.defense_depth_chart[key].season) {
        players = _.concat(players, this.depthChart.defense_depth_chart[key].season.map(this.getPlayerData));
      }
    }
    if (players && players.length) {
      players = _.uniqBy(players, 'name');
      return players.map(player => {
        return {
          '@type': 'OrganizationRole',
          'member': {
            '@type': 'Person',
            'name': player.name,
            'url': 'https://www.lineups.com' + player.profile_url,
          },
          'roleName': player.position
        }
      });
    }
    return [];
  }

  private getPlayerData(player) {
    return {
      name: player.name,
      position: player.position
    }
  }
}
