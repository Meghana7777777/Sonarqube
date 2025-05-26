export class GBSectionsModel {
    id: string;
    secCode: string;
    secName: string;
    secDesc: string;
    depType: string;
    secColor: string;
    secHeadName: string;
    secOrder: string;
    isActive: string;
    processType: string;
    deptCode: string;

    constructor(
        id: string,
        secCode: string,
        secName: string,
        secDesc: string,
        depType: string,
        secColor: string,
        secHeadName: string,
        secOrder: string,
        isActive: string,
        processType: string,
        deptCode: string,
    ) {
       this.id = id;
       this.secCode = secCode;
       this.secName = secName;
       this.secDesc = secDesc;
       this.depType = depType;
       this.secColor = secColor;
       this.secHeadName = secHeadName;
       this.secOrder = secOrder;
       this.isActive = isActive;
       this.processType = processType;
       this.deptCode = deptCode;
    }

}
