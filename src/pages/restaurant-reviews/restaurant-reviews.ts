import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';


@Component({
  selector: 'page-restaurant-reviews',
  templateUrl: 'restaurant-reviews.html',
})
export class RestaurantReviewsPage {

  merchantDetail: any;
  merchantReviews: any;

  averageRestaurantRating: number = 0;

  constructor(public navCtrl: NavController, public navParams: NavParams) {

    this.merchantReviews = this.navParams.get('merchantReviews');
    this.merchantDetail = this.navParams.get('merchantDetail');

    console.log(this.merchantDetail);
    console.log(this.merchantReviews);
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad RestaurantReviewsPage');
  }

}
