import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NguiAutoCompleteModule } from '@ngui/auto-complete';

import { DollarsComponent } from './components/dollars/dollars.component';
import { RatingComponent } from './components/rating/rating.component';
import { RatingTenComponent } from './components/rating/rating-ten.component';
import { StatusComponent } from './components/status/status.component';
import { MatchupHeadingComponent } from './components/matchup-heading/matchup-heading.component';
import { DaySelectorComponent } from './components/day-selector/day-selector.component';
import { BreadcrumbComponent } from './components/breadcrumb/breadcrumb.component';
import { InjuriesComponent } from './components/injuries/injuries.component';

import { LineupComponent } from './components/lineup/lineup.component';
import { SwappableTableComponent } from './components/swappable-table/swappable-table.component';
import { InputWithIconComponent } from './components/input-with-icon/input-with-icon.component';
import { NextPlayComponent } from './components/next-play/next-play.component';
import { StatusOnlyComponent } from './components/status-only/status-only.component';
import { RostersHomePageComponent } from './components/rosters-home-page/rosters-home-page.component';
import { MomentModule } from 'ngx-moment';
import { VerticalList6XlColComponent } from './components/vertical-list-6-xl-col/vertical-list-6-xl-col.component';
import { BettingCardComponent } from './components/betting-card/betting-card.component';
import { SpinnerComponent } from './components/spinner/spinner.component';
import { MfSorterComponent, MfSorterApiComponent } from './components/mf-sorter/mf-sorter.component';
import { DataTableModule } from '@pascalhonegger/ng-datatable';
import { NgxPaginationModule } from 'ngx-pagination';

import { NotFoundComponent } from './components/not-found/not-found.component';
import { DropdownComponent } from './components/dropdown/dropdown.component';
import { PredictedBetsComponent } from './components/predicted-bets/predicted-bets.component';
import { GeneralTimeFormatComponent } from './components/general-time-format/general-time-format.component';
// tslint:disable-next-line:max-line-length
import { PredictionModelAccuracyResultsComponent } from './components/prediction-model-accuracy-results/prediction-model-accuracy-results.component';
import { NewsHomePageComponent } from './components/news-home-page/news-home-page.component';
import { SearchInputComponent } from './components/search-input/search-input.component';
import { StatsLeaderListComponent } from './components/stats-leader-list/stats-leader-list.component';
import { TeamListItemComponent } from './components/team-list-item/team-list-item.component';
import { TeamsPageComponent } from './components/teams-page/teams-page.component';
import { TwitterFollowBtnComponent } from './components/twitter-follow-btn/twitter-follow-btn.component';
import { WeekSelectorMobileComponent } from './components/week-selector-mobile/week-selector-mobile.component';
import { PlayersPageComponent } from './components/players-page/players-page.component';
import { StandingsPageComponent } from './components/standings-page/standings-page.component';
import { MatchupWinPropBoxComponent } from './components/matchup-win-prop-box/matchup-win-prop-box.component';
// tslint:disable-next-line:max-line-length
import { BettingCardWrapperWithControlsComponent } from './components/betting-card-wrapper-with-controls/betting-card-wrapper-with-controls.component';
import { BetCapComponent } from './components/bet-cap/bet-cap-component';
import { PlayerLinkComponent } from './components/player-link/player-link.component';
import { BeautyLogoTeamLinkComponent } from './components/beauty-logo-team-link/beauty-logo-team-link.component';
import { TeamGatewayItemComponent } from './components/team-gateway-item/team-gateway-item.component';
import { WpArticlesListComponent } from './components/wordpress/lineup-team-wp-articles-list/lineup-team-wp-articles-list.component';
import { ShortWpArticleComponent } from './components/wordpress/short-wp-article/short-wp-article.component';
import { DeferLoadComponent } from './components/defer-load/defer-load.component';
import { PipesModule } from './pipes/pipes.module';
import { DirectivesModule } from './directives/directives.module';
import { SharedComponentsModule } from './shared-components/shared-components.module';
import { ModalsModule } from './modals/modals.module';
import { MonkeyKnifeFightComponent } from './components/monkey-knife-fight/monkey-knife-fight.component';
import { ColorBadgeComponent } from './components/color-badge/color-badge.component';
import { NBAnoStatsComponent } from '../nba/stats/no-stats-component/no-stats.component';
import { FallbackImgComponent } from './components/fallback-img/fallback-img.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    NgbModule,
    NguiAutoCompleteModule,
    MomentModule,
    NgxPaginationModule,
    DataTableModule,
    PipesModule,
    ModalsModule,
    DirectivesModule,
    SharedComponentsModule
  ],
  declarations: [
    DollarsComponent,
    RatingComponent,
    ColorBadgeComponent,
    RatingTenComponent,
    StatusComponent,
    MatchupHeadingComponent,
    DaySelectorComponent,
    BreadcrumbComponent,
    InjuriesComponent,
    LineupComponent,
    SwappableTableComponent,
    StatusOnlyComponent,
    NextPlayComponent,
    InputWithIconComponent,
    VerticalList6XlColComponent,
    BettingCardComponent,
    SpinnerComponent,
    MfSorterComponent,
    MfSorterApiComponent,
    NotFoundComponent,
    DropdownComponent,
    PlayerLinkComponent,
    FallbackImgComponent,
    PredictedBetsComponent,
    PredictionModelAccuracyResultsComponent,
    GeneralTimeFormatComponent,
    NewsHomePageComponent,
    RostersHomePageComponent,
    SearchInputComponent,
    StatsLeaderListComponent,
    TeamListItemComponent,
    TeamsPageComponent,
    TwitterFollowBtnComponent,
    WeekSelectorMobileComponent,
    PlayersPageComponent,
    StandingsPageComponent,
    MatchupWinPropBoxComponent,
    BettingCardWrapperWithControlsComponent,
    BetCapComponent,
    BeautyLogoTeamLinkComponent,
    TeamGatewayItemComponent,
    WpArticlesListComponent,
    ShortWpArticleComponent,
    DeferLoadComponent,
    NBAnoStatsComponent
  ],
  exports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    PipesModule,
    ModalsModule,
    DirectivesModule,
    SharedComponentsModule,
    NguiAutoCompleteModule,
    MomentModule,
    DollarsComponent,
    RatingComponent,
    ColorBadgeComponent,
    RatingTenComponent,
    DaySelectorComponent,
    StatusComponent,
    MatchupHeadingComponent,
    DaySelectorComponent,
    BreadcrumbComponent,
    InjuriesComponent,
    LineupComponent,
    InputWithIconComponent,
    StatusOnlyComponent,
    SwappableTableComponent,
    NextPlayComponent,
    VerticalList6XlColComponent,
    BettingCardComponent,
    SpinnerComponent,
    MfSorterComponent,
    MfSorterApiComponent,
    NotFoundComponent,
    DropdownComponent,
    PredictedBetsComponent,
    PredictionModelAccuracyResultsComponent,
    GeneralTimeFormatComponent,
    PlayerLinkComponent,
    FallbackImgComponent,
    NewsHomePageComponent,
    RostersHomePageComponent,
    SearchInputComponent,
    StatsLeaderListComponent,
    TeamListItemComponent,
    TeamsPageComponent,
    TwitterFollowBtnComponent,
    WeekSelectorMobileComponent,
    PlayersPageComponent,
    StandingsPageComponent,
    MatchupWinPropBoxComponent,
    BettingCardWrapperWithControlsComponent,
    BetCapComponent,
    BeautyLogoTeamLinkComponent,
    TeamGatewayItemComponent,
    WpArticlesListComponent,
    ShortWpArticleComponent,
    DeferLoadComponent,
    MonkeyKnifeFightComponent,
    NBAnoStatsComponent
  ],
  entryComponents: [
    PlayerLinkComponent
  ]
})
export class SharedModule {}
