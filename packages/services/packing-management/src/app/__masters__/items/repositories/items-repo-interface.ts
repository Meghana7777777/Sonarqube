import { CommonRequestAttrs, ItemsModelDto, MaterialReqModel } from '@xpparel/shared-models';
import { BaseInterfaceRepository } from '../../../../database/common-repositories';
import { ItemsEntity } from '../entities/items.entity';

export interface ItemsRepoInterface extends BaseInterfaceRepository<ItemsEntity> {
    getALLItems(unitCode: string, companyCode: string, category: string, itemIds: number[]): Promise<ItemsModelDto[]>;
    getUnMappedItemsToSpecByPo(bomItems: number[]): Promise<ItemsModelDto[]>
}
