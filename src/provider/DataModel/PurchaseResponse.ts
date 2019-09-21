import { BaseResponse } from "./BaseResponse";

export class PurchaseResponse extends BaseResponse{

    public credit:string;

    constructor(purchaseResponse: PurchaseResponse) {
        super({success: purchaseResponse.success, msg: null})
        this.credit = purchaseResponse.credit;
    }

}