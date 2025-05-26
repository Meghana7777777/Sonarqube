import { CartonBasicInfoModel } from "../../../carton-filling";

export class CartonContainerMappingValidationModel {
    cartonBasicInfo: CartonBasicInfoModel[];

    incomingContainerId: number;
    incomingContainerCode: string;

    suggestedContainerId: number;
    suggestedContainerCode: string;

    totalContainerCapacity: number;
    currentConfirmedCartonsInContainer: number;

    batchesInContainer: string[];

    constructor(cartonBasicInfo: CartonBasicInfoModel[], incomingContainerId: number, incomingContainerCode: string, suggestedContainerId: number, suggestedContainerCode: string, totalContainerCapacity: number, currentConfirmedCartonsInContainer: number, batchesInContainer: string[]) {
        this.cartonBasicInfo = cartonBasicInfo;
        this.incomingContainerCode = incomingContainerCode;
        this.incomingContainerId = incomingContainerId;
        this.suggestedContainerCode = suggestedContainerCode;
        this.suggestedContainerId = suggestedContainerId;
        this.totalContainerCapacity = totalContainerCapacity;
        this.currentConfirmedCartonsInContainer = currentConfirmedCartonsInContainer;
        this.batchesInContainer = batchesInContainer;
    }
}

