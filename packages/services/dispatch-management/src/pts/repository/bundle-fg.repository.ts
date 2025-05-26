
import { DataSource, Repository } from "typeorm";
import { Injectable } from "@nestjs/common";
import { BundleFgEntity } from "../entity/bundle-fg.entity";
import { MoInfoEntity } from "../entity/mo-info.entity";

@Injectable()
export class BundleFgRepository extends Repository<BundleFgEntity> {
    constructor(private dataSource: DataSource) {
        super(BundleFgEntity, dataSource.createEntityManager());
    }

    async getColSizeForBundle(bundle: string, companyCode: string, unitCode: string): Promise<{color: string, size: string, job_number: string, osl_id: string}> {
        const result: {color: string, size: string, job_number: string, osl_id: string} = await this.createQueryBuilder('b')
        .select(`m.osl_id, m.color, m.size, b.job_number`)
        .leftJoin(MoInfoEntity, 'm', 'm.company_code = b.company_code AND m.unit_code = b.unit_code AND m.osl_id = b.osl_id')
        .where(`b.bundle_barcode = '${bundle}' AND b.company_code = '${companyCode}' AND b.unit_code = '${unitCode}' `)
        .getRawOne();
        return result;
    }

    async getColSizeFgsForJob(jobNumber: string, companyCode: string, unitCode: string): Promise<{color: string, size: string, fgs:string }[]> {
        const result: {color: string, size: string, fgs: string }[] = await this.createQueryBuilder('b')
        .select(`m.sl_id, m.color, m.size, b.job_number, GROUP_CONCAT(b.fg_number) as fgs`)
        .leftJoin(MoInfoEntity, 'm', 'm.company_code = b.company_code AND m.unit_code = b.unit_code AND m.osl_id = b.osl_id')
        .where(`b.job_number = '${jobNumber}' AND b.company_code = '${companyCode}' AND b.unit_code = '${unitCode}' `)
        .groupBy(`m.color, m.size`)
        .getRawMany();
        return result;
    }

    async getColSizeFgsForBundle(bundleBrcd: string, companyCode: string, unitCode: string): Promise<{color: string, size: string, fgs:string }[]> {
        const result: {color: string, size: string, fgs: string }[] = await this.createQueryBuilder('b')
        .select(`m.sl_id, m.color, m.size, b.job_number, GROUP_CONCAT(b.fg_number) as fgs`)
        .leftJoin(MoInfoEntity, 'm', 'm.company_code = b.company_code AND m.unit_code = b.unit_code AND m.osl_id = b.osl_id')
        .where(`b.bundle_barcode = '${bundleBrcd}' AND b.company_code = '${companyCode}' AND b.unit_code = '${unitCode}' `)
        .groupBy(`m.color, m.size`)
        .getRawMany();
        return result;
    }

    async getBundlesForFgNumbersAndJg(sewSerial: number, fgs: number[], jg: number, companyCode: string, unitCode: string): Promise<{osl_id: number, bundle_barcode: string, color: string, size: string, job_number: string, fgs: string}[]> {
        const result: {osl_id: number, bundle_barcode: string, color: string, size: string, job_number: string, fgs: string }[] = await this.createQueryBuilder('b')
        .select(`b.osl_id, b.bundle_barcode, m.color, m.size, b.job_number, GROUP_CONCAT(DISTINCT b.fg_number) as fgs`)
        .leftJoin(MoInfoEntity, 'm', 'm.company_code = b.company_code AND m.unit_code = b.unit_code AND m.osl_id = b.osl_id')
        .where(`b.sew_serial = ${sewSerial} AND b.job_group = ${jg} AND b.fg_number IN (:...fgs) AND b.company_code = '${companyCode}' AND b.unit_code = '${unitCode}' `, { fgs: fgs })
        .groupBy(`b.bundle_barcode, m.color, m.size`)
        .getRawMany();
        return result;
    }

    async getBundlesForFgNumbersAndJob(sewSerial: number, fgs: number[], jobNumber: string, companyCode: string, unitCode: string): Promise<{osl_id: number, bundle_barcode: string, color: string, size: string, job_number: string, fgs: string}[]> {
        const result: {osl_id: number, bundle_barcode: string, color: string, size: string, job_number: string, fgs: string }[] = await this.createQueryBuilder('b')
        .select(`b.osl_id, b.bundle_barcode, m.color, m.size, b.job_number, GROUP_CONCAT(DISTINCT b.fg_number) as fgs`)
        .leftJoin(MoInfoEntity, 'm', 'm.company_code = b.company_code AND m.unit_code = b.unit_code AND m.osl_id = b.osl_id')
        .where(`b.sew_serial = ${sewSerial} AND b.job_number = '${jobNumber}' AND b.fg_number IN (:...fgs) AND b.company_code = '${companyCode}' AND b.unit_code = '${unitCode}' `, { fgs: fgs })
        .groupBy(`b.bundle_barcode, m.color, m.size`)
        .getRawMany();
        return result;
    }

    async getOslRefIdsForSewJob(sewSerial: number, jobNumber: string, companyCode: string, unitCode: string): Promise<number[]> {
        const query: {osl_id: number}[] = await this.createQueryBuilder('b')
        .select(`DISTINCT osl_id`)
        .where(`b.sew_serial = ${sewSerial} AND b.job_number = '${jobNumber}' AND b.company_code = '${companyCode}' AND b.unit_code = '${unitCode}' `)
        .getRawMany();
        return query.map(r => r.osl_id);
    }

    async getOslRefIdsForBundle(sewSerial: number, bundleBrcd: string, companyCode: string, unitCode: string): Promise<number[]> {
        const query: {osl_id: number}[] = await this.createQueryBuilder('b')
        .select(`DISTINCT osl_id`)
        .where(`b.sew_serial = ${sewSerial} AND b.bundle_barcode = '${bundleBrcd}' AND b.company_code = '${companyCode}' AND b.unit_code = '${unitCode}' `)
        .getRawMany();
        return query.map(r => r.osl_id);
    }
}

