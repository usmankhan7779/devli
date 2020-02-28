import { GameDataService } from './game-data.service';
import { ModuleWithProviders, NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { InlineSVGModule } from 'ng-inline-svg';
import { AnimationComponent } from './animation.component';
import { FootballGameComponent } from './football-game/football-game.component';
import { GameBoxComponent } from './game-box/game-box.component';
import { FireworksComponent } from './fireworks/fireworks.component';
import { HeaderComponent } from './header/header.component';
import { FieldComponent } from './field/field.component';
import { ScoreBoxComponent } from './score-box/score-box.component';
import { BoxScoreComponent } from './box-score/box-score.component';
import { PlayByPlayComponent } from './play-by-play/play-by-play.component';
import { ScoringSummaryComponent } from './scoring-summary/scoring-summary.component';
import { GameReviewComponent } from './game-review/game-review.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { InlineSVGService } from 'ng-inline-svg/lib/inline-svg.service';
import { GameViewComponent } from './game-view/game-view.component';

const AnimationRouting: ModuleWithProviders = RouterModule.forChild([
  {
    path: ':gameId',
    component: GameViewComponent
  }
]);

@NgModule({
  declarations: [
    AnimationComponent,
    FootballGameComponent,
    GameBoxComponent,
    FireworksComponent,
    HeaderComponent,
    FieldComponent,
    ScoreBoxComponent,
    BoxScoreComponent,
    PlayByPlayComponent,
    ScoringSummaryComponent,
    GameReviewComponent,
    GameViewComponent
  ],
  imports: [
    NgbModule,
    CommonModule,
    RouterModule,
    InlineSVGModule,
    HttpClientModule,
    AnimationRouting
  ],
  exports: [
    FootballGameComponent
  ],
  providers: [GameDataService, InlineSVGService],
  // bootstrap: [AnimationComponent]
})
export class AnimationModule { }
