export class OpVersionAbstractModel {
    versionId: number;
    versionDescription: string;
    versionName: string;

    /**
     * Constructor for OpVersionAbstractModel
     * @param versionId - Unique ID of the version
     * @param versionDescription - Description of the version
     * @param versionName - Name of the version
     */
    constructor(versionId: number, versionDescription: string, versionName: string) {
        this.versionId = versionId;
        this.versionDescription = versionDescription;
        this.versionName = versionName;
    }
}
