import { Component } from "@angular/core";
import { TranslateService } from "@ngx-translate/core";
import { NavController, LoadingController } from "ionic-angular";
import { UserService } from "../../provider/UserService";
import { GooglePlus } from '@ionic-native/google-plus';

@Component({
  selector: "authentication-component",
  templateUrl: "authentication.component.html"
})
export class AuthenticationComponent {
  constructor(
    public navCtrl: NavController,
    public userService: UserService,
    public loader: LoadingController,
    public translate: TranslateService,
    private google: GooglePlus
  ) {}

  public IsLoggedIn(): boolean {
    return this.userService.GetLoggedInUserOrNull() !== null;
  }

  public async FacebookLogin() {
    let loader = this.loader.create({
      content: "Authenticating with facebook..."
    });

    loader.present();

    try {
      await this.userService.LoginWithFacebook();

      loader.dismiss();
    } catch (error) {
      loader.dismiss();
      console.log("Failed to login with Facebook." + JSON.stringify(error));
    }

    this.NavigateToLastPage();
  }

  public FacebookLogout() {
    this.userService.Logout();
  }

  private NavigateToLastPage() {
    this.navCtrl.pop();
  }

  googleLogin(){
    this.google.login({})
    .then((res:any) =>{
      console.log(res);
      localStorage.setItem('uid',res.userId);
    }, err =>{
      console.log(err);
    })
  }

  googleLogout(){
    this.google.logout();
  }

  isGoogleLogin(){
    if(localStorage.getItem('uid')){
      return true;
    }
    else {
      return false;
    }
  }

}
