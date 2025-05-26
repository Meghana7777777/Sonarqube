import { MenusData } from "./menusData.dto";

export class UserPermissionsDto {
    userId: string;
    userName: string;
    roleId: string[];
    roleName: string[];
    menusData: MenusData[];
    companyCode: string;
    unitCode: string;
    constructor(userId: string, userName: string, roleId: string[], roleName: string[], menusData: MenusData[], companyCode?: string,
        unitCode?: string) {
        this.userId = userId;
        this.userName = userName
        this.roleId = roleId
        this.roleName = roleName
        this.menusData = menusData;
        this.unitCode = unitCode;
        this.companyCode = companyCode;
    }
}