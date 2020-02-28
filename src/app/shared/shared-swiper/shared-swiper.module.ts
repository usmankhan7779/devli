import { NgModule } from '@angular/core';
import { SwiperModule } from 'ngx-swiper-wrapper';
import { WeekSelectorComponent } from './components/week-selector/week-selector.component';

@NgModule({
  imports: [
    SwiperModule,
  ],
  declarations: [
    WeekSelectorComponent
  ],
  exports: [
    WeekSelectorComponent
  ],
  entryComponents: [
  ]
})
export class SharedSwiperModule {}
