import { ModuleWithProviders, NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';


import { HomeComponent } from './home.component';
import { HomeService } from './home.service';
import { SharedModule } from '../shared/shared.module';

export const homeRouting: ModuleWithProviders = RouterModule.forChild([
  {
    path: '',
    component: HomeComponent,
    data: {
      title: 'Lineups: Starting Lineups, Rosters, Betting Odds, Fantasy Stats'
    }
  }
]);

@NgModule({
  imports: [
    SharedModule,
    NgbModule,
    homeRouting
  ],
  declarations: [
    HomeComponent
  ],
  providers: [
    HomeService
  ]
})
export class HomeModule {}
