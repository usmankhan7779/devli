import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { environment } from 'environments/environment';

@Injectable()
export class ContactService {

  constructor(
    private http: HttpClient
  ) { }


  contactUs(data) {
    const endpoint = `${environment.api_url}/contact`;
    return this.http.post(endpoint, data);
  }

}
