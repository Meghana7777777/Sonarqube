
export class MarkerTypeModel {
    id: number; // not required during create
    markerType: string;
    markerDesc: string;
    isActive?:boolean;
    constructor(id: number,markerType: string,markerDesc: string,isActive?:boolean) {
        this.id=id;
        this.markerType=markerType;
        this.markerDesc=markerDesc;
        this.isActive=isActive;
    }
}