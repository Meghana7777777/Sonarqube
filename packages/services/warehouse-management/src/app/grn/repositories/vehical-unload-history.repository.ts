import { Injectable } from "@nestjs/common";
import { Repository, DataSource } from "typeorm";
import { VehicleUnloadingHistory } from "../entities/vehicle-unloading-history.entity";
import { UnloadTimeQueryResponse } from "./query-response/unload-time.query.response";



@Injectable()
export class VehicleUnloadingHisRepo extends Repository<VehicleUnloadingHistory>{
    constructor(private dataSource: DataSource) {
        super(VehicleUnloadingHistory, dataSource.createEntityManager());
    }

    /**
     * Repository to get packing list vehicle info and its status
     * @param packListId 
     * @param uniCode 
     * @param companyCode 
     * @returns 
    */
    async getGrnLoadTimeForVehicleId(phVehicleId: number): Promise<UnloadTimeQueryResponse> {
        return await this.createQueryBuilder('pl_vehicle')
            .select('unload_start_at,unload_complete_at,id')
            .addSelect((subQuery) =>subQuery
              .select('SUM(unload_spent_secs)', 'total_unload_spent_secs')
              .from(VehicleUnloadingHistory, 'subT')
              .where(`ph_vehicle_id = '${phVehicleId}'`)
          , 'spent_sec')
            .where(`ph_vehicle_id = '${phVehicleId}'`)
            .orderBy('id', 'DESC')
            // .limit(1)
            .getRawOne()
    }
}