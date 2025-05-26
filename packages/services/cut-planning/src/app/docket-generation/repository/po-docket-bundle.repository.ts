import { Column, CreateDateColumn, DataSource, Entity, ManyToMany, ManyToOne, OneToMany, Repository } from "typeorm";
import { AbstractEntity } from "../../../database/common-entities";
import { RollSelectionTypeEnum } from '@xpparel/shared-models';
import { Injectable } from "@nestjs/common";
import { FabLevelProdNameQueryResponse } from "./query-response/fab-level-prod-name.query.response";
import { PoDocketEntity } from "../entity/po-docket.entity";
import { PoDocketGroupEntity } from "../entity/po-docket-group.entity";
import { PoDocketBundleEntity } from "../entity/po-docket-bundle.entity";
import { SizeMinMaxDocPanelsQueryResponse } from "./query-response/size-min-max-doc-panels.query.response";

@Injectable()
export class PoDocketBundleRepository extends Repository<PoDocketBundleEntity> {
    constructor(private dataSource: DataSource) {
        super(PoDocketBundleEntity, dataSource.createEntityManager());
    }

    async getSizeWiseMinAndMaxPanelNumberOfDocket(poSerial: number, docketNumber: string, companyCode: string, unitCode: string): Promise<SizeMinMaxDocPanelsQueryResponse[]> {
        const query = this.createQueryBuilder('doc')
        .select(` docket_number, size, MIN(panel_start_number) as min_panel, MAX(panel_end_number) as max_panel, component`)
        .where(` company_code = '${companyCode}' AND unit_code = '${unitCode}' AND po_serial = '${poSerial}' AND docket_number = '${docketNumber}' `)
        .groupBy(` size, component `);
        const result: SizeMinMaxDocPanelsQueryResponse[] = await query.getRawMany();
        return result;
    }

    async getDocketsForCompSizeMinMaxPanelNumbers(poSerial: number, prodName: string, color: string, component: string, size: string, minPanel: number, maxPanel: number, companyCode: string, unitCode: string): Promise<string[]> {
        const query = this.createQueryBuilder('bun')
        .select(` DISTINCT(bun.docket_number) as docket_number`)
        .leftJoin(PoDocketEntity, 'doc', 'doc.company_code = bun.company_code AND doc.unit_code = bun.unit_code AND bun.docket_number = doc.docket_number')
        .where(` bun.company_code = '${companyCode}' AND bun.unit_code = '${unitCode}' AND bun.po_serial = '${poSerial}' AND doc.product_name = '${prodName}' AND bun.component = '${component}' AND bun.size = '${size}' AND bun.color = '${color}' AND bun.panel_start_number >= ${minPanel} AND bun.panel_end_number <= ${maxPanel}  `);
        const result: {docket_number: string}[] = await query.getRawMany();
        const dockets: string[] = [];
        result.forEach(r => dockets.push(r.docket_number));
        return dockets;
    }

    // async getComponentsInvolvedInDocket(poSerial: number, docketNumber: string, companyCode: string, unitCode: string): Promise<string[]> {
    //     const query = this.createQueryBuilder('doc')
    //     .select(` DISTINCT(component) as component`)
    //     .where(` company_code = '${companyCode}' AND unit_code = '${unitCode}' AND po_serial = '${poSerial}' AND docket_number = ${docketNumber}`)
    //     .groupBy(` size, component `);
    //     const result: {component: string}[] = await query.getRawMany();
    //     const components = new Set<string>();
    //     result.forEach(r => components.add(r.component));
    //     return [...components];
    // }
}

