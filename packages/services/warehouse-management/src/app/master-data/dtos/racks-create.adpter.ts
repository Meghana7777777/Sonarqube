import { RacksCreateRequest } from "@xpparel/shared-models";
import { LRackEntity } from "../entities/l-rack.entity";

export class RacksAdapter {

    convertDtoToEntity(dto: RacksCreateRequest): LRackEntity {
        const entity = new LRackEntity();
        entity.name = dto.name;
        entity.code = dto.code;
        entity.unitCode = dto.unitCode;
        entity.levels = dto.levels;
        entity.columns = dto.columns;
        entity.createdUser = dto.username
        entity.code = dto.code;
        entity.wCode = dto.wcode;
        entity.prefferedStorageMaterial = dto.preferredstoraageMateial;
        entity.priority = dto.priority;
        entity.companyCode = dto.companyCode;
        entity.barcodeId = `RCK`
        entity.capacityInMts = dto.capacityInMts;
        if (dto.id) {
            entity.id = dto.id;
            entity.updatedUser = dto.username;
        }
        return entity;
    }

}