import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { BaseAbstractRepository } from "../../../database/common-repositories";
import { PackWhJobMaterialIssuanceEntity } from "../entities/pack-wh-job-material-issuance.entity";
import { PackWhJobMaterialIssuanceRepoInterface } from "./pack-wh-job-material-issuance.interface";

@Injectable()
export class PackWhJobMaterialIssuanceRepo extends BaseAbstractRepository<PackWhJobMaterialIssuanceEntity> implements PackWhJobMaterialIssuanceRepoInterface {

	constructor(
		@InjectRepository(PackWhJobMaterialIssuanceEntity)
		private readonly pmEntity: Repository<PackWhJobMaterialIssuanceEntity>
	) {
		super(pmEntity)
	}

	 



}
