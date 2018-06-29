import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

import { Storage } from "@ionic/storage";

@Component({
  selector: 'page-restaurant-reviews',
  templateUrl: 'restaurant-reviews.html',
})
export class RestaurantReviewsPage {

  merchantDetail: any;
  merchantReviews: any;

  staticStarArray = [ // For creating static stars in right container of restaurant rating
    [1],
    [1, 2],
    [1, 2, 3],
    [1, 2, 3, 4],
    [1, 2, 3, 4, 5]
  ];

  individualRating: any = {
    "1" : 0,
    "2" : 0,
    "3" : 0,
    "4" : 0,
    "5" : 0,
  };

  averageRestaurantRating: number = 0;

  constructor(public navCtrl: NavController, public navParams: NavParams, private _storage: Storage) {

    // this.merchantReviews = this.navParams.get('merchantReviews');
    // this.merchantDetail = this.navParams.get('merchantDetail');

    this._storage.get('reviews')
      .then((val) => {
        this.merchantReviews = val;

        // Create a list of user rating, e.g. how many are 1 how many are 2 etc.
        const reviewsArray = this.merchantReviews.reviews;
        reviewsArray.forEach(elem => {
          const rating = parseFloat(elem.start_rating);
          if (rating <= 1) {
            this.individualRating['1'] = this.individualRating['1'] + 1;
          } else if (rating > 1 &&  rating <= 2) {
            this.individualRating['2'] = this.individualRating['2'] + 1;
          } else if (rating > 2 &&  rating <= 3) {
            this.individualRating['3'] = this.individualRating['3'] + 1;
          } else if (rating > 3 &&  rating <= 4) {
            this.individualRating['4'] = this.individualRating['4'] + 1;
          } else if (rating > 4 &&  rating <= 5) {
            this.individualRating['5'] = this.individualRating['5'] + 1;
          }

        });

        console.log(this.individualRating);


        this._storage.get('merchant')
          .then((merchant) => {
            this.merchantDetail = merchant;

            console.log(this.merchantDetail);
            console.log(this.merchantReviews);
          });
      });
  }

  // This function will compute the width of inner row after stars (.progressRowPercentInner)
  // The logic here is we are passing index i which is (0 - 4)
  // But we want if i == 0, to search this.individualRating == 5
  // Which is the top row for stars
  // And i == 4 is the bottom row of start so it is this.individualRating == 1
  setInnerWidth(i) {
    console.log(`i is ${i}`);
    console.log(`individual rating is ${this.individualRating[5 - i]}`);
    const percentWidth = (this.individualRating[5 - i] / this.merchantReviews.reviews.length) * 100;

    return `${percentWidth}%`;
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad RestaurantReviewsPage');
  }

}
