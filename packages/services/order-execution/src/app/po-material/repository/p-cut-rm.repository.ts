import { Column, CreateDateColumn, DataSource, Entity, ManyToMany, ManyToOne, OneToMany, Repository } from "typeorm";
import { AbstractEntity } from "../../../database/common-entities";
import { RollSelectionTypeEnum } from '@xpparel/shared-models';
import { Injectable } from "@nestjs/common";
import { PCutRmEntity } from "../entity/p-cut-rm.entity";
import { FabLevelProdNameQueryResponse, FabricColorAndItemInfo } from "./query-response/fab-level-prod-name.query.response";
import { PoRatioEntity } from "../../po-ratio/entity/po-ratio.entity";
import { PoRatioLineEntity } from "../../po-ratio/entity/po-ratio-line.entity";
import { PoRatioFabricEntity } from "../../po-ratio/entity/po-ratio-fabric.entity";
import { PoRatioSizeEntity } from "../../po-ratio/entity/po-ratio-size.entity";
import { PoMarkerEntity } from "../../po-marker/entity/po-marker.entity";
import { PoSubLineEntity } from "../../common/entities/po-sub-line-entity";

@Injectable()
export class PCutRmRepository extends Repository<PCutRmEntity> {
    constructor(private dataSource: DataSource) {
        super(PCutRmEntity, dataSource.createEntityManager());
    }


    async getFabricLevelProdNameForPo(poSerial: number, companyCode: string, unitCode: string): Promise<FabLevelProdNameQueryResponse[]> {
        return await this.createQueryBuilder('rm')
        .select('GROUP_CONCAT(DISTINCT pl.product_name) as product_name, GROUP_CONCAT(DISTINCT pl.product_type) as product_type, rm.item_code as item_code')
        .leftJoin(PoSubLineEntity, 'pl', 'pl.company_code = rm.company_code AND pl.unit_code = rm.unit_code AND pl.processing_serial = rm.po_serial AND pl.product_name = rm.product_name  AND pl.fg_color = rm.fg_color')
        .where(`rm.company_code = '${companyCode}' AND rm.unit_code = '${unitCode}' AND rm.po_serial = ${poSerial}`)
        .groupBy('rm.item_code')
        .getRawMany();
    }

    async getPoColorAndItemInformation(poSerial: string, companyCode: string, unitCode: string): Promise<FabricColorAndItemInfo[]> {
      const query = await this.createQueryBuilder('pcr')
        .select(['date(pr.created_at) as createdDate','pcr.po_serial','pcr.fg_color', 'pcr.avg_cons','pcr.product_type','pcr.product_name', 'pcr.item_code','pr.ratio_name','pr.ratio_code', 'pr.ratio_desc', 'prf.plies as plies', 'prf.max_plies','SUM(prs.ratio) AS totratio','pm.marker_length','pcr.wastage as wastage','pcr.binding_cons','pcr.is_main_fabric','pcr.is_binding'])
        .leftJoin(PoRatioLineEntity, 'prl', 'pcr.po_serial = prl.po_serial AND pcr.fg_color = prl.color AND pcr.product_type = prl.product_type AND pcr.product_name = prl.product_name')
        .leftJoin(PoRatioEntity, 'pr', 'prl.po_serial = pr.po_serial AND prl.po_ratio_id = pr.id')
        .leftJoin(PoRatioFabricEntity, 'prf', 'prl.po_serial = prf.po_serial AND prl.id = prf.po_ratio_line_id AND pcr.item_code = prf.item_code')
        .leftJoin(PoRatioSizeEntity, 'prs', 'prs.po_ratio_line_id = prl.id')
        .leftJoin(PoMarkerEntity, 'pm', 'pm.po_serial = pr.po_serial AND pm.id = pr.po_marker_id')
        .where(`pcr.company_code = '${companyCode}' AND pcr.unit_code = '${unitCode}' AND pcr.po_serial = ${poSerial}`)
        .andWhere('prf.plies is not null')
        .andWhere('pm.marker_length is not null')
        .groupBy('pcr.product_type, pcr.product_name, pcr.item_code, pr.ratio_code')
        .getRawMany();
  
      return query;
    }

}

