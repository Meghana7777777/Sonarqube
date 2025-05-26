import { CartonInfoModel } from "../../carton-filling/carton-info.model";


export class PackListContainerCfNcfPendingCartonsModel {
   phId: number;
   phCode: string;
   pendingCartonsForContainerConfirmation: CartonInfoModel[];
   confirmedCartonsForContainer: CartonInfoModel[];

   constructor( phId: number, phCode: string, pendingCartonsForContainerConfirmation: CartonInfoModel[], confirmedCartonsForContainer: CartonInfoModel[]) {
    this.phId = phId;
    this.phCode = phCode;
    this.pendingCartonsForContainerConfirmation = pendingCartonsForContainerConfirmation;
    this.confirmedCartonsForContainer = confirmedCartonsForContainer;
   }
}
