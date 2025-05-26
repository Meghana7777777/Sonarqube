import { Injectable } from "@nestjs/common";
import { DataSource, Repository } from "typeorm";
import { PslOperationEntity } from "../entity/psl-operation.entity";
import { PslOperationRmEntity } from "../entity/psl-operation-rm.entity";

@Injectable()
export class PslOperationRepository extends Repository<PslOperationEntity> {
  constructor(private dataSource: DataSource) {
    super(PslOperationEntity, dataSource.createEntityManager());
  }
   
  /**
   * Repo method to get distinct item codes for the given Mo sub line Ids
   * @param mpPslIds 
   * @param moNumber 
   * @param unitCode 
   * @param companyCode 
   * @returns 
  */
  async getItemCodesInfoForMoSubLineIds(mpPslIds: number[], moNumber: string, unitCode: string, companyCode: string): Promise<string[]> {
    const itemCodesResp: {item_code: string}[] = await this.createQueryBuilder('psl_op')
    .select('DISTINCT item_code')
    .leftJoin(PslOperationRmEntity, 'psl_op_rm', 'psl_op.unit_code = psl_op_rm.unit_code AND psl_op.company_code = psl_op.company_code AND psl_op.id = psl_op_rm.psl_operation_id')
    .where(`psl_op.mo_product_sub_line_id IN (:...pslIds)`, {pslIds: mpPslIds})
    .andWhere(`psl_op.mo_number = '${moNumber}' AND psl_op.unit_code = '${unitCode}' AND psl_op.company_code = '${companyCode}' AND psl_op.is_active = true`)
    .getRawMany();
    return itemCodesResp.map(item => item.item_code);
  }

  async getAllOperationForMo(moNumber:string,companyCode:string,unitCode:string):Promise<string[]>{

    const itemCodesResp: {op_code: string}[] = await this.createQueryBuilder('psl_op')
    .select('DISTINCT psl_op.op_code')
    .leftJoin(PslOperationRmEntity, 'psl_op_rm', 'psl_op.unit_code = psl_op_rm.unit_code AND psl_op.company_code = psl_op.company_code AND psl_op.id = psl_op_rm.psl_operation_id')
    .andWhere(`psl_op.mo_number = '${moNumber}' AND psl_op.unit_code = '${unitCode}' AND psl_op.company_code = '${companyCode}' AND psl_op.is_active = true`)
    .getRawMany();
    return itemCodesResp.map(item => item.op_code);
  }
}
