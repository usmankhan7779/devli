
import { Injectable } from '@angular/core';
import { CommonService } from './common.service';
import { Observable, throwError, ReplaySubject } from 'rxjs';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class GeolocationService {
  isLocationGetting: any;
  userLocationData: any;
  replaySubject: ReplaySubject<any>;

  constructor(
    private http: HttpClient,
    private commonService: CommonService
  ) {
  }

  // getLocationFromLatLng(latitude, longitude) {
  //   if (!latitude || !longitude) {
  //     return throwError('missing latitude or longitude params');
  //   }
  //   return new Observable(observer => {
  //     let params = new HttpParams();
  //     params = params.append('key', environment.firebase.apiKey);
  //     params = params.append('latlng', `${latitude},${longitude}`);
  //     params = params.append('result_type', 'locality');
  //     this.http.get(`https://maps.googleapis.com/maps/api/geocode/json`, {params: params})
  //       .subscribe((res: any) => {
  //         if (res.status === 'OK') {
  //           observer.next(res);
  //           return observer.complete();
  //         } else {
  //           observer.complete();
  //           return throwError(res);
  //         }
  //       })
  //   });
  // }

  getUserLocation() {
    return new Observable(observer => {
      if (!this.commonService.isBrowser()) {
        return observer.complete();
      }
      if (!this.isLocationGetting) {
        this.replaySubject = new ReplaySubject(1);
        this._getUserLocation()
          .subscribe(res => {
            this.replaySubject.next(res)
          });
        this.isLocationGetting = this.replaySubject.asObservable();
      }
      return this.isLocationGetting.subscribe((res: any) => {
        observer.next(res);
        setTimeout(() => {
          observer.complete();
          this.replaySubject.complete();
          this.isLocationGetting = undefined;
        }, 500);
      });
    });
  }

  private _getUserLocation() {
    return new Observable(observer => {
      if (!this.commonService.isBrowser()) {
        return observer.complete();
      }
      const localKey = 'lineups:loc';
      const userLocationData = localStorage.getItem(localKey);
      if (userLocationData) {
        this.userLocationData = JSON.parse(userLocationData);
        observer.next(this.userLocationData);
        return observer.complete();
      } else {
        observer.next();
        return observer.complete();
        // this.getCurrentLocation().subscribe((res: any) => {
        //   const lat = res.coords.latitude;
        //   const long = res.coords.longitude;
        //   this.getLocationFromLatLng(lat, long).subscribe((latLongRes: any) => {
        //     if (latLongRes.results && latLongRes.results.length) {
        //       const place = this.parsePlaceToLocation(latLongRes.results[0]);
        //       if (this.commonService.isBrowser()) {
        //         localStorage.setItem(localKey, JSON.stringify(place));
        //       }
        //       this.userLocationData = place;
        //       observer.next(place);
        //       return observer.complete();
        //     }
        //     observer.error(res);
        //     return observer.complete();
        //   })
        // });
      }
    });
  }

  // getCurrentLocation() {
  //   return new Observable(observer => {
  //     if (this.commonService.isBrowser() && navigator && navigator.geolocation) {
  //       navigator.geolocation.getCurrentPosition(position => {
  //         observer.next(position);
  //         return observer.complete();
  //       }, () => {
  //         console.log('location denied');
  //         return observer.complete();
  //       });
  //     } else {
  //       console.log('not browser');
  //       return observer.complete();
  //     }
  //   });
  // }

  // private parsePlaceToLocation(gplace) {
  //   let city;
  //   let country;
  //   let state;
  //   let locationName;
  //   let locationType;
  //   if (!gplace) {
  //     return;
  //   }
  //   const name = gplace.name;
  //   const externalId = gplace.place_id;
  //
  //   let lat;
  //   let lng;
  //
  //   if ( typeof gplace.geometry.location.lat === 'function') {
  //     lat = gplace.geometry.location.lat();
  //   } else {
  //     lat = gplace.geometry.location.lat;
  //   }
  //
  //   if ( typeof gplace.geometry.location.lat === 'function') {
  //     lng = gplace.geometry.location.lng();
  //   } else {
  //     lng = gplace.geometry.location.lng;
  //   }
  //
  //   if (Array.isArray(gplace.address_components)) {
  //
  //     locationName = gplace.name ? gplace.name : '';
  //     locationType = 'city';
  //     if (gplace.address_components[0].types[0] === 'country' ||
  //       (gplace.address_components[1] !== undefined && gplace.address_components[1].types[0] === 'country')) {
  //       locationType = 'country';
  //     }
  //     if (gplace.address_components[0].types[0] === 'administrative_area_level_1') {
  //       locationType = 'state';
  //     }
  //
  //     gplace.address_components.forEach(component => {
  //       if (component.types.indexOf('locality') !== -1) {
  //         city = component.long_name;
  //       }
  //
  //       if (component.types.indexOf('country') !== -1) {
  //         country = component.long_name;
  //       }
  //
  //       if (component.types.indexOf('administrative_area_level_1') !== -1) {
  //         state = component.long_name;
  //       }
  //     });
  //   }
  //
  //   if (locationType === 'city' && country !== undefined) {
  //     locationName = (locationName ? locationName : city || state) + ',' + country;
  //   }
  //
  //   return {
  //     // name,
  //     // externalId,
  //     // lat,
  //     // lng,
  //     // city,
  //     state
  //     // country,
  //     // locationName,
  //     // locationType
  //   };
  // }

}
