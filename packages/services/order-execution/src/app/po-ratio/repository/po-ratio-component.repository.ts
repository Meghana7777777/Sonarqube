import { Column, CreateDateColumn, DataSource, Entity, ManyToMany, ManyToOne, OneToMany, Repository } from "typeorm";
import { AbstractEntity } from "../../../database/common-entities";
import { RollSelectionTypeEnum } from '@xpparel/shared-models';
import { Injectable } from "@nestjs/common";
import { PoRatioEntity } from "../entity/po-ratio.entity";
import { PoRatioLineEntity } from "../entity/po-ratio-line.entity";
import { PoRatioSizeEntity } from "../entity/po-ratio-size.entity";
import { PoRatioComponentEntity } from "../entity/po-ratio-component.entity";

@Injectable()
export class PoRatioComponentRepository extends Repository<PoRatioComponentEntity> {
    constructor(private dataSource: DataSource) {
        super(PoRatioComponentEntity, dataSource.createEntityManager());
    }

}
