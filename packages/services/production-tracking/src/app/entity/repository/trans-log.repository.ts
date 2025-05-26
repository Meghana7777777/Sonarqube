
import { DataSource, Repository } from "typeorm";
import { Injectable } from "@nestjs/common";
import { TranLogEntity } from "../tran-log.entity";
import { OpOrderTypeEnum } from "@xpparel/shared-models";

@Injectable()
export class TransLogRepository extends Repository<TranLogEntity> {
    constructor(private dataSource: DataSource) {
        super(TranLogEntity, dataSource.createEntityManager());
    }

    // async getOpRepQtysForDateRangeGroupedBySewSerialOperatorResource(companyCode: string, unitCode: string, fromDate: string, toDate: string): Promise<OpRepQtysOperatorWiseQueryResponse[]> {
    //     const res = await this.createQueryBuilder('c')
    //     .select(`created_user, sew_serial, op_code, SUM(r_qty) as r_qty, SUM(g_qty) as g_qty, smv, module_code, workstation_code`)
    //     .where(`company_code = '${companyCode}' AND unit_code = '${unitCode}' AND trans_date BETWEEN '${fromDate} 00:00:00' AND '${toDate} 23:59:59' AND op_order_type = '${OpOrderTypeEnum.OUTPUT}' `)
    //     .groupBy(`sew_serial, created_user, module_code, workstation_code, op_code`)
    //     .getRawMany();
    //     return res;
    // }
}



