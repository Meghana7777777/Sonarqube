export class Stages {
    phId:string;
    unitCode:string;
    vehicleStatus:string;
    inspectionStatus:string;
    grnStatus:string;

    constructor(
        phId:string,
        unitCode:string,
        vehicleStatus:string,
        inspectionStatus:string,
        grnStatus:string
    ){
        this.phId = phId;
        this.unitCode = unitCode;
        this.vehicleStatus = vehicleStatus;
        this.inspectionStatus = inspectionStatus;
        this.grnStatus = grnStatus;
    }
}