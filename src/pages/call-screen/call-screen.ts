import { Component } from "@angular/core";
import {
  NavController,
  NavParams,
  LoadingController,
  ToastController
} from "ionic-angular";
import { BuyCreditsPage } from "../buy-credits/buy-credits";
import { HomePage } from "../home/home";
import { Contacts } from "@ionic-native/contacts";

import * as moment from "moment";
import { ProfilePage } from "../profile/profile";
import { CountryDialCode } from "../../provider/DataModel/CountryDialCodesResponse";
import { CallRequest } from "../../provider/DataModel/CallRequest";
import { CallsService } from "../../provider/CallsService";
import { UserService } from "../../provider/UserService";
import { User } from "../../provider/DataModel/User";
import { CountryDialCodeService } from "../../provider/CountryDialNumberService";
import { XmlCreatingResponse } from "../../provider/DataModel/XmlCreatingResponse";

@Component({
  selector: "page-call-screen",
  templateUrl: "call-screen.html"
})
export class CallScreenPage {
  public clientNumber: string;
  public countryCodeList: CountryDialCode[];
  public chosenCountryDialCode: CountryDialCode;
  Contact_list: Array<any> = [];
  showContactList: boolean = false;
  countryDialCode: string;
  myDate: string;
  minDate: string;
  currentTime: Number;
  audioData: string;
  audioId: string;
  audioMP3: string;
  audioImage: string;
  contactList: Array<string> = [];
  newContactList: Array<string> = [];
  searchContact: string;
  currentLanguage: string;
  rtlLayout: boolean;
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public callsService: CallsService,
    public userService: UserService,
    public countriesDialCodeService: CountryDialCodeService,
    public loader: LoadingController,
    private contacts: Contacts,
    public toastCtrl: ToastController
  ) {
    this.clientNumber = "";
    this.setFakeCountriesDialCodes();
    this.Contact_list = [];
    this.showContactList = false;
    this.myDate = moment().format();
    this.minDate = moment().format();
    this.currentTime = 0;
    this.audioData = this.navParams.get("audioData");
    this.audioMP3 = this.navParams.get("audioData");
    this.audioId = this.navParams.get("audioId");
    this.audioImage = this.navParams.get("image");
    this.rtlLayout = false;

    // Creating audio file to xml
  }
  ionViewWillEnter() {
    this.currentLanguage = localStorage.getItem("selectlanguage");
    console.log("currentLanguage", this.currentLanguage);
    if (this.currentLanguage == "iw") {
      console.log("currentLanguage", this.currentLanguage);
      this.rtlLayout = true;
    }
  }

  EmptyPhoneNumber() {
    this.clientNumber = "";
  }

  getDate(myDate, val) {
    this.currentTime = val;
    this.myDate = myDate;
  }

  getCurrerntTime() {
    this.myDate = moment().format();
  }
  select_val(value) {
    this.clientNumber = value.number;
  }

  getItems(ev: any) {
    let val = ev.target.value;

    // if the value is an empty string don't filter the items
    if (val && val.trim() != "") {
      this.Contact_list = this.Contact_list.filter(item => {
        return item.title.toLowerCase().indexOf(val.toLowerCase()) > -1;
      });
    } else {
      this.Contact();
    }
  }

  ngOnInit() {
    this.setAllCountriesDialCodes();
  }
  profilePage() {
    this.navCtrl.push(ProfilePage);
  }

  Contact() {
    this.contacts.pickContact().then(contacts => {
      let contactPhoneNumber: string = (<any>(
        contacts
      ))._objectInstance.phoneNumbers[0].value
        .trim()
        .split(" ")
        .join("");

      let matchToOneOfTheCountries: boolean = this.countryCodeList.some(
        countryCode => contactPhoneNumber.indexOf(countryCode.dialCode) !== -1
      );

      if (matchToOneOfTheCountries) {
        this.clientNumber = contactPhoneNumber;
      }
    });
  }

  navigateToBuyCreditsPage() {
    this.navCtrl.push(BuyCreditsPage);
  }

  public isLoggedIn(): boolean {
    return this.userService.GetLoggedInUserOrNull() !== null;
  }

  public sendPrankCall() {
    if (!this.chosenCountryDialCode) {
      this.presentToast("Please select country code");
      return;
    }

    if (
      this.clientNumber == "" ||
      !this.countriesDialCodeService.checkIfNumberLengthIsValid(
        this.clientNumber,
        this.chosenCountryDialCode
      )
    ) {
      this.presentToast(
        `Enter valid ${this.chosenCountryDialCode.minNumberOfDigits}/${
          this.chosenCountryDialCode.maxNumberOfDigits
        } Digit Mobile No`
      );
      return;
    }

    let user: User | null = this.userService.GetLoggedInUserOrNull();
    if (user === null) {
      this.presentToast("Not Logged-in");
      return;
    }

    let currentTime = new Date();
    if (!(this.currentTime === 0 || currentTime > new Date(this.myDate))) {
      var Loader = this.loader.create({
        content: "Wait.."
      });
      Loader.present();

      this.CreateXML();

      var callRequest: CallRequest = {
        clientNumber: this.chosenCountryDialCode + this.clientNumber,
        audioId: this.audioMP3,
        url: this.audioData,
        image: this.audioImage
      };

      this.callsService.ClientCall(callRequest, user.ID).subscribe(
        response => {
          this.presentToast(response.msg);
          Loader.dismiss();
        },
        error => {
          Loader.dismiss();
          this.presentToast("Server Not Response!");
        }
      );
    } else {
      let Loader = this.loader.create({
        content: "Wait.."
      });
      Loader.present();
      var dateTimeSchedule = new Date(this.myDate).toString().split("(");
      var request1 = {
        userNumber: this.chosenCountryDialCode.dialCode + this.clientNumber,
        audioData: this.audioData,
        scheduleDate: dateTimeSchedule[0].replace(/\s+$/, ""),
        now: true,
        audioId: this.audioMP3,
        image: this.audioImage
      };

      this.callsService.ScheduleCall(request1, user.ID).subscribe(
        response => {
          this.presentToast(response.msg);
          Loader.dismiss();
        },
        error => {
          Loader.dismiss();
          this.presentToast("Server Not Response!");
        }
      );
    }
  }

  home() {
    this.navCtrl.setRoot(HomePage);
  }

  public countryDialCodesIdentify(index, item: CountryDialCode) {
    return item.dialCode;
  }
  public validateInputNumberOnly(event) {
    let value = this.clientNumber;
    let isNumberOnly: boolean = /^-?\d*$/.test(value);
    if (!isNumberOnly) {
      event.preventDefault();
      this.clientNumber = value.toString().substring(0, value.length - 1);
    }
  }

  private async CreateXML() {
    let audioDataResponse: XmlCreatingResponse = await this.callsService
      .CreatingXML(this.audioData)
      .toPromise();

    this.audioData = audioDataResponse.data;
  }

  private setFakeCountriesDialCodes(): void {
    // When upgrading to angular routing - user resolvers instead of fake/wait
    let fakeWaitingCountryDialCode: CountryDialCode = {
      code: "FAKE",
      name: "Fetching..",
      dialCode: "FAKE",
      minNumberOfDigits: 0,
      maxNumberOfDigits: 1
    };
    this.countryCodeList = [fakeWaitingCountryDialCode];
  }
  private async setAllCountriesDialCodes() {
    try {
      this.countryCodeList = (await this.countriesDialCodeService.getAllCountriesDialCodes()).countryDialCodes;
      this.chosenCountryDialCode = this.countryCodeList[0];
    } catch (error) {
      this.presentToast("Failed to load country list");
    }
  }

  private presentToast(msg): void {
    let toast = this.toastCtrl.create({
      message: msg,
      duration: 3000,
      position: "middle"
    });
    toast.present();
  }
}
