import { BaseResponse } from "./BaseResponse";

export class RemainingCreditsResponse extends BaseResponse {

    public numberOfCalls: number;

    constructor(remainingCredits: RemainingCreditsResponse) {
        super({success: remainingCredits.success,msg: remainingCredits.msg})
        this.numberOfCalls = remainingCredits.numberOfCalls;        
    }
}