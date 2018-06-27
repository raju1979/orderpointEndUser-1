import { Component, NgZone } from '@angular/core';
import { IonicPage, NavController, NavParams, MenuController, AlertController, ToastController, Events  } from 'ionic-angular';

import { GooglePlus } from '@ionic-native/google-plus';

import { Platform } from 'ionic-angular';
import { RemoteServiceProvider } from '../../providers/remote-service/remote-service';

import { Network } from '@ionic-native/network';

import { Storage } from '@ionic/storage';

import 'rxjs/add/operator/finally';
import { HomePage } from '../home/home';

@Component({
  selector: "page-login",
  templateUrl: "login.html"
})
export class LoginPage {
  inputType: string = "password";
  inputToggleIcon = "eye";
  emailPattern = "^[a-z0-9._%+-]+@[a-z0-9.-]+.[a-z]{2,4}$";

  httpRequestPending: boolean = false;

  userInfo: any = {};
  isUserLoggodIn: boolean = false;
  checkingExistingLoggingStatus: boolean = true;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private _platform: Platform,
    private _menuCtrl: MenuController,
    private _zone: NgZone,
    private _googlePlus: GooglePlus,
    private remote: RemoteServiceProvider,
    private _network: Network,
    private _storage: Storage,
    private _alertCtrl: AlertController,
    private _toastCtrl: ToastController,
    private _events: Events
  ) {}

  ionViewWillEnter() {
    this._menuCtrl.enable(true);
  }

  ionViewWillLeave() {
    //
  }

  ionViewDidLoad() {
    console.log("ionViewDidLoad LoginPage");
    this._menuCtrl.enable(false);

    const userData = this._storage.get("userdata").then(val => {
      if (!val) {
        console.log("not logged in");
        this.checkingExistingLoggingStatus = false;
      } else {
        console.log("Already logged in navigate now");
        this.remote.sendMessage(val);
        this.navCtrl.setRoot(HomePage);
      }
    });
  }

  getImageFromAssets(img): string {
    let assetImg = "";

    if (this._platform.is("mobile")) {
      assetImg = `assets/imgs/${img}`;
    } else {
      assetImg = `../../assets/imgs/${img}`;
    }

    // Console.log(assetImg)
    return assetImg;
  } //

  getLoadingImg() {
    if (this._platform.is("core")) {
      return "../assets/imgs/loading.svg";
    } else if (this._platform.is("android")) {
      return "assets/imgs/loading.svg";
    } else {
      return "assets/imgs/loading.svg";
    }
  } //

  toggleInputType() {
    if (this.inputType === "text") {
      this.inputType = "password";
      this.inputToggleIcon = "eye";
    } else {
      this.inputType = "text";
      this.inputToggleIcon = "eye-off";
    }
  }

  onLoginSubmit(f) {
    let loginPayload: any;

    console.log(this._platform);
    console.log(this._network);

    if (this._platform.is("mobile") && this._network.type === "none") {
      console.log("mobile");
    } else {
      console.log(f.value);
      if (f.valid) {
        loginPayload = {
          email: f.value.email,
          password: f.value.password,
          device_model: "ABCDQRW12",
          device_uuid: "hjgy78uyht7",
          device_platform: "Android",
          device_version: "gahbxy16fs",
          device_manufacturer: "nhb17sgja",
          device_serial: "mjn17dgajsgb"
        };
        let token = "";
        this.httpRequestPending = true;

        this.remote
          .login("merchantlogin", loginPayload, token)
          .finally(() => {
            this.httpRequestPending = false;
          })
          .subscribe(
            res => {
              console.log(res);
              if (res["error"].length > 0) {
                this.presentLoginToast("Please check Email and Password");
              } else if (res["data"].length > 0) {
                this._storage.set("userdata", res["data"][0]).then(val => {
                  console.log("Email User Data Saved");
                  this.remote.sendMessage(val);
                  setTimeout(() => {
                    this.navCtrl.setRoot(HomePage);
                  });
                });
              }
            },
            err => {
              this.presentLoginToast("Please check Email and Password");
            }
          );
      }
    }
  } // End onLoginSubmit

  forgotPassword() {
    window.open("https://google.com", "_system");
  } // End forgotPassword

  loginWithGoogle() {
    this._googlePlus
      .login({})
      .then(data => {
        console.log(data);
        console.log(JSON.stringify(data));
        this._storage.set("userdata", data).then(val => {
          console.log("Google Data Saved");
        });
        this.userInfo = data;
        this.isUserLoggodIn = true;
      })
      .catch(err => {
        this.showLoginErrorAlert("Google Login Fail");
      });
  } // End loginWithGoogle()

  showLoginErrorAlert(msg: string) {
    const alert = this._alertCtrl.create({
      title: "Login Failed",
      subTitle: `${msg}`,
      buttons: ["Ok"]
    });
    alert.present();
  } // End showLoginErrorAlert

  presentLoginToast(msg: string) {
    const toast = this._toastCtrl.create({
      message: "ERROR: Please check Email and Password",
      duration: 3000,
      position: "middle"
    });

    toast.present();
  } // End presentLoginToast
}
