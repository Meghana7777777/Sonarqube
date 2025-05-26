import { Column, CreateDateColumn, DataSource, Entity, ManyToMany, ManyToOne, OneToMany, Repository } from "typeorm";
import { AbstractEntity } from "../../../database/common-entities";
import { RollSelectionTypeEnum } from '@xpparel/shared-models';
import { Injectable } from "@nestjs/common";
import { FabLevelProdNameQueryResponse } from "./query-response/fab-level-prod-name.query.response";
import { PoDocketEntity } from "../entity/po-docket.entity";
import { PoDocketGroupEntity } from "../entity/po-docket-group.entity";
import { PoDocketSerialsEntity } from "../entity/po-docket-serials.entity";
import { PoComponentSerialsEntity } from "../entity/po-component-serials.entity";

@Injectable()
export class PoComponentSerialsRepository extends Repository<PoComponentSerialsEntity> {
    constructor(private dataSource: DataSource) {
        super(PoComponentSerialsEntity, dataSource.createEntityManager());
    }


}

