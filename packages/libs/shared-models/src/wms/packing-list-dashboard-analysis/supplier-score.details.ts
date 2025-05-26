export class supplierScoreCard {
    inspectedItems: number;
    passedInspectionPercentage: number;
    delayPercentage: number;
    riskyPackagesByThisSupplier: number;

    constructor(
        inspectedItems: number,
        passedInspectionPercentage: number,
        delayPercentage: number,
        riskyPackagesByThisSupplier: number

    ){
        this.inspectedItems= inspectedItems;
        this.passedInspectionPercentage= passedInspectionPercentage;
        this.delayPercentage= delayPercentage;
        this.riskyPackagesByThisSupplier= riskyPackagesByThisSupplier;
    }
}