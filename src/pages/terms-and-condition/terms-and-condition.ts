import { Component } from "@angular/core";
import { NavController, NavParams } from "ionic-angular";
import { HomePage } from "../home/home";

@Component({
  selector: "page-terms-and-condition",
  templateUrl: "terms-and-condition.html"
})
export class TermsAndConditionPage {
  showContinueButton: boolean;
  constructor(public navCtrl: NavController, public navParams: NavParams) {
    this.showContinueButton = false;
  }

  ionViewDidLoad() {
    if (localStorage.getItem("UserInfo") != null) {
      this.showContinueButton = false;
    } else {
      this.showContinueButton = true;
    }
  }

  goNext() {
    this.navCtrl.setRoot(HomePage);
  }
}
