import { Component, HostListener, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { BreadcrumbService } from '../../../shared/components/breadcrumb/breadcrumb.service';
import { DepthChartService } from '../depth-chart.service';
import { CommonService } from '../../../shared/services/common.service';
import { DropdownService } from '../../../shared/components/dropdown/dropdown.service';
import { TitleService } from '../../../shared/services/title.service';
import * as _ from 'lodash';
import * as moment from 'moment';
import { NbaService } from '../../nba.service';
import { SpinnerService } from '../../../shared/components/spinner/spinner.service';
import { TeamLineupService } from '../../team-lineup/team-lineup.service';
import { Meta } from '@angular/platform-browser';

@Component({
  selector: 'app-individual-depth-chart',
  templateUrl: './individual-depth-chart.component.html',
  styleUrls: ['./individual-depth-chart.component.scss']
})
export class IndividualDepthChartComponent implements OnInit, OnDestroy {
  readonly hoverBreakpoint = 1280  - 1; // screen min res  - 1
  readonly posKeys = ['point_guards', 'shooting_guards', 'small_forwards', 'power_forwards', 'centers'];
  readonly chartColors = {
    chart1: [
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
      },
    ],
    chart2: [
      {
        backgroundColor: '#8794f3',
        borderColor: '#8794f3',
        pointBackgroundColor: '#8794f3',
        pointBorderColor: '#fff',
        pointHoverBackgroundColor: '#fff',
        pointHoverBorderColor: '#8794f3'
      },
      {
        backgroundColor: '#f3c387',
        borderColor: '#f3c387',
        pointBackgroundColor: '#f3c387',
        pointBorderColor: '#fff',
        pointHoverBackgroundColor: '#fff',
        pointHoverBorderColor: '#f3c387'
      }
    ]
  };
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
          callback: (value) => {
            if (value) {
              return moment(value).format('M/D');
            }
            return '';
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
  pageTitle: string;
  readonly maxOffenseTableLength = 5;
  offenseDictionary = {
    'PG': 'Point Guard',
    'SG': 'Shooting Guard',
    'SF': 'Small Forward',
    'PF': 'Power Forward',
    'C': 'Center'
  };
  offenseDictionaryArr = Object.keys(this.offenseDictionary).map(key => key);
  isDefaultSeason: boolean;
  offensePlayersData: any[];
  offensePlayersTableColArr: any[];
  // offenseSorting sorting Start
  offenseSorting = {
    sortByPGs: 'order',
    sortOrderPGs: 'asc',
    sortBySGs: 'order',
    sortOrderSGs: 'asc',
    sortBySFs: 'order',
    sortOrderSFs: 'asc',
    sortByPFs: 'order',
    sortOrderPFs: 'asc',
    sortByCs: 'order',
    sortOrderCs: 'asc'
  };
  // offenseSorting sorting End

  activeOffense: any;

  depthChart: any;
  dropdownCollapsed: boolean;
  params: {year: string, team_name: string};
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
    private teamLineupService: TeamLineupService,
    private nbaService: NbaService,
    private meta: Meta,
    private spinnerService: SpinnerService
  ) { }

  ngOnInit() {
    this.route.params.subscribe((params: Params) => {
      this.handleApiResponse(this.route.snapshot.data['data'], null, params);
    });
  }

  ngOnDestroy() {
    this.meta.removeTag('name="description"');
  }

  onYearDdChange(season) {
    this.spinnerService.handleAPICall(this.depthChartService.getIndividualDepthChart(this.params.team_name, season.year))
      .subscribe(res => {
        this.teamLineupService.changeTeamLineupYear(res, season.year);
        this.handleApiResponse(res, season.year, this.params);
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
      this.onTabGroupClick('depthChart', _.find(this.dropdownValues.depthChart, {value: tab.name.toLowerCase()}));
    }
    if (prop === 'offenseTabs') {
      this.activeOffense = null;
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

  defineIfLongName(player) {
    if (!player) {
      return false;
    }
    return (player.name.length + player.depth_chart_order.toString().length) > 18;
  }

  onPosMouseOver(isDefense, depth_chart_position, player) {
    if (isDefense || !this.allowHoverFunctionality()) {
      return;
    }
    if (
      (!this.activeOffense || !this.activeOffense.player ||
        (player && this.activeOffense.player && this.activeOffense.player.player_id !== player.player_id)) ||
      ((!player && !this.activeOffense.player && this.activeOffense.depth_chart_position !== depth_chart_position) ||
        (!player && this.activeOffense.player))) {
      this.activeOffense = {depth_chart_position, player, dataset: this.prepareBarChartDataSet(player)};
      console.log(this.activeOffense, 'skill');
      return;
    }
  }

  private generateOffensePlayersData() {
    let res: any = [];
    for (const key of this.posKeys) {
      if (this.depthChart.hasOwnProperty(key)) {
        this.depthChart[key].sort((a, b) => {
          return a.depth_chart_order - b.depth_chart_order;
        });
        res.push(...this.depthChart[key])
      }
    }
    res = _.groupBy(res, 'depth_chart_position');

    const offenseTableLength = Math.max.apply(Math, Object.keys(res)
      .map((prop) => res[prop].length));
    this.offensePlayersTableColArr = new Array(
      (offenseTableLength >= this.maxOffenseTableLength ? this.maxOffenseTableLength : offenseTableLength)
    );
    return res
  }

  private prepareBarChartDataSet(player) {
    if (!player || !player.last_7_games) {
      return false;
    }
    return {
      data: {
        chart1: [
          {
            data: this.getSevenItems(player.last_7_games.map(item => item.points)),
              backgroundColor: this.chartColors.chart1[0].backgroundColor,
            borderColor: this.chartColors.chart1[0].backgroundColor,
            label: 'PPG'
          },
          {
            data: this.getSevenItems(player.last_7_games.map(item => item.minutes)),
              backgroundColor: this.chartColors.chart1[1].backgroundColor,
            borderColor: this.chartColors.chart1[1].backgroundColor,
            label: 'MPG'
          },
        ],
        chart2: [
          {
            data: this.getSevenItems(player.last_7_games.map(item => item.rebounds)),
            backgroundColor: this.chartColors.chart2[0].backgroundColor,
            borderColor: this.chartColors.chart2[0].backgroundColor,
            label: 'RPG'
          },
          {
            data: this.getSevenItems(player.last_7_games.map(item => item.assists)),
            backgroundColor: this.chartColors.chart2[1].backgroundColor,
            borderColor: this.chartColors.chart2[1].backgroundColor,
            label: 'APG'
          }
        ]
      },
      dates: this.getSevenItems(player.last_7_games.map(item => item.day))
    };
  }

  private getSevenItems(arr) {
    const array = [];
    for (let i = 0; i < 7; i++) {
      array[i] = arr[i];
    }
    return array;
  }

  private handleApiResponse(depthChart, year, params) {
    this.depthChart = depthChart;

    if (this.depthChart.page_data.meta) {
      this.meta.removeTag('name="description"');
      this.meta.addTag({ name: 'description', content: this.depthChart.page_data.meta });
    }

    this.params = {
      year: year || this.depthChartService.getPreSelectedTeamSeason() ||
      params.year || this.depthChart.season || this.nbaService.getDefaultSeason(this.depthChart.seasons_dropdown),
      team_name: params.team_name
    };
    this.depthChartService.removePreSelectedTeamSeason();
    this.offensePlayersData = this.generateOffensePlayersData();
    this.isDefaultSeason = this.nbaService.checkIfDefaultSeason(this.params.year, this.depthChart.seasons_dropdown);
    if (!this.dropdownValues || !this.dropdownValues.seasons) {
      const orderedSeasons = this.depthChart.seasons_dropdown.sort().reverse();
      const seasons = [];
      orderedSeasons.forEach((season) => {
        seasons.push({
          name: season.name,
          year: season.default ? 'current' : season.year,
          selected: season.default
        });
      });
      this.dropdownValues.seasons = orderedSeasons;
    }
    this.pageTitle = this.depthChart.page_data.heading;
    this.title.setTitle(this.depthChart.page_data.page_title);
    this.breadcrumbService.changeBreadcrumbs([
      {label: 'NBA', url: '/nba'},
      {label: 'Teams', url: '/nba/teams'},
      {label: 'Depth Charts', url: '/nba/depth-charts'},
      {
        label: this.nbaService.handleYear(this.params.year),
        url: '/nba',
        key: this.isDefaultSeason ? null : '/nba/year',
        year: this.params.year
      },
      {
        label: this.pageTitle,
        url: `/nba/depth-charts/${this.params.team_name}`
      }
    ]);
  }

  allowHoverFunctionality() {
    return this.commonService.isBrowser() && window.innerWidth > this.hoverBreakpoint;
  }

  showYear(year) {
    return this.nbaService.handleYear(year);
  }

  getActiveImageItemClass(posType, depth_chart_position, className = '', activeClassName = 'image-item-active-hover') {
    if (posType === 'defense' || !this.activeOffense || !this.activeOffense.depth_chart_position || this.activeOffense.player) {
      return '' + className;
    }
    if (depth_chart_position === this.activeOffense.depth_chart_position) {
      return activeClassName + ' ' + className;
    }
    return '' + className;
  }
}
