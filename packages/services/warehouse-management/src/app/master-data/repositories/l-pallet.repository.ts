import { Injectable } from "@nestjs/common";
import { Repository, DataSource } from "typeorm";
import { LPalletEntity } from "../entities/l-pallet.entity";
import { LBinEntity } from "../entities/l-bin.entity";
import { PalletBinMapEntity } from "../../location-allocation/entities/pallet-bin-map.entity";
import { LRackEntity } from "../entities/l-rack.entity";
import { CommonRequestAttrs, CurrentPalletLocationEnum, PalletBinStatusEnum } from "@xpparel/shared-models";


@Injectable()
export class LPalletRepo extends Repository<LPalletEntity>{
    constructor(private dataSource: DataSource) {
        super(LPalletEntity, dataSource.createEntityManager());
    }

    async getEmptyPalletDetails(companyCode: string, unitCode: string) {
        const query = this.createQueryBuilder('l_pallet')
        .select(['pallet_name', 'pallet_code', 'max_items','bin_name','name as rack_name', 'current_pallet_location as location'])
        .leftJoin(PalletBinMapEntity, 'pb', 'pb.pallet_id=l_pallet.id')
        .leftJoin(LBinEntity, 'lb', 'lb.id=pb.confirmed_bin_id')
        .leftJoin(LRackEntity, 'lr', 'lb.l_rack_id=lr.id')
        .where(`l_pallet.company_code='${companyCode}' AND l_pallet.unit_code='${unitCode}' AND l_pallet.id NOT IN (SELECT confirmed_pallet_id FROM pallet_roll_map WHERE company_code='${companyCode}' AND unit_code='${unitCode}' AND status='${PalletBinStatusEnum.CONFIRMED}' and is_active = TRUE) order by pallet_code`);       
        const data = await query.getRawMany();
        return data;
    }

    async getInspectedPalletDetails(companyCode: string, unitCode: string) {
        const query = this.createQueryBuilder('l_pallet')
            .select(['l_pallet.id','l_pallet.pallet_name', 'l_pallet.barcode_id'])
            .leftJoin(PalletBinMapEntity, 'pb', 'pb.pallet_id=l_pallet.id')
            .leftJoin(LBinEntity, 'lb', 'lb.id=pb.confirmed_bin_id')
            .leftJoin(LRackEntity, 'lr', 'lb.l_rack_id=lr.id')
            .where(`l_pallet.company_code='${companyCode}' AND l_pallet.unit_code='${unitCode}' AND l_pallet.id NOT IN (SELECT confirmed_pallet_id FROM pallet_roll_map WHERE company_code='${companyCode}' AND unit_code='${unitCode}' AND status='${PalletBinStatusEnum.CONFIRMED}' and is_active = TRUE) and current_pallet_location='${CurrentPalletLocationEnum.INSPECTION}' order by pallet_code`);    
        const data = await query.getRawMany();
        return data;
    }
}