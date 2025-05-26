import { Injectable } from "@nestjs/common";
import { ErrorResponse } from "@xpparel/backend-utils";
import { GlobalResponseObject, SI_MoNumberRequest, StyleProductCodeFgColor, StyleProductRequest } from "@xpparel/shared-models";
import { DataSource } from "typeorm";
import { GenericTransactionManager } from "../../database/typeorm-transactions";
import { MoProductSubLineRepository } from "../repository/mo-product-sub-line.repository";
import { MOProductFgColorRepository } from "./repository/mo-product-fg-color.repository";
import { MOProductFgColorEntity } from "./entity/mo-product-color.entity";


@Injectable()
export class MoProductFgColorService {
    constructor(
        private dataSource: DataSource,
        private styleProductTpeRepo: MOProductFgColorRepository,
        private moProductSubLineRepo: MoProductSubLineRepository
    ) {

    }

    /**
     * TODO: Need to call this immediately after mo has been uploaded in the system
     * Service to get and save style product type information for the MO
     * @param req 
     * @returns 
    */
    async getAndSaveMoProductFgColorForMO(req: SI_MoNumberRequest): Promise<GlobalResponseObject> {
        const manager = new GenericTransactionManager(this.dataSource);
        try {
            const distinctStyleProductType = await this.moProductSubLineRepo.getStyleProductColorInfoForMO(req.moNumber, req.unitCode, req.companyCode);
            await manager.startTransaction();
            for (const eachStyleProduct of distinctStyleProductType) {
                await this.checkAndSaveMoProductFgColorForMO(eachStyleProduct, manager, req.unitCode, req.companyCode, req.username, req.moNumber);
            }
            await manager.completeTransaction();
            return new GlobalResponseObject(true, 2, 'Style and Product Type created Successfully');
        } catch (err) {
            await manager.releaseTransaction();
            throw err;
        }
    }

    /**
     * check the style and product type exists , if not inserts data into styleProductTypeEntity
     * @param req 
     * @returns 
    */
    async checkAndSaveMoProductFgColorForMO(req: StyleProductCodeFgColor, transManager: GenericTransactionManager, unitCode: string, companyCode: string, username: string, moNumber: string): Promise<boolean> {
        //check if style and product type exists for the unit coded
        const checkStyleProductTypeExists = await this.styleProductTpeRepo.findOne({ where: { styleCode: req.styleCode, productCode: req.productCode, unitCode, companyCode, moNumber, fgColor: req.fgColor } })
        if (checkStyleProductTypeExists) {
            await transManager.getRepository(MOProductFgColorEntity).delete({ styleCode: req.styleCode, productCode: req.productCode, unitCode, companyCode, moNumber, fgColor: req.fgColor });            // throw new ErrorResponse(1, 'Style and Product Type Already Exists');
        }
        const styleProductTypeEntity = new MOProductFgColorEntity();
        styleProductTypeEntity.styleCode = req.styleCode;
        styleProductTypeEntity.createdUser = username;
        styleProductTypeEntity.fgColor = req.fgColor;
        styleProductTypeEntity.moNumber = moNumber;
        styleProductTypeEntity.styleCode = req.styleCode;
        styleProductTypeEntity.productCode = req.productCode;
        styleProductTypeEntity.createdAt = new Date();
        styleProductTypeEntity.createdUser = username;
        styleProductTypeEntity.unitCode = unitCode;
        styleProductTypeEntity.companyCode = companyCode;
        styleProductTypeEntity.productType = req.productType;
        await transManager.getRepository(MOProductFgColorEntity).save(styleProductTypeEntity);
        return true;

    }
}