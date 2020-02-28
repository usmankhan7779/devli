import { Component, OnInit } from '@angular/core';
import { ParkFactor } from './park-factor.model';
import { ParkFactorService } from './park-factor.service';
import { BreadcrumbService } from '../../shared/components/breadcrumb/breadcrumb.service';
import { CommonService } from '../../shared/services/common.service';

@Component({
  selector: 'app-park-factor-tools-gateway',
  templateUrl: './park-factor-tools-gateway.component.html',
  styleUrls: ['./park-factor-tools-gateway.component.scss']
})
export class ParkFactorToolsGatewayComponent implements OnInit {

  parksData: ParkFactor[];
  // tslint:disable-next-line:max-line-length
  introParagraph = 'Baseball is the only sport where a stadium has unique dimensions and can differ wildly from other ballparks. You have some massive pitcher’s parks out on the west coast, and then some extreme hitter friendly parks like in Colorado, Cincinnati, and of course Yankee Stadium. Park factors have been created to show how a ballpark plays to hitters and pitchers. Some ballparks create more extra base hits to right field because of their dimensions, while some can take away home runs and extra base hits. Each park is different, and our tool helps you view where your fantasy hitters or pitchers can get an edge. A ballpark like the Coliseum out in Oakland has been known to suppress runs and home runs, making it a favorable pitchers park. Our own rating will sum up the overall park factors scores for both hitters and pitchers.';
  indParkData: ParkFactor;
  sortBy;
  sortOrder;
  ddData: any = {
    views: [
      {
        prop: 'all',
        name: 'All Parks',
        selected: true
      },
      {
        prop: 'ind',
        name: 'Individual Parks',
        selected: false
      }
    ],
    parks: []
  };

  constructor(
    private parkFactorService: ParkFactorService,
    private breadcrumbService: BreadcrumbService,
    private commonService: CommonService
  ) {

  }

  ngOnInit() {
    this.breadcrumbService.changeBreadcrumbs([
      {label: 'MLB', url: '/mlb'},
      {label: 'MLB Park Factors', url: '/mlb/park-factors'}
    ]);
    this.parkFactorService.getParks()
      .subscribe((data: ParkFactor[]) => {
        this.parksData = data;
        this.ddData.parks = this.parksData.map((item: ParkFactor) => {
          return {
            prop: item.park_name,
            selected: false,
            name: item.park_name
          }
        });
        this.ddData.parks.unshift({
          prop: 'all',
          selected: true,
          name: 'All Parks'
        });
        this.ddData.activePark = this.ddData.parks[0];
        this.ddData.activeView = this.ddData.views[0];
      });

  }

  onSortBy($event) {
    this.sortBy = $event;
  }

  onSortOrder($event) {
    this.sortOrder = $event;
  }

  updateDDdata() {
    this.ddData.activeView = this.commonService.getActiveCheckBoxItems(this.ddData['views'], 'prop', true)[0];
    this.ddData.activePark = this.commonService.getActiveCheckBoxItems(this.ddData['parks'], 'prop', true)[0];
    if (this.ddData.activePark.prop !== 'all') {
      this.indParkData = this.parksData.filter((park: ParkFactor) => park.park_name === this.ddData.activePark.prop)[0];
    }
  }

  onRadioUpdate(prop) {
    this.ddData['views'] = this.ddData['views'].map(view => {
      view.selected = view.prop === prop;
      return view;
    });
    this.ddData.activeView = this.commonService.getActiveCheckBoxItems(this.ddData['views'], 'prop', true)[0];
  }

  getTdColor(value) {
    return this.parkFactorService.getPlayersColor(value);
  }

  getRainColor(value) {
    return this.parkFactorService.getRainColor(value);
  }

}
