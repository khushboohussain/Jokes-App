import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";

import { Observable } from "rxjs/Rx";
import { map } from "../../node_modules/rxjs/operators";
import { BaseResponse } from "./DataModel/BaseResponse";
import { CreditPurchaseResponse } from "./DataModel/CreditPurchaseResponse";
import { PrankListResponse } from "./DataModel/PrankListResponse";
import { ScheduledCallsResponse } from "./DataModel/ScheduledCalls";
import { PurchaseResponse } from "./DataModel/PurchaseResponse";
import { XmlCreatingResponse } from "./DataModel/XmlCreatingResponse";
import { CallRequest } from "./DataModel/CallRequest";
import { RemainingCallsCreditsService } from "../components/RemainingCallsCreditComponent/RemainingCallsCreditsService.service";
import { Config } from "./Config";

@Injectable()
export class CallsService {
  private httpOptions;

  constructor(
    private config: Config,
    private http: HttpClient,
    private remainingCallsCreditsService: RemainingCallsCreditsService
  ) {
    this.httpOptions = {
      headers: new HttpHeaders({
        "Content-Type": "application/json"
      })
    };
  }

  public ClientCall(
    request: CallRequest,
    userId: string
  ): Observable<BaseResponse> {
    return this.http
      .post(
        this.config.BaseUrl + "clientCall/" + userId,
        request,
        this.httpOptions
      )
      .pipe(map(response => new BaseResponse(<any>response)))
      .do(this.remainingCallsCreditsService.UpdateRemainingCallCredits);
  }

  public ScheduleCall(request, userId): Observable<BaseResponse> {
    return this.http
      .post(
        this.config.BaseUrl + "callScheduler/" + userId,
        request,
        this.httpOptions
      )
      .pipe(map(response => new BaseResponse(<any>response)))
      .do(this.remainingCallsCreditsService.UpdateRemainingCallCredits);
  }

  public PurchaseCredit(
    userId: string,
    planId: string
  ): Observable<PurchaseResponse> {
    const request = {
      userId: userId,
      planId: planId
    };

    return this.http
      .post(this.config.BaseUrl + "perchaseCall/", request, this.httpOptions)
      .pipe(map(response => new PurchaseResponse(<any>response)))
      .do(this.remainingCallsCreditsService.UpdateRemainingCallCredits);
  }

  public getPrankList(): Observable<PrankListResponse> {
    return this.http
      .get(this.config.BaseUrl + "prankList", this.httpOptions)
      .pipe(map(response => new PrankListResponse(<any>response)));
  }

  public getPrankCallHistoryList(
    userId: string
  ): Observable<ScheduledCallsResponse> {
    return this.http
      .get(
        this.config.BaseUrl + "viewAllPrankUserList/" + userId,
        this.httpOptions
      )
      .pipe(map(response => new ScheduledCallsResponse(<any>response)));
  }

  public getBuyCreditList(): Observable<CreditPurchaseResponse> {
    return this.http
      .get(this.config.BaseUrl + "viewAllCreditList", this.httpOptions)
      .pipe(map(response => new CreditPurchaseResponse(<any>response)));
  }

  // Creating XML
  public CreatingXML(audioUrl): Observable<XmlCreatingResponse> {
    const extendedHttpOptions = {
      headers: new HttpHeaders({
        "Content-Type": "application/x-www-form-urlencoded"
      })
    };

    // .post('http://jokingfriend.com/jokes/createXML.php', data, {
    return this.http
      .get(
        `http://jokingfriend.com/jokes/createXML.php?method=createXML&path=${audioUrl}`,
        extendedHttpOptions
      )
      .pipe(map(result => new XmlCreatingResponse(<any>result)));
  }

  // Share Audio Count
  public shareCount(audioID: string): Observable<any> {
    return this.http.post(
      this.config.BaseUrl + "prankShareCount/" + audioID,
      this.httpOptions
    );
  }
}
