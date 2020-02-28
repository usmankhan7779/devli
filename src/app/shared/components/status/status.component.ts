import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-status',
  templateUrl: './status.component.html',
  styleUrls: ['./status.component.scss']
})
export class StatusComponent implements OnInit {
  // side - 'left' or 'right'
  @Input() side: string;

  @Input() isHeader = false;

  @Input() teamName: string;
  
  @Input() mobileTitle: string;
  @Input() matchupMedia: boolean;

  // status - Confirmed - true or Projected - false , don't set a status if you don't want to display it
  @Input() status?: boolean;

  // record - wins-looses and division
  @Input() record: string;

  // some text under Record
  @Input() additionalInfo: string;

  // pitcher - is a pitcher information
  @Input() pitcherInfo: string;
  @Input() pitcherName: string;
  @Input() pitcherLink: string;

  // url to redirect on click
  @Input() redirectUrl: string;

  // url to no follow
  @Input() noFollow = false;

  @Output() teamWasClicked = new EventEmitter();


  constructor() { }

  ngOnInit() {
 console.log(this.teamName)
  }

  onTeamLinkClick() {
    this.teamWasClicked.emit();
  }
}
