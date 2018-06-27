import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';

import { HttpClient, HttpClientModule } from '@angular/common/http';

import { MyApp } from './app.component';
import { HomePage } from '../pages/home/home';
import { ListPage } from '../pages/list/list';

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { LoginPage } from '../pages/login/login';

import { GooglePlus } from '@ionic-native/google-plus';
import { RemoteServiceProvider } from '../providers/remote-service/remote-service';

import { Network } from '@ionic-native/network';
import { InterceptorModule } from './interceptor.module';

import { IonicStorageModule } from '@ionic/storage';
import { SearchFilterPopoverPage } from '../pages/search-filter-popover/search-filter-popover';
import { LocationSearchPopoverPage } from '../pages/location-search-popover/location-search-popover';

// Import ionic2-rating module
import { Ionic2RatingModule } from 'ionic2-rating';
import { RestaurantHomePage } from '../pages/restaurant-home/restaurant-home';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RestaurantAboutPage } from '../pages/restaurant-about/restaurant-about';
import { RestaurantReviewsPage } from '../pages/restaurant-reviews/restaurant-reviews';

@NgModule({
  declarations: [
    MyApp,
    HomePage,
    ListPage,
    LoginPage,
    SearchFilterPopoverPage,
    LocationSearchPopoverPage,
    RestaurantHomePage,
    RestaurantAboutPage,
    RestaurantReviewsPage
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp),
    HttpClientModule,
    IonicStorageModule.forRoot(),
    Ionic2RatingModule,
    BrowserAnimationsModule
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage,
    ListPage,
    LoginPage,
    SearchFilterPopoverPage,
    LocationSearchPopoverPage,
    RestaurantHomePage,
    RestaurantAboutPage,
    RestaurantReviewsPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    GooglePlus,
    RemoteServiceProvider,
    Network
  ]
})
export class AppModule {}
