

export class PackSerialDropDownModel {
    id: number;
    packSerial: number;
    packOrderDescription: string;
    poSeq?: string;
    customerName?: string;
    constructor(id: number, packSerial: number, packOrderDescription: string, poSeq?: string, customerName?: string) {
        this.id = id;
        this.packSerial = packSerial;
        this.packOrderDescription = packOrderDescription;
        this.poSeq = poSeq;
        this.customerName = customerName;
    }
}