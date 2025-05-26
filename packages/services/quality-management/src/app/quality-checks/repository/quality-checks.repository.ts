import { Injectable } from "@nestjs/common";
import { DataSource, Repository } from "typeorm";
import { EsclationsLogEntity } from "../entities/esclations-log.entity";
import { QualityChecksEntity } from "../entities/quality-checks.entity";
import { DateRequest, QMS_DefectRatesReqDto, QMS_DefectRatesModel, QMS_QualityCheckStatus, QualityCheckCreationRequest, QMS_CommonDatesReq } from "@xpparel/shared-models";
import { QualityTypeEntity } from "../../quality-type/entites/quality-type-entity";

@Injectable()
export class QualityChecksRepository extends Repository<QualityChecksEntity> {
    constructor(private dataSource: DataSource) {
        super(QualityChecksEntity, dataSource.createEntityManager());
    }

    async getReportedDefectQuantityForGiveBarcode(req: QualityCheckCreationRequest) {
        const { companyCode, unitCode, barcode, qualityConfigId } = req
        const query = await this.createQueryBuilder('qc')
            .select('SUM(qc.reported_qty) as defectQuantity,GROUP_CONCAT(qc.id) as qualityCheckIds')
            .where(`qc.barcode = '${barcode}' and qc.quality_config_id = ${qualityConfigId} and qc.quality_status = '${QMS_QualityCheckStatus.FAIL}'`)
            .groupBy('qc.barcode,qc.quality_config_id')

        return await query.getRawOne()
    }



    async getTotalBarcodeQty(req?: QMS_CommonDatesReq): Promise<{ totalBarcodeQty: number }> {
        const totalBarcodeQtyQuery = await this.createQueryBuilder('q')
            .select('SUM(sub.barcode_qty)', 'totalBarcodeQty')
            .from((qb) =>
                qb
                    .select('MIN(qc.id)', 'id')
                    .addSelect('qc.barcode_qty', 'barcode_qty')
                    .from(QualityChecksEntity, 'qc')
                    .groupBy('qc.barcode')
                    .addGroupBy('qc.process_type')
                    .addGroupBy('qc.quality_type_id'),
                'sub'
            )
        if (req) {
            const { fromDate, toDate } = req
            totalBarcodeQtyQuery.where(`DATE(q.reported_on) BETWEEN '${fromDate}' AND '${toDate}'`)

        }
        const totalBarcodeQtyResult = await totalBarcodeQtyQuery.getRawOne();
        if (!totalBarcodeQtyResult) {
            return { totalBarcodeQty: 0 };
        }
        return totalBarcodeQtyResult

    }

    async getStatusWiseQtyAndPercent(req: QMS_CommonDatesReq): Promise<{ failQty: number, totalReportedQty }> {
        const query = await this.createQueryBuilder('qc')
            .select(`SUM(CASE WHEN qc.quality_status = :fail THEN qc.reported_qty ELSE 0 END) as failQty,SUM(reported_qty) as totalReportedQty`)
            .setParameters({ pass: QMS_QualityCheckStatus.PASS, fail: QMS_QualityCheckStatus.FAIL })
            .getRawOne()

        return query
    }


    async getDefectRates(request: QMS_DefectRatesReqDto): Promise<QMS_DefectRatesModel[]> {

        let groupByField: string;
        switch (request.category) {
            case 'PROCESS':
                groupByField = 'processType';
                break;
            case 'QUALITY':
                groupByField = 'qualityTypeId';
                break;
            case 'STYLE':
                groupByField = 'styleCode';
                break;
            default:
                throw new Error('Invalid category');
        }

        const query = await this
            .createQueryBuilder('qc')
            .select('SUM(qc.reportedQuantity)', 'totalReported')
            .addSelect('SUM(qc.barcodeQty)', 'totalChecked')
            .addSelect('ROUND(SUM(qc.reportedQuantity) / SUM(qc.barcodeQty) * 100, 2)', 'defectiveRate')
            .where('DATE(qc.reportedOn) BETWEEN :from AND :to', {
                from: request.fromDate,
                to: request.toDate,
            })
            .andWhere('qc.qualityStatus = :status', { status: QMS_QualityCheckStatus.FAIL }) // Assuming only DEFECTIVE entries
            .andWhere(`qc.${groupByField} IS NOT NULL`)
            .andWhere('qc.companyCode = :companyCode', { companyCode: request.companyCode })
            .andWhere('qc.unitCode = :unitCode', { unitCode: request.unitCode })
            .groupBy(`qc.${groupByField}`)
            .orderBy('defectiveRate', 'DESC')
        if (groupByField == 'qualityTypeId') {
            query.leftJoin(QualityTypeEntity, 'qt', 'qt.id = qc.qualityTypeId')
            query.addSelect('qt.qualityType', 'label')
        } else {
            query.addSelect(`qc.${groupByField}`, 'label')

        }
        return await query.getRawMany();
    }

    async getLocationAndQualityTypeWiseDefectQty(req: QMS_CommonDatesReq): Promise<{ location: string, defectiveQty: number, qualityType: string }[]> {
        const query = await this.createQueryBuilder('qc')
            .select('qc.location', 'location')
            .addSelect('SUM(qc.reportedQuantity)', 'defectiveQty')
            .leftJoin(QualityTypeEntity, 'qt', 'qt.id = qc.qualityTypeId')
            .addSelect('qt.qualityType', 'qualityType')
            .where('DATE(qc.reportedOn) BETWEEN :from AND :to', {
                from: req.fromDate,
                to: req.toDate,
            })
            .andWhere('qc.companyCode = :companyCode', { companyCode: req.companyCode })
            .andWhere('qc.unitCode = :unitCode', { unitCode: req.unitCode })
            .groupBy('qc.location')
            .addGroupBy('qc.qualityTypeId')
            .orderBy('defectiveQty', 'DESC')

        return await query.getRawMany()
    }





}