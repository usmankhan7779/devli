import { Component, OnInit } from '@angular/core';
import { TransferHttp } from '../../../modules/transfer-http/transfer-http';
// Environment
import { environment } from '../../../environments/environment';
import { Observable } from 'rxjs';
import { TitleService } from '../../shared/services/title.service';
import { BreadcrumbService } from '../../shared/components/breadcrumb/breadcrumb.service';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-vegas-odds-hp',
  templateUrl: './vegas-odds-hp.component.html',
  styleUrls: ['./vegas-odds-hp.component.scss']
})
export class VegasOddsHpComponent implements OnInit {
  data;
  constructor(
    private http: TransferHttp,
    private titleService: TitleService,
    private breadcrumbService: BreadcrumbService
  ) { }

  ngOnInit() {
    this.getData().subscribe((res) => {
      this.data = res;
      this.titleService.setTitle(res.page_title);
      this.breadcrumbService.changeBreadcrumbs([{
        label: res.heading,
        url: '/vegas-odds'
      }])
    })
  }

  private getData() {
    const endpoint = `${environment.api_url}/betting/fetch/vegas-odds`;
    return this.http.get(endpoint).pipe(
      map((response) => {
        return response;
      }));
  }
}
