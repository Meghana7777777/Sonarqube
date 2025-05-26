import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { BaseAbstractRepository } from "../../../database/common-repositories";
import { PackMatReqWhItemEntity } from "../entities/pack-material-req-wh-item.entity";
import { PackMatReqWhItemRepoInterface } from "./pack-material-req-wh-item.interface";

@Injectable()
export class PackMatReqWhItemRepo extends BaseAbstractRepository<PackMatReqWhItemEntity> implements PackMatReqWhItemRepoInterface {

	constructor(
		@InjectRepository(PackMatReqWhItemEntity)
		private readonly pmEntity: Repository<PackMatReqWhItemEntity>
	) {
		super(pmEntity)
	}

	 



}
