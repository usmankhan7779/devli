import { Component, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { DomSanitizer } from '@angular/platform-browser';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { PlatformLocation } from '@angular/common';

@Component({
  selector: 'app-bet-predictor-help-button',
  templateUrl: './bet-predictor-help-button.component.html',
  styleUrls: ['./bet-predictor-help-button.component.scss']
})
export class BetPredictorHelpButtonComponent implements OnInit {
  activeView: string;
  currentVideoIndex = 1;
  reportForm: FormGroup;

  viedoUrls = {
    video_1: 'https://www.youtube.com/embed/mWoVU4Hn4ug?rel=0',
    video_2: 'https://www.youtube.com/embed/-y5xAs54mzU?rel=0',
    video_3: 'https://www.youtube.com/embed/Z6qAMDi4HH8?rel=0',
    video_4: 'https://www.youtube.com/embed/P7FKsF7cUY4?rel=0'
  };
  activeVideo: any;
  constructor(
    public activeModal: NgbActiveModal,
    private sanitizer: DomSanitizer,
    private location: PlatformLocation
  ) {
    location.onPopState(() => {
      // ensure that modal is opened
      if (this.activeModal !== undefined) {
        this.activeModal.close();
      }
    });
  }

  ngOnInit() {
    this.onViewChange('video', 1);
    this.reportForm = new FormGroup({
      'email': new FormControl('', [Validators.required, Validators.email]),
      'description': new FormControl('', [Validators.required]),
      'file': new FormControl('')
    });
  }

  onViewChange(viewName: string, index?: number) {
    if (viewName === 'video') {
      if (index > 5) {
        index = 1;
      } else if (index < 1) {
        index = 5;
      }
      console.log(index);
      this.currentVideoIndex = index;
      this.activeView = `${viewName}_${index}`;
      this.updateSrc(this.activeView);
    } else {
      this.activeView = viewName;
    }
  }

  private updateSrc(key: string) {
    this.activeVideo = this.sanitizer.bypassSecurityTrustResourceUrl(this.viedoUrls[key]);
  }

  onSubmit() {
    console.log(this.reportForm);
  }
}
