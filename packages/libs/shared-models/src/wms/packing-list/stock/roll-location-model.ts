export class rollLocationInfoModel {
    palletCode: string;
    trayCode: string;
    trolleyCode: string;
    constructor(palletCode: string, trayCode: string, trolleyCode: string) {
        this.palletCode = palletCode,
        this.trayCode = trayCode,
        this.trolleyCode = trolleyCode
    }
}