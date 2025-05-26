import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { PackListIdRequest } from "@xpparel/shared-models";
import { Repository } from "typeorm";
import { BaseAbstractRepository } from "../../../database/common-repositories";
import { ItemsEntity } from "../../__masters__/items/entities/items.entity";
import { PackTypeEntity } from "../../__masters__/pack-types/entities/pack-type.entity";
import { BoxMapEntity } from "../../__masters__/packing-spec/entities/box-map.entity";
import { PackingSpecEntity } from "../../__masters__/packing-spec/entities/packing-spec.entity";
import { PKMSPoLineEntity } from "../../pre-integrations/pkms-po-entities/pkms-po-line-entity";
import { PKMSPoSubLineEntity } from "../../pre-integrations/pkms-po-entities/pkms-po-sub-line-entity";
import { PKMSProcessingOrderEntity } from "../../pre-integrations/pkms-po-entities/pkms-processing-order-entity";
import { ConfigQueryDto } from "../dto/config-qurrey.dto";
import { PacklistQurreyDto } from "../dto/packlist-qurrey-dto";
import { CartonParentHierarchyEntity } from "../entities/carton-config-parent-hierarchy.entity";
import { PLConfigEntity } from "../entities/pack-list.entity";
import { PLConfigRepoInterface } from "./config-repo.interface";

@Injectable()
export class PLConfigRepo
  extends BaseAbstractRepository<PLConfigEntity>
  implements PLConfigRepoInterface {
  constructor(
    @InjectRepository(PLConfigEntity)
    private readonly configEntity: Repository<PLConfigEntity>
  ) {
    super(configEntity);
  }
  async getPLConfigData(
    poNumber: string,
    poLineId?: string,
    subLineId?: string
  ): Promise<PLConfigEntity | undefined> {
    const query = this.configEntity
      .createQueryBuilder("pLConfigData")
      .leftJoinAndSelect("pLConfigData.po", "po")
      .leftJoinAndSelect("pLConfigData.poLine", "poLine")
      .leftJoinAndSelect("pLConfigData.pLConfigChild", "pLConfigChild")
      .leftJoinAndSelect("pLConfigChild.poOrderSubLineId", "poOrderSubLine")
      .where(`po.poNumber='${poNumber}'`);
    if (poLineId) query.andWhere(`poLine.poLine = '${poLineId}'`);
    if (subLineId) query.andWhere(`poOrderSubLine.id = '${subLineId}'`);
    return await query.getOne();
  }

  // async getPackListsForPo(
  //   companyCode: string, unitCode: string,
  //   packSerial: number,
  //   poLineId?: string,
  //   subLineId?: string
  // ): Promise<PLConfigEntity[]> {
  //   const query = this.configEntity
  //     .createQueryBuilder("pLConfigData")
  //     .leftJoinAndSelect("pLConfigData.po", "po")
  //     .leftJoinAndSelect("po.poOrderLines", "poOrderLines")
  //     .leftJoinAndSelect("poOrderLines.poOrderSubLines", "poOrderSubLines")
  //     .leftJoinAndSelect("pLConfigData.pkSpecId", "pkSpecId")
  //     .leftJoinAndSelect("pLConfigData.pkTypeId", "pkTypeId")
  //     .where(`pLConfigData.packSerial='${packSerial}'  AND pLConfigData.unitCode = '${unitCode}' AND pLConfigData.companyCode = '${companyCode}'`);
  //   if (poLineId) query.andWhere(`poOrderLines.poLine = '${poLineId}'`);
  //   if (subLineId) query.andWhere(`poOrderSubLine.id = '${subLineId}'`);
  //   return await query.getMany();
  // }
  async getPackListsForPo(companyCode: string, unitCode: string, packSerial: number, poLineId?: string, subLineId?: string
  ): Promise<ConfigQueryDto[]> {
    const query = this.configEntity
      .createQueryBuilder("plcd")
      .select(`plcd.id AS configId, plcd.pl_config_no, plcd.pl_config_desc,  plcd.quantity,
        plcd.no_of_cartons, plcd.pack_job_qty, plcd.pack_job_qty`)
      .addSelect('po.id AS poId, po.processing_serial')
      // .addSelect('po.delivery_date')
      .addSelect('ps.id AS specId, pt.id AS ptId ')
      .leftJoin(PKMSProcessingOrderEntity, "po", "po.id = plcd.po_id")
      .leftJoin(PKMSPoLineEntity, "pl", "pl.po_id = po.id")
      .leftJoin(PKMSPoSubLineEntity, "pls", "pls.po_line_id = pl.id")
      .leftJoin(PackingSpecEntity, "ps", "ps.id = plcd.pk_spec_id")
      .leftJoin(PackTypeEntity, "pt", "pt.id = plcd.pk_type_id")
      .where(`plcd.processing_serial='${packSerial}'  AND plcd.company_code= '${companyCode}' AND plcd.unit_code = '${unitCode}'`)
      .groupBy('plcd.id')
    if (poLineId) query.andWhere(`pl.po_line = '${poLineId}'`);
    if (subLineId) query.andWhere(`pls.id = '${subLineId}'`);
    return await query.getRawMany();
  }

  // async getPackingListDataById(packListId: number): Promise<PLConfigEntity> {
  //   const query = this.configEntity
  //     .createQueryBuilder("pLConfigData")
  //     .leftJoinAndSelect("pLConfigData.pLConfigParents", "pLConfigParents")
  //     .leftJoinAndSelect("pLConfigData.po", "po")
  //     .leftJoinAndSelect("pLConfigData.pkSpecId", "spec")
  //     .leftJoinAndSelect("spec.boxMappings", "boxMappings")
  //     .leftJoinAndSelect("pLConfigData.pkTypeId", "pkTypeId")
  //     .where(`pLConfigData.Id=${packListId}`);
  //   return await query.getOne();
  // }

  async getPackingListDataById(packListId: number): Promise<PacklistQurreyDto> {
    const query = await this.configEntity.createQueryBuilder('cog')
      .select(`cog.id AS configId , cog.pl_config_no  , cog.pl_config_desc,cog.company_code,cog.unit_code, cog.quantity, cog.pk_type_id, cog.no_of_cartons,cog.pack_job_qty, cog.created_user`)
      .addSelect(`po.id AS PoId,po.processing_serial`)
      // .addSelect('po.delivery_date')
      .addSelect(`ps.id AS SpecId`)
      .addSelect('pt.pack_method')
      .leftJoin(CartonParentHierarchyEntity, 'ph', 'ph.pk_config_id = cog.id')
      .leftJoin(PKMSProcessingOrderEntity, 'po', 'po.id = cog.po_id')
      .leftJoin(PackingSpecEntity, 'ps', 'ps.id = cog.pk_spec_id')
      .leftJoin(BoxMapEntity, 'bm', 'bm.spec_id = ps.id')
      .leftJoin(PackTypeEntity, 'pt', 'pt.id = cog.pk_type_id')
      .where(`cog.id= "${packListId}"`)
      .getRawOne();
    return query;
  }




  async getPackListDetails(req: PackListIdRequest) {
    const query = await this.configEntity.createQueryBuilder('pl')
      .select(`pl.po,po.buyer_address AS destination ,pol.customer_name as buyer,po.style AS style,po.order_ref_no AS PONo,po.delivery_date,pl.company_code AS CompanyCode,Sum(pl.quantity) as quantity,po.exfactory as exfactory,GROUP_CONCAT(CONCAT(pol.style, '(', pol.product_type, ')')) as item,item.desc as ctnDmn`)
      .leftJoin(PKMSProcessingOrderEntity, 'po', 'po.id = pl.po')
      .leftJoin(PKMSPoLineEntity, 'pol', 'pol.po_order_id= pl.po')
      .leftJoin(CartonParentHierarchyEntity, 'cp', 'cp.pk_config_id=pl.id')
      .leftJoin(ItemsEntity, 'item', ' item.id=cp.item_id')
      .where(`pl.id='${req.packListId}' and pl.company_code='${req.companyCode}' and pl.unit_code='${req.unitCode}'`)
      .getRawOne()
    return query
  };

  async getBlockID() {
    const query = await this.configEntity.createQueryBuilder('pl')
      .select(`pol.destination,pol.po_order_id`)
      .leftJoin(PKMSProcessingOrderEntity, 'po', 'po.id = pl.po')
      .leftJoin(PKMSPoLineEntity, 'pol', 'pol.po_order_id= pl.po')
      .groupBy('pol.po_order_id')
      // .where(`pl.id='${req.packListId}' and pl.company_code='${req.companyCode}' and pl.unit_code='${req.unitCode}'`)
      .getRawMany()
    return query
  }

  async getPackListInfoByPackList(packListIds: number[], companyCode: string, unitCode: string): Promise<{ id: number, po_id: number, plConfigNo: string, noOfCartons: number, pk_type_id: number }[]> {
    const query = await this.configEntity.createQueryBuilder('p')
      .select(`p.id, p.po_id, p.pl_config_no as plConfigNo, p.no_of_cartons as noOfCartons, p.pk_type_id`)
      .where(`company_code='${companyCode}' and unit_code='${unitCode}'`)
      .andWhere(`id IN (:...ids)`, { ids: packListIds })
      .getRawMany()
    return query
  }


}
