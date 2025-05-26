import {InsMasterReasonsCreateRequest, InsReasonsCreateRequest} from "@xpparel/shared-models";
import { IReasonEntity } from "../entity/i-reason.entity";

export class ReasonsAdapter {

    convertDtoToEntity(dto: InsReasonsCreateRequest): IReasonEntity {
        const entity = new IReasonEntity();
        entity.name = dto.name;
        entity.code=dto.code;
        entity.unitCode=dto.unitCode;
        entity.extCode=dto.extCode;
        entity.pointValue=dto.pointValue;
        entity.category=dto.category;
        entity.companyCode=dto.companyCode;
        
        if (dto.id) {
            entity.id = dto.id;
            entity.updatedUser = dto.username;
        }
        return entity;
    }

    convertMasterDtoToEntity(dto: InsMasterReasonsCreateRequest): IReasonEntity {
        const entity = new IReasonEntity();
        entity.name = dto.name;
        entity.code=dto.code;
        entity.unitCode=dto.unitCode;
        entity.extCode=dto.extCode;
        entity.pointValue=dto.pointValue;
        entity.category=dto.category;
        entity.reasonName=dto.reasonName;
        entity.reasonDesc=dto.reasonDesc;
        entity.insType=dto.insType;
        entity.companyCode=dto.companyCode;
        
        if (dto.id) {
            entity.id = dto.id;
            entity.updatedUser = dto.username;
        }
        return entity;
    }

}