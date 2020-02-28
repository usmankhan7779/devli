import { NgModule } from '@angular/core';
import { NotificationModalComponent } from './notification-modal/notification-modal';
import { InputPanelModalComponent } from './input-panel-modal/input-panel-modal.component';
import { PlayerNewsModalComponent } from './player-news-modal/player-news-modal.component';
import { VideoModalComponent } from './video-modal/video-modal.component';
import { BetPredictorHelpButtonComponent } from './bet-predictor-help-button/bet-predictor-help-button.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { PipesModule } from '../pipes/pipes.module';

import { DirectivesModule } from '../directives/directives.module';
import { SharedComponentsModule } from '../shared-components/shared-components.module';
import { AdModalComponent } from './ad-modal/ad-modal.component';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    SharedComponentsModule,
    NgbModule,
    PipesModule,
    DirectivesModule
  ],
  declarations: [
    NotificationModalComponent,
    InputPanelModalComponent,
    PlayerNewsModalComponent,
    VideoModalComponent,
    BetPredictorHelpButtonComponent,
    AdModalComponent
  ],
  exports: [
    NotificationModalComponent,
    InputPanelModalComponent,
    PlayerNewsModalComponent,
    VideoModalComponent,
    BetPredictorHelpButtonComponent,
    AdModalComponent
  ],
  entryComponents: [
    NotificationModalComponent,
    InputPanelModalComponent,
    PlayerNewsModalComponent,
    VideoModalComponent,
    BetPredictorHelpButtonComponent,
    AdModalComponent
    // CreditCardModalComponent
  ]
})
export class ModalsModule {}
