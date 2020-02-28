import { Component, Input, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-video-modal',
  templateUrl: './video-modal.component.html',
  styleUrls: ['./video-modal.component.scss']
})
export class VideoModalComponent implements OnInit {
  @Input() src: string;

  videoUrl: SafeResourceUrl;

  constructor(
    public activeModal: NgbActiveModal,
    private sanitizer: DomSanitizer
  ) {
  }

  ngOnInit() {
    this.updateSrc(this.src);
  }

  private updateSrc(src: string) {
    this.videoUrl = this.sanitizer.bypassSecurityTrustResourceUrl(src);
  }
}
