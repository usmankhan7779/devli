import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ParseTableService {

  constructor() {}

  arrayify(collection) {
    return Array.prototype.slice.call(collection);
  }

  factory(headings, getStarterImage = false) {
    return (row) => {
      return this.arrayify(row.querySelectorAll('td')).reduce((prev, curr, i) => {
        if (getStarterImage && curr.innerHTML.indexOf('<img src="') !== -1) {
          const re = /\ssrc=(?:(?:'([^']*)')|(?:"([^"]*)")|([^\s]*))/i; // match src='a' OR src="a" OR src=a
          const res = curr.innerHTML.match(re);
          prev['starterImage'] = res[1] || res[2] || res[3];
        }
        prev[headings[i]] = curr.innerText || curr.textContent;
        return prev;
      }, {});
    }
  }

  parseTable(table, getStarterImage = false) {
    const headings = this.arrayify(table.querySelectorAll('th')).map((heading) => {
      return heading.innerText || heading.textContent;
    });
    return this.arrayify(table.querySelectorAll('tbody tr')).map(this.factory(headings, getStarterImage));
  }
}
