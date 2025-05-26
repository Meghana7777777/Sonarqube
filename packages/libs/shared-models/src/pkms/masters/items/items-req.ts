import { CommonRequestAttrs } from "../../../common";
import { MaterialTypeEnum } from "../../enum";

export class ItemsTypeModel extends CommonRequestAttrs {
    id: number;
    code: string;
    desc: string;
    category: MaterialTypeEnum;
    materialType: number
    dimensionId: number
    length?: number;
    width?: number;
    height?: number;
    packSerial?: string;
    constructor(
        id: number,
        code: string,
        desc: string,
        category: MaterialTypeEnum,
        materialType: number,
        dimensionId: number,
        username: string,
        unitCode: string,
        companyCode: string,
        userId: number,
        length?: number,
        width?: number,
        height?: number,
        packSerial?: string
    ) {
        super(username, unitCode, companyCode, userId)
        this.id = id
        this.code = code
        this.desc = desc
        this.height = height
        this.length = length
        this.width = width
        this.category = category
        this.materialType = materialType
        this.dimensionId = dimensionId
        this.packSerial = packSerial;
    }
}