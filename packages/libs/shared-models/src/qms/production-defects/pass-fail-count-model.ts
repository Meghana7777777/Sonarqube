export class PassFailCountModel{
    passCount:number;
    pwdCount:number;
    failCount:number;

    constructor(passCount:number,pwdCount:number,failCount:number){
        this.passCount = passCount
        this.pwdCount = pwdCount
        this.failCount = failCount
    }
}