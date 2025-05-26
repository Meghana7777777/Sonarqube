import { CommonRequestAttrs } from '@xpparel/shared-models';
import { BaseInterfaceRepository } from '../../../../database/common-repositories';
import { PackTypeEntity } from '../entities/pack-type.entity';

export interface PackTypeRepoInterface extends BaseInterfaceRepository<PackTypeEntity> {
    getPackTypeDropDown(dto: CommonRequestAttrs)
}
