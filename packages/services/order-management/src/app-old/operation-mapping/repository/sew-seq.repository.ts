import { Injectable } from "@nestjs/common";
import { DataSource, Repository } from "typeorm";
import { SewSequence } from "../entity/sew-seq.entity";

@Injectable()
export class SewSeqRepository extends Repository<SewSequence> {
    constructor(private dataSource: DataSource) {
        super(SewSequence, dataSource.createEntityManager());
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
    async getOpsequenceGroupsForProduct(unitCode: string, companyCode: string, productName: string, poSerial: string, opVersionId: number) {
        const opSeqData = await this.createQueryBuilder('sew_sequence')
            .select('i_op_Code as iOpCode,op_name as opName,op_category as opCategory,op_form as opForm,sequence,sew_sequence.group,dep_group as depGroup,smv,components as componentNames,job_type as jobType,to_warehouse as toWarehouse,to_ExtProcessing as toExtProcessing,item_code as itemCode,group_concat(i_op_Code) as operations').where(`unit_code = '${unitCode}' and company_code = '${companyCode}' and product_name = '${productName}' and sew_serial = ${poSerial} and op_version_id = ${opVersionId} `)
            .groupBy(`sew_sequence.group`)
            .getRawMany();
        return opSeqData
    }


    async getComponentsBySewSerial(sewSerial: number, productName: string, unitCode: string, companyCode: string, group: number): Promise<string | null> {
        const query = this.dataSource
            .createQueryBuilder()
            .select("GROUP_CONCAT(DISTINCT sq.components)", "components")
            .from("sew_version", "sv")
            .leftJoin("sew_sequence", "sq", "sq.op_version_id = sv.id AND sq.group = :group", { group: group })
            .where("sv.sew_serial = :sewSerial", { sewSerial })
            .andWhere("sv.product_name = :productName", { productName })
            .andWhere("sv.unit_code = :unitCode", { unitCode })
            .andWhere("sv.company_code = :companyCode", { companyCode })
            .limit(1);
        const result = await query.getRawOne();
        return result ? result.components : null;
    }

}

