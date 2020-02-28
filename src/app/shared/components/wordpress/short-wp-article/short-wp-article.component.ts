import { Component, Inject, Input, OnInit } from '@angular/core';
import { WpSmBlogItemModel } from '../models/wp-sm-blog-item.model';
import { DOCUMENT } from '@angular/common';

@Component({
  selector: 'app-short-wp-article',
  templateUrl: './short-wp-article.component.html',
  styleUrls: ['./short-wp-article.component.scss']
})
export class ShortWpArticleComponent implements OnInit {
  @Input() showFirstParagraph: boolean;
  @Input() set wpSmBlogItem(wpSmBlogItem) {
    this._wpSmBlogItem = wpSmBlogItem;
    if (this.showFirstParagraph) {
      const div = this.document.createElement('div');
      div.innerHTML = this.wpSmBlogItem.content;
      const firstP = Array.prototype.slice.call(div.querySelectorAll('p:not(.toc_title):not(.ez-toc-title)'))[0];
      this.contentHTML = firstP.textContent || firstP.innerText
    }
  }
  _wpSmBlogItem: WpSmBlogItemModel;
  contentHTML: string;
  get wpSmBlogItem() { return this._wpSmBlogItem; }
  constructor(
    @Inject(DOCUMENT) private document,
  ) { }

  ngOnInit() {

  }
}
