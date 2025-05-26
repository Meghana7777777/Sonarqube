
import { FgLocationCreateReq } from "@xpparel/shared-models";
import { FgMLocationEntity } from "../entities/fgm-location.entity";





export class FgLocationsCreateAdapter {

    convertDtoToEntity(dto: FgLocationCreateReq): FgMLocationEntity {
        const entity = new FgMLocationEntity();
        entity.name = dto.name;
        entity.code = dto.code;
        entity.unitCode = dto.unitCode;
        entity.supportedPalletsCount = dto.spcount;
        entity.createdUser = dto.username
        entity.level = dto.level;
        entity.rackId = dto.rackId;
        entity.whId = dto.whId;
        entity.column = dto.column;
        entity.preferredStorageMaterial=dto.preferredStorageMaterial;
        entity.companyCode = dto.companyCode;
        entity.barcodeId = 'BN';
        entity.length = dto.length
        entity.latitude = dto.latitude
        entity.height = dto.height
        entity.longitude = dto.longitude
        entity.width = dto.width
        if (dto.id) {
            entity.id = dto.id;
            entity.updatedUser = dto.username;
        }
        return entity;
    }

}