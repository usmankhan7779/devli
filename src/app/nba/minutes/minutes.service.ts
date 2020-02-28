
import { of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { environment } from 'environments/environment';
import { Injectable } from '@angular/core';
import { TransferHttp } from '../../../modules/transfer-http/transfer-http';
import * as _ from 'lodash'


import { HttpParams } from '@angular/common/http';
import { NbaService } from '../nba.service';

@Injectable({
  providedIn: 'root'
})
export class MinutesService {
  private savedDD;

  // tslint:disable-next-line
  private minutesResponseCap = {"count":0,"next":null,"previous":null,"results":[],"heading":"NBA Minutes Per Game: Projected Minutes + Fantasy Points Per Minute","header_order":["name","game","position","10/12","10/13","10/14","10/15","10/16","10/17","10/18","10/19","10/20","10/21","total_minutes","points","rebounds","assists"],"header_map":{"turnovers":"TOV","game":"GAME","games":"G","fan_duel.projection":"Projection","double_doubles":"DD","fantasy_points_yahoo":"Yahoo Fantasy Points","fan_duel.salary":"Salary","position":"POS","rebounds":"REB","field_goals_made":"FGM","free_throws_made":"FTM","field_goals_attempted":"FGA","steals_percentage":"STL%","true_shooting_percentage":"TS%","fan_duel_per_game":"FPPG","fan_duel_per_minute":"FPPM","team":"TEAM","assists":"AST","draft_kings_salary":"DraftKings Salary","three_pointers_percentage":"3P5","plus_minus":"+/-","three_pointers_made":"3PM","draft_kings.projection":"Projection","offensive_rebounds":"ORB","three_pointers_attempted":"3PA","steals":"STL","fantasy_points_fan_duel":"FanDuel Fantasy Points","defensive_rebounds":"DRB","assists_percentage":"AST%","personal_fouls":"PF","free_throws_attempted":"FTA","fantasy_points_per_game_yahoo":"Yahoo Fantasy Points Per Game","field_goals_percentage":"FG%","effective_field_goals_percentage":"EFG%","fan_duel_salary":"FanDuel Salary","fantasy_points_draft_kings":"DraftKings Fantasy Points","draft_kings_per_game":"FPPG","draft_kings_per_minute":"FPPM","points":"PTS","fantasy_points_per_game_draft_kings":"DraftKings Fantasy Points Per Game","free_throws_percentage":"FT%","total_rebounds_percentage":"TRB%","usage_rate_percentage":"USG%","draft_kings.salary":"Salary","yahoo_salary":"Yahoo Salary","minutes":"MINS","player_efficiency_rating":"PER","name":"NAME","full_name":"NAME","offensive_rebounds_percentage":"ORB%","turn_overs_percentage":"TOV%","defensive_rebounds_percentage":"DRB%","blocks_percentage":"BLK%","blocked_shots":"BLK","triple_doubles":"TD","fantasy_points_per_game_fan_duel":"FanDuel Fantasy Points Per Game","started":"GS"},"per_game_header_map":{"turnovers":"TOV","game":"GAME","three_pointers_attempted":"3PA","fan_duel.projection":"Projection","double_doubles":"DD","fantasy_points_yahoo":"Yahoo Fantasy Points","fan_duel.salary":"Salary","position":"POS","rebounds":"REB","field_goals_made":"FGM","free_throws_made":"FTM","field_goals_attempted":"FGA","steals_percentage":"STL%","true_shooting_percentage":"TS%","fan_duel_per_game":"FPPG","fan_duel_per_minute":"FPPM","team":"TEAM","assists":"AST","draft_kings_salary":"DraftKings Salary","three_pointers_percentage":"3P5","plus_minus":"+/-","three_pointers_made":"3PM","draft_kings.projection":"Projection","offensive_rebounds":"ORB","games":"G","steals":"STL","fantasy_points_fan_duel":"FanDuel Fantasy Points","defensive_rebounds":"DRB","assists_percentage":"AST%","personal_fouls":"PF","free_throws_attempted":"FTA","fantasy_points_per_game_yahoo":"Yahoo Fantasy Points Per Game","field_goals_percentage":"FG%","effective_field_goals_percentage":"EFG%","fan_duel_salary":"FanDuel Salary","fantasy_points_draft_kings":"DraftKings Fantasy Points","draft_kings_per_game":"FPPG","draft_kings_per_minute":"FPPM","points":"PTS","fantasy_points_per_game_draft_kings":"DraftKings Fantasy Points Per Game","free_throws_percentage":"FT%","total_rebounds_percentage":"TRB%","usage_rate_percentage":"USG%","draft_kings.salary":"Salary","yahoo_salary":"Yahoo Salary","minutes":"MINS/G","player_efficiency_rating":"PER","name":"NAME","full_name":"NAME","offensive_rebounds_percentage":"ORB%","turn_overs_percentage":"TOV%","defensive_rebounds_percentage":"DRB%","blocks_percentage":"BLK%","blocked_shots":"BLK","triple_doubles":"TD","fantasy_points_per_game_fan_duel":"FanDuel Fantasy Points Per Game","started":"GS"},"headers":["10/12","10/13","10/14","10/15","10/16","10/17","10/18","10/19","10/20","10/21"],"teams_dropdown":["ATL","BKN","BOS","CHA","CHI","CLE","DAL","DEN","DET","GS","HOU","IND","LAC","LAL","MEM","MIA","MIL","MIN","NO","NY","OKC","ORL","PHI","PHO","POR","SA","SAC","TOR","UTA","WAS"],"intro_paragraph":"Minutes in NBA are a pretty straight forward way of figuring out which players are getting a majority of the run. Minutes mean fantasy production, and that is where we usually start. A player getting 35+ minutes means he is on the court producing at a solid rate. Lineups breaks down minutes by a date basis, showing you individual player’s minutes per game over the last 10 or 30 games. This is key because player’s minutes will change often throughout a season. This is also another way to keep an eye on players on back-to-back nights, or three games in four nights. Production will drop when players are in the midst of a tough part of the schedule. Next to minutes you can see basic stats to find quick production in a hurry. We want to match the production with heavy minutes because they go hand-in-hand. You have the option to view in a per-game sense, per possession, or per 36 minutes. Using per 36 can be a little misleading if a player gets in, mainly because usage and efficiency isn’t a guarantee. If you are looking to import this info, you can export the data via CSV.","page_title":"NBA Minutes Per Game, NBA Player Minutes","bottom_header":"","bottom_paragraph":"Rotations are very important to pay attention to, and can change throughout the year. Coaches will move players on and off the bench, but that does not necessarily mean minutes will change. Take a player like Lou Williams or Will Barton, their bench role means nothing for their minutes. They easily see over 30 minutes a night, and will get into the game within a few minutes of it starting. Coaches will often insert a player into the lineup to change things up during a bad stretch, but minutes can be tough to trust. The more frustrating part of fantasy basketball is the teams with log jams at positions, or coaches that simply just like to limit minutes. There is nothing worse than four to five players in a backcourt playing around 24-28 minutes a night. This means long lengthy rotations that limit upside for fantasy. Brooklyn is notorious for this given their eight million wings and guards. Keeping tabs on these scenarios is key for fantasy, and you can get an edge over others. Using this page to your advantage will give you that edge as well. Certain teams and players will make it easy on you, like LeBron James who somehow manages to plug in 35+ minutes a night at his age. Tom Thibodeau is one coach who is known for logging heavy minutes in the starting five. If every coach was like this then this section would be much shorter. You will find many of the Minnesota players up there in minutes, and Jimmy Butler knows all about that from his Chicago days. Use the “per game” and “per 36 minutes” stat views to keep tabs on players getting a chance at more minutes in the starting lineup. Take it with a grain of salt as this isn’t a standard projection for what to expect, as it is best to drop down the usage a bit.","meta":""};

  private ddsObj = {
    activeMain: {
      name: 'Minutes',
      prop: 'minutes',
      selected: true
    },
    activeSecondary: '10',
    activeThird: 'per_36',
    activeThirdFantasy: 'fan_duel',
    main: [
      {
        name: 'Minutes',
        prop: 'minutes',
        selected: true
      },
      {
        name: 'Stats',
        prop: 'stats',
        selected: false
      },
      {
        name: 'Fantasy Projections',
        prop: 'fantasy-projections',
        selected: false
      },
      {
        name: 'Fantasy Points',
        prop: 'fantasy',
        selected: false
      }
    ],
    secondary: [
      {
        name: 'Last 10',
        prop: '10',
        selected: true
      },
      {
        name: 'Last 30',
        prop: '30',
        selected: false
      },
      {
        name: 'Season',
        prop: 'season',
        selected: false
      }
    ],
    third: [
      {
        name: 'Per 36 Minutes',
        prop: 'per_36',
        selected: true
      },
      {
        name: 'Per 100 Possessions',
        prop: 'per_possession',
        selected: false
      },
      {
        name: 'Per Game',
        prop: 'per_game',
        selected: false
      }
    ],
    thirdFantasy: [
      {
        name: 'FanDuel',
        prop: 'fan_duel',
        selected: true
      },
      {
        name: 'DraftKings',
        prop: 'draft_kings',
        selected: false
      }
    ]
  };

  constructor(
    private http: TransferHttp,
    private nbaService: NbaService
  ) { }


  saveDD(ddObj) {
    this.savedDD = {...ddObj};
  }

  getSavedDD() {
    if (this.savedDD) {
      return {...this.savedDD};
    }
    return null;
  }

  removeSavedDD() {
    this.savedDD = null;
  }


  getDddObj(activeMain) {
    return {
      ..._.cloneDeep(this.ddsObj),
      activeMain: this.ddsObj.main.filter(item => activeMain === item.prop)[0]
    };
  }

  // type minutes | stats | fantasy
  getMinutes(year = 'current', type: string, game = '10', teams = [], page, itemsPerPage, sortBy, orderBy, playerName) {
    let _year;
    let params = new HttpParams();
    if (!page) {
      page = 1;
    }
    if (!year) {
      _year = 'current'
    } else {
      _year = year;
    }
    if (page && page.toString()) {
      params = params.append('page', page.toString());
    }
    if (game) {
      params = params.append('game', game);
    }
    if (itemsPerPage) {
      params = params.append('page_size', itemsPerPage.toString());
    }
    if (teams && teams.length) {
      params = params.append('teams', teams.join(','));
    }
    if (sortBy) {
      params = params.append('sort_by', sortBy);
    }
    if (orderBy) {
      params = params.append('order_by', orderBy);
    }
    if (playerName) {
      params = params.append('player', playerName.trim().toLowerCase());
    }
    const options = {
      params: params
    };
    const endpoint = `${environment.api_url}/nba/fetch/players/${_year}/${type}`;
    if (endpoint.indexOf('/nba/fetch/players/current/minutes') !== -1) {
      return of(this.minutesResponseCap);
    }
    return this.http.get(endpoint, options).pipe(
      catchError(() => {
        return of(null);
      }),
      map((res: any) => {
        if (res === null && endpoint.indexOf('/nba/fetch/players/current/minutes') !== -1) {
          // tslint:disable-next-line
          return this.minutesResponseCap;
        }
        if (res === null && endpoint.indexOf('/nba/fetch/players/current/fantasy') !== -1) {
            // tslint:disable
            return {
              "count": 0,
              "next": null,
              "previous": null,
              "results": [],
              "headers": [
                "10/12",
                "10/13",
                "10/14",
                "10/15",
                "10/16",
                "10/17",
                "10/18",
                "10/19",
                "10/20",
                "10/21"
              ],
              "heading": "NBA Fantasy Points Scored Per Game 2020",
              "teams_dropdown": [
                "ATL",
                "BKN",
                "BOS",
                "CHA",
                "CHI",
                "CLE",
                "DAL",
                "DEN",
                "DET",
                "GS",
                "HOU",
                "IND",
                "LAC",
                "LAL",
                "MEM",
                "MIA",
                "MIL",
                "MIN",
                "NO",
                "NY",
                "OKC",
                "ORL",
                "PHI",
                "PHO",
                "POR",
                "SA",
                "SAC",
                "TOR",
                "UTA",
                "WAS"
              ],
              "fan_duel_header_order": [
                "name",
                "game",
                "position",
                "10/12",
                "10/13",
                "10/14",
                "10/15",
                "10/16",
                "10/17",
                "10/18",
                "10/19",
                "10/20",
                "10/21",
                "fan_duel_per_game",
                "fan_duel_per_minute",
                "fan_duel.salary",
                "fan_duel.projection"
              ],
              "draft_kings_header_order": [
                "name",
                "game",
                "position",
                "10/12",
                "10/13",
                "10/14",
                "10/15",
                "10/16",
                "10/17",
                "10/18",
                "10/19",
                "10/20",
                "10/21",
                "draft_kings_per_game",
                "draft_kings_per_minute",
                "draft_kings.salary",
                "draft_kings.projection"
              ],
              "header_map": {
                "turnovers": "TOV",
                "game": "GAME",
                "games": "G",
                "fan_duel.projection": "Projection",
                "double_doubles": "DD",
                "fantasy_points_yahoo": "Yahoo Fantasy Points",
                "fan_duel.salary": "Salary",
                "position": "POS",
                "rebounds": "REB",
                "field_goals_made": "FGM",
                "free_throws_made": "FTM",
                "field_goals_attempted": "FGA",
                "steals_percentage": "STL%",
                "true_shooting_percentage": "TS%",
                "fan_duel_per_game": "FPPG",
                "fan_duel_per_minute": "FPPM",
                "team": "TEAM",
                "assists": "AST",
                "draft_kings_salary": "DraftKings Salary",
                "three_pointers_percentage": "3P5",
                "plus_minus": "+/-",
                "three_pointers_made": "3PM",
                "draft_kings.projection": "Projection",
                "offensive_rebounds": "ORB",
                "three_pointers_attempted": "3PA",
                "steals": "STL",
                "fantasy_points_fan_duel": "FanDuel Fantasy Points",
                "defensive_rebounds": "DRB",
                "assists_percentage": "AST%",
                "personal_fouls": "PF",
                "free_throws_attempted": "FTA",
                "fantasy_points_per_game_yahoo": "Yahoo Fantasy Points Per Game",
                "field_goals_percentage": "FG%",
                "effective_field_goals_percentage": "EFG%",
                "fan_duel_salary": "FanDuel Salary",
                "fantasy_points_draft_kings": "DraftKings Fantasy Points",
                "draft_kings_per_game": "FPPG",
                "draft_kings_per_minute": "FPPM",
                "points": "PTS",
                "fantasy_points_per_game_draft_kings": "DraftKings Fantasy Points Per Game",
                "free_throws_percentage": "FT%",
                "total_rebounds_percentage": "TRB%",
                "usage_rate_percentage": "USG%",
                "draft_kings.salary": "Salary",
                "yahoo_salary": "Yahoo Salary",
                "minutes": "MINS",
                "player_efficiency_rating": "PER",
                "name": "NAME",
                "full_name": "NAME",
                "offensive_rebounds_percentage": "ORB%",
                "turn_overs_percentage": "TOV%",
                "defensive_rebounds_percentage": "DRB%",
                "blocks_percentage": "BLK%",
                "blocked_shots": "BLK",
                "triple_doubles": "TD",
                "fantasy_points_per_game_fan_duel": "FanDuel Fantasy Points Per Game",
                "started": "GS"
              },
              "intro_paragraph": "Fantasy Basketball has blossomed into a large sport in the fantasy community, and more so on the daily fantasy sports side (DFS). This page leads you to the fantasy points scored per game on an individual player basis. Next to the current game projection, we showcase their recent stretch of games to see how they have been performing over the last 10 or 30 games. If you want to see across a full season, we have that too. You can flip between <a href=\"https://www.lineups.com/betting/draftkings/\">DraftKings</a> and <a href=\"https://www.lineups.com/betting/fanduel/\">FanDuel</a> scoring, where the NBA DFS product differs in scoring quite a bit. If you are looking to get this info into a CSV format, the button to download is on the upper right-hand side. You will also find the current day’s salary for DFS sites, as well as our own Lineups based rating for each player.",
              "page_title": "NBA Fantasy Points Scored Per Game",
              "bottom_header": "",
              "bottom_paragraph": "<h2 class=\"page-heading-two\">\r\n\tWhat is FPPM and FPPG? \r\n</h2>\r\n<p>\r\n\tFantasy points are generated through scoring, assists, rebounds, turnovers, and defensive stats. Depending on the site scoring, these can equal up to different amounts. Minutes are very important to basketball, because if a player is playing 30+ minutes, that means they are in a good spot to generate fantasy points. FPPM means fantasy points per minute. It is simply the overall outcome in fantasy points divided by the minutes played within a game or on a seasonal aspect. LeBron James is one of the best FPPM players, and when he averages 1.6 FPPM and also plays 35 minutes a night, he is averaging 56 fantasy points per game based on those numbers. This leads us to seeing fantasy points per game (FPPG).\r\n</p>\r\n<h2 class=\"page-heading-two\">\r\n\tUsing Previous History To Predict The Future\r\n</h2>\r\n\r\n<p>\r\n\tThings can get a little blurry when using historical outcomes to project future ones. At first we want to see larger sample sizes, because those tend to be less noisy and show more consistency when it comes to projecting. A player with a smaller sample size can have a number of reasons for why this production has improved or decreased. For example, if a bench player all of a sudden produces over the span of a week, there as to be a reason for why. He might be filling in for injury, or has earned himself a place in the starting lineup. It is crucial to know the reasons behind the production, because if that player comes back from injury, all of a sudden that production can’t be relied upon anymore. It is a helpful way to look at things, but it is just a small piece of the puzzle when it comes to projecting players. \r\n</p>\r\n<h2 class=\"page-heading-two\">\r\n\tHow To Use FPPM In Fantasy\r\n</h2>\r\n<p>\r\n\tFantasy points per minute is a good measure for fantasy production, although there are some disclaimers. Consistent starters have a more sound FPPM to base their production off of. Bench guys do not. If Fred VanVleet generates 1.25 FPPM off the bench, that doesn’t mean he will generate the same if he gets into the starting lineup. Usage changes when a player is off the bench and around other starts. You might see his FPPM dip in the starting lineup because he is playing alongside players with higher usages. If a rookie is posting a 1.10 FPPM and minutes are growing, this is a positive sign for his overall fantasy output.\r\n</p>",
              "meta": ""
            };
        }
        if (res && res.results && (type === 'fantasy' || type === 'stats') && res.results.length) {
          res.results = res.results.map(item => {
            try {
              const teamRoute = this.nbaService.getTeamByKey(item.team).team_route;
              if (teamRoute) {
                item.roster_route = `/nba/roster/${teamRoute}`;
              }
            } catch (e) {
              console.error('error', e);
            }
            return item;
          });
        }
        return res;
      }));
  }

  selectDDoption(ddData, activeProp, prop, selectedProp) {
    ddData[activeProp] = selectedProp;
    ddData[prop].forEach(item => {
      item.selected = item.prop === selectedProp;
    })
  }
}
