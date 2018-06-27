import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController, ViewController } from 'ionic-angular';

import { RemoteServiceProvider } from "../../providers/remote-service/remote-service";

import { Storage } from "@ionic/storage";


import * as _ from 'lodash';


@Component({
  selector: 'page-location-search-popover',
  templateUrl: 'location-search-popover.html',
})
export class LocationSearchPopoverPage {

  httpRequestPending: boolean = false;

  locationArray: Array<any> = [];
  filteredLocationArray: Array<any> = [];

  locationCriteriaText: string = 'postcode';
  locationSearchtext: string = '';


  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private _toastCtrl: ToastController,
    private remote: RemoteServiceProvider,
    private _storage: Storage,
    private _viewCtrl: ViewController
  ) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad SearchFilterPopoverPage');

    this.httpRequestPending = true;
    this.remote
      .get("getLocationData")
      .finally(() => (this.httpRequestPending = false))
      .subscribe(
        (resp: any) => {
          if (resp[0].status === 1) {
            this.locationArray = resp[0].data;
            console.log(this.locationArray);
          } else {
            this.presentToast("Please try again later");
          }
        },
        err => {
          this.presentToast("Please try again later");
        }
      );

  }

  onCancel() {
    let data = { 'success': false };
    this._viewCtrl.dismiss(data);
  } //

  presentToast(msg: string) {
    const toast = this._toastCtrl.create({
      message: `ERROR, ${msg}`,
      duration: 3000,
      position: "middle"
    });

    toast.present();
  } // End presentLoginToast

  getLocationPlaceholderText() {
    let placeholderText: string;
    placeholderText = `Please Enter ${this.locationCriteriaText}`;

    return placeholderText;
  } //

  changeLocationCriteria(criteria: string) {
    this.locationCriteriaText = criteria;
    this.locationSearchtext = '';
    this.filteredLocationArray = [];
  }

  searchLocation(event) {
    this.locationSearchtext = event;
    if (this.locationSearchtext.length > 2) {
      console.log('do somehting');
      if (this.locationCriteriaText === 'postcode') {
        this.searchLocationByPostcode();
      } else {
        this.searchLocationBySuburb();
      }
    }
  } //

  searchLocationByPostcode() {
    console.log(this.locationSearchtext);
    console.log(this.locationArray);
    this.filteredLocationArray = [];

    this.filteredLocationArray = this.locationArray.filter((o) => {
      return (o.postcode.toLowerCase().trim().indexOf(this.locationSearchtext.trim().toLocaleLowerCase()) > -1);
    });

    console.log(this.filteredLocationArray);
  } //

  searchLocationBySuburb() {
    console.log(this.locationSearchtext);
    console.log(this.locationArray);
    this.filteredLocationArray = [];

    this.filteredLocationArray = this.locationArray.filter((o) => {
      return (o.suburb.toLowerCase().trim().indexOf(this.locationSearchtext.toLowerCase().trim()) > -1);
    });

    console.log(this.filteredLocationArray);
  } //

  selectLocation(location) {
    let data = { 'success': true, location: location };
    this._viewCtrl.dismiss(data);
  }

}
