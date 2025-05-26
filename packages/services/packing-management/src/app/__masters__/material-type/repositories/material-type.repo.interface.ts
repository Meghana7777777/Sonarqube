import { CommonRequestAttrs } from '@xpparel/shared-models';
import { BaseInterfaceRepository } from '../../../../database/common-repositories';
import { MaterialTypeEntity } from '../entities/material-type.entity';

export interface MaterialTypeRepoInterface extends BaseInterfaceRepository<MaterialTypeEntity> {
    getMaterialToItems()
    materialIdExist(req: CommonRequestAttrs, materialId: number);
}
