import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BreadcrumbService } from '../../shared/components/breadcrumb/breadcrumb.service';
import { TitleService } from '../../shared/services/title.service';

@Component({
  selector: 'app-team-injuries',
  templateUrl: './team-injuries.component.html',
  styleUrls: ['./team-injuries.component.scss']
})
export class TeamInjuriesComponent implements OnInit {
  isCollapsed: boolean;
  data;
  params: {team_name: string};
  pageTitle: string;
  bottomContent: any;
  constructor(
    private title: TitleService,
    private route: ActivatedRoute,
    private breadcrumbService: BreadcrumbService
  ) { }

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.params = {team_name: params.team_name};
      this.data = this.route.snapshot.data['depthChart'];
    });
  }

  onApiUpdate(data) {
    this.pageTitle = data.heading;
    this.title.setTitle(data.page_title);
    this.breadcrumbService.changeBreadcrumbs([
      {label: 'NFL', url: '/nfl'},
      {label: 'Teams', url: '/nfl/teams'},
      {
        label: 'Injuries',
        url: '/nfl/player-injuries'
      },
      {
        label: this.pageTitle,
        url: './'
      }
    ]);
    this.bottomContent = {
      bottom_header: data.bottom_header,
      bottom_paragraph: data.bottom_paragraph,
      intro_paragraph: data.intro_paragraph
    };
  }

}
