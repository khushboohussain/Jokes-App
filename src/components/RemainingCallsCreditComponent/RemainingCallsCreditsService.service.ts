import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { User } from "../../provider/DataModel/User";
import { RemainingCreditsResponse } from "../../provider/DataModel/RemainingCreditsResponse";
import { map } from "rxjs/operators";
import { Observable, BehaviorSubject } from "rxjs";
import { UserService } from "../../provider/UserService";
import { Config } from "../../provider/Config";

@Injectable()
export class RemainingCallsCreditsService {
  constructor(
    private config: Config,
    private http: HttpClient,
    private userService: UserService
  ) {
    this.RemainingCallsCreditSubject = new BehaviorSubject<number>(0);
  }

  public RemainingCallsCreditSubject: BehaviorSubject<number>;

  public async UpdateRemainingCallCredits(): Promise<void> {
    if (this.RemainingCallsCreditSubject.observers.length == 0) {
      return;
    }
    let remainingCallCreditsResult: number = await this.GetRemainingCallCreditsIfLogged();

    this.RemainingCallsCreditSubject.next(remainingCallCreditsResult);
  }

  private async GetRemainingCallCreditsIfLogged(): Promise<number> {
    let user: null | User = this.userService.GetLoggedInUserOrNull();
    if (user == null) {
      return 0;
    }

    try {
      let remainingCreditsResponse = await this.FetchRemainingCallCreditsFromServer(
        user
      ).toPromise();
      return remainingCreditsResponse.numberOfCalls;
    } catch (error) {
      console.log("Error while fetching remaining credits from server");
      return 0;
    }
  }

  private FetchRemainingCallCreditsFromServer(
    user: User
  ): Observable<RemainingCreditsResponse> {
    let httpOptions = {
      headers: new HttpHeaders({
        "Content-Type": "application/json"
      })
    };

    return this.http
      .get<RemainingCreditsResponse>(
        this.config.BaseUrl + "remainingCredits/" + user.ID,
        httpOptions
      )
      .pipe(map(result => new RemainingCreditsResponse(<any>result)));
  }
}
