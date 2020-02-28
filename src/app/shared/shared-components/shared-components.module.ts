import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { PipesModule } from '../pipes/pipes.module';

import { ArrowsUpDownComponent } from './components/arrows-up-down/arrows-up-down.component';
import { DirectivesModule } from '../directives/directives.module';
import { NewsItemComponent } from './components/news-item/news-item.component';
import { MomentModule } from 'ngx-moment';
import { AdComponent } from './components/ad-component/ad.component';
import { MonkeyKnifeFightComponent } from '../components/monkey-knife-fight/monkey-knife-fight.component';
import { FanduelComponent } from './components/ad-component/fanduel/fanduel.component';
import { PennsylvaniaComponent } from './components/ad-component/pennsylvania-banner/pennsylvania.component';
import { AdVideoComponent } from './components/ad-component/ad-video/ad-video.component';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    NgbModule,
    MomentModule,
    PipesModule,
    DirectivesModule
  ],
  declarations: [
    ArrowsUpDownComponent,
    NewsItemComponent,
    MonkeyKnifeFightComponent,
    FanduelComponent,
    PennsylvaniaComponent,
    AdVideoComponent,
    AdComponent
  ],
  exports: [
    ArrowsUpDownComponent,
    NewsItemComponent,
    MonkeyKnifeFightComponent,
    FanduelComponent,
    PennsylvaniaComponent,
    AdVideoComponent,
    AdComponent
  ],
  entryComponents: [
  ]
})
export class SharedComponentsModule {}
