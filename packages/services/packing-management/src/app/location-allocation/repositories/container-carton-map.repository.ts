import { Injectable } from "@nestjs/common";
import { FgContainerLocationStatusEnum } from "@xpparel/shared-models";
import { DataSource, Repository } from "typeorm";
import { GenericTransactionManager } from "../../../database/typeorm-transactions";
import { FGContainerCartonMapEntity } from "../entities/container-carton-map.entity";
import { FGContainerLocationMapEntity } from "../entities/container-location-map.entity";
import { FgMContainerEntity } from "../../__masters__/container/entities/fgm-container.entity";
import { FgMLocationEntity } from "../../__masters__/location/entities/fgm-location.entity";
import { ContainerAndLocationCodeQueryResponse } from "./query-response.ts/container-and-location-data.query.response";
import { ContainerPackListCartonsQueryResponse } from "./query-response.ts/container-packlist-cartons.query.response";

@Injectable()
export class ContainerCartonMapRepo extends Repository<FGContainerCartonMapEntity> {
    constructor(dataSource: DataSource) {
        super(FGContainerCartonMapEntity, dataSource.createEntityManager());
    }

    async getConfirmedContainerIdsForPackList(companyCode: string, unitCode: string, packListId: number): Promise<number[]> {
        const query = this.createQueryBuilder('p')
            .select('DISTINCT confirmed_container_id')
            .where(`company_code = '${companyCode}' AND unit_code = '${unitCode}' AND pack_list_id = '${packListId}' AND status = '${FgContainerLocationStatusEnum.CONFIRMED}' `);
        const result: { confirmed_container_id: number }[] = await query.getRawMany();
        const containerIds: number[] = [];
        result.forEach(r => {
            containerIds.push(r.confirmed_container_id);
        });
        return containerIds;
    }

    async getConfirmedContainerIdsForCartonIds(companyCode: string, unitCode: string, cartonIds: number[], transManager: GenericTransactionManager): Promise<number[]> {
        const containerIds: number[] = [];
        if (cartonIds?.length) {
            const ref = transManager ? transManager.getRepository(FGContainerCartonMapEntity).createQueryBuilder('p') : this.createQueryBuilder('p');
            const query = ref.select('DISTINCT confirmed_container_id')
                .where(`company_code = '${companyCode}' AND unit_code = '${unitCode}' AND  status = '${FgContainerLocationStatusEnum.CONFIRMED}' `)
                .andWhere(`item_lines_id IN (${cartonIds} )`,)
            const result: { confirmed_container_id: number }[] = await query.getRawMany();
            result.forEach(r => {
                containerIds.push(r.confirmed_container_id);
            });
        }

        return containerIds;
    }

    async getConfirmedCartonIdsForPackList(companyCode: string, unitCode: string, packListId: number, transManager: GenericTransactionManager): Promise<number[]> {
        const ref = transManager ? transManager.getRepository(FGContainerCartonMapEntity).createQueryBuilder('p') : this.createQueryBuilder('p');
        const query = ref.select('DISTINCT item_lines_id')
            .where(` company_code = '${companyCode}' AND unit_code = '${unitCode}' AND pack_list_id = '${packListId}' AND status = '${FgContainerLocationStatusEnum.CONFIRMED}' `);
        const result: { item_lines_id: number }[] = await query.getRawMany();
        const cartonIds: number[] = [];
        result.forEach(r => {
            cartonIds.push(r.item_lines_id);
        });
        return cartonIds;
    }

    async getSuggestedContainerIdsForPackList(companyCode: string, unitCode: string, packListId: number): Promise<number[]> {
        const query = this.createQueryBuilder('p')
            .select('DISTINCT suggested_container_id')
            .where(` company_code = '${companyCode}' AND unit_code = '${unitCode}' AND pack_list_id = '${packListId}' AND status = '${FgContainerLocationStatusEnum.OPEN}' `);
        const result: { suggested_container_id: number }[] = await query.getRawMany();
        const containerIds: number[] = [];
        result.forEach(r => {
            containerIds.push(r.suggested_container_id);
        });
        return containerIds;
    }

    async getPacklistIdsForContainerId(companyCode: string, unitCode: string, containerId: number): Promise<number[]> {
        const query = this.createQueryBuilder('p')
            .select('DISTINCT pack_list_id')
            .where(`company_code = '${companyCode}' AND unit_code = '${unitCode}' AND ( suggested_container_id = ${containerId} OR confirmed_container_id = ${containerId} )`);
        const result: { pack_list_id: number }[] = await query.getRawMany();
        const packListIds: number[] = [];
        result.forEach(r => {
            packListIds.push(r.pack_list_id);
        });
        return packListIds;
    }

    async getCartonIdsForContainerIdAndPhId(companyCode: string, unitCode: string, containerId: number, packListId: number): Promise<ContainerPackListCartonsQueryResponse[]> {
        const query = this.createQueryBuilder('p')
            .select('pack_list_id, item_lines_id, status')
            .where(` company_code = '${companyCode}' AND unit_code = '${unitCode}' AND confirmed_container_id = ${containerId} AND pack_list_id = '${packListId}'`);
        return await query.getRawMany();
    }

    async getCartonIdsForContainerId(companyCode: string, unitCode: string, containerId: number, transManager?: GenericTransactionManager): Promise<ContainerPackListCartonsQueryResponse[]> {
        let query;
        if (transManager) {
            query = transManager.getRepository(FGContainerCartonMapEntity).createQueryBuilder('p')
                .select('pack_list_id, item_lines_id, status')
                .where(` company_code = '${companyCode}' AND unit_code = '${unitCode}' AND confirmed_container_id = ${containerId} AND is_active=true`);
        } else {
            query = this.createQueryBuilder('p')
                .select('pack_list_id, item_lines_id, status')
                .where(` company_code = '${companyCode}' AND unit_code = '${unitCode}' AND confirmed_container_id = ${containerId} AND is_active=true`);
        }
        return await query.getRawMany();
    }


    async getConfirmedCartonIdsForContainerId(companyCode: string, unitCode: string, containerId: number): Promise<ContainerPackListCartonsQueryResponse[]> {
        const query = this.createQueryBuilder('p')
            .select('pack_list_id, item_lines_id, status')
            .where(` company_code = '${companyCode}' AND unit_code = '${unitCode}' AND confirmed_container_id = ${containerId} `);
        return await query.getRawMany();
    }

    async getWarehouseCartonIdsForContainerId(companyCode: string, unitCode: string, containerId: number): Promise<ContainerPackListCartonsQueryResponse[]> {
        const query = this.createQueryBuilder('p')
            .select('p.pack_list_id, p.item_lines_id, p.status')
            //TODO:
            // .leftJoin(PhItemLinesEntity, 'carton', 'carton.company_code = p.company_code AND carton.unit_code = p.unit_code AND carton.id = p.item_lines_id')
            .where(` p.company_code = '${companyCode}' AND p.unit_code = '${unitCode}' AND carton.inspection_pick = false AND  p.confirmed_container_id = ${containerId} `);
        return await query.getRawMany();
    }

    async getInspectionCartonIdsForContainerId(companyCode: string, unitCode: string, containerId: number): Promise<ContainerPackListCartonsQueryResponse[]> {
        const query = this.createQueryBuilder('p')
            .select('p.pack_list_id, p.item_lines_id, p.status')
            //TODO://
            //.leftJoin(PhItemLinesEntity, 'carton', 'carton.company_code = p.company_code AND carton.unit_code = p.unit_code AND carton.id = p.item_lines_id')
            .where(` p.company_code = '${companyCode}' AND p.unit_code = '${unitCode}' AND carton.inspection_pick = true AND p.confirmed_container_id = ${containerId} `);
        return await query.getRawMany();
    }

    async getContainerAndLocationCodeforCartonsIds(companyCode: string, unitCode: string, cartonIds: number[]): Promise<ContainerAndLocationCodeQueryResponse[]> {
        const query = this.createQueryBuilder('pcontainer')
            .select('pcontainer.item_lines_id, container.id as container_id, container.container_name, container.container_code, container.barcode_id as container_barcode, location.id as location_id, location.location_name, location.location_code,location.barcode_id as location_barcode')
            .leftJoin(FgMContainerEntity, 'container', 'container.company_code= pcontainer.company_code AND container.unit_code= pcontainer.unit_code AND container.is_active= pcontainer.is_active AND container.id= pcontainer.confirmed_container_id')
            .leftJoin(FGContainerLocationMapEntity, 'plocation', 'plocation.company_code = pcontainer.company_code AND plocation.unit_code = pcontainer.unit_code AND plocation.is_active = pcontainer.is_active AND plocation.container_id = pcontainer.confirmed_container_id')
            .leftJoin(FgMLocationEntity, 'location', 'plocation.company_code = location.company_code AND plocation.unit_code = location.unit_code AND plocation.is_active = location.is_active AND location.id= plocation.confirmed_location_id')
            .where(`pcontainer.company_code = '${companyCode}' AND pcontainer.unit_code = '${unitCode}' AND pcontainer.item_lines_id IN (:...cartonIds) AND pcontainer.status = '${FgContainerLocationStatusEnum.CONFIRMED}' `, { cartonIds: cartonIds });
        return await query.getRawMany();
    }

    async getGrnCompletedBuNotInWhPackListCount(companyCode: string, unitCode: string, packListId: number[]): Promise<number> {
        const countObj: { cnt: number } = await this.createQueryBuilder('p')
            .select('COUNT(DISTINCT p.pack_list_id) AS cnt')
            .where(` company_code = '${companyCode}' AND unit_code = '${unitCode}' AND status = '${FgContainerLocationStatusEnum.CONFIRMED}' `)
            .andWhere(`p.pack_list_id IN(:...packListId)`, { packListId: packListId })
            .getRawOne()
        return countObj.cnt;
    }
    async getCartonsInWarehouse(itemLines: number[]): Promise<number> {
        const query = await this.createQueryBuilder('prm')
            .select('COUNT(DISTINCT prm.item_lines_id)', 'cnt')
            .leftJoin(FGContainerLocationMapEntity, 'pbm', 'pbm.container_id = prm.confirmed_container_id')
            .where('prm.item_lines_id IN (:...itemLines)', { itemLines: itemLines })
            .andWhere('pbm.confirmed_location_id IS NOT NULL')
            .getRawOne();

        return query;
    }
}













