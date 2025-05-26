import { InsInspectionHeaderAttributes } from "../enum";

export class InsAttributeNameValueModel {
    attributeName: InsInspectionHeaderAttributes;
    attributeValue: string;
    constructor(attributeName: InsInspectionHeaderAttributes,
        attributeValue: string) {
            this.attributeName = attributeName;
            this.attributeValue = attributeValue;
    }
}