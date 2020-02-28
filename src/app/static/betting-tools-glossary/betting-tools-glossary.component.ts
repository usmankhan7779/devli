import { Component, OnInit } from '@angular/core';
import { BreadcrumbService } from '../../shared/components/breadcrumb/breadcrumb.service';

@Component({
  selector: 'app-betting-tools-glossary',
  templateUrl: './betting-tools-glossary.component.html',
  styleUrls: ['./betting-tools-glossary.component.scss']
})
export class BettingToolsGlossaryComponent implements OnInit {
  tabs = ['Bet Predictor'];
  activeTab = this.tabs[0];

  constructor(
    private breadcrumbService: BreadcrumbService
  ) { }

  ngOnInit() {
    this.breadcrumbService.changeBreadcrumbs([
      {
        label: 'Betting System',
        url: '/nfl/betting-system'
      },
      {
        label: 'Betting Tools Glossary',
        url: '/betting-tools-glossary'
      }
    ]);
  }

  onTabClick(tab: string) {
    this.activeTab = tab;
  }

}
