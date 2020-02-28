import { Component, OnInit } from '@angular/core';
import { SchemaService } from '../../shared/services/schema.service';

@Component({
  selector: 'app-about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.scss']
})
export class AboutComponent implements OnInit {

  constructor(
    private schemaService: SchemaService
  ) { }

  ngOnInit() {
    this.schemaService.setDefaultSchema();
  }
}
