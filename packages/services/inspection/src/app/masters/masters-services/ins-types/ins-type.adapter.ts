import { InsConfigEntity } from "../../entity/ins-config.entity";

export class InsTypesAdapter {

    convertDtoToEntity(dto: any): InsConfigEntity {
        const entity = new InsConfigEntity();
        entity.itemCategoryType = dto.itemCategory;
        entity.insTypeI1 = dto.insTypeI1;
        entity.insTypeI2=dto.insTypeI2;
        entity.materialReady = dto.requiredForAlloc;
        entity.selected = dto.requiredForDis;
        entity.defaultPerc = dto.defaultPerc;
        if (dto.id) {
            entity.id = dto.id;
            entity.updatedUser = dto.username;
        }else {
            entity.createdUser = dto.username;
        }
        return entity;
    }
}
