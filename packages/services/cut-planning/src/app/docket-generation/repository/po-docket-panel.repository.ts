import { Column, CreateDateColumn, DataSource, Entity, ManyToMany, ManyToOne, OneToMany, Repository } from "typeorm";
import { AbstractEntity } from "../../../database/common-entities";
import { RollSelectionTypeEnum } from '@xpparel/shared-models';
import { Injectable } from "@nestjs/common";
import { FabLevelProdNameQueryResponse } from "./query-response/fab-level-prod-name.query.response";
import { PoDocketEntity } from "../entity/po-docket.entity";
import { PoDocketGroupEntity } from "../entity/po-docket-group.entity";
import { PoDocketPanelEntity } from "../entity/po-docket-panel.entity";
import { DOC_ElgPanelsForBundlingQueryResponse, DOC_SizeWiseBundledQtysQueryResponse, DOC_SizeWiseCutRepQytsQueryResponse } from "./query-response/doc-query-response.models";

@Injectable()
export class PoDocketPanelRepository extends Repository<PoDocketPanelEntity> {
    constructor(private dataSource: DataSource) {
        super(PoDocketPanelEntity, dataSource.createEntityManager());
    }

    async getCutReportedPanelsForBundlingByPslIds(poSerial: number, refComp: string, pslIds: number[], companyCode: string, unitCode: string): Promise<DOC_ElgPanelsForBundlingQueryResponse[]> {
        const query = this.createQueryBuilder('p')
        .select(`psl_id, size, bundle_number, adb_roll_id, adb_number, under_doc_lay_number, GROUP_CONCAT(panel_number) as panels`)
        .where(`po_serial = ${poSerial} AND company_code = '${companyCode}' AND unit_code = '${unitCode}' AND component = '${refComp}'  AND psl_id IN (:...psls) AND bundled = false AND cut_reported = true`, {psls: pslIds})
        .groupBy(`under_doc_lay_number, psl_id, adb_roll_id `)
        .orderBy(`bundle_number, adb_number, panel_number`);
        return query.getRawMany();
    }

    async getCutReportedPanelsForBundlingByDocket(docketNumber: string, underDocLayNumber: number, pslIds: number[], companyCode: string, unitCode: string): Promise<DOC_ElgPanelsForBundlingQueryResponse[]> {
        const query = this.createQueryBuilder('p')
        .select(`psl_id, size, bundle_number, adb_roll_id, adb_number, under_doc_lay_number, GROUP_CONCAT(panel_number) as panels`)
        .where(`company_code = '${companyCode}' AND unit_code = '${unitCode}' AND docket_number = '${docketNumber}' AND bundled = false AND cut_reported = true`);
        if(pslIds?.length) {
            query.andWhere(`psl_id IN (:...psls)`, {psls: pslIds});
        }
        if(underDocLayNumber > 0) {
            query.andWhere(`under_doc_lay_number = ${underDocLayNumber}`);
        }
        query.groupBy(`under_doc_lay_number, psl_id, adb_roll_id `)
        .orderBy(`bundle_number, adb_number, panel_number`);
        return query.getRawMany();
    }


    async getSizeWiseCutReportedQtysForDockets(poSerial: number, docketNumbers: string[], companyCode: string, unitCode: string): Promise<DOC_SizeWiseCutRepQytsQueryResponse[]> {
        const query = this.createQueryBuilder('p')
        .select(`docket_number, size, count(1) as cut_qty`)
        .where(`po_serial = ${poSerial} AND company_code = '${companyCode}' AND unit_code = '${unitCode}' AND cut_reported = true AND docket_number IN(:...docs)`, {docs: docketNumbers})
        .groupBy(`docket_number, size `);
        return query.getRawMany();
    }

    async getSizeWiseBundledQtysForDockets(poSerial: number, docketNumbers: string[], companyCode: string, unitCode: string): Promise<DOC_SizeWiseBundledQtysQueryResponse[]> {
        const query = this.createQueryBuilder('p')
        .select(`docket_number, size, count(1) as bundled_qty`)
        .where(`po_serial = ${poSerial} AND company_code = '${companyCode}' AND unit_code = '${unitCode}' AND bundled = true AND docket_number IN(:...docs)`, {docs: docketNumbers})
        .groupBy(`docket_number, size `);
        return query.getRawMany();
    }
}


