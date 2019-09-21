import { Component } from "@angular/core";
import {
  NavController,
  NavParams,
  LoadingController,
  ToastController
} from "ionic-angular";
import { ProfilePage } from "../profile/profile";
import { SocialSharing } from "@ionic-native/social-sharing";
import { CreditPurchase } from "../../provider/DataModel/CreditPurchaseResponse";
import { CallsService } from "../../provider/CallsService";
import { UserService } from "../../provider/UserService";
import { User } from "../../provider/DataModel/User";

@Component({
  selector: "page-buy-credits",
  templateUrl: "buy-credits.html"
})
export class BuyCreditsPage {
  BuyCreditListData: CreditPurchase[];
  planId: string;
  selectedItem: string;
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public callsService: CallsService,
    public userService: UserService,
    public loader: LoadingController,
    private socialSharing: SocialSharing,
    public toastCtrl: ToastController
  ) {
    this.getBuyCreditList();
  }
  goNext() {
    this.navCtrl.push(ProfilePage);
  }

  presentToast(msg) {
    let toast = this.toastCtrl.create({
      message: msg,
      duration: 3000,
      position: "middle"
    });
    toast.present();
  }

  public isLoggedIn(): boolean {
    return this.userService.GetLoggedInUserOrNull() !== null;
  }

  purchaseCredit(event, planId) {
    this.planId = planId;
    this.selectedItem = planId;
  }

  PurchaseCall() {
    if (this.selectedItem == undefined) {
      this.presentToast("Please select plan");
      return;
    }
    var Loader = this.loader.create({
      content: "Wait.."
    });
    Loader.present();

    let user: User = this.userService.GetLoggedInUserOrNull();
    if (user === null) {
      this.presentToast("User not Logged-In");
      return;
    }

    this.callsService.PurchaseCredit(user.ID, this.planId).subscribe(
      response => {
        console.log(
          "TCL: BuyCreditsPage -> PurchaseCall -> this.Result",
          response
        );
        Loader.dismiss();
        this.presentToast(
          `Successfully credited ${response.credit} credits to your account`
        );
      },
      error => {
        Loader.dismiss();
        this.presentToast("Server Not Response!");
      }
    );
  }

  getBuyCreditList() {
    var Loader = this.loader.create({
      content: "Wait.."
    });
    Loader.present();
    this.callsService.getBuyCreditList().subscribe(
      response => {
        this.BuyCreditListData = response.creditPurchases;
        Loader.dismiss();
      },
      error => {
        Loader.dismiss();
        // this.presentToast('Server Not Response!')
      }
    );
  }
}
