import { Column, CreateDateColumn, DataSource, Entity, ManyToMany, ManyToOne, OneToMany, Repository } from "typeorm";
import { Injectable } from "@nestjs/common";
import { ShiftEntity } from "../entity/shift.entity";

@Injectable()
export class ShiftRepository extends Repository<ShiftEntity> {
    constructor(private dataSource: DataSource) {
        super(ShiftEntity, dataSource.createEntityManager());
    }

}

