import {
  ApplicationRef, Component, ComponentFactoryResolver, EmbeddedViewRef, Inject, Injector, OnDestroy,
  OnInit, Renderer2
} from '@angular/core';
import { DepthChartsService } from './depth-charts.service';
import { DOCUMENT } from '@angular/common';
import { TitleService } from '../../shared/services/title.service';
import { Meta } from '@angular/platform-browser';
import { BreadcrumbService } from '../../shared/components/breadcrumb/breadcrumb.service';
import { PlayerLinkComponent } from '../../shared/components/player-link/player-link.component';

@Component({
  selector: 'app-depth-charts',
  templateUrl: './depth-charts.component.html',
  styleUrls: ['./depth-charts.component.scss']
})
export class DepthChartsComponent implements OnInit, OnDestroy {
  data: any = {
    title: 'MLB Depth Charts 2019',
    // tslint:disable-next-line:max-line-length
    intro_paragraph: 'While generally a starting lineup in baseball stays pretty consistent, it is important to know who is behind each position. That is where the MLB Depth Charts page can come in handy. Catchers begin to start sharing more time, as teams like Atlanta have used a pretty equal split behind the dish. Teams will also use platoon splits to determine their starting lineups. For example, Boston will start Mitch Moreland at first base versus right-handed pitching. If a southpaw is on the mound, Steve Pearce will draw the start being a right-handed bat. Clicking the team link will bring you to everything on the site dedicated to that specific team. If you are looking to dive into a specific player, clicking the link will take you over to their stats, news, and recent performances. Lineups will be staying on top of this information, so you don’t have to.',
    // tslint:disable-next-line:max-line-length
    meta_description: 'Up to date MLB depth charts for all 30 MLB teams. Depth charts are broken down by position and team all on one page for your viewing pleasure.'
  };
  loading = true;
  teamMapArr: string[] = this.depthChartsService.teamMapArray;
  teamMap: any = {};
  constructor(
    private depthChartsService: DepthChartsService,
    private title: TitleService,
    private meta: Meta,
    private breadcrumbService: BreadcrumbService,
    @Inject(DOCUMENT) private document,
    private renderer: Renderer2,
    private componentFactoryResolver: ComponentFactoryResolver,
    private appRef: ApplicationRef,
    private injector: Injector
  ) { }

  ngOnInit() {
    this.meta.addTag({
      name: 'description',
      content: this.data.meta_description
    });
    this.title.setTitle(this.data.title);
    this.breadcrumbService.changeBreadcrumbs([
      {label: 'MLB', url: '/mlb'},
      {label: this.data.title, url: '/mlb/depth-charts'}
    ]);
    this.getDepthCharts();
  }

  ngOnDestroy() {
    this.meta.removeTag('name="description"');
  }

  private getDepthCharts() {
    this.loading = true;
    this.depthChartsService.getMLBDepthCharts().subscribe(res => {
      this.data.dp_html = this.document.createElement('div');
      this.data.dp_html.innerHTML = res.content.rendered;
      this.teamMapArr.forEach(teamName => {
        this.teamMap[teamName] = {
          table: this.processTableData(this.getHTMLTableByName(teamName)),
          ...this.depthChartsService.teamMap[teamName]
        }
      });
      delete this.data.dp_html;
      this.loading = false;
    });
  }

  getHTMLTableByName(name) {
    const items = Array.prototype.slice.call(this.data.dp_html.getElementsByTagName('p'));
    for (let i = 0; i < items.length; i++) {
      if (items[i].innerHTML.indexOf(name) !== -1) {
        return items[i].nextElementSibling;
      }
    }
  }

  processTableData(table) {
    this.renderer.addClass(table, 'multi-row-data-table');
    this.renderer.addClass(table, 't-stripped');
    this.renderer.addClass(table.querySelector('thead tr'), 't-sub-header');
    Array.prototype.slice.call(table.querySelectorAll('tbody tr')).forEach(row => {
      this.renderer.addClass(row, 't-content');
    });
    Array.prototype.slice.call(table.querySelectorAll('tbody tr td:not(.column-1)')).forEach(td => {
      const playerName = td.innerHTML;
      if (playerName) {
        const componentRef = this.componentFactoryResolver
          .resolveComponentFactory(PlayerLinkComponent)
          .create(this.injector);
        componentRef.instance.league = 'mlb';
        componentRef.instance.playerName = playerName;
        componentRef.instance.customContent = false;
        componentRef.instance.playerUrl = `/mlb/player-stats/${playerName.replace(/[^a-zA-Z ]/g, '').toLowerCase().split(' ').join('-')}`;
        componentRef.changeDetectorRef.detectChanges();

        // 2. Attach component to the appRef so that it's inside the ng component tree
        this.appRef.attachView(componentRef.hostView);

        // 3. Get DOM element from component
        const domElem = (componentRef.hostView as EmbeddedViewRef<any>)
          .rootNodes[0] as HTMLElement;

        td.innerHTML = '';
        // 4. Append DOM element to the td
        td.appendChild(domElem);
      }
    });
    return table;
  }
}
