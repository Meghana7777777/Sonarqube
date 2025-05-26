export class RefCompDetailModel {
    refComponent: string;
    actComponents: string[];

    constructor( refComponent: string, actComponents: string[],) {
        this.refComponent = refComponent;
        this.actComponents = actComponents;
    }
}