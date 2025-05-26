export class LayRollInfoAttrsModel {
    endBits: number;
    damages: number;
    shortage: number;
    remarks: string;
    layStartTime: string;
    layEndTime: string;
    breakTime: string;
    sequence: number;
    jointsOverlapping: number;
    noOfJoints: number;
    remnantsOfOtherLay: number;
    halfPlieOfPreRoll: number;
    fabricDefects: number;
    usableRemains: number;
    unUsableRemains: number;

    constructor(
        endBits: number,    
        damages: number,
        shortage: number,
        remarks: string,
        layStartTime: string,
        layEndTime: string,
        breakTime: string,
        sequence: number ,
        jointsOverlapping: number,
        noOfJoints: number,
        remnantsOfOtherLay: number,
        halfPlieOfPreRoll: number,
        fabricDefects: number,
        usableRemains: number,
        unUsableRemains: number,
    ) {
        this.endBits = endBits;
        this.damages = damages;
        this.shortage = shortage;
        this.remarks = remarks;
        this.layStartTime = layStartTime;
        this.layEndTime = layEndTime;
        this.breakTime = breakTime;
        this.sequence = sequence;
        this.jointsOverlapping = jointsOverlapping;
        this.noOfJoints = noOfJoints;
        this.remnantsOfOtherLay = remnantsOfOtherLay;
        this.halfPlieOfPreRoll = halfPlieOfPreRoll;
        this.fabricDefects = fabricDefects;
        this. usableRemains = usableRemains;
        this.unUsableRemains = unUsableRemains;
    }
}