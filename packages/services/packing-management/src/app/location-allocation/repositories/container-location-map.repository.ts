import { Injectable } from "@nestjs/common";
import { FgContainerLocationStatusEnum, PackLinesObjectTypeEnum, PhItemLinesObjectTypeEnum } from "@xpparel/shared-models";
import { DataSource, Repository } from "typeorm";
import { FGContainerCartonMapEntity } from "../entities/container-carton-map.entity";
import { FGContainerLocationMapEntity } from "../entities/container-location-map.entity";
import { LocationRelatedDataQryResp } from "./query-response.ts/location-related-data.response";
import { CrtnEntity } from "../../packing-list/entities/crtns.entity";

@Injectable()
export class ContainerLocationMapRepo extends Repository<FGContainerLocationMapEntity> {

    constructor(dataSource: DataSource) {
        super(FGContainerLocationMapEntity, dataSource.createEntityManager());
    }

    async getConfirmedLocationIdsForContainerIds(companyCode: string, unitCode: string, containerIds: number[]): Promise<number[]> {
        const query = this.createQueryBuilder('p')
            .select('DISTINCT confirmed_location_id')
            .where(` company_code = '${companyCode}' AND unit_code = '${unitCode}' AND status = '${FgContainerLocationStatusEnum.CONFIRMED}' AND container_id IN(:...containers)`, { containers: containerIds });
        const result: { confirmed_location_id: number }[] = await query.getRawMany();
        const locationIds: number[] = [];
        result.forEach(r => {
            locationIds.push(r.confirmed_location_id);
        });
        return locationIds;
    }

    async getSuggestedLocationIdsForContainerIds(companyCode: string, unitCode: string, containerIds: number[]): Promise<number[]> {
        const query = this.createQueryBuilder('p')
            .select('DISTINCT suggested_location_id')
            .where(` company_code = '${companyCode}' AND unit_code = '${unitCode}' AND status = '${FgContainerLocationStatusEnum.OPEN}' AND container_id IN(:...containers)`, { containers: containerIds });
        const result: { suggested_location_id: number }[] = await query.getRawMany();
        const locationIds: number[] = [];
        result.forEach(r => {
            locationIds.push(r.suggested_location_id);
        });
        return locationIds;
    }

    async getConfirmedContainerIdsForLocationIds(companyCode: string, unitCode: string, locationIds: number[]): Promise<number[]> {
        const query = this.createQueryBuilder('p')
            .select('DISTINCT container_id')
            .where(` company_code = '${companyCode}' AND unit_code = '${unitCode}' AND status = '${FgContainerLocationStatusEnum.CONFIRMED}' AND is_active = true AND confirmed_location_id IN(:...locationIds)`, { locationIds: locationIds });
        const result: { container_id: number }[] = await query.getRawMany();
        const container_ids: number[] = [];
        result.forEach(r => {
            container_ids.push(r.container_id);
        });
        return container_ids;
    }

    async getSuggestedContainerIdsForLocationIds(companyCode: string, unitCode: string, locationIds: number[]): Promise<number[]> {
        const query = this.createQueryBuilder('p')
            .select('DISTINCT container_id')
            .where(` company_code = '${companyCode}' AND unit_code = '${unitCode}' AND status = '${FgContainerLocationStatusEnum.OPEN}' AND is_active = true AND suggested_location_id IN(:...locationIds)`, { locationIds: locationIds });
        const result: { container_id: number }[] = await query.getRawMany();
        const container_ids: number[] = [];
        result.forEach(r => {
            container_ids.push(r.container_id);
        });
        return container_ids;
    }


    async getContainersCountByLocationIds(locationIds: number[], companyCode: string, unitCode: string): Promise<number[]> {
        const query = this.createQueryBuilder('p')
            .select('DISTINCT container_id')
            .where(` company_code = '${companyCode}' AND unit_code = '${unitCode}' AND is_active = true AND is_active = true AND confirmed_location_id IN(:...locationIds)`, { locationIds: locationIds });
        const result: { container_id: number }[] = await query.getRawMany();
        const container_ids: number[] = [];
        result.forEach(r => {
            container_ids.push(r.container_id);
        });
        return container_ids;
    }

    async getSupportedContainersCountByLocationIds(locationIds: number[], companyCode: string, unitCode: string): Promise<number[]> {
        const query = this.createQueryBuilder('p')
            .select('DISTINCT container_id')
            .where(` company_code = '${companyCode}' AND unit_code = '${unitCode}' AND is_active = true AND is_active = true AND confirmed_location_id IN(:...locationIds)`, { locationIds: locationIds });
        const result: { container_id: number }[] = await query.getRawMany();
        const container_ids: number[] = [];
        result.forEach(r => {
            container_ids.push(r.container_id);
        });
        return container_ids;
    }

    async getTotalAndEmptyContainerCountForLocationIds(locationIds: number[], companyCode: string, unitCode: string): Promise<LocationRelatedDataQryResp[]> {
        const query = await this.createQueryBuilder('p')
            .select([
                'p.confirmed_location_id AS id',
                'SUM(CASE WHEN container_location.item_lines_id IS NULL THEN 1 ELSE 0 END) AS empty_containers',
                'COUNT(DISTINCT p.container_id) AS total_containers',
                'COUNT(DISTINCT container_location.item_lines_id) AS no_of_cartons_in_location',
                'COUNT(IF(ph_item_lines.inspection_status = \'OPEN\', 1, NULL)) AS count_open',
                'COUNT(IF(ph_item_lines.inspection_status = \'INPROGRESS\', 1, NULL)) AS count_inprogress',
                'COUNT(IF(ph_item_lines.inspection_status = \'COMPLETED\', 1, NULL)) AS count_completed',

                'SUM(IF(ph_item_lines.inspection_status = \'OPEN\', ph_item_lines.required_qty, 0)) AS total_sQuantity_open',
                'SUM(IF(ph_item_lines.inspection_status = \'INPROGRESS\', ph_item_lines.required_qty, 0)) AS total_sQuantity_inprogress',
                'SUM(IF(ph_item_lines.inspection_status = \'COMPLETED\', ph_item_lines.required_qty, 0)) AS total_sQuantity_completed',

                'SUM(IF(ph_item_lines.inspection_status = \'OPEN\', ph_item_lines.completed_qty, 0)) AS total_allocatedQty_open',
                'SUM(IF(ph_item_lines.inspection_status = \'INPROGRESS\', ph_item_lines.completed_qty, 0)) AS total_allocatedQty_inprogress',
                'SUM(IF(ph_item_lines.inspection_status = \'COMPLETED\', ph_item_lines.completed_qty, 0)) AS total_allocatedQty_completed',

                'COUNT(IF(ph_item_lines.status = \'DONE\', 1, NULL)) AS grn_completed_cartons_count',
                'COUNT(IF(ph_item_lines.status = \'OPEN\', 1, NULL)) AS grn_pending_cartons_count',

                'SUM(IF(ph_item_lines.status = \'DONE\', ph_item_lines.required_qty, 0)) AS grn_completed_length',
                'SUM(IF(ph_item_lines.status = \'OPEN\', ph_item_lines.required_qty, 0)) AS grn_pending_length',

                // 'SUM(allocated_quantity) as allocated_qty',
                // 'SUM(issued_quantity) as issued_qty',
                // 'COUNT(IF(ph_item_lines.allocated_quantity > 0, 1, 0)) AS allocated_cartons',
                // 'COUNT(IF(ph_item_lines.issued_quantity > 0, 1, 0)) AS issued_cartons',


                // 'GROUP_CONCAT(DISTINCT ph_items.item_code ORDER BY ph_items.item_code ASC) AS itemCodes',
                'GROUP_CONCAT(DISTINCT ph_item_lines.inspection_status ORDER BY ph_item_lines.inspection_status ASC) AS inspectionStatuses',
                'GROUP_CONCAT(DISTINCT ph_item_lines.id) as carton_ids',
                'GROUP_CONCAT(DISTINCT  ph_item_lines.style) as style'
            ])
            .leftJoin(FGContainerCartonMapEntity, 'container_location', 'container_location.confirmed_container_id = p.container_id AND container_location.unit_code = p.unit_code AND container_location.company_code = p.company_code')
            //TODO://
            .leftJoin(CrtnEntity, 'ph_item_lines', 'ph_item_lines.id = container_location.item_lines_id')
            .where('p.company_code = :companyCode', { companyCode })
            .andWhere('p.unit_code = :unitCode', { unitCode })
            .andWhere('p.is_active = true')
            .andWhere('p.confirmed_location_id IN (:...locationIds)', { locationIds })
            .groupBy('p.confirmed_location_id')
            .getRawMany();

        return query;
    }

}