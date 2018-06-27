import { Component, ViewChild } from '@angular/core';
import { Nav, Platform } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { HomePage } from '../pages/home/home';
import { ListPage } from '../pages/list/list';
import { LoginPage } from '../pages/login/login';
import { RemoteServiceProvider } from '../providers/remote-service/remote-service';
import { Subscription } from 'rxjs/Subscription';

import { Storage } from "@ionic/storage";

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  @ViewChild(Nav) nav: Nav;

  rootPage: any = LoginPage;

  pages: Array<{title: string, component: any}>;

  user: any;
  subscription: Subscription;

  constructor(public platform: Platform, public statusBar: StatusBar, public splashScreen: SplashScreen, private _remote: RemoteServiceProvider, private _platform: Platform, private _storage: Storage) {
    this.initializeApp();

    // subscribe to login component messages
    this.subscription = this._remote.getMessage().subscribe(user => { 
      this.user = user; 
      console.log(this.user);
    });

    // used for an example of ngFor and navigation
    this.pages = [
      { title: 'Home', component: HomePage },
      { title: 'List', component: ListPage }
    ];

  }

  initializeApp() {
    this.platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      this.statusBar.styleDefault();
      this.splashScreen.hide();
    });
  }

  openPage(page) {
    // Reset the content nav to have just this page
    // we wouldn't want the back button to show in this scenario
    this.nav.setRoot(page.component);
  }

  getBackground() {
    if(this._platform.is('mobile')) {
      return `url(assets/imgs/burger-menu-bg.png)`;
    } else {
      return `url(../assets/imgs/burger-menu-bg.png)`;
    }
  }; //

  logout() {
    this._storage.clear(); //clear storage
    this._remote.sendMessage(''); //clear user subscription
    this.nav.setRoot(LoginPage);
  }

}
