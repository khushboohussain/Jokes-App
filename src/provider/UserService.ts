import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";

import { Observable } from "rxjs/Rx";
import { map } from "../../node_modules/rxjs/operators";
import { BaseResponse } from "./DataModel/BaseResponse";
import { User, AuthenticationService } from "./DataModel/User";
import {
  Facebook,
  FacebookLoginResponse
} from "../../node_modules/@ionic-native/facebook";
import { Config } from "./Config";

@Injectable()
export class UserService {
  private readonly STORAGE_USER_KEY: string = "UserInfo";
  private httpOptions;

  constructor(
    private config: Config,
    private http: HttpClient,
    private facebookService: Facebook
  ) {
    this.httpOptions = {
      headers: new HttpHeaders({
        "Content-Type": "application/json"
      })
    };
  }

  public async LoginWithFacebook(): Promise<User> {
    // Check if already logged in.
    if (this.GetLoggedInUserOrNull() != null) {
      throw "User is already logged in";
    }

    let user: User = await this.AuthenticateViaFacebook();
    this.SetLoggedInUser(user);

    return user;
  }

  public GetLoggedInUserOrNull(): null | User {
    let userDetailsString: string = localStorage.getItem(this.STORAGE_USER_KEY);

    if (userDetailsString == null) {
      return null;
    }

    let user: User = JSON.parse(userDetailsString);
    return user;
  }

  public Logout(): void {
    if (this.GetLoggedInUserOrNull() === null) {
      throw "User is not logged in. Unable to logout.";
    }

    localStorage.removeItem(this.STORAGE_USER_KEY);
  }

  private SetLoggedInUser(user: User): void {
    if (this.GetLoggedInUserOrNull() != null) {
      throw "User is already logged in.";
    }

    localStorage.setItem(this.STORAGE_USER_KEY, JSON.stringify(user));
  }

  private async AuthenticateViaFacebook(): Promise<User> {
    try {
      let loginResponse: FacebookLoginResponse = await this.facebookService.login(
        ["public_profile", "email"]
      );
      if (loginResponse.status == "connected") {
        let facebookUserId = loginResponse.authResponse.userID;
        console.log("Facebook authenticated. UserID=" + facebookUserId);
        try {
          let userData: any = await this.facebookService.api(
            "/me?fields=name",
            []
          );

          console.log("Facebook User Data:", JSON.stringify(userData));
          let displayName: string = userData["name"];
          let user: User = new User(
            facebookUserId,
            AuthenticationService.Facebook,
            displayName
          );

          return user;
        } catch (error) {
          throw "Facebook api to get user details has failed with status:" +
            JSON.stringify(error);
        }
      } else {
        throw "Facebook authentication has failed with status:" +
          loginResponse.status;
      }
    } catch (error) {
      console.log(
        "Facebook authentication has failed." + JSON.stringify(error)
      );
      throw error;
    }
  }

  // Add 1 Call Credit on facebook login
  public fbCredit(request): Observable<BaseResponse> {
    return this.http
      .post(this.config.BaseUrl + "fbLogin", request, this.httpOptions)
      .pipe(map(result => new BaseResponse(<any>result)));
  }

  // Get Remaining Call Credits
}

// *** Post Facebook and get plus one credit ***

// this.fb
// .showDialog({
//   method: 'share',
//   href: 'http://example.com',
//   caption: 'Such caption, very feed.',
//   description: 'Much description',
//   picture: 'http://example.com/image.png',
//   hashtag: '#myHashtag',
//   share_feedWeb: true // iOS only
// })
// .then(e => {
//   console.log(console.log('success post'));
//   // Add 1 call credit on successfull post
//   var Loader = this.loader.create({
//     content: 'Wait..'
//   });
//   Loader.present();
//   var request = {
//     userId: localStorage.getItem('userId')
//   };
//   this.userService.fbCredit(request).subscribe(
//     response => {
//       if (response.success == true) {
//         Loader.dismiss();
//         this.presentToast(response.msg);
//         this.UpdateRemainingCallCredits();
//       } else {
//         this.presentToast(response.msg);
//       }
//     },
//     error => {
//       Loader.dismiss();
//       this.presentToast('Server Not Response!');
//     }
//   );
