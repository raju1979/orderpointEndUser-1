import { HttpClient, HttpHeaders, } from '@angular/common/http';
import { RequestOptions, Request, RequestMethod } from '@angular/http';
import { Injectable } from '@angular/core';

// Import { Observable } from 'rxjs/Rx';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/forkJoin';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Subject } from 'rxjs/Subject';

/*
  Generated class for the RemoteServiceProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class RemoteServiceProvider {

  instance: any;
  api_endpoint: any;
  thirdPartyAPIs: any;

  private subject = new Subject<any>();

  constructor(private _http: HttpClient) {
    console.log('Hello RemoteServiceProvider Provider');
    this.instance = 'https://adminstaging.azurewebsites.net/';
    /// This.instance = 'http://localhost:8383/sangeetha/GitHubRepo/OrderpointAdmin/public/';
    this.api_endpoint = 'api/v1/';
  }

  get(api) {
    let url = this.instance + this.api_endpoint + api;
    // Let body = JSON.stringify(data);
    // Let headers = new Headers({ "Content-Type": "application/json"});
    // Let options = new RequestOptions({ headers: headers });

    return this._http.get(url);
  }

  getAllDataAndLocationData(api) {
    const locationUrl = `${this.instance}${this.api_endpoint}getLocationData`;

    let url = this.instance + this.api_endpoint + api;

    return Observable.forkJoin(
      this._http.get(url),
      this._http.get(locationUrl)
    );
  } //

  login(api, payload, token) {
    let url = this.instance + this.api_endpoint + api;
    let response = this._http.post(url, payload);

    return response;
  }//

  postWithoutToken(api, payload) {
    let url = this.instance + this.api_endpoint + api;
    let headers = new HttpHeaders({ "Content-Type": "application/json" });

    let response = this._http.post(url, payload, { headers: headers });

    return response;

  }

  /*
    In this method we are calling 4 API using forkJoin
    If any one API fails all 4 will fail
  */
  getAllInfoAboutSelectedRestaurant(restaurantId, token: any = '', payload: any = '') {
    console.log(token);
    console.log(payload);

    let headers = new HttpHeaders({'Authorization': 'Bearer ' + token});

    let merchantDetailsUrl = `${this.instance}${this.api_endpoint}getMerchantDetails/${restaurantId}`;
    // Let menuDetailsUrl = `${this.instance}${this.api_endpoint}getMenuDetails/${restaurantId}`;
    let menuDetailsMerchantUrl = `${this.instance}${this.api_endpoint}getMobileAppMenuDetails`;
    let reviewListsUrl = `${this.instance}${this.api_endpoint}getReviewList?merchantId=${restaurantId}`;
    // Let menuDetailsMerchantUrl = `${this.instance}${this.api_endpoint}getMobileAppMenuDetails`
    // Https://adminstaging.azurewebsites.net/api/v1/getMobileAppMenuDetails

    return Observable.forkJoin(
      this._http.get(merchantDetailsUrl),
      // This._http.get(menuDetailsUrl),
      this._http.post(menuDetailsMerchantUrl, payload, {headers} ),
      this._http.get(reviewListsUrl)
    );

  } //

  sendMessage(user: any) {
    this.subject.next(user);
  }

  getMessage(): Observable<any> {
      return this.subject.asObservable();
  }

}
