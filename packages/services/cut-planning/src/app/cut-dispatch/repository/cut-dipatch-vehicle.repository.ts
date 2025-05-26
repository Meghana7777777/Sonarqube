
import { DataSource, Repository } from "typeorm";
import { Injectable } from "@nestjs/common";
import { CutDispatchHeaderEntity } from "../entity/cut-dispatch-header.entity";
import { CutDispatchVehicleEntity } from "../entity/cut-dispatch-vehicle.entity";

@Injectable()
export class CutDispatchVehicleRepository extends Repository<CutDispatchVehicleEntity> {
    constructor(private dataSource: DataSource) {
        super(CutDispatchVehicleEntity, dataSource.createEntityManager());
    }
}
