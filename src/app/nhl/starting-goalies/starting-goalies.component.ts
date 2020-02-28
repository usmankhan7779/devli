import { Component, OnInit } from '@angular/core';
import { BreadcrumbService } from '../../shared/components/breadcrumb/breadcrumb.service';
import { TransferHttp } from '../../../modules/transfer-http/transfer-http';
import { environment } from '../../../environments/environment';
import { TitleService } from '../../shared/services/title.service';

@Component({
  selector: 'app-starting-goalies',
  templateUrl: './starting-goalies.component.html',
})
export class StartingGoaliesComponent implements OnInit {
  loading: boolean;
  data;
  constructor(
    private breadcrumbService: BreadcrumbService,
    private title: TitleService,
    private http: TransferHttp
  ) { }

  ngOnInit() {
    this.loading = true;
    const endpoint = `${environment.api_url}/nhl/starting-goalies`;
    this.http.get(endpoint)
      .subscribe(res => {
        this.data = res;
        this.title.setTitle(res.page_title);
        this.loading = false;
        this.breadcrumbService.changeBreadcrumbs([{
          url: '/nhl/starting-goalies',
          label: res.heading
        }])
      });
  }

}
