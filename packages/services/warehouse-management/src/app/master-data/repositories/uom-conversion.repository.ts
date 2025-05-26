import { Injectable } from "@nestjs/common";
import { DataSource, Repository } from "typeorm";
import { UomConversionEntity } from "../entities/uom-conversion.entity";
import { UOMConversionRequest } from "@xpparel/shared-models";


@Injectable()
export class UomConversionRepo extends Repository<UomConversionEntity> {
    constructor(private dataSource: DataSource) {
        super(UomConversionEntity, dataSource.createEntityManager());
    }

    async getAllUOMConversion(req: UOMConversionRequest): Promise<any> {
        let uomConversionQuery = this.createQueryBuilder("uomConversion")
            .where("uomConversion.companyCode = :companyCode", { companyCode: req.companyCode })
            .andWhere("uomConversion.unitCode = :unitCode", { unitCode: req.unitCode })
            .andWhere("uomConversion.validFrom <= :date", { date: req.date })
            .andWhere("uomConversion.validTo >= :date", { date: req.date })
        if (req.fromUOM && req.fromUOM.length > 0)
            uomConversionQuery.andWhere("uomConversion.fromUom = :fromUom", { fromUom: req.fromUOM })
        
        if (req.toUOM && req.toUOM.length > 0)
            uomConversionQuery.andWhere("uomConversion.toUom = :toUom", { toUom: req.toUOM })

        return await uomConversionQuery.getMany()
    }
}