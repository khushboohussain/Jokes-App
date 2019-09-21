import { Component, ViewChild } from "@angular/core";

import { Platform, MenuController, Nav, AlertController } from "ionic-angular";

import { StatusBar } from "@ionic-native/status-bar";
import { SplashScreen } from "@ionic-native/splash-screen";

import { HomePage } from "../pages/home/home";
import { BuyCreditsPage } from "../pages/buy-credits/buy-credits";
import { CallScreenPage } from "../pages/call-screen/call-screen";
import { ProfilePage } from "../pages/profile/profile";
import { TermsAndConditionPage } from "../pages/terms-and-condition/terms-and-condition";
import { PrankCallsListPage } from "../pages/prank-calls-list/prank-calls-list";
import { TranslateService } from "@ngx-translate/core";
import { App } from "ionic-angular";
import { File } from "@ionic-native/file";
import { AndroidPermissions } from "@ionic-native/android-permissions";
@Component({
  templateUrl: "app.html"
})
export class MyApp {
  @ViewChild(Nav) nav: Nav;

  // make HomePage the root (or first) page
  rootPage: any;
  pages: Array<{ title: string; component: any }>;
  checklang: string;
  currentPage: any;
  constructor(
    public platform: Platform,
    public menu: MenuController,
    public statusBar: StatusBar,
    public splashScreen: SplashScreen,
    public translate: TranslateService,
    public app: App,
    private alertCtrl: AlertController,
    private file: File,
    private androidPermissions: AndroidPermissions
  ) {
    this.initializeApp();

    this.checklang = localStorage.getItem("selectlanguage");
    if (
      this.checklang == "" ||
      this.checklang == "undefined" ||
      this.checklang == undefined ||
      this.checklang == "null" ||
      this.checklang == null
    ) {
      this.translate.addLangs(["en", "iw"]);
      this.translate.setDefaultLang("en");
    } else {
      this.translate.setDefaultLang(this.checklang);
    }

    // set our app's pages
    this.pages = [
      { title: "Home", component: HomePage },
      { title: "Buy Credits", component: BuyCreditsPage },
      { title: "Call Screen", component: CallScreenPage },
      { title: "Profile", component: ProfilePage },
      { title: "Terms and Conditions", component: TermsAndConditionPage },
      { title: "Prank Calls List", component: PrankCallsListPage }
    ];
  }

  initializeApp() {
    this.platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      this.statusBar.styleBlackOpaque();
      this.splashScreen.hide();

      this.rootPage = HomePage;

      // Creating new directiory
      // this.file
      //   .checkDir(this.file.externalRootDirectory, 'Skandal')
      //   .then(response => {
      //     console.log('Directory exists' + response);
      //   })
      //   .catch(err => {
      //     console.log("Directory doesn't exist" + JSON.stringify(err));
      //     this.file
      //       .createDir(this.file.externalRootDirectory, 'Skandal', false)
      //       .then(response => {
      //         console.log('Directory create' + response);
      //       })
      //       .catch(err => {
      //         console.log('Directory no create' + JSON.stringify(err));
      //       });
      //   });
    });

    this.platform.registerBackButtonAction(() => {
      // Catches the active view
      let nav = this.app.getActiveNavs()[0];
      // Checks if can go back before show up the alert

      if (
        this.currentPage === "HomePage" ||
        this.currentPage === undefined ||
        this.currentPage == undefined
      ) {
        if (nav.canGoBack()) {
          nav.pop();
        } else {
          this.platform.exitApp();
        }
      }
    });
  }

  openPage(page) {
    // close the menu when clicking a link from the menu
    this.menu.close();
    // navigate to the new page if it is not the current page
    this.nav.setRoot(page.component);
  }
}
