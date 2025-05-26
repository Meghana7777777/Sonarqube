import { Column, CreateDateColumn, DataSource, Entity, ManyToMany, ManyToOne, OneToMany, Repository } from "typeorm";
import { Injectable } from "@nestjs/common";
import { ActualMarkerEntity } from "../entity/actual-marker.entity";

@Injectable()
export class ActualMarkerRepository extends Repository<ActualMarkerEntity> {
    constructor(private dataSource: DataSource) {
        super(ActualMarkerEntity, dataSource.createEntityManager());
    }


}

