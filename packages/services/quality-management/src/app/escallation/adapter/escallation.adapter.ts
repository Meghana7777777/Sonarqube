import { Injectable } from '@nestjs/common';
import { EscallationDto } from '@xpparel/shared-models';
import { EscallationEntity } from '../entites/escallation.entity';

@Injectable()
export class EscallationAdapter {
    convertDtoToEntity(dto: EscallationDto): EscallationEntity {
        const entity = new EscallationEntity();
        entity.escalationType = dto.escalationType;
        entity.style = dto.style;
        entity.buyer = dto.buyer;
        entity.workOrder = dto.workOrder;
        entity.qualityType = dto.qualityType;
        entity.escalationPercentage = dto.escalationPercentage;
        entity.escalationPerson = dto.escalationPerson;
        if (dto.id) {
            entity.id = dto.id;
        }
        return entity;
    }
}
