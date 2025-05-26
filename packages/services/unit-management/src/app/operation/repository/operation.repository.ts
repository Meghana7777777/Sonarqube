import { Injectable } from "@nestjs/common";
import { DataSource, Repository } from "typeorm";
import { OperationEntity } from "../entity/operation.entity";

@Injectable()
export class OperationRepository extends Repository<OperationEntity> {
    constructor(private dataSource: DataSource) {
        super(OperationEntity, dataSource.createEntityManager());
    }

    async getAllActiveOperations(): Promise<any> {
        try {
            const query = await this.createQueryBuilder("operation")
                .select([
                    "operation.id as id",
                    "operation.iOpCode",
                    "operation.eOpCode",
                    "operation.opName as opName",
                    "operation.opCategory",
                    "operation.opForm"
                ])
                .groupBy("operation.opName")
                .getRawMany();

            return query;
        } catch (err) {
            console.error(err);
        }
    }


}

