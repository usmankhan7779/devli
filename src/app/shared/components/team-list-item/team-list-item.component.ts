import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-team-list-item',
  templateUrl: './team-list-item.component.html',
  styleUrls: ['./team-list-item.component.scss']
})
export class TeamListItemComponent implements OnInit {
  @Input() league: string;
  @Input() item: any;
  constructor() { }

  ngOnInit() {
  }

}
