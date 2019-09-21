import { BaseResponse } from "./BaseResponse";

export class ScheduledCallsResponse extends BaseResponse{

    public data : ScheduledCall[];
    constructor(scheduledCallsResponse: ScheduledCallsResponse) {
        super({success: scheduledCallsResponse.success,msg: scheduledCallsResponse.msg})
        this.data = 
            scheduledCallsResponse.data.map(scheduledCall=> new ScheduledCall(scheduledCall));
    }
}

export class ScheduledCall {

    constructor(scheduledCall: ScheduledCall) {
        this.userNumber = scheduledCall.userNumber;
        this.userId = scheduledCall.userId;        
        this.audioData = scheduledCall.audioData; 
        this.audioId = scheduledCall.audioId;        
        this.image = scheduledCall.image;        
        this.scheduleDate = scheduledCall.scheduleDate;        
        this.time = scheduledCall.time;        
        this.date = scheduledCall.date;  
        this.status = scheduledCall.status;                     
    }

    public userNumber: string;
    public userId: string;
	public audioData: string;
	public audioId:string;
	public image: string;
	public scheduleDate: Date;
	public time: string;
    public date: string;
    public status: boolean;
}