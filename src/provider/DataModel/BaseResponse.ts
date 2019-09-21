export class BaseResponse {

    constructor(baseResponse: BaseResponse) {
        this.success = baseResponse.success;
        this.msg = baseResponse.msg;
    }

    public success: boolean; 
    public msg: string; 
}