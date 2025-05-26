import { Injectable } from "@nestjs/common";
import { Repository, DataSource } from "typeorm";
import { TrayRollMapHistoryEntity } from "../entities/tray-roll-map-history.entity";
import { TrayRollMapEntity } from "../entities/tray-roll-map.entity";
import { TrayAndTrolleyCodeQueryResponse } from "./query-reponse/tray-and-trolley-query.response";
import { LTrayEntity } from "../../master-data/entities/l-tray.entity";
import { LTrolleyEntity } from "../../master-data/entities/l-trolly.entity";
import { TrayTrolleyMapEntity } from "../entities/tray-trolley-map.entity";

@Injectable()
export class TrayRollMapRepo extends Repository<TrayRollMapEntity>{

    constructor(dataSource: DataSource) {
        super(TrayRollMapEntity, dataSource.createEntityManager());
    }

    async getTrayAndTrolleyCodeforRollsIds(companyCode: string, unitCode: string, rollIds: number[]): Promise<TrayAndTrolleyCodeQueryResponse[]> {
        const query = this.createQueryBuilder('tr')
        .select('tr.item_lines_id, tray.id as tray_id, tray.name as tray_name, tray.code as tray_code, tray.barcode as tray_barcode, trolley.id as trolley_id, trolley.name as trolley_name, trolley.code as trolley_code,trolley.barcode as trolley_barcode')
        .leftJoin(LTrayEntity, 'tray', 'tray.id= tr.confirmed_tray_id and tr.company_code = tray.company_code AND tr.unit_code = tray.unit_code and tr.is_active = tray.is_active')        
        .leftJoin(TrayTrolleyMapEntity, 'tt', 'tr.company_code = tt.company_code AND tr.unit_code = tt.unit_code  and tr.is_active = tt.is_active AND tr.confirmed_tray_id = tt.tray_id')        
        .leftJoin(LTrolleyEntity, 'trolley', 'tt.company_code = trolley.company_code AND tt.unit_code = trolley.unit_code and tt.is_active = trolley.is_active AND trolley.id= tt.confirmed_trolley_id')
        .where(`tr.company_code = '${companyCode}' AND tr.unit_code = '${unitCode}' AND tr.item_lines_id IN (:...rollIds)`, { rollIds: rollIds});
        return await query.getRawMany();
    }

}   