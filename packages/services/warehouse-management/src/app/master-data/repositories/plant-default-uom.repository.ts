import { Injectable } from "@nestjs/common";
import { DataSource, Repository } from "typeorm";
import { PlantDefaultUomEntity } from "../entities/plant-default-uom.entity";
import { UOMConversionRequest } from "@xpparel/shared-models";


@Injectable()
export class PlantDefaultUomRepo extends Repository<PlantDefaultUomEntity>{
    constructor(private dataSource: DataSource) {
        super(PlantDefaultUomEntity, dataSource.createEntityManager());
    }
    async getPlantDefaultUOMForGivenItem(req: UOMConversionRequest): Promise<any> {
        const query=this.createQueryBuilder('pd')
        .where(`pd.companyCode = :companyCode AND pd.unitCode = :unitCode AND pd.itemCategory = :itemCategory`,{companyCode: req.companyCode, unitCode: req.unitCode, itemCategory: req.phItemCategoryEnum})
        .andWhere(`pd.validFrom <= :date AND pd.validTo >= :date`, { date: req.date });
        return await query.getOne()
    }
}