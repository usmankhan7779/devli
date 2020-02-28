export class TeamRankingsService {

  readonly ratingConfig = {
    'green': 1,
    'light-green': 7,
    'yellow': 13,
    'orange': 19,
    'red': 25,
  };

  readonly columnHeaders = [
    'team',
    'offensive_rating_rank',
    'fantasy_points_rank',
    'offensive_plays_rank',
    'points_rank',
    'offensive_yards_rank',
    'passing_yards_rank',
    'passing_attempts_rank',
    'passing_completions_rank',
    'passing_touchdowns_rank',
    'rushing_yards_rank',
    'rushing_attempts_rank',
    'rushing_touchdowns_rank',
    'touchdowns_rank',

    'red_zone_attempts_rank',
    'red_zone_conversions_rank',
    'red_zone_percentage_rank',

    'first_downs_rank',
    'third_down_percentage_rank',
    'fourth_down_percentage_rank',

    'passing_interceptions_rank', // INTs  (ranking) ?
    'sacks_rank',
  ];

  readonly defenseColumnHeaders = [
    'team',
    'defensive_rating_rank',
    'fantasy_points_rank',
    'offensive_plays_rank',
    'points_rank',
    'offensive_yards_rank',
    'passing_yards_rank',
    'passing_attempts_rank',
    'passing_completions_rank',
    'passing_touchdowns_rank',
    'rushing_yards_rank',
    'rushing_attempts_rank',
    'rushing_touchdowns_rank',
    'touchdowns_rank',

    'red_zone_attempts_rank',
    'red_zone_conversions_rank',
    'red_zone_percentage_rank',

    'first_downs_rank',
    'third_down_percentage_rank',
    'fourth_down_percentage_rank',

    'passing_interceptions_rank', // INTs  (ranking) ?
    'sacks_rank',
  ];
  readonly spColumnHeaders = [
    'team',
    'overall_rating_rank',
    'field_goal_rank',
    'field_goal_attempts_rank',
    'field_goals_made_rank',
    'extra_point_kicking_attempts_rank',
    'extra_point_kicking_conversions_rank',
    'opponent_field_goal_attempts_rank',
    'opponent_field_goals_made_rank',
    'opponent_extra_point_kicking_attempts_rank',
    'opponent_extra_point_kicking_conversions_rank',
    'opponent_punts_rank',
    'opponent_punt_return_yards_rank',
    'opponent_kick_returns_rank',
    'opponent_kick_return_yards_rank',
    'punt_returns_rank',
    'kick_returns_rank',
    'punt_average_rank',
    'punt_net_average_rank',
  ];

  readonly headerMap = {
    'team' : 'Team',
    // 'overall_rating' : 'Rating',
    'overall_rating_rank' : 'Overall',
    'offensive_rating_rank' : 'Offense',
    'defensive_rating_rank' : 'Defense',
    'fantasy_points_rank' : 'FPTS',
    'offensive_plays_rank' : 'Plays',
    'points_rank' : 'Points',
    'offensive_yards_rank' : 'Yards',
    'passing_yards_rank' : 'Pass Yds',
    'passing_attempts_rank' : 'Pass Att',
    'passing_completions_rank' : 'Pass Comp',
    'passing_touchdowns_rank' : 'Pass TD',
    'rushing_yards_rank' : 'Rush Yds',
    'rushing_attempts_rank' : 'Rush Att',
    'rushing_touchdowns_rank' : 'Rush TD',
    'touchdowns_rank' : 'TD',

    'red_zone_attempts_rank' : 'RZ Att',
    'red_zone_conversions_rank' : 'RZ TD',
    'red_zone_percentage_rank' : 'RZ TD %',

    'first_downs_rank' : '1st Down',
    'third_down_percentage_rank' : '3rd Conv %',
    'fourth_down_percentage_rank' : '4th Conv %',
    'passing_interceptions_rank' : 'INTs',
    'sacks_rank' : 'Sacks',

    // SP
    'field_goal_rank': 'FG %',
    'punt_rank': 'Punt Ranking',
    'field_goal_attempts_rank': 'FGA',
    'field_goals_made_rank': 'FGM',
    'extra_point_kicking_attempts_rank': 'XPA',
    'extra_point_kicking_conversions_rank': 'XPM',
    'opponent_field_goal_attempts_rank': 'Opp FGA',
    'opponent_field_goals_made_rank': 'Opp FGM',
    'opponent_extra_point_kicking_attempts_rank': 'Opp XPA',
    'opponent_extra_point_kicking_conversions_rank': 'Opp XPM',
    'opponent_punts_rank': 'Opp Punts',
    'opponent_punt_return_yards_rank': 'Opp Punt RET Yds',
    'opponent_kick_returns_rank': 'Opp Kick RET',
    'opponent_kick_return_yards_rank': 'Opp Kick Ret Yds',
    'punt_returns_rank': 'Punt Ret',
    'kick_returns_rank': 'Kick Ret',
    'punt_average_rank': 'Punt Avg',
    'punt_net_average_rank': 'Punt Net Avg'
  };

  constructor() {}

  getColumnHeaders(type?: 'defense' | 'special-teams') {
    switch (type) {
      case 'special-teams': {
        return [...this.spColumnHeaders];
      }
      case 'defense': {
        return [...this.defenseColumnHeaders];
      }
      default: {
        return [...this.columnHeaders];
      }
    }
  }

  getColumnHeaderMap() {
    return {...this.headerMap};
  }
}
