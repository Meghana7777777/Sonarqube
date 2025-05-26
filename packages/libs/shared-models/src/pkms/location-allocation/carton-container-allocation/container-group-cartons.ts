import { CartonInfoModel } from "../../carton-filling/carton-info.model";
import { FGContainerGroupTypeEnum } from "../../enum";



export class PgCartonsModel {
    pgId: number;
    pgName: string;
    pgType: FGContainerGroupTypeEnum;
    cartonsInfo: CartonInfoModel[];
    packListId: number;
    packListCode: string;
    packListDesc: string

    constructor(pgName: string, pgId: number, pgType: FGContainerGroupTypeEnum, packListId: number, cartonsInfo: CartonInfoModel[], packListCode: string, packListDesc: string) {
        this.pgName = pgName;
        this.pgId = pgId;
        this.pgType = pgType;
        this.packListId = packListId;
        this.cartonsInfo = cartonsInfo;
        this.packListCode = packListCode;
        this.packListDesc = packListDesc;
    }
}
