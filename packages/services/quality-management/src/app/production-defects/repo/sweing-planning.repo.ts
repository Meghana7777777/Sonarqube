import { Injectable } from "@nestjs/common";
import { Repository } from "typeorm";
import { InjectRepository } from "@nestjs/typeorm";
import { SweingPlanningEntity } from "../entites/sweing-planning.entity";


@Injectable()
export class SweingPlanningRepo extends Repository<SweingPlanningEntity>{
    constructor(@InjectRepository(SweingPlanningEntity) private routesRepo: Repository<SweingPlanningEntity>
    ) {
        super(routesRepo.target, routesRepo.manager, routesRepo.queryRunner);
    }

}