import { Injectable } from '@nestjs/common';
import { ApproverDto } from '@xpparel/shared-models';
import { ApproverEntity } from '../entites/approver.entity';

@Injectable()
export class ApproverAdapter {
    convertDtoToEntity(dto: ApproverDto): ApproverEntity {
        const entity = new ApproverEntity();
        entity.approverName = dto.approverName;
        entity.emailId = dto.emailId;
        if (dto.id) {
            entity.id = dto.id;
        }
        return entity;
    }
}
