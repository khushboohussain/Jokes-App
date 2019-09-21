import { Injectable } from "@angular/core";
import {
  CountryDialCodesResponse,
  CountryDialCode
} from "./DataModel/CountryDialCodesResponse";
import { Observable } from "../../node_modules/rxjs";
import { Config } from "./Config";
import {
  HttpClient,
  HttpHeaders
} from "../../node_modules/@angular/common/http";
import { map } from "../../node_modules/rxjs/operators";

@Injectable()
export class CountryDialCodeService {
  private httpOptions;
  private countriesDialCodes: Promise<CountryDialCodesResponse> | null;

  constructor(private config: Config, private http: HttpClient) {
    this.httpOptions = {
      headers: new HttpHeaders({
        "Content-Type": "application/json"
      })
    };
    this.countriesDialCodes = null;
  }

  // Get ALL Countries dial codes
  public getAllCountriesDialCodes(): Promise<CountryDialCodesResponse> {
    if (this.countriesDialCodes === null) {
      this.countriesDialCodes = this.http
        .get<CountryDialCodesResponse>(
          this.config.BaseUrl + "dialCodeList",
          this.httpOptions
        )
        .pipe(map(response => new CountryDialCodesResponse(<any>response)))
        .toPromise();
    }

    return this.countriesDialCodes;
  }

  public checkIfNumberLengthIsValid(
    phoneNumberWithoutDialCode: string,
    countryDialCode: CountryDialCode
  ): boolean {
    if (countryDialCode.maxNumberOfDigits < countryDialCode.minNumberOfDigits) {
      throw `The country dial code: '${JSON.stringify(
        countryDialCode
      )}' is broken(max < min). Bug.`;
    }

    if (
      phoneNumberWithoutDialCode.length >= countryDialCode.minNumberOfDigits &&
      phoneNumberWithoutDialCode.length <= countryDialCode.maxNumberOfDigits
    ) {
      return true;
    }
    return false;
  }
}
