export class MaterialTypeResponseDto {
    id: number;
    materialTypeCode: string;
    materialTypeDesc: string;
    isExist?: boolean;
    constructor(
        id: number,
        materialTypeCode: string,
        materialTypeDesc: string,
        isExist?: boolean
    ) {
        this.id = id;
        this.materialTypeCode = materialTypeCode;
        this.materialTypeDesc = materialTypeDesc;
        this.isExist = isExist;
    }

}