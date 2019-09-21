import { Component, OnInit } from "@angular/core";
import {
  NavController,
  NavParams,
  LoadingController,
  ToastController
} from "ionic-angular";
import { SocialSharing } from "@ionic-native/social-sharing";
import { File } from "@ionic-native/file";
import { FileTransfer } from "@ionic-native/file-transfer";
import { AndroidPermissions } from "@ionic-native/android-permissions";
import { ScheduledCall } from "../../provider/DataModel/ScheduledCalls";
import { CallsService } from "../../provider/CallsService";
import { User } from "../../provider/DataModel/User";
import { UserService } from "../../provider/UserService";

@Component({
  selector: "page-prank-calls-history",
  templateUrl: "prank-calls-history.html"
})
export class PrankCallsHistoryPage implements OnInit {
  prankCallhistoryData: ScheduledCall[];
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public callsService: CallsService,
    public userService: UserService,
    public loader: LoadingController,
    private socialSharing: SocialSharing,
    public toastCtrl: ToastController,
    private file: File,
    private transfer: FileTransfer,
    private androidPermissions: AndroidPermissions
  ) {
    this.getPrankCallHistoryList();
  }

  ngOnInit() {
    if (this.userService.GetLoggedInUserOrNull() === null) {
      this.presentToast("User must be logged in for this page");
      this.navCtrl.pop();
    }
  }
  // File Download Native
  // public download(fileName, filePath) {
  //   let url = encodeURI(filePath);
  //   console.log(url);
  //   this.fileTransfer = this.transfer.create();
  //   this.fileTransfer
  //     .download(url, this.file.externalRootDirectory + fileName, true)
  //     .then(
  //       entry => {
  //         console.log('download completed: ' + entry.toURL());
  //       },
  //       error => {
  //         console.log('download failed: ' + error);
  //       }
  //     );
  // }

  /*
  download(fileName, filePath) {
    const fileTransfer: FileTransferObject = this.transfer.create();
    const url = filePath;
    console.log(url);
    console.log(fileTransfer);
    fileTransfer.download(url, this.file.dataDirectory + fileName).then(
      entry => {
        console.log('download complete: ' + entry.toURL());
      },
      error => {
        // handle error
        console.log(error, 'download failed');
      }
    );
  }
  */

  // File Download
  fileDownload(filePath) {
    console.log(filePath);
    // this.download(fileName, filePath);
    // let path = this.file.dataDirectory;
    var currentDate = new Date().toString();
    var msec = Date.parse(currentDate);
    let url = encodeURI(filePath);
    let path = this.file.externalRootDirectory + "/Skandal/";
    const transfer = this.transfer.create();
    transfer.download(url, path + msec + ".mp3").then(
      entry => {
        this.presentToast("Audio has been downloaded in skandal folder");
        console.log("download complete: " + entry.toURL());
      },
      error => {
        console.log(error, "download failed");
        this.androidPermissions
          .checkPermission(
            this.androidPermissions.PERMISSION.READ_EXTERNAL_STORAGE
          )
          .then(
            result => console.log("Has permission?", result.hasPermission),
            err =>
              this.androidPermissions.requestPermission(
                this.androidPermissions.PERMISSION.READ_EXTERNAL_STORAGE
              )
          );
        this.presentToast("Getting error when downloading file");
      }
    );
  }

  /*
  // Share Audio Count
  shareCount(audioId) {
    this.userService.shareCount(audioId).subscribe(response => {}, error => {});
  }

  openShareOptions(audioId) {
    this.socialSharing
      .share(
        'Skandal APP',
        'Hi i am sharing this prank audio from skandal app',
        'assets/imgs/logo.png'
      )
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

  ionViewDidLoad() {
    document.addEventListener(
      "play",
      function(e) {
        var audios = document.getElementsByTagName("audio");
        for (var i = 0, len = audios.length; i < len; i++) {
          if (audios[i] != e.target) {
            audios[i].pause();
          }
        }
      },
      true
    );
  }

  getPrankCallHistoryList() {
    let user: User | null = this.userService.GetLoggedInUserOrNull();
    if (user === null) {
      this.presentToast("User is not Logged-in");
      return;
    }

    var Loader = this.loader.create({
      content: "Wait.."
    });

    Loader.present();
    this.callsService.getPrankCallHistoryList(user.ID).subscribe(
      response => {
        this.prankCallhistoryData = response.data;
        // this.prankCallhistoryData.createdAt = moment().format(
        //   'D MMMM YYYY HH:mm:ss'
        // )
        Loader.dismiss();
      },
      error => {
        Loader.dismiss();
        // this.presentToast('Server Not Response!')
      }
    );
  }

  private presentToast(msg) {
    let toast = this.toastCtrl.create({
      message: msg,
      duration: 3000,
      position: "middle"
    });
    toast.present();
  }
}
