import { Injectable } from "@nestjs/common";
import { DataSource, Repository } from "typeorm";
import { PKMSPoSubLineEntity } from "../../pkms-po-entities/pkms-po-sub-line-entity";
import { BaseAbstractRepository } from "packages/services/packing-management/src/database/common-repositories";
import { PKMSPoSubLineRepoInterface } from "../interfaces/pkms-po-subline.repo.interface";
import { InjectRepository } from "@nestjs/typeorm";
import { ConfigLeastChildEntity } from "../../../packing-list/entities/config-least-child.entity";
import { CartonParentHierarchyEntity } from "../../../packing-list/entities/carton-config-parent-hierarchy.entity";
import { ConfigLeastAggregatorEntity } from "../../../packing-list/entities/config-least-aggregator.entity";
import { PLSubLineQtyModel } from "@xpparel/shared-models";
import { ProductRefQryRes } from "../query-types/product-ref.qry.res";
import { ProductRefFgColorQryRes } from "../query-types/product-ref-fg-color.qry.res";

@Injectable()
export class PKMSPoSubLineRepository extends BaseAbstractRepository<PKMSPoSubLineEntity> implements PKMSPoSubLineRepoInterface {
    constructor(
        @InjectRepository(PKMSPoSubLineEntity)
        private readonly poSubLineEntity: Repository<PKMSPoSubLineEntity>,
        private readonly dataSource: DataSource
    ) {
        super(poSubLineEntity);
    }


    async getPoSizeWiseQtys(pOrderId: number): Promise<any[]> {
        return await this.poSubLineEntity.createQueryBuilder('sl')
            .select('size, quantity')
            .where(`pOrderId = ${pOrderId}`)
            .getRawMany();
    }

    async getPlGenQty(companyCode: string, unitCode: string, subLineId: number): Promise<{ qty: number; }> {
        const query: { qty: number } = await this.dataSource.getRepository(ConfigLeastChildEntity).createQueryBuilder('fgRatios')
            .select(`sum(fgRatios.ratio*carton_proto.count*poly_bag.count) as qty`)
            .leftJoin(PKMSPoSubLineEntity, 'sub_po', 'sub_po.company_code = fgRatios.company_code AND sub_po.unit_code = fgRatios.unit_code AND sub_po.id = fgRatios.po_order_sub_line_id')
            .leftJoin(CartonParentHierarchyEntity, 'carton_proto', 'carton_proto.company_code = fgRatios.company_code AND carton_proto.unit_code = fgRatios.unit_code AND carton_proto.id = fgRatios.parent_hierarchy_id')
            .leftJoin(ConfigLeastAggregatorEntity, 'poly_bag', 'poly_bag.company_code = fgRatios.company_code AND poly_bag.unit_code = fgRatios.unit_code AND poly_bag.id = fgRatios.least_aggregator_id')
            .where(`fgRatios.company_code = '${companyCode}' AND fgRatios.unit_code = '${unitCode}' AND fgRatios.po_order_sub_line_id ='${subLineId}'`)
            .groupBy(`fgRatios.po_order_sub_line_id`)
            .getRawOne();
            
        return query;
    }

    async getSubLinesByPoLineIdAndProductColor(poLineId: number,productCode: string,fgColor: string, unitCode: string, companyCode: string): Promise<PLSubLineQtyModel[]> {
        const query = await this.poSubLineEntity.createQueryBuilder()
            .select(`id,size,quantity as qty`)
            .where(`po_line_id = "${poLineId}"`)
            .andWhere(`company_code = "${companyCode}" AND unit_code = "${unitCode}"`)
            .andWhere(`product_code = "${productCode}"`)
            .andWhere(`fg_color = "${fgColor}"`)
            .getRawMany()
        const data = [];
        for (const rec of query) {
            const plGenQtyQUery = await this.getPlGenQty(companyCode, unitCode, rec.id);            
            const plGenQty = plGenQtyQUery ? Number(plGenQtyQUery?.qty) : 0
            const additionQty = plGenQty - Number(rec.qty);
            data.push(new PLSubLineQtyModel(rec.id, rec.size, rec.qty, plGenQty, additionQty > 0 ? additionQty : 0))
        }
        return data

    }

    async getDistinctProductsForPoLine(processingSerial: number, poLineId: number, companyCode: string, unitCode: string): Promise<ProductRefQryRes[]> {
        return await this.poSubLineEntity.createQueryBuilder('psl')
            .select('DISTINCT psl.product_ref  as productRef,psl.product_code as productCode,psl.product_name as productName,psl.product_type as productType')
            .where('psl.processing_serial = :processingSerial', { processingSerial })
            .andWhere('psl.po_line_id = :poLineId', { poLineId })
            .andWhere('psl.company_code = :companyCode', { companyCode })
            .andWhere('psl.unit_code = :unitCode', { unitCode })
            .getRawMany();

    }

    async getDistinctColorProductsForPoLine(processingSerial: number, poLineId: number, companyCode: string, unitCode: string): Promise<ProductRefFgColorQryRes[]> {
        return await this.poSubLineEntity.createQueryBuilder('psl')
            .select('psl.fg_color as fgColor,psl.product_ref  as productRef,psl.product_code as productCode,psl.product_name as productName,psl.product_type as productType')
            .where('psl.processing_serial = :processingSerial', { processingSerial })
            .andWhere('psl.po_line_id = :poLineId', { poLineId })
            .andWhere('psl.company_code = :companyCode', { companyCode })
            .andWhere('psl.unit_code = :unitCode', { unitCode })
            .groupBy('psl.product_ref,psl.fg_color')
            .getRawMany();

    }

    async getAlreadyCreatedSubLineIdQty(companyCode: string, unitCode: string, moProductSubLineId: number): Promise<{ qty: number; }> {
        const { qty } = await this.poSubLineEntity.createQueryBuilder('line')
            .select('SUM(line.quantity)', 'sum')
            .where('line.moProductSubLineId = :moProductSubLineId', { moProductSubLineId })
            .andWhere('line.unitCode = :unitCode', { unitCode })
            .andWhere('line.companyCode = :companyCode', { companyCode })
            .getRawOne();
            return { qty }
    }

}