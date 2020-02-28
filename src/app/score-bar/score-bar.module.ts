
import { NgModule } from '@angular/core';
import { ScoreBarComponent } from './score-bar.component';
import { environment } from '../../environments/environment';
import { AngularFireLite } from 'angularfire-lite';
import { SWIPER_CONFIG, SwiperConfigInterface, SwiperModule } from 'ngx-swiper-wrapper';
import { RouterModule } from '@angular/router';
import { SharedModule } from '../shared/shared.module';
import { ScoreBarService } from './score-bar.service';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
// Swiper Config
const DEFAULT_SWIPER_CONFIG: SwiperConfigInterface = {
  direction: 'horizontal',
  slidesPerView: 'auto',
  keyboard: true
};

@NgModule({
  imports: [
    SwiperModule,
    NgbModule,
    SharedModule,
    RouterModule,
    AngularFireLite.forRoot(environment.firebase),
  ],
  declarations: [ScoreBarComponent],
  entryComponents: [ScoreBarComponent],
  providers: [
    {provide: 'LAZY_SCORE_BAR', useValue: ScoreBarComponent},
    {
      provide: SWIPER_CONFIG,
      useValue: DEFAULT_SWIPER_CONFIG
    },
    ScoreBarService
  ]
})
export class ScoreBarModule {

}
