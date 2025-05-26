import { Injectable } from "@nestjs/common";
import { DataSource, Repository } from "typeorm";
import { DSetContainerEntity } from "../entity/d-set-container.entity";

@Injectable()
export class DSetContainerRepository extends Repository<DSetContainerEntity>{
    constructor(private dataSource:DataSource){
        super(DSetContainerEntity,dataSource.createEntityManager())
    }

}