import { BinsCreateRequest, RacksCreateRequest } from "@xpparel/shared-models";
import { LRackEntity } from "../entities/l-rack.entity";
import { LBinEntity } from "../entities/l-bin.entity";

export class BinsAdapter {

    convertDtoToEntity(dto: BinsCreateRequest): LBinEntity {
        const entity = new LBinEntity();
        entity.name = dto.name;
        entity.code=dto.code;
        entity.unitCode=dto.unitCode;
        entity.supportedPalletsCount=dto.spcount;
        entity.createdUser=dto.username
        entity.level=dto.level;
        entity.lRackId=dto.rackId;
        entity.column=dto.column;
        // entity.prefferedStorageMaterial=dto.preferredstoraageMateial;
        entity.companyCode=dto.companyCode;
        entity.barcodeId = 'BN';
        if (dto.id) {
            entity.id = dto.id;
            entity.updatedUser = dto.username;
        }
        return entity;
    }

}