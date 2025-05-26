import { Injectable } from "@nestjs/common";
import { ManufacturingOrderNumberRequest } from "@xpparel/shared-models";
import { DataSource, Repository } from "typeorm";
import { MoToPoMapEntity } from "../entities/mo-to-po-mapping.entity";



@Injectable()
export class MOToMapRepo extends Repository<MoToPoMapEntity>{
    constructor(private dataSource: DataSource) {
        super(MoToPoMapEntity, dataSource.createEntityManager());
    }

    async getPONumbersMappedToGivenMo(reqObj: ManufacturingOrderNumberRequest): Promise<string[]> {
        const queryBuilder: { poNumber: string }[] = await this.createQueryBuilder('moToPoMap')
            .select(`distinct po_number as poNumber`)
            .where(`mo_no IN (:...moNos)`, { moNos:reqObj.manufacturingOrderNos })
            .getRawMany();
        return queryBuilder.map(res => res.poNumber);
    }
}