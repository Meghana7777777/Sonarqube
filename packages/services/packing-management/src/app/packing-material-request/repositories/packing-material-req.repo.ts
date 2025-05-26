import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { PackMAterialRequest } from "@xpparel/shared-models";
import { Repository } from "typeorm";
import { BaseAbstractRepository } from "../../../database/common-repositories";
import { CrtnEntity } from "../../packing-list/entities/crtns.entity";
import { JobHeaderEntity } from "../../packing-list/entities/job-header.entity";
import { PLConfigEntity } from "../../packing-list/entities/pack-list.entity";
import { CartonConfigParentHierarchyRepo } from "../../packing-list/repositories/carton-config-parent-hierarchy.repo";
import { PackMaterialRequestEntity } from "../entities/material-request.entity";
import { PackingMaterialReqRepoInterface } from "./packing-material-req-repo-interface";
import { PackMaterialQueryRes } from "./query-response/pack-mat-query-res";

@Injectable()
export class PackingMaterialReqRepo extends BaseAbstractRepository<PackMaterialRequestEntity> implements PackingMaterialReqRepoInterface {

	constructor(
		@InjectRepository(PackMaterialRequestEntity)
		private readonly pmEntity: Repository<PackMaterialRequestEntity>
	) {
		super(pmEntity)
	}

	async getItemInfoForPMRNo(pmrID: number) {
		const itemsData = await this.pmEntity.createQueryBuilder('pm')
			.select('pm.id as pmd,pm.request_no as mrNo,pm.request_status as status,pm.pk_config_id,packJob.job_number,parent.item_id,parent.quantity')
			.leftJoin(PLConfigEntity, 'pl', 'pm.pk_config_id=pl.id')
			.leftJoin(JobHeaderEntity, 'packJob', 'packJob.pk_config_id=pl.id')
			.leftJoin(CrtnEntity, 'crtn', 'crtn.pk_job_id= packJob.id')
			.leftJoin(CartonConfigParentHierarchyRepo, 'parent', 'crtn.carton_proto_id=parent.id')
			.where(`pm.id=${pmrID}`)
			.groupBy(`pm.id`)
			.addGroupBy(`pm.request_status`)
		return await itemsData.getRawMany()
	}

	async getPackMaterialsByPkMrnStatus(req: PackMAterialRequest): Promise<PackMaterialQueryRes[]> {
		const statusColumn = req.mrStatus.map((rec) => String(rec))
		const query: PackMaterialQueryRes[] = await this.pmEntity.createQueryBuilder('pm')
			.select(`pm.id as req_id,pm.request_no as request_no,pm.request_status as request_status,pm.mat_request_on as mat_request_on ,pm.mat_request_by as mat_request_by,pm.mat_fulfill_date_time as mat_fulfill_date_time`)
			.leftJoin(PLConfigEntity, 'packList', 'pm.pk_config_id=packList.id')
			.where(`pm.company_code='${req.companyCode}' AND pm.unit_code='${req.unitCode}'`)
			.andWhere("request_status IN(:...statusColumn)", { statusColumn: statusColumn })
			.orderBy('pm.created_at','DESC')
			.getRawMany();
		return query
	}


}
