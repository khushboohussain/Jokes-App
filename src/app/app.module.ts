import { BrowserModule } from "@angular/platform-browser";
import { NgModule, ErrorHandler } from "@angular/core";
import { IonicApp, IonicModule, IonicErrorHandler } from "ionic-angular";
import { MyApp } from "./app.component";

import { StatusBar } from "@ionic-native/status-bar";
import { SplashScreen } from "@ionic-native/splash-screen";

import { Config } from "../provider/Config";

import { HomePage } from "../pages/home/home";
import { BuyCreditsPage } from "../pages/buy-credits/buy-credits";
import { CallScreenPage } from "../pages/call-screen/call-screen";
import { ProfilePage } from "../pages/profile/profile";
import { TermsAndConditionPage } from "../pages/terms-and-condition/terms-and-condition";
import { PrankCallsListPage } from "../pages/prank-calls-list/prank-calls-list";
import { PrankCallsHistoryPage } from "../pages/prank-calls-history/prank-calls-history";

import { RemandingCallsCreditComponent } from "../components/RemainingCallsCreditComponent/remaining-calls-credits.component";
import { AuthenticationComponent } from "../components/AuthenticationComponent/authentication.component";

import { UserService } from "../provider/UserService";
import { CallsService } from "../provider/CallsService";
import { RemainingCallsCreditsService } from "../components/RemainingCallsCreditComponent/RemainingCallsCreditsService.service";
import { SocialSharing } from "@ionic-native/social-sharing";
import { Contacts } from "@ionic-native/contacts";

import { TranslateModule, TranslateLoader } from "@ngx-translate/core";
import { TranslateHttpLoader } from "@ngx-translate/http-loader";
import { Facebook } from "@ionic-native/facebook";

import { HttpClientModule, HttpClient } from "@angular/common/http";
import { MomentPipe } from "../pipes/moment/moment";

import { File } from "@ionic-native/file";
import { FileTransfer } from "@ionic-native/file-transfer";
import { AndroidPermissions } from "@ionic-native/android-permissions";
import { CountryDialCodeService } from "../provider/CountryDialNumberService";
import { GooglePlus } from '@ionic-native/google-plus';


export function createTranslateLoader(http: HttpClient) {
  return new TranslateHttpLoader(http, "./assets/i18n/", ".json");
}

@NgModule({
  declarations: [
    MyApp,
    HomePage,
    BuyCreditsPage,
    CallScreenPage,
    ProfilePage,
    TermsAndConditionPage,
    PrankCallsListPage,
    PrankCallsHistoryPage,
    MomentPipe,
    RemandingCallsCreditComponent,
    AuthenticationComponent
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp),
    HttpClientModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: createTranslateLoader,
        deps: [HttpClient]
      }
    })
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage,
    BuyCreditsPage,
    CallScreenPage,
    ProfilePage,
    TermsAndConditionPage,
    PrankCallsListPage,
    PrankCallsHistoryPage
  ],
  providers: [
    Config,
    StatusBar,
    SplashScreen,
    UserService,
    CallsService,
    RemainingCallsCreditsService,
    CountryDialCodeService,
    { provide: ErrorHandler, useClass: IonicErrorHandler },
    SocialSharing,
    Contacts,
    Facebook,
    File,
    FileTransfer,
    AndroidPermissions,
    GooglePlus
  ]
})
export class AppModule {}
