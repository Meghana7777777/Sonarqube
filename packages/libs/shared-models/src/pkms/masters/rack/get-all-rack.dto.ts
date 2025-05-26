export class FgGetAllRackDto {
    name: string;
    id: number;
    code: string;
    barcodeId: string;
    constructor(name: string, id: number, code: string) {
        this.name = name
        this.id = id
        this.code = code
    }
}