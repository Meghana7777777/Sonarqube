export class CutTableOpenCloseDocketsCountModel {
    
    inActiveDockets:number;
    inProgressDockets:number;
    completedDockets:number;
    constructor(
        inActiveDockets:number,
        inProgressDockets:number,
        completedDockets:number
    ) {
        this.inActiveDockets=inActiveDockets;
        this.inProgressDockets=inProgressDockets;
        this.completedDockets=completedDockets;
    }
}