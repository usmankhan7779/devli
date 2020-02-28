import { TransferHttp } from '../../../modules/transfer-http/transfer-http';
import { Injectable } from '@angular/core';



@Injectable()
export class DepthChartsService {

  teamMap: any = {
    'arizona-diamondbacks': {
      'name': 'Arizona Diamondbacks',
      'lineup_url': '/mlb/lineups/arizona-diamondbacks',
      'color': '#A71930'
    },
    'atlanta-braves': {
      'name': 'Atlanta Braves',
      'lineup_url': '/mlb/lineups/atlanta-braves',
      'color': '#13274F'
    },
    'baltimore-orioles': {
      'name': 'Baltimore Orioles',
      'lineup_url': '/mlb/lineups/baltimore-orioles',
      'color': '#DF4601'
    },
    'boston-red-sox': {
      'name': 'Boston Red Sox',
      'lineup_url': '/mlb/lineups/boston-red-sox',
      'color': '#BD3039'
    },
    'chicago-cubs': {
      'name': 'Chicago Cubs',
      'lineup_url': '/mlb/lineups/chicago-cubs',
      'color': '#0E3386'
    },
    'chicago-white-sox': {
      'name': 'Chicago White Sox',
      'lineup_url': '/mlb/lineups/chicago-white-sox',
      'color': '#000000'
    },
    'cincinnati-reds': {
      'name': 'Cincinnati Reds',
      'lineup_url': '/mlb/lineups/cincinnati-reds',
      'color': '#C6011F'
    },
    'cleveland-indians': {
      'name': 'Cleveland Indians',
      'lineup_url': '/mlb/lineups/cleveland-indians',
      'color': '#E31937'
    },
    'colorado-rockies': {
      'name': 'Colorado Rockies',
      'lineup_url': '/mlb/lineups/colorado-rockies',
      'color': '#33006F'
    },
    'detroit-tigers': {
      'name': 'Detroit Tigers',
      'lineup_url': '/mlb/lineups/detroit-tigers',
      'color': '#0C2C56'
    },
    'houston-astros': {
      'name': 'Houston Astros',
      'lineup_url': '/mlb/lineups/houston-astros',
      'color': '#002D62'
    },
    'kansas-city-royals': {
      'name': 'Kansas City Royals',
      'lineup_url': '/mlb/lineups/kansas-city-royals',
      'color': '#004687'
    },
    'los-angeles-angels': {
      'name': 'Los Angeles Angels',
      'lineup_url': '/mlb/lineups/los-angeles-angels',
      'color': '#BA0021'
    },
    'los-angeles-dodgers': {
      'name': 'Los Angeles Dodgers',
      'lineup_url': '/mlb/lineups/los-angeles-dodgers',
      'color': '#005A9C'
    },
    'miami-marlins': {
      'name': 'Miami Marlins',
      'lineup_url': '/mlb/lineups/miami-marlins',
      'color': '#000000'
    },
    'milwaukee-brewers': {
      'name': 'Milwaukee Brewers',
      'lineup_url': '/mlb/lineups/milwaukee-brewers',
      'color': '#0A2351'
    },
    'minnesota-twins': {
      'name': 'Minnesota Twins',
      'lineup_url': '/mlb/lineups/minnesota-twins',
      'color': '#002B5C'
    },
    'new-york-mets': {
      'name': 'New York Mets',
      'lineup_url': '/mlb/lineups/new-york-mets',
      'color': '#002D72'
    },
    'new-york-yankees': {
      'name': 'New York Yankees',
      'lineup_url': '/mlb/lineups/new-york-yankees',
      'color': '#132448'
    },
    'oakland-athletics': {
      'name': 'Oakland Athletics',
      'lineup_url': '/mlb/lineups/oakland-athletics',
      'color': '#003831'
    },
    'philadelphia-phillies': {
      'name': 'Philadelphia Phillies',
      'lineup_url': '/mlb/lineups/philadelphia-phillies',
      'color': '#E81828'
    },
    'pittsburgh-pirates': {
      'name': 'Pittsburgh Pirates',
      'lineup_url': '/mlb/lineups/pittsburgh-pirates',
      'color': '#000000'
    },
    'san-diego-padres': {
      'name': 'San Diego Padres',
      'lineup_url': '/mlb/lineups/san-diego-padres',
      'color': '#05143F'
    },
    'san-francisco-giants': {
      'name': 'San Francisco Giants',
      'lineup_url': '/mlb/lineups/san-francisco-giants',
      'color': '#FD5A1E'
    },
    'seattle-mariners': {
      'name': 'Seattle Mariners',
      'lineup_url': '/mlb/lineups/seattle-mariners',
      'color': '#0C2C56'
    },
    'st-louis-cardinals': {
      'name': 'St. Louis Cardinals',
      'lineup_url': '/mlb/lineups/st-louis-cardinals',
      'color': '#C41E3A'
    },
    'tampa-bay-rays': {
      'name': 'Tampa Bay Rays',
      'lineup_url': '/mlb/lineups/tampa-bay-rays',
      'color': '#092C5C'
    },
    'texas-rangers': {
      'name': 'Texas Rangers',
      'lineup_url': '/mlb/lineups/texas-rangers',
      'color': '#003278'
    },
    'toronto-blue-jays': {
      'name': 'Toronto Blue Jays',
      'lineup_url': '/mlb/lineups/toronto-blue-jays',
      'color': '#134A8E'
    },
    'washington-nationals': {
      'name': 'Washington Nationals',
      'lineup_url': '/mlb/lineups/washington-nationals',
      'color': '#AB0003'
    }
  };

  teamMapArray = Object.keys(this.teamMap);

  constructor(
    private http: TransferHttp
  ) { }

  getMLBDepthCharts() {
    return this.http.get('https://depthcharts.com/wp-json/wp/v2/pages/1623')
  }
}

