import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, Router } from '@angular/router';
import { ServerResponseService } from '../../services/server-response.service';
import { EMPTY, Observable } from 'rxjs';
import { CommonService } from '../../services/common.service';

@Injectable()
export class ExternalRedirectResolver implements Resolve<any> {
  constructor(
    private router: Router,
    private serverResponseService: ServerResponseService,
    private commonService: CommonService
  ) {}

  resolve(route: ActivatedRouteSnapshot): Observable<any> {
    const externalUrl = route.data.externalUrl;
    if (this.commonService.isBrowser()) {
      window.location.href = externalUrl;
    } else {
      this.serverResponseService.serverRedirect(externalUrl);
    }
    return EMPTY;
  }
}
