import { Column, CreateDateColumn, DataSource, Entity, ManyToMany, ManyToOne, OneToMany, Repository } from "typeorm";
import { AbstractEntity } from "../../../database/common-entities";
import { RollSelectionTypeEnum } from '@xpparel/shared-models';
import { Injectable } from "@nestjs/common";
import { PoDocketGenOrderEntity } from "../entity/po-docket-gen-order.entity";

@Injectable()
export class PoDocketGenOrderRepository extends Repository<PoDocketGenOrderEntity> {
    constructor(private dataSource: DataSource) {
        super(PoDocketGenOrderEntity, dataSource.createEntityManager());
    }

}
