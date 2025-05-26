import { MaterialTypeEnum } from "../../enum";

export class ItemsModelDto {
    id: number
    code: string;
    desc: string;
    length: number;
    width: number;
    height: number;
    category: MaterialTypeEnum;
    materialType: number;
    materialTypeDesc: string;
    dimensionId: number;
    isActive: boolean;
    constructor(
        id: number,
        code: string,
        desc: string,
        length: number,
        width: number,
        height: number,
        category: MaterialTypeEnum,
        materialType: number,
        materialTypeDesc: string,
        dimensionId: number,
        isActive?: boolean
    ) {
        this.id = id
        this.code = code
        this.desc = desc
        this.height = height
        this.length = length
        this.width = width
        this.category = category
        this.materialType = materialType
        this.materialTypeDesc = materialTypeDesc
        this.dimensionId = dimensionId
        this.isActive = isActive
    }
}

