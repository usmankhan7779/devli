import { Component, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-ad-modal',
  templateUrl: './ad-modal.component.html',
  styleUrls: ['./ad-modal.component.scss']
})
export class AdModalComponent implements OnInit {
  constructor(
    public activeModal: NgbActiveModal,
  ) {
  }

  ngOnInit() {
  }

}
