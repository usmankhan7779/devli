import { ModuleWithProviders, NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';


// Modules
import { SharedModule } from '../../shared/shared.module';
import { BettingToolsGlossaryComponent } from './betting-tools-glossary.component';

// Routes
export const staticRouting: ModuleWithProviders = RouterModule.forChild([
  {
    path: '',
    component: BettingToolsGlossaryComponent,
    data: {
      breadcrumb: null,
      title: 'Betting Tools Glossary'
    }
  }
]);

@NgModule({
  imports: [
    SharedModule,
    NgbModule,
    staticRouting
  ],
  declarations: [
    BettingToolsGlossaryComponent
  ]
})
export class BettingToolsGlossaryModule {}
