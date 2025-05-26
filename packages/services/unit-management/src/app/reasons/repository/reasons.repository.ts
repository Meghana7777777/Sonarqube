import { Column, CreateDateColumn, DataSource, Entity, ManyToMany, ManyToOne, OneToMany, Repository } from "typeorm";
import { RollSelectionTypeEnum } from '@xpparel/shared-models';
import { Injectable } from "@nestjs/common";
import { ReasonsEntity } from "../entity/reasons.entity";

@Injectable()
export class ReasonsRepository extends Repository<ReasonsEntity> {
    constructor(private dataSource: DataSource) {
        super(ReasonsEntity, dataSource.createEntityManager());
    }

    async getAllActiveReasons(): Promise<any> {
        try {
            const query = await this.createQueryBuilder("reasons")
                .select([
                    "reasons.id as id",
                    "reasons.reasonName as reasonName",
                    "reasons.reasonCode",
                    "reasons.reasonDesc",
                    "reasons.reasonCategory"
                ])
                .groupBy("reasons.reasonName")
                .getRawMany();
            return query
        } catch (err) {
            console.error(err);
        }
    }

}

