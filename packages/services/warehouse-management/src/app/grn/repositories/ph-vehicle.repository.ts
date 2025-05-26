import { Injectable } from "@nestjs/common";
import { DataSource, Repository } from "typeorm";
import { PhVehicleEntity } from "../entities/ph-vehicle.entity";
import { PackListVehicleStatusResp } from "./query-response/pack-list-vehicle-status.qry.resp";
//import { groupBy } from "rxjs";
import { PackingListEntity } from "../../packing-list/entities/packing-list.entity";
import { getChartData, PackListLoadingStatus } from "@xpparel/shared-models";
import { VehicleUnloadingDetailsQryResp } from "./query-response/vehicle-unloading-details.qry.resp";

@Injectable()
export class PhVehicleRepo extends Repository<PhVehicleEntity>{
    constructor(private dataSource: DataSource) {
        super(PhVehicleEntity, dataSource.createEntityManager());
    }

    /**
     * Repository to get packing list vehicle info and its status
     * @param packListId 
     * @param uniCode 
     * @param companyCode 
     * @returns 
    */
    async getPackListVehicleInfo(packListId: number, uniCode: string, companyCode: string): Promise<PackListVehicleStatusResp> {
        return await this.createQueryBuilder('pl_vehicle')
            .select('id,vehicle_number, driver_name, in_at, out_at, unload_start_at, unload_complete_at, check_list_status, invoice_no,status, vehicle_contact')
            .where(`ph_id = '${packListId}' AND unit_code = '${uniCode}' AND company_code = '${companyCode}'`)
            .getRawOne()
    }

    async getAvgVehicleUnloadingTime() {
        const query = this.createQueryBuilder('phv')
            .select(`phv.vehicle_number AS vehicleNumber, phv.actual_unload_start_at AS unloadingStart, phv.actual_unload_complete_at AS unloadingComplete,
            SEC_TO_TIME(AVG(TIMESTAMPDIFF(SECOND, phv.actual_unload_start_at, phv.actual_unload_complete_at))) AS unloadingTime`);

        const result = await query.getRawMany();
        return result;
    }


    async getHowMuchTimeVehicleInThePlant() {
        const query = this.createQueryBuilder('phv')
            .select(`phv.vehicle_number AS vehicleNumber,
        phv.net_weight AS weight,
        phv.in_at AS entryTime,
        phv.out_at AS exitTime,
        ph.supplier_name AS supplier,
        SEC_TO_TIME(AVG(TIMESTAMPDIFF(SECOND, phv.in_at, phv.out_at))) AS avgTimeDifference,
        CURDATE() AS currentDate`)
            .leftJoin(PackingListEntity, 'ph', 'ph.id = phv.ph_id')
            .groupBy('phv.vehicle_number');
        const result = await query.getRawMany();
        return result;
    }

    async getHowManyVechicleCurrentlyUnloading() {
        const query = this.createQueryBuilder('phv')
            .select(`phv.vehicle_number AS vehicleNumber,phv.unload_start_at AS VehicleUnloading,CURDATE() AS currentDate`)
            .groupBy('phv.vehicle_number');
        const result = await query.getRawMany();
        return result;

    }

    async getNoOfVehiclesArrived() {
        const query = this.createQueryBuilder('phv')
            .select(`phv.vehicle_number AS vehicleNumber, phv.net_weight AS weight,phv.in_at AS entryTime`)
            .where('phv.in_at IS NOT NULL AND phv.unload_start_at IS NULL');
        const result = await query.getRawMany();
        return result;
    }

    async getNoOfVehiclesUnloadingInprogress() {
        const query = this.createQueryBuilder('phv')
            .select(`phv.vehicle_number AS vehicleNumber`)
            .where(`phv.unload_start_at IS NOT NULL AND phv.unload_complete_at IS NULL`);
        const result = await query.getRawMany();
        return result;
    }


    async getNoOfVehiclesToBeArrived() {
        const query = this.createQueryBuilder('phv')
            .select(`phv.vehicle_number AS vehicleNumber,plh.delivery_date AS deliveryDate`)
            .leftJoin(PackingListEntity, 'plh', 'plh.id=phv.id')
        const result = await query.getRawMany();
        return result;
    }

    async getNoOfVehiclesWaitingForUnloading() {
        const query = this.createQueryBuilder('phv')
            .select(`phv.vehicle_number AS vehicleNumber,phv.in_at AS entryTime`)
            .where(`phv.in_at IS NOT NULL AND phv.unload_start_at IS NULL`);
        const result = await query.getRawMany();
        return result;
    }

    async getNoOfvehiclesCompletedUnloading() {
        const query = this.createQueryBuilder('phv')
            .select(`phv.vehicle_number AS vehicleNumber,phv.unload_complete_at AS unloadingCompletedTime`)
            .where(`phv.unload_complete_at IS NOT NULL AND phv.out_at IS NULL`);
        const result = await query.getRawMany();
        return result;
    }



    async getNoOfVehiclesInPlant(){
        const query = this.createQueryBuilder('phv')
            .select(`COUNT(DISTINCT phv.vehicle_number) AS vehiclesInPlant`)
            .where(`phv.in_at IS NOT NULL AND phv.out_at IS NULL;`)
        const result = await query.getRawMany();
        return result
    }

    async getUnloadingCompletedNotAtSecurityCheckOutVehicles() {
        const query = this.createQueryBuilder('phv')
            .select(`COUNT(DISTINCT phv.vehicle_number) AS vehiclesCount`)
            .where(`phv.unload_complete_at IS NOT NULL AND phv.out_at IS NULL`)
        const data = await query.getRawMany();
        return data
    }

    /**
     * Repository to get vehicle arrived but unloading not started vehicle info
     * @param date 
     * @param uniCode 
     * @param companyCode 
    */
    async getVehicleArrivedButNotStartedInfo(uniCode: string, companyCode: string): Promise<VehicleUnloadingDetailsQryResp[]> {
        return await this.createQueryBuilder('phv').
        select('vehicle_number, driver_name, vehicle_contact, status, unload_start_at, unload_complete_at, unload_pause_at, unload_spent_secs, ph_id, net_weight, in_at, out_at,  SEC_TO_TIME(AVG(TIMESTAMPDIFF(SECOND, phv.in_at, phv.out_at))) AS tat_for_vehicle')
        .where(`unit_code = '${uniCode}' AND company_code = '${companyCode}' AND status = '${PackListLoadingStatus.IN}'`)
        .orderBy(`in_at`)
        .groupBy('vehicle_number, driver_name, vehicle_contact, status, unload_start_at, unload_complete_at, unload_pause_at, unload_spent_secs, ph_id, net_weight, in_at, out_at')
        .getRawMany()
    }

    /**
     * Repository to get vehicle arrived but unloading not started vehicle info
     * @param date 
     * @param uniCode 
     * @param companyCode 
    */
    async getVehicleUnloadSInProgressInfo(uniCode: string, companyCode: string): Promise<VehicleUnloadingDetailsQryResp[]> {
        return await this.createQueryBuilder('phv').
        select('vehicle_number, driver_name, vehicle_contact, status, unload_start_at, unload_complete_at, unload_pause_at, unload_spent_secs, ph_id, net_weight, in_at, out_at,  SEC_TO_TIME(AVG(TIMESTAMPDIFF(SECOND, phv.in_at, phv.out_at))) AS tat_for_vehicle')
        .where(`unit_code = '${uniCode}' AND company_code = '${companyCode}' AND (status = '${PackListLoadingStatus.UN_LOADING_START}' || status = '${PackListLoadingStatus.UN_LOADING_PAUSED}') AND out_at is NULL`)
        .groupBy('vehicle_number, driver_name, vehicle_contact, status, unload_start_at, unload_complete_at, unload_pause_at, unload_spent_secs, ph_id, net_weight, in_at, out_at')
        .orderBy(`in_at`)
        .getRawMany()
    }

    /**
     * Repository to get vehicle arrived but unloading not started vehicle info
     * @param date 
     * @param uniCode 
     * @param companyCode 
    */
    async getVehicleUnloadCompletedButNotDepartedInfo(uniCode: string, companyCode: string): Promise<VehicleUnloadingDetailsQryResp[]> {
        return await this.createQueryBuilder('phv').
        select('vehicle_number, driver_name, vehicle_contact, status, unload_start_at, unload_complete_at, unload_pause_at, unload_spent_secs, ph_id, net_weight, in_at, out_at,  SEC_TO_TIME(AVG(TIMESTAMPDIFF(SECOND, phv.in_at, phv.out_at))) AS tat_for_vehicle')
        .where(`unit_code = '${uniCode}' AND company_code = '${companyCode}' AND status = '${PackListLoadingStatus.UN_LOADING_COMPLETED}' AND out_at is NULL`)
        .groupBy('vehicle_number, driver_name, vehicle_contact, status, unload_start_at, unload_complete_at, unload_pause_at, unload_spent_secs, ph_id, net_weight, in_at, out_at')
        .orderBy(`in_at`)
        .getRawMany()
    }

    /**
     * Repository to get vehicle arrived but unloading not started vehicle info
     * @param date 
     * @param uniCode 
     * @param companyCode 
    */
    async getVehicleDepartedInfoForGivenDate(date: string, uniCode: string, companyCode: string): Promise<VehicleUnloadingDetailsQryResp[]> {
        return await this.createQueryBuilder('phv').
        select('vehicle_number, driver_name, vehicle_contact, status, unload_start_at, unload_complete_at, unload_pause_at, unload_spent_secs, ph_id, net_weight, in_at, out_at,  SEC_TO_TIME(AVG(TIMESTAMPDIFF(SECOND, phv.in_at, phv.out_at))) AS tat_for_vehicle')
        .where(`unit_code = '${uniCode}' AND company_code = '${companyCode}' AND Date(out_at) = '${date}'`)
        .groupBy('vehicle_number, driver_name, vehicle_contact, status, unload_start_at, unload_complete_at, unload_pause_at, unload_spent_secs, ph_id, net_weight, in_at, out_at')
        .orderBy(`in_at`)
        .getRawMany()
    }

    async getVehicleArrivedInfoForGivenDate(date: string, uniCode: string, companyCode: string): Promise<VehicleUnloadingDetailsQryResp[]> {
        return await this.createQueryBuilder('phv').
        select('vehicle_number, driver_name, vehicle_contact, status, unload_start_at, unload_complete_at, unload_pause_at, unload_spent_secs, ph_id, net_weight, in_at, out_at,  SEC_TO_TIME(AVG(TIMESTAMPDIFF(SECOND, phv.in_at, phv.out_at))) AS tat_for_vehicle')
        .where(`unit_code = '${uniCode}' AND company_code = '${companyCode}' AND Date(in_at) = '${date}'`)
        .groupBy('vehicle_number, driver_name, vehicle_contact, status, unload_start_at, unload_complete_at, unload_pause_at, unload_spent_secs, ph_id, net_weight, in_at, out_at')
        .orderBy(`in_at`)
        .getRawMany()
    }


    async getVehicleUnloadedInfoForGivenDate(date: string, uniCode: string, companyCode: string): Promise<VehicleUnloadingDetailsQryResp[]> {
        return await this.createQueryBuilder('phv').
        select('vehicle_number, driver_name, vehicle_contact, status, unload_start_at, unload_complete_at, unload_pause_at, unload_spent_secs, ph_id, net_weight, in_at, out_at,  SEC_TO_TIME(AVG(TIMESTAMPDIFF(SECOND, phv.in_at, phv.out_at))) AS tat_for_vehicle')
        .where(`unit_code = '${uniCode}' AND company_code = '${companyCode}' AND Date(unload_complete_at) = '${date}'`)
        .groupBy('vehicle_number, driver_name, vehicle_contact, status, unload_start_at, unload_complete_at, unload_pause_at, unload_spent_secs, ph_id, net_weight, in_at, out_at')
        .orderBy(`in_at`)
        .getRawMany()
    }

    async getVehicleActualArrivalDetailsByPhId(phId: number, uniCode: string, companyCode: string): Promise<VehicleUnloadingDetailsQryResp> {
        return await this.createQueryBuilder('phv').
        select('vehicle_number, in_at')
        .where(`ph_id = '${phId}' AND unit_code = '${uniCode}' AND company_code = '${companyCode}'`)
        .groupBy('vehicle_number, driver_name, vehicle_contact, status, unload_start_at, unload_complete_at, unload_pause_at, unload_spent_secs, ph_id, net_weight, in_at, out_at')
        .orderBy(`in_at`)
        .getRawOne()
    }

    async getVehicleArrivalInfo(uniCode: string, companyCode: string, limit : number): Promise<VehicleUnloadingDetailsQryResp[]> {
        return await this.createQueryBuilder('phv').
        select('vehicle_number, driver_name, vehicle_contact, status, unload_start_at, unload_complete_at, unload_pause_at, unload_spent_secs, ph_id, net_weight, in_at, out_at,  SEC_TO_TIME(AVG(TIMESTAMPDIFF(SECOND, phv.in_at, phv.out_at))) AS tat_for_vehicle')
        .where(`unit_code = '${uniCode}' AND company_code = '${companyCode}' AND in_at is not NULL`)
        .groupBy('vehicle_number, driver_name, vehicle_contact, status, unload_start_at, unload_complete_at, unload_pause_at, unload_spent_secs, ph_id, net_weight, in_at, out_at')
        .orderBy(`in_at`, 'DESC')
        .limit(limit)
        .getRawMany()
    }

    async getVehicleDepartInfo(uniCode: string, companyCode: string, limit : number): Promise<VehicleUnloadingDetailsQryResp[]> {
        return await this.createQueryBuilder('phv').
        select('vehicle_number, driver_name, vehicle_contact, status, unload_start_at, unload_complete_at, unload_pause_at, unload_spent_secs, ph_id, net_weight, in_at, out_at,  SEC_TO_TIME(AVG(TIMESTAMPDIFF(SECOND, phv.in_at, phv.out_at))) AS tat_for_vehicle')
        .where(`unit_code = '${uniCode}' AND company_code = '${companyCode}' AND out_at is not NULL`)
        .groupBy('vehicle_number, driver_name, vehicle_contact, status, unload_start_at, unload_complete_at, unload_pause_at, unload_spent_secs, ph_id, net_weight, in_at, out_at')
        .orderBy(`out_at`, 'DESC')
        .limit(limit)
        .getRawMany()
    }

    async getInAtCount(fromDate:string , toDate:string ,groupinfo : string):Promise<getChartData[]> {

        let dateFormat: string;

  // Dynamically set the date format based on the group value
  switch (groupinfo) {
    case 'day':
      dateFormat = 'DATE(vehicle.inAt)';
      break;
    case 'week':
      dateFormat = 'WEEK(vehicle.inAt)'; // MySQL uses WEEK()
      break;
    case 'month':
      dateFormat = 'MONTH(vehicle.inAt)';
      break;
    case 'year':
      dateFormat = 'YEAR(vehicle.inAt)';
      break;
    default:
      throw new Error('Invalid group option');
  }
      
        const queryBuilder = await this
          .createQueryBuilder('vehicle')
          .select(`${dateFormat}`, 'deliveryDate')
          .addSelect('COUNT(*)', 'count')
          .where(`date(in_at) between '${fromDate}' and '${toDate}'`)
          .groupBy(`${dateFormat}`)

          
          console.log(queryBuilder.getSql());
          const result = await queryBuilder.getRawMany();
      
        return result;
      }

      async getCountOfInAndOutVehicleStatus(phIds:number[]):Promise<{count_in :number, count_out : number , count_other : number }> {
        const result = await this
        .createQueryBuilder('ph')
        .select([
            // Count for 'IN' status
            'COUNT(CASE WHEN ph.STATUS = :statusIn THEN 1 END) AS count_in',
            // Count for 'OUT' status
            'COUNT(CASE WHEN ph.STATUS = :statusOut THEN 1 END) AS count_out',
            'COUNT(CASE WHEN ph.STATUS NOT IN (:statusIn, :statusOut) THEN 1 END) AS count_other'
        ])
        .setParameters({
            statusIn: 'IN',
            statusOut: 'OUT',
        })
        .getRawOne(); // getRawOne() returns the raw result from the query
        return result;
      }
}