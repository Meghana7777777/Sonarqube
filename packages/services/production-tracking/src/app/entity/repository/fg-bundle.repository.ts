
import { DataSource, Repository } from "typeorm";
import { Injectable } from "@nestjs/common";
import { FgBundleEntity } from "../fg-bundle.entity";
import { ProcessTypeEnum } from "@xpparel/shared-models";

@Injectable()
export class FgBundleRepository extends Repository<FgBundleEntity> {
    constructor(private dataSource: DataSource) {
        super(FgBundleEntity, dataSource.createEntityManager());
    }


    // UNUSED
    async getFgNumbersForProcTypeAndPslIds(procType: ProcessTypeEnum, pslIds: number[], companyCode: string, unitCode: string): Promise<number[]> {
        const query = this.createQueryBuilder('bfg')
        .select('DISTINCT fg_number')
        .where(`osl_id In (:...psls) AND proc_type = '${procType}' `, {psls: pslIds});
        const result: {fg_number: number}[] =  await query.getRawMany();
        return result.map(r => Number(r.fg_number));
    }

    async getFgNumbersForProcTypeBundleNumberAndPslId(procType: ProcessTypeEnum, bundleNo: string, pslId: number, companyCode: string, unitCode: string, isActual: boolean): Promise<number[]> {
        const query = this.createQueryBuilder('bfg')
        .select('DISTINCT fg_number')
        .where(`osl_id = ${pslId} AND proc_type = '${procType}'`);
        if(isActual) {
            query.andWhere(`ab_barcode = '${bundleNo}'`);
        } else {
            query.andWhere(`barcode = '${bundleNo}'`);
        }
        const result: {fg_number: number}[] =  await query.getRawMany();
        return result.map(r => Number(r.fg_number));
    }
}