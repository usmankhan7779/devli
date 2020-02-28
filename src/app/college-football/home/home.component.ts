import { Component, OnInit } from '@angular/core';
import { CollegeFootballService } from '../college-football.service';
import { CommonService } from '../../shared/services/common.service';
import { TitleService } from '../../shared/services/title.service';
import { SpinnerService } from '../../shared/components/spinner/spinner.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  homeData: any;
  ddData: any;
  isDefaultYear: boolean;
  constructor(
    private collegeFootballService: CollegeFootballService,
    private commonService: CommonService,
    private titleService: TitleService,
    private spinnerService: SpinnerService
  ) { }

  ngOnInit() {
    const preselectedYear = this.collegeFootballService.getPreSelectedSeason();
    this.collegeFootballService.removePreSelectedSeason();
    this.getGatewayData(preselectedYear);
  }

  onYearDdChange(season) {
    if (this.homeData.year === season.year) {
      return;
    }
    this.getGatewayData(season.year);
  }

  private getGatewayData(year?) {
    let apiCall = this.collegeFootballService.getGatewayData(year);
    if (this.homeData) {
      apiCall = this.spinnerService.handleAPICall(apiCall);
    }
    apiCall
      .subscribe(res => {
        const homeData = {...res};
        this.homeData = homeData;
        const defaultYear = parseInt(this.collegeFootballService.getDefaultSeason(this.homeData.seasons_dropdown), 10);
        this.isDefaultYear = defaultYear === parseInt(this.homeData.year, 10);
        this.titleService.setTitle(homeData.page_title);
      });
  }

}
