import { BinsCreateRequest, RacksCreateRequest, RollAttributesCreateRequest } from "@xpparel/shared-models";
import { RollAttributesEntity } from "../entities/roll-attributes.entity";

export class RollAttributesAdapter {

    convertDtoToEntity(dto: RollAttributesCreateRequest): RollAttributesEntity {
        const entity = new RollAttributesEntity();
        entity.name = dto.name;
        entity.code=dto.code;
        entity.unitCode=dto.unitCode;
        entity.companyCode=dto.companyCode;
       
        if (dto.id) {
            entity.id = dto.id;
            entity.updatedUser = dto.username;
        }
        return entity;
    }

}