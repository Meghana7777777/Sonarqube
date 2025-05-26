
import { DataSource, Repository } from "typeorm";
import { Injectable } from "@nestjs/common";
import { FgOpDepEntity } from "../entity/fg-op-dep.entity";
import { MoInfoEntity } from "../entity/mo-info.entity";


@Injectable()
export class FgOpDepRepository extends Repository<FgOpDepEntity> {
    constructor(private dataSource: DataSource) {
        super(FgOpDepEntity, dataSource.createEntityManager());
    }

    // async getFgsOfJobThatAreFreeToMapWithThePreOps(jobNumber: string, col: string, size: string, preOp: string, companyCode: string, unitCode: string): Promise<> {

    //     const query = await this.createQueryBuilder('c')
    //     .select('DISTINCT fg_number')
    //     .leftJoin(MoInfoEntity, 'm', 'm.company_code = c.company_code AND m.unit_code = c.unit_code AND m.osl_id = b.osl_id')
    //     .where(``)

    // }
}


