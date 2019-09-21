import { Component } from "@angular/core";
import {
  NavController,
  NavParams,
  LoadingController,
  ToastController
} from "ionic-angular";
import { PrankCallsHistoryPage } from "../prank-calls-history/prank-calls-history";
import { HomePage } from "../home/home";
import { PrankCallsListPage } from "../prank-calls-list/prank-calls-list";
import { TermsAndConditionPage } from "../terms-and-condition/terms-and-condition";
import { UserService } from "../../provider/UserService";
import { TranslateService } from "@ngx-translate/core";
import { SocialSharing } from "@ionic-native/social-sharing";

@Component({
  selector: "page-profile",
  templateUrl: "profile.html"
})
export class ProfilePage {
  Mobile_Number: any;
  sel_lang: any;
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public userService: UserService,
    public loader: LoadingController,
    public toastCtrl: ToastController,
    public translate: TranslateService,
    private socialSharing: SocialSharing
  ) {
    this.Mobile_Number = localStorage.getItem("phoneno");
    this.sel_lang = localStorage.getItem("selectlanguage");
  }

  public isLoggedIn(): boolean {
    return this.userService.GetLoggedInUserOrNull() !== null;
  }

  presentToast(msg) {
    let toast = this.toastCtrl.create({
      message: msg,
      duration: 3000,
      position: "bottom"
    });
    toast.present();
  }

  Change(value) {
    localStorage.setItem("selectlanguage", value);
    this.translate.use(value);
  }

  ionViewDidLoad() {}
  callHistory() {
    this.navCtrl.push(PrankCallsHistoryPage);
  }
  home() {
    this.navCtrl.setRoot(HomePage);
  }
  pranksList() {
    this.navCtrl.push(PrankCallsListPage);
  }
  termsAndConditions() {
    this.navCtrl.push(TermsAndConditionPage);
  }

  // Open Sharesheet Options
  openShareOptions() {
    this.socialSharing
      .share("Skandal APP", "Share", null, "http://demo.com")
      .then(() => {
        // Success!
        console.log("success");
      })
      .catch(() => {
        // Error!
        console.log("error");
      });
  }
}
