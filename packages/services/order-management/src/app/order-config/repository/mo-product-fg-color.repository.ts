import { Injectable } from "@nestjs/common";
import { DataSource, Repository } from "typeorm";
import { MOProductFgColorEntity } from "../entity/mo-product-color.entity";
import { MoOpProcTypeEntity } from "../entity/mo-op-proc-type.entity";
import { MoOpVersionEntity } from "../entity/mo-op-version.entity";
import { MoOpSubprocessEntity } from "../entity/mo-op-sub-process.entity";

@Injectable()
export class MOProductFgColorRepository extends Repository<MOProductFgColorEntity> {
    constructor(private dataSource: DataSource) {
        super(MOProductFgColorEntity, dataSource.createEntityManager());
    }


    // async getBomInfoByMoNumber(moNumber:string,companyCode:string,unitCode:string){
    //     const query = this.createQueryBuilder('moPrFgCo')
    //     .leftJoin(MoOpVersionEntity,'moOpVe','moOpVe.mo_product_fg_color_id = moPrFgCo.id')
    //     .leftJoin(MoOpProcTypeEntity,'moOpPr','moOpPr.id = moOpVe.op_proc_type_id AND moOpPr.company_code = moOpVe.company_code AND  moOpPr.unit_code = moOpVe.unit_code')
    //     .leftJoin(MoOpSubprocessEntity,'moOpSubPro','moOpSubPro.id = moOpPr.op_proc_type_id AND moOpSubPro.company_code = moOpPr.company_code AND  moOpSubPro.unit_code = moOpPr.unit_code')
    //     // .leftJoin()
    //     .where('moPrFgCo.mo_number = :moNumber AND moPrFgCo.company_code = :companyCode AND moPrFgCo.unit_code =:unitCode', {moNumber,companyCode,unitCode})
    //     .getRawMany()
    // }
}

