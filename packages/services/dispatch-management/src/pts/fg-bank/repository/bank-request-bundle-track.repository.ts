
import { DataSource, Repository } from "typeorm";
import { Injectable } from "@nestjs/common";
import { BankRequestBundleTrackEntity } from "../entity/bank-request-bundle-track.entity";

@Injectable()
export class BankRequestBundleTrackRepository extends Repository<BankRequestBundleTrackEntity> {
    constructor(private dataSource: DataSource) {
        super(BankRequestBundleTrackEntity, dataSource.createEntityManager());
    }
}

