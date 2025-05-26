import { FgRackCreateReq } from "packages/libs/shared-models/src/pkms";
import { FgMRackEntity } from "../entity/fg-m-rack.entity";


export class FgRacksAdapter {

    convertDtoToEntity(dto: FgRackCreateReq): FgMRackEntity {
        const entity = new FgMRackEntity();
        entity.name = dto.name;
        entity.code = dto.code;
        entity.unitCode = dto.unitCode;
        entity.levels = dto.levels;
        entity.weightCapacity = dto.weightCapacity;
        entity.weightUom = dto.weightUom;
        entity.columns = dto.columns;
        entity.createdUser = dto.username
        entity.code = dto.code;
        // entity.wCode = dto.wcode;
        entity.whId = dto.whId
        entity.preferredStorageMaterial = dto.preferredStorageMaterial;
        entity.priority = dto.priority;
        entity.companyCode = dto.companyCode;
        entity.barcodeId = `RCK`
        entity.length = dto.length;
        entity.width = dto.width;
        entity.height = dto.height;
        entity.lengthUom = dto.lengthUom;
        entity.weightUom = dto.weightUom
        entity.heightUom = dto.heightUom
        entity.floor = dto.floor;
        entity.latitude = dto.latitude;
        entity.longitude = dto.longitude;

        entity.createLocations = dto.createLocations;
        if (dto.id) {
            entity.id = dto.id;
            entity.updatedUser = dto.username;
        }
        return entity;

    }

}