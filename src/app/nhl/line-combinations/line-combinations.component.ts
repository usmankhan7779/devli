import { Component, OnInit } from '@angular/core';
import { BreadcrumbService } from '../../shared/components/breadcrumb/breadcrumb.service';
import { environment } from '../../../environments/environment';
import { TransferHttp } from '../../../modules/transfer-http/transfer-http';
import { TitleService } from '../../shared/services/title.service';

@Component({
  selector: 'app-line-combinations',
  templateUrl: './line-combinations.component.html',
})
export class LineCombinationsComponent implements OnInit {
  loading: boolean;
  data;
  constructor(
    private breadcrumbService: BreadcrumbService,
    private title: TitleService,
    private http: TransferHttp
  ) { }

  ngOnInit() {
    this.loading = true;
    const endpoint = `${environment.api_url}/nhl/teams/line-combinations`;
    this.http.get(endpoint)
      .subscribe(res => {
        this.data = res;
        this.title.setTitle(res.page_title);
        this.loading = false;
        this.breadcrumbService.changeBreadcrumbs([{
          url: '/nhl/teams/line-combinations',
          label: res.heading
        }]);
      });
  }
}
