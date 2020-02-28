import { Component, Input, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { PlatformLocation } from '@angular/common';

@Component({
  selector: 'app-notification-modal',
  templateUrl: './notification-modal.html',
  styleUrls: ['./notification-modal.scss']
})
export class NotificationModalComponent implements OnInit {
  @Input() text;
  @Input() header;
  @Input() btn;

  constructor(
    public activeModal: NgbActiveModal,
    private location: PlatformLocation
  ) {
    location.onPopState(() => {
      // ensure that modal is opened
      if (this.activeModal !== undefined) {
        this.activeModal.close();
      }
    });
  }

  ngOnInit() {
  }
}
