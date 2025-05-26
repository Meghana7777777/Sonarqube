
import { DataSource, Repository } from "typeorm";
import { Injectable } from "@nestjs/common";
import { OpSequenceOpgEntity } from "../op-sequence-opg.entity";
import { ProcessTypeEnum } from "@xpparel/shared-models";


@Injectable()
export class OpSequenceOpgRepository extends Repository<OpSequenceOpgEntity> {
    constructor(private dataSource: DataSource) {
        super(OpSequenceOpgEntity, dataSource.createEntityManager());
    }

    // WRONG - Not valid
    async getOpGroupsLevelRecsForMo(companyCode: string, unitCode: string, moNo: string, prodName: string, color: string): Promise<OpSeqQueryResponseForMoProdColor[]> {
        const query = this.createQueryBuilder('op')
            .select('op_group, GROUP_CONCAT(DISTINCT pre_op_group) as dep_op_group, routing_group, proc_type, op_group_order ')
            .where(`company_code = '${companyCode}' AND unit_code = '${unitCode}' AND mo_no = '${moNo}' AND prod_name = '${prodName}' AND fg_color = '${color}' `)
            .groupBy(`op_group`);
        return await query.getRawMany();
    }

    async getOpSeqForOpSeqRefId(opSeqRefId: number): Promise<{ procType: string, opSequence: number,lastOpGroup:string }[]> {

        const opSeqGrouped = await this.createQueryBuilder('op')
            .select(['op.procType as procType', '(op.opGroupOrder) as opSequence','op.op_group as lastOpGroup']) // Example aggregation
            .where('op.opSeqRefId = :opSeqRefId', { opSeqRefId: opSeqRefId })
            .orderBy('op.createdAt','DESC')
        return await opSeqGrouped.getRawMany();
    }


}

// WRONG - Not valid
export class OpSeqQueryResponseForMoProdColor {
    op_group: string;
    dep_op_group: string;
    routing_group: string;
    proc_type: ProcessTypeEnum;
    op_group_order: number;
}

