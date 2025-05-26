import { Column, CreateDateColumn, DataSource, Entity, ManyToMany, ManyToOne, OneToMany, Repository } from "typeorm";
import { RollSelectionTypeEnum } from '@xpparel/shared-models';
import { Injectable } from "@nestjs/common";
import { PoDocketGroupEntity } from "../entity/po-docket-group.entity";


@Injectable()
export class RemarksPoDocketRepository extends Repository<PoDocketGroupEntity> {
    constructor(private dataSource: DataSource) {
        super(PoDocketGroupEntity, dataSource.createEntityManager());
    }

}

