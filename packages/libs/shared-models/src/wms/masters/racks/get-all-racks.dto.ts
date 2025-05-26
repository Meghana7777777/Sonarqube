export class getAllRacksDto {
    name: string;
    id: number;
    code: string;
    constructor(name: string, id: number, code: string) {
        this.name = name
        this.id = id
        this.code = code
    }
}