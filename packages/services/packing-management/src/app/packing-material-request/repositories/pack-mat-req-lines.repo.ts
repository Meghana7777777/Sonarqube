import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { PackMatReqID } from "@xpparel/shared-models";
import { Repository } from "typeorm";
import { BaseAbstractRepository } from "../../../database/common-repositories";
import { ItemsEntity } from "../../__masters__/items/entities/items.entity";
import { JobHeaderEntity } from "../../packing-list/entities/job-header.entity";
import { PackMatReqLinesEntity } from "../entities/pack-mat-req-lines.entity";
import { PackMatReqLinesRepoInterface } from "./pack-mat-req-lines.interface";
import { PackMtSummaryRes } from "./query-response/pack-mat-sum-res";

@Injectable()
export class PackMatReqLinesRepo extends BaseAbstractRepository<PackMatReqLinesEntity> implements PackMatReqLinesRepoInterface {

	constructor(
		@InjectRepository(PackMatReqLinesEntity)
		private readonly pmEntity: Repository<PackMatReqLinesEntity>
	) {
		super(pmEntity)
	}

	async getPackMaterialSummaryDataById(req: PackMatReqID): Promise<PackMtSummaryRes[]> {
		const query: PackMtSummaryRes[] = await this.pmEntity.createQueryBuilder('pack_mat')
			.select(`GROUP_CONCAT(packJob.job_number) as pack_jobs ,item.category as item_category,item.code as item_code,pack_mat.pk_job_id,pack_mat.pk_mat_req_id,pack_mat.pm_m_items_id as item_id,pack_mat.id,sum(pack_mat.required_qty) as qty,pack_mat.id as map_id,SUM(pack_mat.issued_qty) as issued_qty`)
			.leftJoin(JobHeaderEntity, 'packJob', 'pack_mat.pk_job_id=packJob.id')
			.leftJoin(ItemsEntity, 'item', 'item.id=pack_mat.pm_m_items_id')
			.where(`pack_mat.company_code='${req.companyCode}' AND pack_mat.unit_code='${req.unitCode}'`)
			.andWhere(`pack_mat.pk_mat_req_id IN(${req.mrnID})`)
			.groupBy(`pack_mat.pm_m_items_id`)
			.getRawMany()
		return query
	}

	 



}
