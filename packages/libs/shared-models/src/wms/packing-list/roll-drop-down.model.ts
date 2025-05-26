export class RollsDropdownModal {
    rollId: number;
    externalRollNumber: string;
    constructor(rollId: number, externalRollNumber: string) {
        this.rollId = rollId;
        this.externalRollNumber = externalRollNumber;
    }
}