export class UsersDropdownDto {
    name: string; 
    mobileNo:string;
    usersId: number;
    constructor(
        name: string,
        mobileNo:string,
        usersId: number,
    ) {
        this.name = name;
        this.mobileNo= mobileNo;
        this.usersId = usersId;
    }

}