import { CartonBasicInfoModel } from "../carton-filling";


export class PGCartonInfoModel  {
    pgName: string;
    pgId: number;
    defaultContainerId: number;
    defaultContainerName: string;
    currentContainerId: number;
    currentContainerName: string;
    cartonInfo: CartonBasicInfoModel;
    
    /**
     * 
     * @param pgName 
     * @param pgId 
     * @param defaultContainerId 
     * @param defaultContainerName 
     * @param currentContainerId 
     * @param currentContainerName 
     * @param cartonInfo 
     */
    constructor(pgName: string, pgId: number, defaultContainerId: number, defaultContainerName: string, currentContainerId: number, currentContainerName: string, cartonInfo: CartonBasicInfoModel) {
        this.pgName = pgName;
        this.pgId = pgId;
        this.defaultContainerId = defaultContainerId;
        this.defaultContainerName = defaultContainerName;
        this.currentContainerId = currentContainerId;
        this.currentContainerName = currentContainerName;
        this.cartonInfo = cartonInfo;
    }
}