import { BaseResponse } from "./BaseResponse";

export class CreditPurchaseResponse extends BaseResponse{
   public creditPurchases: CreditPurchase[];

   constructor(creditPurchaseResponse: CreditPurchaseResponse) {
    super({success: creditPurchaseResponse.success,msg: creditPurchaseResponse.msg})

    this.creditPurchases =
         creditPurchaseResponse.creditPurchases.map(creditPurchase=> new CreditPurchase(creditPurchase));        
   }
}

export class CreditPurchase {

    constructor(creditPurchase: CreditPurchase) {
        this._id = creditPurchase._id;
        this.credit = creditPurchase.credit;
        this.creditAmount = creditPurchase.creditAmount;
        this.amountPerCredit = creditPurchase.amountPerCredit;
        this.role = creditPurchase.role;
    }
    public _id: string;
    public credit: number;
    public creditAmount: string;
    public amountPerCredit: string;
    public role: string;
}