import { Column, CreateDateColumn, DataSource, Entity, ManyToMany, ManyToOne, OneToMany, Repository } from "typeorm";
import { AbstractEntity } from "../../../database/common-entities";
import { DocketGroupResponseModel, LayerMeterageRequest, RemarksDocketGroupRequest, RollSelectionTypeEnum } from '@xpparel/shared-models';
import { Injectable } from "@nestjs/common";
import { FabLevelProdNameQueryResponse } from "./query-response/fab-level-prod-name.query.response";
import { PoDocketEntity } from "../entity/po-docket.entity";
import { PoDocketGroupEntity } from "../entity/po-docket-group.entity";
import { PoDocketBundleEntity } from "../entity/po-docket-bundle.entity";
import { ItemDocSizeWiseQtysQueryResponse } from "./query-response/doc-query-response.models";

@Injectable()
export class PoDocketRepository extends Repository<PoDocketEntity> {
    constructor(private dataSource: DataSource) {
        super(PoDocketEntity, dataSource.createEntityManager());
    }

    async getTotalDocketsGeneratedToday(unitCode: string, companyCode: string, date: string): Promise<number> {
        const startDate = `${date} 00:00:00`;
        const endDate = `${date} 23:59:59`;
        const query = await this.createQueryBuilder('pod')
            .select('COUNT(*) AS count')
            .where('pod.created_at BETWEEN :startDate AND :endDate', { startDate, endDate })
            .andWhere('pod.unit_code = :unitCode', { unitCode })
            .andWhere('pod.company_code = :companyCode', { companyCode })
            .getRawOne();
        return query?.count ?? 0;
    }

    async getTotalDocketGeneratedTodayInfo(unitCode: string, companyCode: string, date: string): Promise<any> {
        const startDate = `${date} 00:00:00`;
        const endDate = `${date} 23:59:59`;
        const query = await this.createQueryBuilder('pod')
            .select('docket_number as docketNumber')
            .where('pod.created_at BETWEEN :startDate AND :endDate', { startDate, endDate })
            .andWhere('pod.unit_code = :unitCode', { unitCode })
            .andWhere('pod.company_code = :companyCode', { companyCode })
            .getRawMany();
        return query;
    }


    async getTotalLayedCutsInfoRepo(unitCode: string, companyCode: string, docketGroup: string): Promise<{docketNumber : number}> {
        const query = await this.createQueryBuilder('pd')
            .select('GROUP_CONCAT(pd.docket_number)', 'docketNumber')
            .where('pd.docket_group IN (:docketGroup)', { docketGroup: docketGroup })
            .andWhere('pd.unit_code = :unitCode', { unitCode })
            .andWhere('pd.company_code = :companyCode', { companyCode })
            .getRawOne();

        return query?.docketNumber || '';
    };

    async getSizeWiseDocGenQtysForPoProdColorRm(poSerial: number, prodName: string, color: string, rmSku: string, companyCode: string, unitCode: string): Promise<ItemDocSizeWiseQtysQueryResponse[]> {
        const query = this.createQueryBuilder('doc')
        .select(` bun.size, SUM(bun.quantity) as total_qty, bun.docket_number, doc.item_code`)
        .innerJoin(PoDocketBundleEntity, 'bun', 'doc.company_code = bun.company_code AND doc.unit_code = bun.unit_code AND bun.docket_number = doc.docket_number')
        .where(` doc.company_code = '${companyCode}' AND doc.unit_code = '${unitCode}' AND doc.po_serial = '${poSerial}' AND doc.product_name = '${prodName}' AND doc.color = '${color}'`);
        if(rmSku) {
            query.andWhere(`AND doc.item_code = '${rmSku}'`);
        }
        query.groupBy(`doc.item_code, bun.docket_number, bun.size`);
        return await query.getRawMany();
    }


}