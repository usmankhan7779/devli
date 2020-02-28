
import {of as observableOf, Subject, Observable } from 'rxjs';
import {map, catchError, debounceTime, switchMap} from 'rxjs/operators';
import { Component, Inject, Injector, OnDestroy, OnInit, PLATFORM_ID, ViewEncapsulation } from '@angular/core';
import { PredictionModelAccuracyService } from './prediction-model-accuracy.service';
import { CommonService } from '../../services/common.service';
import { ActivatedRoute } from '@angular/router';
import { SpinnerService } from '../spinner/spinner.service';
import { VideoModalComponent } from '../../modals/video-modal/video-modal.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { isPlatformBrowser } from '@angular/common';
import { DropdownService } from '../dropdown/dropdown.service';
import * as _ from 'lodash';
import { MlbService } from '../../../mlb/mlb.service';

@Component({
  selector: 'app-prediction-model-accuracy-results',
  templateUrl: './prediction-model-accuracy-results.component.html',
  styleUrls: ['./prediction-model-accuracy-results.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class PredictionModelAccuracyResultsComponent implements OnInit, OnDestroy {
  itemsPerPage = 100;
  sortBy = 'dollar_signs';
  sortOrder = 'desc';
  league;
  dropdownCollapsed: boolean;
  predictionData: any;
  getMaxDollarSelected = this.commonService.getMaxDollarSelected;
  searchTerm$ = new Subject<string>();
  searchTermImmidiate$ = new Subject<any>();
  searchTermSorting$ = new Subject<any>();
  currentPage = 0;
  totalItems: number;
  totalItemsPerPage: number;
  selectedYear: number;
  private modalService;
  constructor(
    private predictionModelAccuracyService: PredictionModelAccuracyService,
    private spinnerService: SpinnerService,
    private commonService: CommonService,
    private route: ActivatedRoute,
    private dropdownService: DropdownService,
    private mlbService: MlbService,
    @Inject(PLATFORM_ID) private platformId: Object,
    private injector: Injector,
  ) {
    if (isPlatformBrowser(this.platformId)) {
      this.modalService = this.injector.get(NgbModal);
    }
  }

  ngOnInit() {
    this.route.params.subscribe(() => {
      this.league = this.route.snapshot.data['league'];
      this.initPageData();
    });
    this.initSearchTerm(this.searchTerm$, 1000);
    this.initSearchTerm(this.searchTermImmidiate$, 0);
    this.initSearchTerm(this.searchTermSorting$, 200);
  }

  ngOnDestroy() {
    this.searchTerm$.unsubscribe();
    this.searchTermImmidiate$.unsubscribe();
    this.searchTermSorting$.unsubscribe();
  }

  private initSearchTerm(searchTerm, debounceTimeArg) {
    searchTerm
      .pipe(
        debounceTime(debounceTimeArg),
        switchMap((subject) => {
          if (!subject || !(<any>subject).noSpinner) {
            this.spinnerService.showSpinner();
          }
          return this.predictionModelAccuracyService
            .fetchSimGameBets(this.league, this.predictionData, this.currentPage, this.sortBy, this.sortOrder, this.selectedYear).pipe(
              catchError((err) => {
                console.error('ERR', err);
                return observableOf(null);
              }),
              map(res => res));
        })
      )
      .subscribe((res) => {
        if (res) {
          this.handleApiResponse(res);
        }
        this.spinnerService.hideSpinner();
      });
  }

  onSortOrder(mode, $event) {
    if (mode === 'by') {
      this.sortBy = $event;
    } else if (mode === 'order') {
      this.sortOrder = $event;
    }
    this.searchTermSorting$.next();
  }


  private initPageData() {
    this.predictionModelAccuracyService.initiallyFetchSimGameBets(this.league)
      .subscribe(res => {
        this.handleApiResponse(res);
      });
  }

  filterItems(page) {
    if (page) {
      this.currentPage = page;
      return this.searchTermImmidiate$.next();
    }
    const newItemsPerPage = this.commonService.getActiveCheckBoxItems(this.predictionData.items_per_page, 'name')[0];
    if (this.predictionData.seasons) {
      const selectedYear = this.commonService.getActiveCheckBoxItems(this.predictionData.seasons, 'year')[0];
      const yearWasChanged = this.selectedYear !== selectedYear;
      if (this.itemsPerPage !== newItemsPerPage || yearWasChanged) {
        if (yearWasChanged) {
          this.predictionData = null;
          this.currentPage = 1;
        }
        this.selectedYear = selectedYear;
        this.itemsPerPage = newItemsPerPage;
        return this.searchTermImmidiate$.next((yearWasChanged ? {noSpinner: true} : null));
      }
    }
    if (this.itemsPerPage !== newItemsPerPage) {
      this.itemsPerPage = newItemsPerPage;
      return this.searchTermImmidiate$.next();
    }
    this.searchTerm$.next();
  }

  private handleApiResponse(res) {
    console.log('res', res);
    if (!this.predictionData) {
      res.data = this.handleWinProb(res);
      res.dollar_ranges = this.commonService.prepareDDItems(res.dollar_ranges);
      res.ev_ranges = this.commonService.prepareDDItems(res.ev_ranges, false).sort((a, b) => {
        return a.id[0] - b.id[0];
      });
      res.probabilities = this.commonService.prepareDDItems(res.probabilities, false)
        .map((obj) => {
          obj.name += ' %';
          return obj;
        })
        .sort((a, b) => {
          return a.id[0] - b.id[0];
        });
      res.bet_types = this.commonService.prepareDDItems(res.bet_types, false);
      res.models = this.commonService.prepareDDItems(res.models, false);
      res.result_types = this.commonService.prepareDDItems(res.result_types, false);

      res.items_per_page = this.commonService.prepareDDItems([100, 200, 500], true, false);
      res.items_per_page[0].selected = true;

      if (res.seasons_dropdown && res.seasons_dropdown.length) {
        if (!this.selectedYear) {
          this.selectedYear = (<any>_.find(res.seasons_dropdown, 'default')).year;
        }
        res.seasons = this.prepareSeasons(res.seasons_dropdown);
      }

      this.totalItemsPerPage = res.results.length;
      this.totalItems = res.count;
      this.predictionData = res;
    } else {
      res.data = this.handleWinProb(res);
      this.totalItems = res.count;
      this.predictionData.data = res.results;
      this.predictionData.overview = res.overview;
    }
    if (this.league === 'mlb') {
      const basicModel = (<any>_.find(this.predictionData.models, { id: 'basic' }));
      if (basicModel) {
        basicModel.hidden = !this.mlbService.checkIfDefaultSeason(this.selectedYear, this.predictionData.seasons);
      }
    }
  }

  private handleWinProb(res) {
    return res.results.map((item) => {
      if (item.win_prob) {
        item.win_prob = Math.round(item.win_prob * 100);
      }
      if (item.model_type) {
        for (const key in  res.models) {
          if (res.models.hasOwnProperty(key) && res.models[key] === item.model_type) {
            item.model_name = key;
          }
        }
      }
      return item;
    });
  }

  private prepareSeasons(seasons) {
    return seasons.map(season => {
      return {
        name: season.name,
        year: season.year,
        'default': season.default,
        selected: this.selectedYear === season.year
      }
    });
  }

  onHowItWorksClick() {
    const modalRef = this.modalService.open(VideoModalComponent, {
      size: 'lg',
      windowClass: `lineups-custom-modal common-modal video-modal`
    });
    modalRef.componentInstance.src = 'https://www.youtube.com/embed/FsQoteGxb6E?rel=0';
  }
}
