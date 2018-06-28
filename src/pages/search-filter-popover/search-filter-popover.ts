import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController, ViewController, ModalController } from 'ionic-angular';

import { RemoteServiceProvider } from "../../providers/remote-service/remote-service";

import { Storage } from "@ionic/storage";


import * as _ from 'lodash';
import { LocationSearchPopoverPage } from '../location-search-popover/location-search-popover';

@Component({
  selector: 'page-search-filter-popover',
  templateUrl: 'search-filter-popover.html',
})
export class SearchFilterPopoverPage {

  httpRequestPending: boolean = false;

  location: any;

  cuisineTypeArray: Array<any> = [];
  cuisineId: any;
  merchantsArray: Array<any> = [];


  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private _toastCtrl: ToastController,
    private remote: RemoteServiceProvider,
    private _storage: Storage,
    private _viewCtrl: ViewController,
    private _modalCtrl: ModalController
  ) {
  }

  ionViewDidLoad() {

    this._storage.get('alldata')
      .then((val) => {
        console.log(val);
        if (val) {
          this.cuisineTypeArray = val['getCuisineTypeData'][0].data;
          console.log(this.cuisineTypeArray);
        }
      });

  }

  onCancel() {
    let data = { 'success': false };
    this._viewCtrl.dismiss(data);
  } //

  getCuisineId($event: any) {
    this.cuisineId = $event;
    console.log(this.cuisineId.join());
  } //

  searchRestaurants() {
    let cuisinesTypeString: string;
    if (!this.cuisineId) {
      cuisinesTypeString = '';
    } else {
      cuisinesTypeString = this.cuisineId.join();
    }

    const finalData = {
      "cuisineId" : cuisinesTypeString,
      "pageno" : 1,
      "pagesize": 30,
      "serviceId": "",
      "suburb": this.location.suburb
    };
    console.log(finalData);

    this.httpRequestPending = true;
    this.remote.postWithoutToken('search', finalData)
      .finally(() => {
        this.httpRequestPending = false;
      }).subscribe((resp: any) => {
        console.log(resp);
        if (resp.status === 0) {
          this.presentToast('No restaurant found for your query. Please change search criteria');
        } else {
          this.merchantsArray = resp.data.merchants;
          let data = { 'success': true, data:  this.merchantsArray};
          this._viewCtrl.dismiss(data);
        }
      });

  } //

  presentToast(msg: string) {
    const toast = this._toastCtrl.create({
      message: `ERROR, ${msg}`,
      duration: 3000,
      position: "middle"
    });

    toast.present();
  } // End presentLoginToast

  presentLocationSearchModal() {
    let profileModal = this._modalCtrl.create(LocationSearchPopoverPage, { userId: 8675309 });
    profileModal.onDidDismiss(data => {
      console.log(data);
      if (data.success) {
        this.location = data.location;
        console.log(this.location);
      }
    });
    profileModal.present();
  } //


}
