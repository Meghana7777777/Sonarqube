import { Injectable } from "@nestjs/common";
import { Repository, DataSource, getRepository } from "typeorm";
import { IReasonEntity } from "../entity/i-reason.entity";


@Injectable()
export class IReasonRepo extends Repository<IReasonEntity>{
    constructor(private dataSource: DataSource) {
        super(IReasonEntity, dataSource.createEntityManager());
    }
  
   
}