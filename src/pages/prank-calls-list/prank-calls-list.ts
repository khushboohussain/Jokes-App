import { Component } from '@angular/core'
import { NavController, NavParams, LoadingController } from 'ionic-angular'
import { CallScreenPage } from '../call-screen/call-screen'
import { CallsService } from '../../provider/CallsService';

@Component({
  selector: 'page-prank-calls-list',
  templateUrl: 'prank-calls-list.html'
})
export class PrankCallsListPage {
  prenkList: any
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public callsService: CallsService,
    public loader: LoadingController
  ) {
    this.getList()
  }

  ionViewDidLoad() {
    document.addEventListener(
      'play',
      function(e) {
        var audios = document.getElementsByTagName('audio')
        for (var i = 0, len = audios.length; i < len; i++) {
          if (audios[i] != e.target) {
            audios[i].pause()
          }
        }
      },
      true
    )
  }
  // callScreen() {
  //   this.navCtrl.push(CallScreenPage)
  // }
  PauseAudio() {
    document.addEventListener(
      'click',
      function(e) {
        var audios = document.getElementsByTagName('audio')
        for (var i = 0, len = audios.length; i < len; i++) {
          if (audios[i] != e.target) {
            audios[i].pause()
          }
        }
      },
      true
    )
  }
  callScreen(pranklist) {
    this.PauseAudio()
    this.navCtrl.push(CallScreenPage, {
      audioData: pranklist.audioData,
      audioId: pranklist._id,
      image: pranklist.image
    })
  }

  getList() {
    var Loader = this.loader.create({
      content: 'Wait..'
    })
    Loader.present()
    this.callsService.getPrankList().subscribe(
      response => {
        this.prenkList = response.data
        Loader.dismiss()
      },
      error => {
        Loader.dismiss()
        // this.presentToast('Server Not Response!')
      }
    )
  }
}
