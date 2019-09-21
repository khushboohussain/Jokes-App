import { Component } from '@angular/core';
import {
  NavController,
  NavParams,
  LoadingController,
  ViewController,
  ToastController
} from 'ionic-angular';
import { PrankCallsListPage } from '../prank-calls-list/prank-calls-list';
import { CallScreenPage } from '../call-screen/call-screen';
import { ProfilePage } from '../profile/profile';
import { Platform } from 'ionic-angular';
import { BuyCreditsPage } from '../buy-credits/buy-credits';
import { SocialSharing } from '@ionic-native/social-sharing';
import { CallsService } from '../../provider/CallsService';
import { UserService } from '../../provider/UserService';
import { PrankCallsHistoryPage } from '../prank-calls-history/prank-calls-history';
@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  prenkList: any;
  remainingCallCredits: number;
  currentPage: any;
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public callsService: CallsService,
    public usersService: UserService,
    public loader: LoadingController,
    public platform: Platform,
    public viewCtrl: ViewController,
    private socialSharing: SocialSharing,
    public toastCtrl: ToastController
  ) {
    this.getList();
    // this.RemainingCallCredits();

    localStorage.setItem('currentPage', 'HomePage');
    this.currentPage = localStorage.getItem('currentPage');
  }
  ionViewWillLeave() {
    localStorage.removeItem('currentPage');
  }
  ionViewWillEnter() {
    localStorage.setItem('currentPage', 'HomePage');
    this.currentPage = localStorage.getItem('currentPage');
    this.remainingCallCredits = +localStorage.getItem('credits');
  }

  presentToast(msg) {
    let toast = this.toastCtrl.create({
      message: msg,
      duration: 3000,
      position: 'middle'
    });
    toast.present();
  }

  // Share Audio Count
  shareCount(audioId) {
    this.callsService.shareCount(audioId).subscribe(
      response => {
        this.getList();
      },
      error => {}
    );
  }

  /*
  openShareOptions(audioId) {
    this.socialSharing
      .share('Skandal APP', 'Share', null, 'http://demo.com')
      .then(() => {
        // Success!
        this.shareCount(audioId);
      })
      .catch(() => {
        // Error!
        this.shareCount(audioId);
      });
  }
  */
  openShareOptions(dataObject) {
    const { _id, audioData } = dataObject;
    
    this.socialSharing
      .share(
        'I played a prank call on a friend of ours with skandal App, take a look at how much fun it was\n\n',
        'prank audio url',
        'http://jokingfriend.com/BeehapImageUpload/img/155989704513651.jpg',
        audioData
      )
      .then(status => {
        // Success!
        this.shareCount(_id);
        console.log(status);
      })
      .catch(() => {
        // Error!
        this.shareCount(_id);
      });
    
  }

  ionViewDidLoad() {
    localStorage.setItem('currentPage', 'HomePage');
    this.currentPage = localStorage.getItem('currentPage');

    document.addEventListener(
      'play',
      function(e) {
        var audios = document.getElementsByTagName('audio');
        for (var i = 0, len = audios.length; i < len; i++) {
          if (audios[i] != e.target) {
            audios[i].pause();
          }
        }
      },
      true
    );
  }
  PauseAudio() {
    document.addEventListener(
      'click',
      function(e) {
        var audios = document.getElementsByTagName('audio');
        for (var i = 0, len = audios.length; i < len; i++) {
          if (audios[i] != e.target) {
            audios[i].pause();
          }
        }
      },
      true
    );
  }
  callScreen(pranklist) {
    this.PauseAudio();
    this.navCtrl.push(CallScreenPage, {
      audioData: pranklist.audioData,
      audioId: pranklist._id,
      image: pranklist.image
    });
  }
  pranksList() {
    this.PauseAudio();
    this.navCtrl.push(PrankCallsListPage);
  }
  profilePage() {
    this.PauseAudio();
    this.navCtrl.push(ProfilePage);
  }
  getList() {
    var Loader = this.loader.create({
      content: 'Wait..'
    });
    Loader.present();
    this.callsService.getPrankList().subscribe(
      response => {
        this.prenkList = response.data;
        Loader.dismiss();
      },
      error => {
        Loader.dismiss();
        this.presentToast('Server Not Response!');
      }
    );
  }
}
