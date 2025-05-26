
import { FgContainerCreateRequest } from "@xpparel/shared-models";
import { FgMContainerEntity } from "../entities/fgm-container.entity";


export class FgContainerAdapter {

    convertDtoToEntity(dto: FgContainerCreateRequest): FgMContainerEntity {
        const entity = new FgMContainerEntity();
        entity.id = dto.id;
        entity.containerName = dto.name;
        entity.containerCode = dto.code;
        entity.unitCode = dto.unitCode;
        entity.weightCapacity = dto.weightCapacity;
        entity.weightUom = dto.weightUom;
        entity.currentLocationId = dto.currentLocationId;
        entity.currentContainerState = dto.currentContainerState;
        entity.currentContainerLocation = dto.currentContainerLocation;
        entity.containerBehavior = dto.containerBehavior;
        entity.freezeStatus = dto.freezeStatus;
        entity.maxItems = dto.maxItems;
        entity.companyCode = dto.companyCode;
        entity.barcodeId = 'barcode';
        entity.lengthUom = dto.lengthUom
        entity.widthUom = dto.widthUom
        entity.heightUom = dto.heightUom
        entity.rackId = dto.rackId
        entity.length = dto.length;
        entity.width = dto.width;
        entity.height = dto.height;
        entity.containerType = dto.type;
        entity.whId = dto?.whId;
        if (dto.id) {
            entity.id = dto.id;
            entity.updatedUser = dto.username;
        }
        return entity;
    }

}