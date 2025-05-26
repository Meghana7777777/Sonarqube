

import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { BaseAbstractRepository } from "packages/services/packing-management/src/database/common-repositories";
import { Repository } from "typeorm";
import { CartonJobReqAttributeRepoInterFace } from "./carton-attribute-repo-interface";
import { CartonTemplateAttributesEntity } from "../entities/carton-template-attributes.entity";


@Injectable()
export class CartonReqAttributeRepo extends BaseAbstractRepository<CartonTemplateAttributesEntity> implements CartonJobReqAttributeRepoInterFace {
    constructor(
        @InjectRepository(CartonTemplateAttributesEntity)
        private readonly cartonAttribute: Repository<CartonTemplateAttributesEntity>,
    ) {
        super(cartonAttribute);
    }

}