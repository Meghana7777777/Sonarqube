import { Column, CreateDateColumn, DataSource, Entity, ManyToMany, ManyToOne, OneToMany, Repository } from "typeorm";
import { AbstractEntity } from "../../../database/common-entities";
import { RollSelectionTypeEnum } from '@xpparel/shared-models';
import { Injectable } from "@nestjs/common";
import { PoDocketLayEntity } from "../entity/po-docket-lay.entity";
import { PoDocketLayBundlePrintEntity } from "../entity/po-docket-lay-bundle-print.entity";

@Injectable()
export class PoDocketLayBundlePrintRepository extends Repository<PoDocketLayBundlePrintEntity> {
    constructor(private dataSource: DataSource) {
        super(PoDocketLayBundlePrintEntity, dataSource.createEntityManager());
    }


}

