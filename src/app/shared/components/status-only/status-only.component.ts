import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-status-only',
  templateUrl: './status-only.component.html',
  styleUrls: ['./status-only.component.scss']
})
export class StatusOnlyComponent implements OnInit {
  @Input() status;
  @Input() allowShortNames: boolean;
  @Input() hideText: boolean;
  @Input() onlyShortNames: boolean;
  @Input() altView: boolean;
  constructor() { }

  ngOnInit() {
  }

}
