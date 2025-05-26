import { Injectable } from '@nestjs/common';
import { QualityTypeDto } from '@xpparel/shared-models';
import { QualityTypeEntity } from '../entites/quality-type-entity';

@Injectable()
export class QualityTypeAdapter {
    convertDtoToEntity(dto: QualityTypeDto): QualityTypeEntity {
        const entity = new QualityTypeEntity();
        entity.qualityType = dto.qualityType;
        if (dto.id) {
            entity.id = dto.id;
        }
        return entity;
    }
}
