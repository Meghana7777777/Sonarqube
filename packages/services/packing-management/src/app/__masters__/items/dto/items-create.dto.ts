import { MaterialTypeEnum } from "@xpparel/shared-models";
import { CommonDto } from "packages/services/packing-management/src/base-services/dtos/common-dto";

export class ItemsCreateDTO extends CommonDto {
    id: number;
    code: string;
    desc: string;
    length?: number;
    width?: number;
    height?: number;
    category: MaterialTypeEnum;
    materialType: number;
    dimensionId: number;
    packSerial: string;
}
