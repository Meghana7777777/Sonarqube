import { SupplierCreateRequest} from "@xpparel/shared-models";
import { SupplierEntity } from "../entities/supplier.entity";

export class supplierAdapter {

    convertDtoToEntity(dto: SupplierCreateRequest): SupplierEntity {
        const entity = new SupplierEntity();
        entity.supplierName = dto.supplierName;
        entity.supplierCode=dto.supplierCode;
        entity.unitCode=dto.unitCode;
        entity.companyCode = dto.companyCode;  
        entity.phoneNumber=dto.phoneNumber;
        entity.supplierAddress=dto.supplierAddress;
    
        if (dto.id) {
            entity.id = dto.id;
           
        }
        return entity;
    }

}