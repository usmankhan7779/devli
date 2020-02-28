import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-beauty-logo-team-link',
  templateUrl: './beauty-logo-team-link.component.html',
  styleUrls: ['./beauty-logo-team-link.component.scss']
})
export class BeautyLogoTeamLinkComponent {
  @Input() league: 'nfl' | 'nba' | 'mlb';
  @Input() url: string;
  @Input() name: string;
  @Input() logo: string;
  @Input() hex: string;
  @Output() urlClicked = new EventEmitter();

  constructor(
  ) { }

  onUrlClick() {
    this.urlClicked.emit();
  }
}
