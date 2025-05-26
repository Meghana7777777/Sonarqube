import { Injectable } from "@nestjs/common";
import { BaseAbstractRepository } from "packages/services/packing-management/src/database/common-repositories";
import { BoxMapEntity } from "../entities/box-map.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { BoxMapEntityRepoInterface } from "./box-map-repo-interface";

@Injectable()
export class BoxMapRepo extends BaseAbstractRepository<BoxMapEntity> implements BoxMapEntityRepoInterface
{
  constructor(
    @InjectRepository(BoxMapEntity)
    private readonly  bmEntity: Repository<BoxMapEntity>,
  ) {
    super(bmEntity);
  }
}