import { Component } from "@angular/core";
import {
  NavController,
  AlertController,
  ToastController,
  Events,
  ActionSheetController,
  ModalController
} from "ionic-angular";
import { RemoteServiceProvider } from "../../providers/remote-service/remote-service";

import { Storage } from "@ionic/storage";
import { SearchFilterPopoverPage } from "../search-filter-popover/search-filter-popover";
import { RestaurantHomePage } from "../restaurant-home/restaurant-home";

@Component({
  selector: "page-home",
  templateUrl: "home.html"
})
export class HomePage {
  allData: any = {};
  httpRequestPending: boolean = false;
  searchText: string = "";

  filterOnText: string = 'restaurant';
  filterPlaceholderText = `Search By ${this.filterOnText}`;

  restaurantsArray: Array<any> = [];
  filteredRestauransArray: Array<any> = [];

  restaurantLogoURL =
    "https://adminstaging.azurewebsites.net/uploadedimages/RestaurantLogo/";

  featuredImageUrl =
    "https://adminstaging.azurewebsites.net/uploadedimages/MerchantGeneralSetting/";

  constructor(
    public navCtrl: NavController,
    private remote: RemoteServiceProvider,
    private _storage: Storage,
    private _alertCtrl: AlertController,
    private _toastCtrl: ToastController,
    private _events: Events,
    private _actionSheetCtrl: ActionSheetController,
    private _modalCtrl: ModalController
  ) {
    this.httpRequestPending = true;

    this._events.subscribe("user:created", (user, time) => {
      // User and time are the same arguments passed in `events.publish(user, time)`
      alert("Welcome");
    });

    this.remote
      .get("getAllData")
      .finally(() => (this.httpRequestPending = false))
      .subscribe(
        (resp: any) => {
          if (resp.status === 1) {
            this.allData = resp.data;
            console.log(this.allData);
            this.restaurantsArray = this.allData.getPopularRestaurantsByLocality[0].data;
            console.log(this.restaurantsArray);
            //set allData into storage
            this._storage.set('alldata', this.allData)
              .then((val) => {
                console.log('All Data saved to storage');
              })
          } else {
            this.presentToast("Please try again later");
          }
        },
        err => {
          this.presentToast("Please try again later");
        }
      );
  }

  presentToast(msg: string) {
    const toast = this._toastCtrl.create({
      message: `ERROR, ${msg}`,
      duration: 3000,
      position: "middle"
    });

    toast.present();
  } // End presentLoginToast

  searchRestaurants(event) {
    this.searchText = event;
    // Check string length
    if (this.searchText.length > 3) {
      console.log("do something");
    }
  } // End searchRestaurants

  gotoRestaurantHome(restaurant) {
    this._storage.set('restaurantinfo', restaurant)
      .then(() => {
        setTimeout(() => {
          this.navCtrl.push(RestaurantHomePage)
        }, 50);
      })
  }; // end gotoRestaurantHome 

  openFilterOptionsModal() {
    let filterModal = this._modalCtrl.create(SearchFilterPopoverPage);
    filterModal.onDidDismiss(data => {
      console.log(data);
      if(data.success) {
        this.filteredRestauransArray = data.data;
      }
    });
    filterModal.present();
  }


  presentFilterSelectionActionSheet() {
    let actionSheet = this._actionSheetCtrl.create({
      title: 'Change your Filter criteria',
      buttons: [
        {
          text: 'Search By Restaurant',
          handler: () => {
            this.filterOnText = 'restaurant';
            this.filterPlaceholderText = `Search By ${this.filterOnText}`;
            console.log('restaurant clicked');
          }
        },
        {
          text: 'Search By Dish',
          handler: () => {
            this.filterOnText = 'dish';
            this.filterPlaceholderText = `Search By ${this.filterOnText}`;
            console.log('dish clicked');
          }
        },
        {
          text: 'Cancel',
          role: 'cancel',
          handler: () => {
            console.log('Cancel clicked');
          }
        }
      ]
    });
    actionSheet.present();
  }

}
