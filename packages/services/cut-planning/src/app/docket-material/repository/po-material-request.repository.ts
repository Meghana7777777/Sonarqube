import { Column, CreateDateColumn, DataSource, Entity, ManyToMany, ManyToOne, OneToMany, Repository } from "typeorm";
import { AbstractEntity } from "../../../database/common-entities";
import { RollSelectionTypeEnum } from '@xpparel/shared-models';
import { Injectable } from "@nestjs/common";
import { PoMaterialRequestEntity } from "../entity/po-material-request.entity";

@Injectable()
export class PoMaterialRequestRepository extends Repository<PoMaterialRequestEntity> {
    constructor(private dataSource: DataSource) {
        super(PoMaterialRequestEntity, dataSource.createEntityManager());
    }

    /**
     * 
     * @param poSerial 
     * @param unitCode 
     * @param companyCode 
     * @returns 
    */
    async getMaxRequestNumberByPoSerial(poSerial: number, unitCode: string, companyCode: string): Promise<number> {
        const qryResp: {request_number: string}  = await this.createQueryBuilder('po_mat_req')
        .select('request_number')
        .where(`po_serial = ${poSerial} and unit_code = '${unitCode}' and company_code = '${companyCode}'`)
        .orderBy('id', 'DESC')
        .limit(1)
        .getRawOne();
        if (qryResp?.request_number) {
            return Number(qryResp.request_number.split('-')[1]);
        } else {
            return 0;
        }
    }   
}

