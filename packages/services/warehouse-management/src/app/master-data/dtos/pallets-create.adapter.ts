import { PalletsCreateRequest } from "@xpparel/shared-models";
import { LPalletEntity } from "../entities/l-pallet.entity";

export class PalletsAadapter {

    convertDtoToEntity(dto: PalletsCreateRequest): LPalletEntity {
        const entity = new LPalletEntity();
        entity.palletName = dto.name;
        entity.palletCode=dto.code;
        entity.unitCode=dto.unitCode;
        entity.fabricCapacity=dto.fabricCapacity;
        entity.fabricUom=dto.fabricUom
        entity.weightCapacity=dto.weightCapacity;
        entity.weightUom=dto.weightUom;
        entity.currentBinId=dto.currentBinId;
        entity.currentPalletState=dto.currentPalletState;
        entity.currentPalletLocation=dto.currentPalletLocation;
        entity.palletBeahvior=dto.palletBeahvior;
        entity.freezeStatus=dto.freezeStatus;
        entity.maxItems=dto.maxItems;
        entity.companyCode=dto.companyCode;
        entity.barcodeId = 'barcode';
        if (dto.id) {
            entity.id = dto.id;
            entity.updatedUser = dto.username;
        }
        return entity;
    }

}