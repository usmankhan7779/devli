import { Component, OnInit } from '@angular/core';
import { ServerResponseService } from '../../services/server-response.service';

@Component({
  selector: 'app-not-found',
  templateUrl: './not-found.component.html',
  styleUrls: ['./not-found.component.scss']
})
export class NotFoundComponent implements OnInit {

  constructor(private serverResponseService: ServerResponseService) { }

  ngOnInit() {
    this.serverResponseService.setNotFound();
  }

}
