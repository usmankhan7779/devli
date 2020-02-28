import { Component, OnInit } from '@angular/core';
import { BreadcrumbService } from '../shared/components/breadcrumb/breadcrumb.service';


@Component({
  selector: 'app-scholarship-program-page',
  templateUrl: './scholarship-program.component.html',
  styleUrls: ['../home/home.component.scss', './scholarship-program.component.scss']
})
export class ScholarshipProgramComponent implements OnInit {
  constructor(
    private breadcrumbService: BreadcrumbService
  ) {}

  ngOnInit() {
    this.breadcrumbService.changeBreadcrumbs([
      {label: 'Scholarship Overview', url: '/sports-scholarship'}
    ]);
  }

}
