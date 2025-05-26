import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { DateRequest, PoNumberReq } from "@xpparel/shared-models";
import { Repository } from "typeorm";
import { ProductionDefectEntity } from "../entites/production-defects.entity";

@Injectable()
export class SewingDefectRepo extends Repository<ProductionDefectEntity> {
    constructor(@InjectRepository(ProductionDefectEntity) private routesRepo: Repository<ProductionDefectEntity>
    ) {
        super(routesRepo.target, routesRepo.manager, routesRepo.queryRunner);
    }

    async passFailCount(req: PoNumberReq): Promise<any[]> {
        const query = this.createQueryBuilder('swd')
            .select(`test_result,COUNT(sewing_defect_id) as count`)
            .where(`po_number= '${req.poNumber}'`)
            .groupBy(`test_result`)

        return await query.getRawMany()
    }


    async getAllTotalDefects(req: DateRequest): Promise<any> {
        try {
            const fromDate = req?.fromDate
            const toDate = req?.toDate;

            const query = `
                SELECT COUNT(*) AS totalDefects 
                FROM (
                    SELECT pd.test_result
                    FROM production_defect pd
                    WHERE pd.created_at BETWEEN "${fromDate}" AND "${toDate}"
                ) AS total_defects
            `;

            const result = await this.query(query);
            return result;
        } catch (err) {
            console.error('Error fetching total defects:', err);
            throw new Error('Failed to fetch total defects');
        }
    }

    async getAllPassCount(req: DateRequest): Promise<any> {
        try {
            const fromDate = req?.fromDate
            const toDate = req?.toDate

            const query = `
                SELECT COUNT(*) AS passResult 
                FROM (
                    SELECT pd.test_result
                    FROM production_defect pd
                    WHERE pd.test_result ="Pass"  AND pd.created_at BETWEEN "${fromDate}" AND "${toDate}"
                ) AS total_defects
            `;

            const result = await this.query(query);
            return result;
        } catch (err) {
            console.error('Error fetching total defects:', err);
            throw new Error('Failed to fetch total defects');
        }
    }

    async getAllFailCount(req: DateRequest): Promise<any> {
        try {
            const fromDate = req?.fromDate
            const toDate = req?.toDate

            const query = `
                SELECT COUNT(*) AS failResult 
                FROM (
                    SELECT pd.test_result
                    FROM production_defect pd
                    WHERE pd.test_result ="Fail"  AND pd.created_at BETWEEN "${fromDate}" AND "${toDate}"
                ) AS total_defects
            `;

            const result = await this.query(query);
            return result;
        } catch (err) {
            console.error('Error fetching total defects:', err);
            throw new Error('Failed to fetch total defects');
        }
    }

    async getAllBuyerWiseDefect(req: DateRequest): Promise<any> {
        try {
            const fromDate = req?.fromDate
            const toDate = req?.toDate

            const query = `
            SELECT
                emp.first_name,
                emp.employee_id,
                COALESCE(COUNT(pd.test_result), 0) AS totalDefects,
                COALESCE(
                    (SUM(CASE WHEN pd.test_result = 'Fail' THEN 1 ELSE 0 END) * 100.0) 
                    / NULLIF(COUNT(pd.test_result), 0), 
                    0
                ) AS defectRate
            FROM  employee_details emp
            LEFT JOIN production_defect pd  ON pd.employee_id = emp.employee_id 
                AND pd.created_at BETWEEN "${fromDate}" AND "${toDate}"
            GROUP BY
                emp.first_name
            ORDER BY
                defectRate DESC
            LIMIT 5;
            `;
            const result = await this.query(query);
            return result;
        } catch (err) {
            console.error('Error fetching total defects:', err);
            throw new Error('Failed to fetch total defects');
        }
    }

    async getAllPOWiseDefect(req: DateRequest): Promise<any> {
        try {
            const fromDate = req?.fromDate
            const toDate = req?.toDate

            const query = `
            SELECT 
             po.po_number,
             COALESCE(COUNT(pd.test_result), 0) AS totalDefects,
             COALESCE(
                 (SUM(CASE WHEN pd.test_result = 'Fail' THEN 1 ELSE 0 END) * 100.0) 
                 / NULLIF(COUNT(pd.test_result), 0), 
                 0
             ) AS defectRate
            FROM  po po
            LEFT JOIN  production_defect pd  ON pd.po_id = po.po_id  AND pd.created_at BETWEEN "${fromDate}" AND "${toDate}"
            GROUP BY 
                po.po_number
            ORDER BY 
                defectRate DESC
            LIMIT 5;
            `;
            const result = await this.query(query);
            return result;
        } catch (err) {
            console.error('Error fetching total defects:', err);
            throw new Error('Failed to fetch total defects');
        }
    }

    async getAllTopTenDefects(req: DateRequest): Promise<any> {
        try {
            const fromDate = req?.fromDate
            const toDate = req?.toDate
            const query = `
            SELECT  res.reason_name as reasonName,
            COALESCE(COUNT(pd.test_result), 0) AS defectRate
            FROM xpparel_ums.reasons res
            LEFT JOIN xpparel_qms.production_defect pd ON pd.defect_id = res.id AND pd.test_result = 'Fail' AND pd.created_at BETWEEN "${fromDate}" AND "${toDate}"
            GROUP BY res.reason_name
            ORDER BY defectRate DESC 
            LIMIT 10;
            `;
            const result = await this.query(query);
            return result;
        } catch (err) {
            console.error('Error fetching total defects:', err);
            throw new Error('Failed to fetch total defects');
        }
    }
   
    async getAllQualityTypeTopTenDefects(req: DateRequest): Promise<any> {
        try {
            const fromDate = req?.fromDate
            const toDate = req?.toDate
            const query = `
          SELECT 
          res.reason_name,
          COALESCE(COUNT(pd.test_result), 0) AS defectRate,
          qt.quality_type
          FROM xpparel_ums.reasons res
          LEFT JOIN xpparel_qms.production_defect pd ON pd.defect_id = res.id AND pd.test_result = 'Fail' AND pd.created_at BETWEEN "${fromDate}" AND "${toDate}"
          LEFT JOIN xpparel_qms.quality_type qt ON qt.id = pd.quality_type_id
          WHERE qt.id= ${req.qualityTypeId}
          GROUP BY res.reason_name, qt.quality_type
          ORDER BY defectRate DESC 
          LIMIT 10;
            `;
            const result = await this.query(query);
            return result;
        } catch (err) {
            console.error('Error fetching total defects:', err);
            throw new Error('Failed to fetch total defects');
        }
    }

}