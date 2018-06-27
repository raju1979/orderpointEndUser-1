import { Component } from '@angular/core';
import {
  IonicPage,
  NavController,
  NavParams,
  AlertController,
  ToastController,
  ModalController
} from 'ionic-angular';

import { RemoteServiceProvider } from "../../providers/remote-service/remote-service";

import { trigger, state, transition, style, animate } from '@angular/animations';


import { Storage } from "@ionic/storage";
import { LoginPage } from '../login/login';
import { RestaurantAboutPage } from '../restaurant-about/restaurant-about';
import { RestaurantReviewsPage } from '../restaurant-reviews/restaurant-reviews';


@Component({
  selector: 'page-restaurant-home',
  templateUrl: 'restaurant-home.html',
  animations: [
    trigger('openClose', [
      state('true', style({ height: '*' })),
      state('false', style({ height: '0px' })),
      transition('false <=> true', animate(200))
    ])
  ]
})
export class RestaurantHomePage {

  restaurantInfoFromStorage: any;

  httpRequestPending: boolean = false;

  merchantDetail: any;
  foodTruckLocations: any;
  merchantReviews: any;
  menuGroups: any;
  featuredMenu: Array<any> = [];

  allDataLoadedSuccessFully: boolean = false;

  restaurantLogoURL = "https://adminstaging.azurewebsites.net/uploadedimages/RestaurantLogo/";

  featuredImageUrl = "https://adminstaging.azurewebsites.net/uploadedimages/MerchantGeneralSetting/";

  itemImage_url = "https://adminstaging.azurewebsites.net/uploadedimages/menuitem/";

  userSelectedItems: any = {};

  token: string = '';

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private remote: RemoteServiceProvider,
    private _storage: Storage,
    private _alertCtrl: AlertController,
    private _toastCtrl: ToastController,
    private _modalCtrl: ModalController
  ) {

  }; // end constructor



  ionViewDidLoad() {
    console.log('ionViewDidLoad RestaurantHomePage hhh');
    this._storage.get('restaurantinfo')
      .then((val) => {
        if (!val) { // If storage is empty, force navigate to LoginPage
          this._storage.clear();
          this.navCtrl.setRoot(LoginPage);
        } else {

          this._storage.get('userdata')
            .then((user) => {
              if(!user) {
                this._storage.clear();
                this.navCtrl.setRoot(LoginPage);
              }
              this.restaurantInfoFromStorage = val;
              console.log(this.restaurantInfoFromStorage);
              this.httpRequestPending = true;

              const payload = {
                merchant_id: val.merchantId
              }

              const token = user.token;

              this.remote.getAllInfoAboutSelectedRestaurant(this.restaurantInfoFromStorage.merchantId || this.restaurantInfoFromStorage.merchantid, token, payload)
                .finally(() => this.httpRequestPending = false)
                .subscribe((resp: any) => {
                  console.log(resp);
                  /* If we get successfull response
                    resp[0] = MerchantDetails
                    resp[1] = MenuDetails
                    resp[2] = FoodTruckLocations
                    resp[3] = ReviewList
                  */

                  // Check for status == 1 in all responses
                  if (resp[0].status !== 1 ||  resp[1].error.length > 0 || resp[2].status !== 1) {
                    // If any resp.status != 1 then send user to previous page
                    this.presentResponseErrorConfirm();
                  } else {
                    console.log(resp);
                    this.allDataLoadedSuccessFully = true;
                    this.merchantDetail = resp[0].data.merchants; //get merchant details
                    this.menuGroups = resp[1].data[0].menuItems; // get menu groups
                    console.log(this.menuGroups);
                    // this.foodTruckLocations = resp[2].data.merchants.operatinghrs.FoodtruckLocations;
                    this.merchantReviews = resp[2].data;
                    this.featuredMenu = this.menuGroups[0];
                    console.log(this.featuredMenu);

                    console.log(this.merchantDetail);

                    this.menuGroups.forEach(group => {
                      group['expanded'] = false;

                      group.GroupWiseMenuItems.forEach(item => {
                        item['qty'] = 0;
                        item['newQty'] = 0;
                      })
                    });
                    console.log(this.menuGroups);
                  }
                }, (err) => {
                  console.log(err);
                  this.presentResponseErrorConfirm();
                })
            })

        }
      })
  }; //

  getExpandButtonName(isExpanded) {
    if (isExpanded) {
      return 'remove-circle';
    } else {
      return 'add-circle';
    }
  }; //

  toggleExpand(menuGroup) {
    console.log(menuGroup);
    menuGroup.expanded = !menuGroup.expanded;
  }; //

  getVegNonVegImg(item) {
    let imgStr: string = '';
    if (!item.vegOrNonVeg) {
      imgStr = `assets/imgs/veg.png`;
    } else if (item.vegOrNonVeg == 'veg') {
      imgStr = `assets/imgs/veg.png`;
    } else {
      imgStr = `assets/imgs/non-veg.png`;
    }
    return imgStr
  }; //

  getMenuItemImage(img) {
    return this.itemImage_url + img;
  }; //

  addItem(item) {
    console.log(item);
    item.newQty++;
    this.modifyUserSelectedQty(item);
  }; //

  removeItem(item) {
    console.log(item);
    if (item.newQty > 0) {
      item.newQty--;
      this.modifyUserSelectedQty(item);
    }
  }; //

  /*
    This method is used to modify user selected items quantity
  */
  modifyUserSelectedQty(item) {
    //search for key == item.menuItemId
    if (this.userSelectedItems[item.menuItemId]) { // if key is found then increase or decrease quantity
      this.userSelectedItems[item.menuItemId]['qty'] = item.newQty;
    } else { //if no key exists then create new key == item.menuItemId
      console.log('new item');
      this.userSelectedItems[item.menuItemId] = {
        'qty': item.newQty
      }
    }

    console.log(this.userSelectedItems);
  }; //

  readAllReviews() {
    console.log(this.merchantDetail, this.merchantReviews);
    this.navCtrl.push(RestaurantReviewsPage, { merchantDetail: this.merchantDetail, merchantReviews: this.merchantReviews });
  }

  presentResponseErrorConfirm() {
    var a = 10;
    let alert = this._alertCtrl.create({
      title: 'Error',
      message: 'There is some Error. Please reselect the restaurant?',
      buttons: [
        {
          text: 'Ok',
          handler: () => {
            console.log('Buy clicked');
            this.navCtrl.pop();
          }
        }
      ]
    });
    alert.present();
  }; //

  openRestaurantAboutModal() {
    let aboutModal = this._modalCtrl.create(RestaurantAboutPage, { data: this.merchantDetail });
    aboutModal.present();
  }

}
