import { Column, CreateDateColumn, DataSource, Entity, ManyToMany, ManyToOne, OneToMany, Repository } from "typeorm";
import { AbstractEntity } from "../../../database/common-entities";
import { RollSelectionTypeEnum } from '@xpparel/shared-models';
import { Injectable } from "@nestjs/common";
import { PoRatioEntity } from "../entity/po-ratio.entity";
import { PoRatioLineEntity } from "../entity/po-ratio-line.entity";
import { PoRatioSizeEntity } from "../entity/po-ratio-size.entity";

@Injectable()
export class PoRatioSizeRepository extends Repository<PoRatioSizeEntity> {
    constructor(private dataSource: DataSource) {
        super(PoRatioSizeEntity, dataSource.createEntityManager());
    }

}
