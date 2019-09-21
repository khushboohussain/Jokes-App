export class User{
    constructor(id: string, authenticationService: AuthenticationService, displayName: string) {
        this.ID = id;
        this.AuthenticationService = authenticationService;
        this.DisplayName = displayName;
    }
    
    public ID: string;
    public AuthenticationService : AuthenticationService;
    public DisplayName : string;
} 

export enum AuthenticationService{
    Facebook = 1,
    Google = 2
}