import { BaseResponse } from "./BaseResponse";

export class CountryDialCodesResponse extends BaseResponse {
  public countryDialCodes: CountryDialCode[];

  constructor(countryDialCodesResponse: CountryDialCodesResponse) {
    super({
      success: countryDialCodesResponse.success,
      msg: countryDialCodesResponse.msg
    });

    this.countryDialCodes = countryDialCodesResponse.countryDialCodes.map(
      countryDialCode => new CountryDialCode(countryDialCode)
    );
  }
}

export class CountryDialCode {
  public name: string;
  public dialCode: string;
  public code: string;
  public maxNumberOfDigits: number;
  public minNumberOfDigits: number;

  constructor(countryDialCode: CountryDialCode) {
    this.name = countryDialCode.name;
    this.dialCode = countryDialCode.dialCode;
    this.code = countryDialCode.code;
    this.maxNumberOfDigits = countryDialCode.maxNumberOfDigits;
    this.minNumberOfDigits = countryDialCode.minNumberOfDigits;
  }
}
