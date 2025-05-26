import { Injectable } from "@nestjs/common";
import { DataSource, Repository } from "typeorm";
import { FgMRackEntity } from "../../racks/entity/fg-m-rack.entity";
import { FgMContainerEntity } from "../entities/fgm-container.entity";
import { FgMLocationEntity } from "../../location/entities/fgm-location.entity";
import { CommonIdReqModal, FgContainerLocationStatusEnum, FgContainerResponse, FgCurrentContainerLocationEnum } from "@xpparel/shared-models";
import { FGContainerLocationMapEntity } from "../../../location-allocation/entities/container-location-map.entity";
import { FGMWareHouseEntity } from "../../warehouse-masters/entities/fg-m-warehouse.entity";


@Injectable()
export class FgMContainerRepo extends Repository<FgMContainerEntity> {
    constructor(private dataSource: DataSource) {
        super(FgMContainerEntity, dataSource.createEntityManager());
    }

    async getEmptyContainerDetails(companyCode: string, unitCode: string) {
        const query = this.createQueryBuilder('l_container')
            .select(['container_name', 'container_code', 'max_items', 'bin_name', 'name as rack_name'])
            .leftJoin(FGContainerLocationMapEntity, 'pb', 'pb.container_id=l_container.id')
            .leftJoin(FgMLocationEntity, 'lb', 'lb.id=pb.confirmed_bin_id')
            .leftJoin(FgMRackEntity, 'lr', 'lb.rack_id=lr.id')
            .where(`l_container.company_code='${companyCode}' AND l_container.unit_code='${unitCode}' AND l_container.id NOT IN (SELECT confirmed_container_id FROM container_roll_map WHERE company_code='${companyCode}' AND unit_code='${unitCode}' AND status='${FgContainerLocationStatusEnum.CONFIRMED}' and is_active = TRUE) order by container_code`);
        const data = await query.getRawMany();
        return data;
    }

    async getInspectedContainerDetails(companyCode: string, unitCode: string) {
        const query = this.createQueryBuilder('l_container')
            .select(['l_container.id', 'l_container.container_name', 'l_container.barcode_id'])
            .leftJoin(FGContainerLocationMapEntity, 'pb', 'pb.container_id=l_container.id')
            .leftJoin(FgMLocationEntity, 'lb', 'lb.id=pb.confirmed_bin_id')
            .leftJoin(FgMRackEntity, 'lr', 'lb.rack_id=lr.id')
            .where(`l_container.company_code='${companyCode}' AND l_container.unit_code='${unitCode}' AND l_container.id NOT IN (SELECT confirmed_container_id FROM container_roll_map WHERE company_code='${companyCode}' AND unit_code='${unitCode}' AND status='${FgContainerLocationStatusEnum.CONFIRMED}' and is_active = TRUE) and current_container_location='${FgCurrentContainerLocationEnum.INSPECTION}' order by container_code`);
        const data = await query.getRawMany();
        return data;
    }

    async getWarehouseCodeDropdown(){
        const query = this.createQueryBuilder('c')
        .select(['DISTINCT(c.wh_id) as whId' ,'w.code'])
        .leftJoin(FGMWareHouseEntity,'w','w.id = c.wh_id')
        return await query.getRawMany()
    }

    // async getAllContainersData(req:CommonIdReqModal){
    //     const qurey=await this.createQueryBuilder('l_container')
    //     .select(`l_container.*,whId.desc,whId.id as whId`)
    //     .leftJoin()
    // }
}