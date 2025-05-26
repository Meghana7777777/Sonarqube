import { Column, CreateDateColumn, DataSource, Entity, ManyToMany, ManyToOne, OneToMany, Repository } from "typeorm";
import { Injectable } from "@nestjs/common";
import { PoMarkerEntity } from "../entity/po-marker.entity";

@Injectable()
export class PoMarkerRepository extends Repository<PoMarkerEntity> {
    constructor(private dataSource: DataSource) {
        super(PoMarkerEntity, dataSource.createEntityManager());
    }

    async getMaxClubMarkerCode(poSerial: number, companyCode: string, unitCode: string): Promise<number> {
        const result: {club_code: number} = await this.createQueryBuilder('m')
        .select(` IF( MAX(club_marker_code), MAX(club_marker_code), 0) as club_code `)
        .where(` po_serial = ${poSerial} AND company_code = '${companyCode}' AND unit_code = '${unitCode}' `)
        .getRawOne();
        return Number(result.club_code);
    }
}
