import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { CartonIdsRequest, PackInspectionStatusEnum, PackingListIdRequest, PackingStatusEnum } from "@xpparel/shared-models";
import { BaseAbstractRepository } from "packages/services/packing-management/src/database/common-repositories";
import { Repository } from "typeorm";
import { ItemDimensionsEntity } from "../../__masters__/items/entities/item-dimensions.entity";
import { ItemsEntity } from "../../__masters__/items/entities/items.entity";
import { CartonParentHierarchyEntity } from "../entities/carton-config-parent-hierarchy.entity";
import { ConfigLeastAggregatorEntity } from "../entities/config-least-aggregator.entity";
import { CrtnEntity } from "../entities/crtns.entity";
import { JobHeaderEntity } from "../entities/job-header.entity";
import { CartonRepoInterFace } from "./carton-repo-interface";
import { CartonItemsQueryRes, PolyBagItemsQueryRes } from "./query-response/carton-items-query.res";
import { CrtnDataRes } from "./query-response/crtn-data-query.res";


@Injectable()
export class CartonRepo extends BaseAbstractRepository<CrtnEntity> implements CartonRepoInterFace {
    constructor(
        @InjectRepository(CrtnEntity)
        private readonly cartonEntity: Repository<CrtnEntity>,
    ) {
        super(cartonEntity);
    }


    async getCartonItemsDataOfPackJob(packJobId: number): Promise<CartonItemsQueryRes[]> {
        const query = this.cartonEntity
            .createQueryBuilder("crtn")
            .select(`crtn.carton_proto_id,carton_proto.item_id,item.code as item_code,item.category`)
            .leftJoin(CartonParentHierarchyEntity, 'carton_proto', 'carton_proto.company_code = crtn.company_code AND carton_proto.unit_code = crtn.unit_code AND carton_proto.id = crtn.carton_proto_id')
            .leftJoin(ItemsEntity, 'item', 'item.company_code = crtn.company_code AND item.unit_code = crtn.unit_code AND item.id = carton_proto.item_id')
            .where(`crtn.pk_job_id='${packJobId}'`)
            .groupBy('carton_proto.item_id')
        return await query.getRawMany();
    }

    async getDistinctItemsForPackJob(packJobId: number[],plantCode:string,unitCode:string): Promise<string[]> {
        const data: { itemCodes: string } = await this.cartonEntity
            .createQueryBuilder("crtn")
            .select(`group_concat(distinct tem.code) as itemCodes`)
            .leftJoin(CartonParentHierarchyEntity, 'carton_proto', 'carton_proto.company_code = crtn.company_code AND carton_proto.unit_code = crtn.unit_code AND carton_proto.id = crtn.carton_proto_id')
            .leftJoin(ItemsEntity, 'item', 'item.company_code = crtn.company_code AND item.unit_code = crtn.unit_code AND item.id = carton_proto.item_id')
            .where(`crtn.pk_job_id IN (${packJobId})`)
            .andWhere(`crtn.company_code = '${plantCode}'`)
            .andWhere(`crtn.unit_code = '${unitCode}'`)
            .getRawOne();
        return data?.itemCodes ? data.itemCodes.split(',') : [];
    }

    async getPolyItemsDataOfPackJob(packJobId: number, cartonProtoId: number): Promise<PolyBagItemsQueryRes[]> {
        const query = this.cartonEntity
            .createQueryBuilder("crtn")
            .select(`crtn.carton_proto_id,poly_bag.item_id,item.code as item_code,item.category,poly_bag.count`)
            .leftJoin(CartonParentHierarchyEntity, 'carton_proto', 'carton_proto.company_code = crtn.company_code AND carton_proto.unit_code = crtn.unit_code AND carton_proto.id = crtn.carton_proto_id')
            .leftJoin(ConfigLeastAggregatorEntity, 'poly_bag', 'poly_bag.company_code = crtn.company_code AND poly_bag.unit_code = crtn.unit_code AND poly_bag.parent_hierarchy_id = crtn.carton_proto_id')
            .leftJoin(ItemsEntity, 'item', 'item.company_code = crtn.company_code AND item.unit_code = crtn.unit_code AND item.id = poly_bag.item_id')
            .where(`crtn.pk_job_id='${packJobId}' and carton_proto_id='${cartonProtoId}'`)
            .groupBy('poly_bag.item_id')
        return await query.getRawMany();
    }

    async getCartonDataForInspection(packListID: number): Promise<CrtnDataRes[]> {
        const query = this.cartonEntity.createQueryBuilder('crtn')
            .select(`crtn.pk_config_id,crtn.pk_job_id,crtn.carton_proto_id,packJob.job_number as pack_job_no ,crtn.barcode,items.code as item_code,items.desc as item_desc,crtn.required_qty as required_qty,box.length as length,box.width as width,box.height as height ,crtn.delivery_date as deliver_date,crtn.exfactory as ex_factory,crtn.style as style,crtn.inspection_pick`)
            // .addSelect(`crtn.buyer_address as buyer_address`)
            .leftJoin(JobHeaderEntity, 'packJob', 'packJob.id=crtn.pk_job_id')
            .leftJoin(CartonParentHierarchyEntity, 'parent', 'parent.id=crtn.carton_proto_id')
            .leftJoin(ItemsEntity, 'items', 'items.id=parent.`item_id`')
            .leftJoin(ItemDimensionsEntity, 'box', 'box.id=items.`dimensions_id`')
            .where(`crtn.pk_config_id='${packListID}'`)
        // .andWhere(`crtn.inspection_status ='${PackInspectionStatusEnum.OPEN}'`)
        return await query.getRawMany()
    }

    async getGroupedProtoTypeIds(cartonId: number[], companyCode: string, unitCode: string) {
        const query = await this.cartonEntity.createQueryBuilder()
            .select(`GROUP_CONCAT(DISTINCT carton_proto_id) as cartonProtoId`)
            .where(`company_code = "${companyCode}" and unit_code = "${unitCode}"`)
            .andWhereInIds(cartonId)
            .getRawOne()
        return query.cartonProtoId?.split(',')
    }


}