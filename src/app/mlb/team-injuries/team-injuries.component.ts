import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BreadcrumbService } from '../../shared/components/breadcrumb/breadcrumb.service';
import { TitleService } from '../../shared/services/title.service';
import { TeamLineupService } from '../team-lineup/team-lineup.service';

@Component({
  selector: 'app-team-injuries',
  templateUrl: './team-injuries.component.html',
  styleUrls: ['./team-injuries.component.scss']
})
export class TeamInjuriesComponent implements OnInit {
  data;
  bottomContent: any;
  constructor(
    private route: ActivatedRoute,
    private title: TitleService,
    private breadcrumbService: BreadcrumbService,
    private teamLineupService: TeamLineupService
  ) { }

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.data = this.route.snapshot.data['teamLineup'];
      this.breadcrumbService.changeBreadcrumbs([
        {label: 'MLB', url: '/mlb'},
        {label: 'Teams', url: '/mlb/teams'},
        {
          label: 'Injuries',
          url: '/mlb/player-injuries'
        },
        {
          label: this.data.nav.team_name_full + ' Injuries',
          url: './'
        }
      ]);
      this.title.setTitle(this.data.nav.team_name_full + ' Injuries');
    });
  }

  onApiUpdate(data) {
    this.teamLineupService.changeIndTeamData(null, null, data.heading);
    this.title.setTitle(data.page_title);
    this.breadcrumbService.changeBreadcrumbs([
      {label: 'MLB', url: '/mlb'},
      {label: 'Teams', url: '/mlb/teams'},
      {
        label: 'Injuries',
        url: '/mlb/player-injuries'
      },
      {
        label: data.heading,
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
