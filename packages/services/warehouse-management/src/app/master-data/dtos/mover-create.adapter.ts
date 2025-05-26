import { MoversCreateRequest, PalletsCreateRequest } from "@xpparel/shared-models";
import { MoverEntity } from "../entities/mover.entity";

export class MoversAdapter {

    convertDtoToEntity(dto: MoversCreateRequest): MoverEntity {
        const entity = new MoverEntity();
        entity.name = dto.name;
        entity.code=dto.code;
        entity.unitCode=dto.unitCode;
        entity.capacity=dto.capacity;
        entity.uom=dto.uom;
        entity.companyCode=dto.companyCode;
        
        if (dto.id) {
            entity.id = dto.id;
            entity.updatedUser = dto.username;
        }
        return entity;
    }

}