import { UsersCreateRequest } from "@xpparel/shared-models";
import { UserGroupEntity } from "../entities/user-group.entity";

export class UsersGroupAdapter {

    convertDtoToEntity(dto:UsersCreateRequest ): UserGroupEntity {
        const entity = new UserGroupEntity();
        entity.groupName = dto.groupName;
        entity.userId=dto.UsersId;
        entity.unitCode=dto.unitCode;
        entity.companyCode=dto.companyCode;
        
        if (dto.id) {
            entity.id = dto.id;
            entity.updatedUser = dto.username;
        }
        return entity;
    }

}