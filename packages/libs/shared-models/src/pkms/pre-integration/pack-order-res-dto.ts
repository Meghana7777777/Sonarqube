export class PackOrderResponseDto {
    packOrderNumber: string;
    poId: number;
    constructor(
        packOrderNumber: string,
        poId: number,
    ) {
        this.packOrderNumber = packOrderNumber;
        this.poId = poId;
    }
}