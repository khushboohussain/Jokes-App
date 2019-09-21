import { Component, OnInit, OnDestroy } from '@angular/core';
import { NavController } from 'ionic-angular';
import { BuyCreditsPage } from '../../pages/buy-credits/buy-credits';
import { UserService } from '../../provider/UserService';
import { RemainingCallsCreditsService } from './RemainingCallsCreditsService.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'remaining-calls-credits-component',
  templateUrl: 'remaining-calls-credits.component.html'
})
export class RemandingCallsCreditComponent implements OnInit,OnDestroy {
  public remainingCallCredits: number;
  private subscription: Subscription;
  constructor(
    public navCtrl: NavController,
    public userService: UserService,
    public remainingCallsCreditsService: RemainingCallsCreditsService) {
  }

  ngOnInit(){
   this.subscription = this.remainingCallsCreditsService.RemainingCallsCreditSubject
    .subscribe(remainingCallCredits=>{
      this.remainingCallCredits = remainingCallCredits;
    })
  }

  ngOnDestroy(){
    this.subscription.unsubscribe();
  }

  public navigateToCreditsPage(): void{
    this.navCtrl.push(BuyCreditsPage);
  }
}
