import { Column, CreateDateColumn, DataSource, Entity, ManyToMany, ManyToOne, OneToMany, Repository } from "typeorm";
import { AbstractEntity } from "../../../database/common-entities";
import { RollSelectionTypeEnum } from '@xpparel/shared-models';
import { Injectable } from "@nestjs/common";
import { FabLevelProdNameQueryResponse } from "./query-response/fab-level-prod-name.query.response";
import { PoDocketEntity } from "../entity/po-docket.entity";
import { PoDocketGroupEntity } from "../entity/po-docket-group.entity";
import { PoDocketAttrEntity } from "../entity/po-docket-attr.entity";

@Injectable()
export class PoDocketAttrRepository extends Repository<PoDocketAttrEntity> {
    constructor(private dataSource: DataSource) {
        super(PoDocketAttrEntity, dataSource.createEntityManager());
    }


}

