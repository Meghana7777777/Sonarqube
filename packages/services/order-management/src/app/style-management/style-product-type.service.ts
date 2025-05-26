import { Injectable } from "@nestjs/common";
import { ErrorResponse } from "@xpparel/backend-utils";
import { CommonRequestAttrs, GlobalResponseObject, OperationModel, OpVersionIdDesp, PoProdutNameRequest, ProcessTypesModel, ProcessTypesResponse, SewGroupModel, SewVersionModel, SewVersionResponse, SI_MoNumberRequest, SI_SoNumberRequest, StyleProductCodeRequest, StyleProductOpInfo, StyleProductOpResponse, StyleProductRequest } from "@xpparel/shared-models";
import { DataSource, In } from "typeorm";
import { StyleProductTypeEntity } from "./entity/style-product.entity";
import { StyleProductTypeRepository } from "./repository/style-product-type.repository";
import { GenericTransactionManager } from "../../database/typeorm-transactions";
import { SPOpVersionRepository } from "./repository/sp-op-version.repository";
import { MoProductSubLineRepository } from "../repository/mo-product-sub-line.repository";
import { FgSkuEntity } from "./entity/fg-sku.entity";
import { SoProductSubLineRepository } from "../repository/so-product-sub-line.repository";


@Injectable()
export class StyleOperationInfoService {
    constructor(
        private dataSource: DataSource,
        private styleProductTpeRepo: StyleProductTypeRepository,
        private styleOpVersionRepo: SPOpVersionRepository,
        private moProductSubLineRepo: MoProductSubLineRepository,
        private soProductSubLineRepo: SoProductSubLineRepository

    ) {

    }

    /**
     * Service to get and save style product type information for the MO
     * @param req 
     * @returns 
    */
    async getAndSaveStyleProductTypeForMO(req: SI_MoNumberRequest): Promise<GlobalResponseObject> {
        const manager = new GenericTransactionManager(this.dataSource);
        try {
            const distinctStyleProductType = await this.moProductSubLineRepo.getStyleProductTypeInfoForMO(req.moNumber, req.unitCode, req.companyCode);
            await manager.startTransaction();
            for (const eachStyleProduct of distinctStyleProductType) {
                await this.checkStyleProductTypeAndSave(eachStyleProduct, manager, req.unitCode, req.companyCode);
            }
            const distinctStyleProductFgColor = await this.moProductSubLineRepo.getStyleProductCodeFgColorInfoForMO(req.moNumber, req.unitCode, req.companyCode);
            for (const eachCombo of distinctStyleProductFgColor) {
                const fgSkuCheck = await manager.getRepository(FgSkuEntity).findOne({ where: { styleCode: eachCombo.styleCode, productCode: eachCombo.productCode, fgColor: eachCombo.fgColor } });
                if (!fgSkuCheck) {
                    await manager.getRepository(FgSkuEntity).save(fgSkuCheck);
                }
            }
            await manager.completeTransaction();
            return new GlobalResponseObject(true, 2, 'Style and Product Type created Successfully');
        } catch (err) {
            await manager.releaseTransaction();
            throw err;
        }
    }

    async getAndSaveStyleProductTypeForSO(req: SI_SoNumberRequest): Promise<GlobalResponseObject> {
        const manager = new GenericTransactionManager(this.dataSource);
        try {
            const distinctStyleProductType = await this.soProductSubLineRepo.getStyleProductTypeInfoForSO(req.soNumber, req.unitCode, req.companyCode);
            await manager.startTransaction();
            for (const eachStyleProduct of distinctStyleProductType) {
                await this.checkStyleProductTypeAndSave(eachStyleProduct, manager, req.unitCode, req.companyCode);
            }
            const distinctStyleProductFgColor = await this.soProductSubLineRepo.getStyleProductCodeFgColorInfoForSO(req.soNumber, req.unitCode, req.companyCode);
            for (const eachCombo of distinctStyleProductFgColor) {
                const fgSkuCheck = await manager.getRepository(FgSkuEntity).findOne({ where: { styleCode: eachCombo.styleCode, productCode: eachCombo.productCode, fgColor: eachCombo.fgColor } });
                if (!fgSkuCheck) {
                    const fgSku = new FgSkuEntity();
                    fgSku.styleCode = eachCombo.styleCode;
                    fgSku.productCode = eachCombo.productCode;
                    fgSku.fgColor = eachCombo.fgColor;
                    fgSku.unitCode = req.unitCode;
                    fgSku.companyCode = req.companyCode;
                    fgSku.createdUser = req.username;
                    await manager.getRepository(FgSkuEntity).save(fgSku);
                }
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
    async checkStyleProductTypeAndSave(req: StyleProductRequest, transManager: GenericTransactionManager, unitCode: string, companyCode: string): Promise<boolean> {
        //check if style and product type exists for the unit coded
        const checkStyleProductTypeExists = await this.styleProductTpeRepo.findOne({ where: { styleCode: req.styleCode, productType: req.productType, unitCode: req.unitCode, companyCode: req.companyCode } })
        if (!checkStyleProductTypeExists) {
        const styleProductTypeEntity = new StyleProductTypeEntity();
        styleProductTypeEntity.styleCode = req.styleCode;
        styleProductTypeEntity.productType = req.productType;
        styleProductTypeEntity.createdAt = new Date();
        styleProductTypeEntity.createdUser = req.username;
        styleProductTypeEntity.unitCode = unitCode;
        styleProductTypeEntity.companyCode = companyCode;
        await transManager.getRepository(StyleProductTypeEntity).save(styleProductTypeEntity);
        return true;
        }
    }

    async getProcessTypesForStyle(req: StyleProductCodeRequest): Promise<ProcessTypesResponse> {
        const res = await this.styleProductTpeRepo.getProcessTypesForStyle(req)
        if (!res.length) {
            throw new ErrorResponse(0, 'No Process types found for the style')
        }
        const processTypes: ProcessTypesModel[] = []
        res.forEach((v) => {
            const processType = new ProcessTypesModel(v.processType)
            processTypes.push(processType)

        })
        return new ProcessTypesResponse(true, 1, 'Process type', processTypes)
    }
}