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
  featuredRestaurantsArray: Array<any> = [];
  filteredRestauransArray: Array<any> = [];

  restaurantLogoURL =
    "https://adminstaging.azurewebsites.net/uploadedimages/RestaurantLogo/";

  featuredImageUrl =
    "https://adminstaging.azurewebsites.net/uploadedimages/MerchantGeneralSetting/";

  offserArray: Array<any> = [
    {
      offerId: 'x112',
      offerTitle: 'Get 20% off on ABCD',
      offerDescription: 'Valid on Sandwich and pipes',
      imgUrl: 'https://loremflickr.com/320/240/food,restaurant/all?random=1'
    },
    {
      offerId: 'x113',
      offerTitle: 'Get 10% off on ZZZZ',
      offerDescription: 'Valid on Mi. 2000 shopping',
      imgUrl: 'https://loremflickr.com/320/240/food,restaurant/all?random=2'
    },
    {
      offerId: 'x114',
      offerTitle: 'Get 50% off on NNNN From XXXXX',
      offerDescription: 'Valid on Min. 500 shopping',
      imgUrl: 'https://loremflickr.com/320/240/food,restaurant/all?random=3'
    }
  ];

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
            // This is for popularRestaurants array
            this.restaurantsArray = this.allData.getPopularRestaurantsByLocality[0].data;

            // Add dummy data to this.restaurantsArray
            this.restaurantsArray.forEach(elem => {
              elem['badgeText'] = '30% off on select category';
              elem['restaurantRating'] = 4.3;
              elem['restaurantDistance'] = '3 KM';
              elem['restaurantTime'] = '30 Mins';
              elem['restaurantFoodCost'] = '$300 For Two';

            });

            console.log(this.restaurantsArray);

            this.featuredRestaurantsArray = this.allData.getFeaturedRestaurants[0].data;
            console.log(this.restaurantsArray);
            // Set allData into storage
            this._storage.set('alldata', this.allData)
              .then((val) => {
                console.log('All Data saved to storage');
              });
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
          this.navCtrl.push(RestaurantHomePage);
        }, 50);
      });
  } // End gotoRestaurantHome 

  openFilterOptionsModal() {
    let filterModal = this._modalCtrl.create(SearchFilterPopoverPage);
    filterModal.onDidDismiss(data => {
      console.log(data);
      if (data.success) {
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
