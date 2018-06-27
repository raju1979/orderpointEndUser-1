import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';


@Component({
  selector: 'page-restaurant-about',
  templateUrl: 'restaurant-about.html',
})
export class RestaurantAboutPage {

  merchantDetails: any;

  timingSegment: string;

  openingHrs: any;

  constructor(public navCtrl: NavController, public navParams: NavParams) {
    this.merchantDetails = this.navParams.get('data');
    console.log(this.merchantDetails);
    this.openingHrs = this.merchantDetails.openinghrs;
    console.log(this.merchantDetails);
    console.log(JSON.stringify(this.merchantDetails));
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad RestaurantAboutPage');
    this.timingSegment = 'Business'; // this.merchantDetails['openinghrs']
  }

  exit() {
    this.navCtrl.pop();
  }

}
