import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { BreadcrumbService } from '../../../shared/components/breadcrumb/breadcrumb.service';
import { FantasyProjectionsService } from './fantasy-projections.service';
import { CommonService } from '../../../shared/services/common.service';
import { debounceTime } from 'rxjs/operators';
import { TitleService } from '../../../shared/services/title.service';
import { SchemaService } from '../../../shared/services/schema.service';
import * as FileSaver from 'file-saver';

@Component({
  selector: 'app-fantasy-projections',
  templateUrl: './fantasy-projections.component.html',
  styleUrls: ['../minutes-top-section.scss', './fantasy-projections.component.scss']
})
export class FantasyProjectionsComponent implements OnInit, OnDestroy {
  pageHeading = 'NBA Daily Fantasy Basketball Projections: DraftKings & FanDuel';
  dropdownCollapsed: boolean;
  minutesDDs: any = {
    fantasy: [
      {
        name: 'FanDuel',
        prop: 'fanduel',
        selected: true
      },
      {
        name: 'DraftKings',
        prop: 'draftkings',
        selected: false
      }
    ],
    teams: [],
    activeTeams: [],
    activeFantasy: 'fanduel'
  };
  data: any = {};
  bottomInfo: any = {
    // tslint:disable-next-line:max-line-length
    bottom_paragraph: '<p>Projections can get fairly tricky given minutes and usage can fluctuate on any given night. Foul trouble can instantly send a player to the bench which will limit his minutes for the rest of the game. There are some very notable players that have these types of issues, and makes their projection much more volatile. As mentioned usage can change at times, although this is less common. The most often scenario is a bench player joining the starting lineup. His usage is higher when he plays with players of less quality, which means entering the starting lineup is going to diminish role. At times we will see a player just simply not have it that night, and they know it. The usage can go to a player that is shooting lights out.</p><p>Golden State is a great example of fluctuating usage rates. Sometimes we will see Stephen Curry lead the way, and Kevin Durant take a bit more of a backseat. With the NBA starting to put together more and more super teams, like Minnesota, Houston, and Boston, the team’s usage starts to get a little bit more complicated. Ceiling projections start to go down, and consistency becomes a little lackluster. Defensive stats are the hard to cook into projections, and score-keeping can often be beneficial to the home team, but that is a story for another day. A player can rack up five steals in a game, and fantasy scoring has recently jumped those stats to more value. This gives defensive players a little bit more worth, and makes scoring for them a little less reliant for a good night in the box score. In comparison to other sports, NBA projections remain the most consistent to trust, and we can’t see that ever changing.</p>'
  };
  itemsPerPage: number;
  totalItems: number;
  csvText;
  csvShowed = false;
  searchModel: string;
  // tslint:disable-next-line:max-line-length
  introParagraph = 'We have you covered for your DFS needs, whether you are playing on FanDuel or DraftKings. NBA Projections are based on numerous matchup and player data to give you an edge in your DFS games. You will also have the ability to see the previous games data to find out what Durant’s fantasy outcomes have looked like of late. This is something people enjoy to do, and with the NBA being fairly consistent, a floor over the last ten games can be used as a good base. We also breakdown fantasy points per minute, which can be used for when players see an uptick or decrease in minutes. Now things can change with this. A bench players FPPM may be different for when he enters a starting lineup because the usage drops. Seasonal fantasy points per game and fantasy points per minute are also included for you to see who has been a fantasy king this season. Projections are current for today’s games, and can be exported into CSV form to bring into various tools. We also have our own personal Lineups rating next to each player to give our view on their overall grade in comparison to other players in the league.';
  searchTerm$ = new Subject<any>();
  searchByNameTerm$ = new Subject<any>();
  isOffseason: boolean;
  currentPage = 0;
  sortByFantasy = 'fanduel_projection';
  sortOrderFantasy = 'desc';
  colorConfig = this.fantasyProjectionsService.colorConfig;

  dataToShow = [];

  radios = ['All', 'PG', 'SG', 'SF', 'PF', 'C'];
  activeRadio = 'All';

  constructor(
    private breadcrumbService: BreadcrumbService,
    private commonService: CommonService,
    private title: TitleService,
    private schemaService: SchemaService,
    private fantasyProjectionsService: FantasyProjectionsService
  ) { }

  ngOnInit() {
    this.initSearchSubject(this.searchTerm$, 0);
    this.initSearchSubject(this.searchByNameTerm$, 700);
    this.breadcrumbService.changeBreadcrumbs([
      { label: 'NBA', url: '/nba' },
      { label: 'Players', url: '/nba/players' },
      { label: 'NBA Fantasy Projections', url: './' }
    ]);
    this.title.setTitle(this.pageHeading);
    this.minutesDDs.items_per_page = this.commonService.prepareDDItems([50, 100, 200, 500], true, false);
    this.minutesDDs.items_per_page[0].selected = true;
    this.itemsPerPage = this.minutesDDs.items_per_page[0].name;
    this.fantasyProjectionsService.getPlayers().subscribe(({data, teams}) => {
      this.data = data;
      this.minutesDDs.teams = teams.map(teamAbbr => {return {name: teamAbbr, selected: true}});
      this.minutesDDs.activeTeams = teams;
      this.searchTerm$.next();
    });
  }

  ngOnDestroy() {
    this.searchTerm$.unsubscribe();
    this.searchByNameTerm$.unsubscribe();
  }

  filterByName(filterVal) {
    this.searchModel = filterVal;
    this.searchByNameTerm$.next();
  }

  onPageChange(page) {
    this.currentPage = page;
  }

  onItemsPerPageChange() {
    this.itemsPerPage =  this.commonService.getActiveCheckBoxItems(this.minutesDDs['items_per_page'], 'name')[0];
  }

  onCsvClick() {
    this.updateCSVText();
    FileSaver.saveAs(new File([this.csvText], 'nba-fantasy-basketball-projections.csv', {type: 'text/plain;charset=utf-8'}));
  }

  onDropdownChange() {
    const prevActiveThirdFantasy = this.minutesDDs.activeFantasy;
    this.minutesDDs.activeFantasy = this.commonService.getActiveCheckBoxItems(this.minutesDDs.fantasy, 'prop')[0];
    this.minutesDDs.activeTeams = this.commonService.getActiveCheckBoxItems(this.minutesDDs.teams, 'name');
    // sort bug fix after 3rd dd change
    setTimeout(() => {
      this.handleTableSortingAfterDdChange('sortByFantasy',
        this.minutesDDs.activeFantasy, prevActiveThirdFantasy, 'fantasy');
    }, 10);
    this.searchTerm$.next();
  }

  private handleTableSortingAfterDdChange(sortBy, ddVal, prevDDVal, thirdName) {
    if (this[sortBy] && (this[sortBy].indexOf(this.minutesDDs[thirdName][0].prop) !== -1 ||
        this[sortBy].indexOf(this.minutesDDs[thirdName][1].prop) !== -1 || (
          this.minutesDDs[thirdName][2] && this[sortBy].indexOf(this.minutesDDs[thirdName][2].prop) !== -1))) {
      this[sortBy] = this.commonService.replaceStrAll(this[sortBy], prevDDVal, ddVal);
    }
  }

  isTabActive(name) {
    return this.activeRadio === name;
  }

  onRadioClick(name) {
    this.activeRadio = name;
    this.searchTerm$.next();
  }

  private updateCSVText() {
    const start = (this.currentPage === 1 || this.currentPage === 0 ? 0 : this.currentPage - 1) * this.itemsPerPage;
    const dataToCSV = this.dataToShow.slice(start, start + this.itemsPerPage).sort((aplayer, bplayer) => {
      if (aplayer[this.sortByFantasy] < bplayer[this.sortByFantasy]) {
        return this.sortOrderFantasy === 'desc' ? 1 : -1;
      }
      if (aplayer[this.sortByFantasy] > bplayer[this.sortByFantasy]) {
        return this.sortOrderFantasy === 'desc' ? -1 : 1;
      }
      return 0;
    });
    this.csvText = this.commonService.generateCSV(dataToCSV
      .map((player) => {
      const resObj = {};
      resObj['Name'] = player.full_name;
      resObj['Team'] = player.team;
      resObj['Pos'] = player[`${this.minutesDDs.activeFantasy}_position_display`];
      resObj['Projection'] = player[`${this.minutesDDs.activeFantasy}_projection`];
      resObj['Salary'] = player[`${this.minutesDDs.activeFantasy}_salary`];
      resObj['Pts/$1k'] = player[`${this.minutesDDs.activeFantasy}_ptsK`];
      resObj['FPPM'] = player[`${this.minutesDDs.activeFantasy}_fppm`];
      resObj['USG%'] = player.usage_rate_percentage;
      resObj['Opp'] = player.opponent;
      resObj['OPP Rank'] = player.opponent_rank;
      resObj['DVP'] = player.opponent_position_rank;
      resObj['Spread'] = player.spread || '';
      resObj['Total'] = player.vegas_total;
      resObj['O/U'] = player.over_under;
      resObj['Minutes'] = player.minutes;
      resObj['PTS'] = player.points;
      resObj['AST'] = player.assists;
      resObj['REB'] = player.rebounds;
      resObj['STL'] = player.steals;
      resObj['BLK'] = player.blocks;
      resObj['FT'] = player.free_throws;
      resObj['FGA'] = player.field_goal_attempts;
      resObj['FGM'] = player.field_goal_made;
      resObj['PER'] = player.player_efficiency_rating;
      resObj['FG%'] = player.field_goal_percentage;
      resObj['eFG%'] = player.effective_field_goal_percentage;
      return resObj;
    }));
  }

  private initSearchSubject(searchTerm$, debounceTimeArg) {
    searchTerm$
      .pipe(
        debounceTime(debounceTimeArg)
      )
      .subscribe(() => {
        this.dataToShow = this.data.filter(player => {
          // hide if not search model filtering || radio filtering || team filtering
          if (
            (this.searchModel && this.searchModel.length &&
              player.full_name.toLowerCase().indexOf(this.searchModel.toLowerCase()) === -1) ||
            (this.activeRadio !== this.radios[0] && player[`${this.minutesDDs.activeFantasy}_position`].indexOf(this.activeRadio) === -1) ||
            this.minutesDDs.activeTeams.indexOf(player.teamAbbr) === -1
          ) {
            return false;
          }
          return true;
        });
        this.setSchema(this.dataToShow);
        this.totalItems = this.dataToShow.length;
      });
  }

  onSortOrder(sortBy, sortOrder, mode, $event) {
    if (mode === 'by') {
      this[sortBy] = $event;
    } else if (mode === 'order') {
      this[sortOrder] = $event;
    }
  }

  private generatePlayersSchema(data) {
    return data.map((player) => {
      return {
        '@context': 'http://schema.org',

        '@type': 'Person',

        'name': player.full_name,

        'url': 'https://www.lineups.com' + player.profile_url,

        'jobTitle': player[`${this.minutesDDs.activeFantasy}_position_display`],

        'memberOf': [
          {
            '@type': 'SportsTeam',
            'name': player.team,
            'sport': 'Basketball',
            'memberOf': [
              {
                '@type': 'SportsOrganization',
                'name': 'NBA'
              }
            ]
          }
        ]
      }
    });
  }

  private setSchema(data) {
    let playersSchema = [];
    if (data && data.length) {
      playersSchema = this.generatePlayersSchema(data);
    }
    const pageDataSet = this.commonService.generateDatasetSchema(
      this.pageHeading,
      // tslint:disable-next-line:max-line-length
      'NBA fantasy basketball projections for fanduel and draftkings websites. Includes player salary, game, ratings, position, projection and fantasy points scored over the past 10 games, 30 games or season. Fantasy points per game and fantasy points per minute is also available.',
      'nba fantasy projections, fantasy basketball projections, draftkings nba fantasy projections, fanduel nba fantasy projections',
      'https://www.lineups.com/nba/nba-fantasy-basketball-projections',
      'Dataset'
    );
    this.schemaService.addSchema([pageDataSet, ...playersSchema]);
  }
}
