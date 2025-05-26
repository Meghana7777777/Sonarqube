
import { DataSource, Repository } from "typeorm";
import { Injectable } from "@nestjs/common";
import { MoInfoEntity } from "../entity/mo-info.entity";
import { FgEntity } from "../entity/fg.entity";


@Injectable()
export class MoInfoRepository extends Repository<MoInfoEntity> {
    constructor(private dataSource: DataSource) {
        super(MoInfoEntity, dataSource.createEntityManager());
    }

    async getColSizeFgsForSewSerial(sewSerial: number, companyCode: string, unitCode: string): Promise<{color: string, size: string, fgs: string }[]> {
        const result: {color: string, size: string, fgs: string }[] = await this.createQueryBuilder('mo')
        .select(`osl_id, color, size, job_number, GROUP_CONCAT(fg_number) as fgs`)
        .leftJoin(FgEntity, 'f', 'f.company_code = mo.company_code AND f.unit_code = mo.unit_code AND f.osl_id = mo.osl_id')
        .where(`mo.sew_serial = ${sewSerial} AND mo.company_code = '${companyCode}' AND mo.unit_code = '${unitCode}' `)
        .groupBy(`mo.color, mo.size`)
        .getRawMany();
        return result;
    }
}


