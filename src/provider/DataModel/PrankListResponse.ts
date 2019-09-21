import { BaseResponse } from "./BaseResponse";

export class PrankListResponse extends BaseResponse{
    public data: Prank[];

    constructor(prankListResponse: PrankListResponse) {
        super({success: prankListResponse.success, msg: prankListResponse.msg})
        
        this.data = prankListResponse.data.map(prank=> new Prank(prank));
    }
}

export class Prank {

    constructor(prank:Prank) {
      this.title = prank.title;
      this.discription = prank.discription;
      this.image = prank.image;
      this.audioData = prank.audioData;
      this.mp3Url = prank.mp3Url;
      this.shareCount = prank.shareCount;
      this.status = prank.status;  
    }

    public title: string;
    public discription: string;
    public image: string;
    public audioData: string;
    public mp3Url: string;
    public shareCount: number;
    public status: string;
}