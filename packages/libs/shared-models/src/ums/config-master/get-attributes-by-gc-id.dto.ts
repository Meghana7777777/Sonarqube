import { AttributesMasterModelDto } from "../attributes-master";

export class GetAttributesByGcId {
    gcId: number; 
    gcmName: string;//global-config-master name
    attributeProperties: AttributesMasterModelDto[]
    constructor(
        gcId: number, 
        gcmName: string,
        attributeProperties: AttributesMasterModelDto[]
    ) {
        this.gcId = gcId; 
        this.attributeProperties = attributeProperties;
        this.gcmName = gcmName;
    }
}