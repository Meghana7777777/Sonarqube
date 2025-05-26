import { DataSource, Repository } from "typeorm";
import { Injectable } from "@nestjs/common";
import { OpSequence } from "../entity/op-seq.entity";

@Injectable()
export class OpSeqRepository extends Repository<OpSequence> {
    constructor(private dataSource: DataSource) {
        super(OpSequence, dataSource.createEntityManager());
    }


     /**
     * Query to get operation sequence details for the product and poserial under unit ad comapny
     * @param unitCode 
     * @param companyCode 
     * @param productName 
     * @param poSerial 
     * @param opVersionId 
     * @returns 
    */
    async getOpsequenceGroupsForProduct(unitCode:string,companyCode:string,productName:string,poSerial:string,opVersionId:number){
        const opSeqData = await this.createQueryBuilder('op_sequence')
        .select('i_op_Code as iOpCode,op_name as opName,op_category as opCategory,op_form as opForm,sequence,op_sequence.group,dep_group as depGroup,smv,components as componentNames,group_concat(i_op_Code) as operations').where(`unit_code = '${unitCode}' and company_code = '${companyCode}' and prod_name = '${productName}' and po_serial = ${poSerial} and op_version_id = ${opVersionId} `)
        .groupBy(`op_sequence.group`)
        .getRawMany();
        return opSeqData 
    }

}

