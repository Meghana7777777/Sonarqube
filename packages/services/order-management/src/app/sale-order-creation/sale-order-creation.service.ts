import { Injectable } from "@nestjs/common";
import { ErrorResponse } from "@xpparel/backend-utils";
import { CustomerIdRequest, GlobalResponseObject, ProductsIdRequest, ProductsModel, ProductTypeIdRequest, SaleOrderDumpRequest, SI_MoNumberRequest, SI_SoNumberRequest, StyleIdRequest } from "@xpparel/shared-models";
import { CustomerSharedService, ProductSharedService, ProductTypeServices, StyleProductOpService, StyleSharedService } from "@xpparel/shared-services";
import { DataSource } from "typeorm";
import { GenericTransactionManager } from "../../database/typeorm-transactions";
import { SoInfoEntity } from "../entity/so-info-entity";
import { SoLineProductEntity } from "../entity/so-line-product.entity";
import { SoLineEntity } from "../entity/so-line.entity";
import { SoProductSubLineEntity } from "../entity/so-product-sub-line.entity";
import { SoInfoRepository } from "../repository/so-info-repository";
import { SoLineProductRepository } from "../repository/so-line-product.repository";
import { SoLineRepository } from "../repository/so-line.repository";
import { SoProductSubLineRepository } from "../repository/so-product-sub-line.repository";


@Injectable()
export class SaleOrderCreationService {
    constructor(
        private dataSource: DataSource,
        private soInfoRepo: SoInfoRepository,
        private soLineRepo: SoLineRepository,
        private soLineProductRepo: SoLineProductRepository,
        private soProductSubLineRepo: SoProductSubLineRepository,
        private customerService: CustomerSharedService,
        private styleService: StyleSharedService,
        private productService: ProductSharedService,
        private productTypeService: ProductTypeServices,
        private styleProductOpService: StyleProductOpService,//Todo-- add bull


    ) {

    }

    // CALLED FROM EXCEL UPLOAD API
    /**
     * Service to upload Sale orders
     * @param req 
     * @returns 
    */
    async upLoadSaleOrders(req: SaleOrderDumpRequest): Promise<GlobalResponseObject> {
        // construct the body required by createOrders and call that service for every SO
        // call only 1 sale order save at a time and pass to createOrders
        for (const eachSo of req.saleOrderDumpData) {
            const eachOrder = new SaleOrderDumpRequest(req.username, req.unitCode, req.companyCode, req.userId, [eachSo])
            await this.createSaleOrders(eachOrder)
        }
        return new GlobalResponseObject(true, 0, "Order Uploaded Successfully");
    }

    // Called from UI if a form exist.
    // Also called from upLoadOrders
    async createSaleOrders(req: SaleOrderDumpRequest): Promise<GlobalResponseObject> {
        // save the sale orders inside a loop. only 1 at a time and commit and rebegin the transaction
        const transactionalEntityManager = new GenericTransactionManager(this.dataSource);
        try {
            await transactionalEntityManager.startTransaction();
            for (const saleOrderDump of req.saleOrderDumpData) {
                const existingUnconfirmedSoInfo = await this.soInfoRepo.findOne({ where: { soNumber: saleOrderDump.soNumber, unitCode: req.unitCode, companyCode: req.companyCode, isActive: true } });

                //existing So check
                if (existingUnconfirmedSoInfo && existingUnconfirmedSoInfo.isConfirmed > 0) {
                    throw new ErrorResponse(0, 'Given SO already confirmed / Processed / Completed you cannot upload it again. Please un confirm and try again')
                }
                //customer Master Fetch
                const customerReq = new CustomerIdRequest(req.username, req.unitCode, req.companyCode, req.userId, null, null, saleOrderDump.customerCode)
                const customerData = await this.customerService.getCustomerByCustomerCode(customerReq);
                console.log(customerReq, customerData, "dsv")
                if (!customerData.status) {
                    throw new ErrorResponse(1, "Customer Details  Not Found Please add in the Master to Proceed");
                }
                const customerInfo = customerData?.data[0];

                //style master Fetch
                const styleReq = new StyleIdRequest(req.username, req.unitCode, req.companyCode, req.userId, null, null, saleOrderDump.styleCode);
                const stylesData = await this.styleService.getStyleByStyleCode(styleReq);
                if (!stylesData.status) {
                    throw new ErrorResponse(0, "Style Details Not Found Please add in the Master to Proceed");
                }
                const styleInfo = stylesData?.data[0]
                const allProductsData: ProductsModel[] = [];


                for (let i = 0; i < saleOrderDump.soLines.length; i++) {
                    const soLine = saleOrderDump.soLines[i];
                    for (const product of soLine.soLineProducts) {

                        //Product master Fetch
                        const productReq = new ProductsIdRequest(req.username, req.unitCode, req.companyCode, req.userId, null, null, product.productCode)
                        const productsData = await this.productService.getProductByProductCode(productReq);
                        if (!productsData.status) {
                            throw new ErrorResponse(1, "Product Details  Not Found Please add in the Master to Proceed");
                        }
                        allProductsData.push(...productsData.data);
                        //ProductType master Fetch
                        const productTypeReq = new ProductTypeIdRequest(req.username, req.unitCode, req.companyCode, req.userId, null, product.productType)
                        const productTypesData = await this.productTypeService.getProductDetailsByProductType(productTypeReq);
                        if (!productTypesData.status) {
                            throw new ErrorResponse(1, "Product Type  Details  Not Found Please add in the Master to Proceed");
                        }

                    }
                }


                //Delete Existing So if not confirmed
                await this.deleteSOInfo(saleOrderDump.soNumber, req.unitCode, req.companyCode, transactionalEntityManager);
                //Insert into SoInfo
                const soEntity = new SoInfoEntity();
                soEntity.companyCode = req.companyCode;
                soEntity.unitCode = req.unitCode;
                soEntity.createdUser = req.username;
                soEntity.soNumber = saleOrderDump.soNumber;
                soEntity.style = saleOrderDump.styleCode;
                soEntity.plantStyleRef = saleOrderDump.plantStyleRef;
                soEntity.coNumber = saleOrderDump.coNumber;
                soEntity.customerName = customerInfo.customerName;
                soEntity.soRefNo = saleOrderDump.soRefNumber;
                soEntity.customerLoc = customerInfo.customerLocation;
                soEntity.quantity = saleOrderDump.quantity;
                soEntity.packMethod = saleOrderDump.packMethod;
                soEntity.isConfirmed = 0;
                soEntity.customerCode = saleOrderDump.customerCode;
                soEntity.profitCenterCode = saleOrderDump.profitCenterCode;
                soEntity.profitCenterName = saleOrderDump.profitCenterName;
                soEntity.styleName = styleInfo.styleName;
                soEntity.styleCode = styleInfo.styleCode;
                soEntity.styleDescription = styleInfo.description;
                soEntity.soProgressStatus = 0;
                soEntity.businessHead = saleOrderDump.businessHead;
                soEntity.soItem = saleOrderDump.soItem;
                soEntity.customerStylesDesignNo = saleOrderDump.customerStylesDesignNo;
                soEntity.soCreationDate =saleOrderDump.soCreationDate;
                soEntity.soClosedDate   =saleOrderDump.soClosedDate;
                soEntity.exFactoryDate  = saleOrderDump?.exFactoryDate;                
                soEntity.uploadedDate = new Date().toISOString();
                soEntity.soNumber = saleOrderDump.soNumber;
                const soInfoEntity = await this.soInfoRepo.save(soEntity);
                for (const soLine of saleOrderDump.soLines) {
                    const soLineEntity = new SoLineEntity();
                    soLineEntity.companyCode = req.companyCode;
                    soLineEntity.unitCode = req.unitCode;
                    soLineEntity.createdUser = req.username;
                    soLineEntity.soNumber = soInfoEntity.soNumber;
                    soLineEntity.soId = soInfoEntity.id;
                    soLineEntity.soLineNumber = soLine.soLineNumber;
                    soLineEntity.soLineNumber = soLine.soLineNumber;
                    const savedSoLineEntity = await transactionalEntityManager.getRepository(SoLineEntity).save(soLineEntity)
                    let index = 0
                    for (const product of soLine.soLineProducts) {
                        const soLineProductEntity = new SoLineProductEntity();
                        soLineProductEntity.companyCode = req.companyCode;
                        soLineProductEntity.unitCode = req.unitCode;
                        soLineProductEntity.createdUser = req.username;
                        soLineProductEntity.soNumber = soInfoEntity.soNumber;
                        soLineProductEntity.soLineId = savedSoLineEntity.id;
                        soLineProductEntity.soLineNumber = savedSoLineEntity.soLineNumber
                        soLineProductEntity.productCode = product.productCode;
                        soLineProductEntity.productName = allProductsData.find(pro => pro.productCode == product.productCode).productCode;
                        soLineProductEntity.productType = product.productType;
                        soLineProductEntity.sequence = ++index;
                        soLineProductEntity.soLineNumber = savedSoLineEntity.soLineNumber;
                        soLineProductEntity.soNumber = saleOrderDump.soNumber;
                        soLineProductEntity.soLineNumber = savedSoLineEntity.soLineNumber;
                        const savedSoLineProduct = await transactionalEntityManager.getRepository(SoLineProductEntity).save(soLineProductEntity)
                        for (const subLine of product.soProductSubLines) {
                            const soProductSubLineEntity = new SoProductSubLineEntity();
                            soProductSubLineEntity.companyCode = req.companyCode;
                            soProductSubLineEntity.companyCode = req.companyCode;
                            soProductSubLineEntity.unitCode = req.unitCode;
                            soProductSubLineEntity.createdUser = req.username;
                            soProductSubLineEntity.soNumber = soInfoEntity.soNumber;
                            soProductSubLineEntity.soLineProductId = savedSoLineProduct.id;
                            soProductSubLineEntity.fgColor = subLine.fgColor;
                            soProductSubLineEntity.size = subLine.size;
                            soProductSubLineEntity.quantity = subLine.quantity;
                            soProductSubLineEntity.destination = subLine.destination;
                            soProductSubLineEntity.deliveryDate = subLine.deliveryDate;
                            soProductSubLineEntity.zFeature = subLine.zFeature;
                            soProductSubLineEntity.soLineNumber = savedSoLineProduct.soLineNumber;
                            soProductSubLineEntity.productCode = savedSoLineProduct.productCode;
                            soProductSubLineEntity.productName = savedSoLineProduct.productName;
                            soProductSubLineEntity.productType = savedSoLineProduct.productType;
                            soProductSubLineEntity.styleCode = styleInfo.styleCode;
                            soProductSubLineEntity.soNumber = savedSoLineProduct.soNumber;
                            soProductSubLineEntity.soLineNumber = savedSoLineProduct.soLineNumber;
                            soProductSubLineEntity.buyerPo = subLine.buyerPo;


                            await transactionalEntityManager.getRepository(SoProductSubLineEntity).save(soProductSubLineEntity)

                        }
                    }

                }

            }
            await transactionalEntityManager.completeTransaction();
            const reqObj = new SI_SoNumberRequest(req.username, req.unitCode, req.companyCode, req.userId, req?.saleOrderDumpData[0]?.soNumber, null, false, false, false, false, false, false, false)
            await this.styleProductOpService.getAndSaveStyleProductTypeForSO(reqObj)
            return new GlobalResponseObject(true, 1, "Success");
        } catch (err) {
            if (transactionalEntityManager) {
                await transactionalEntityManager.releaseTransaction();
            }
            throw err;
        }
    }

    /**
     * 
     * @param req 
     * @returns 
    */
    async deleteSaleOrders(req: SI_SoNumberRequest): Promise<GlobalResponseObject> {
        const manager = new GenericTransactionManager(this.dataSource);
        try {
            const soInfo = await this.soInfoRepo.findOne({ where: { soNumber: req.soNumber, unitCode: req.unitCode, companyCode: req.companyCode, isActive: true } });
            if (!soInfo) {
                throw new ErrorResponse(0, 'Sale order info not found. Please check and try again')
            }
            await manager.startTransaction();
            await this.deleteSOInfo(req.soNumber, req.unitCode, req.companyCode, manager);
            await manager.completeTransaction();
            return new GlobalResponseObject(true, 0, 'Sale order deleted successfully');
        } catch (err) {
            await manager.releaseTransaction();
            throw err;
        }


    }


    /**
     * 
     * @param soNumber 
     * @param unitCode 
     * @param companyCode 
     * @param manager 
     * @returns 
    */
    async deleteSOInfo(soNumber: string, unitCode: string, companyCode: string, manager: GenericTransactionManager): Promise<boolean> {
        // Deleting existing so number info

        await manager.getRepository(SoProductSubLineEntity).delete({ soNumber: soNumber, unitCode: unitCode, companyCode: companyCode, isActive: true })
        await manager.getRepository(SoLineProductEntity).delete({ soNumber: soNumber, unitCode: unitCode, companyCode: companyCode, isActive: true })
        await manager.getRepository(SoLineEntity).delete({ soNumber: soNumber, unitCode: unitCode, companyCode: companyCode, isActive: true })
        await manager.getRepository(SoInfoEntity).delete({ soNumber: soNumber, unitCode: unitCode, companyCode: companyCode, isActive: true });
        return true;
    }

    // called from UI
    async confirmSaleOrder(req: SI_SoNumberRequest): Promise<GlobalResponseObject> {
        const manager = new GenericTransactionManager(this.dataSource);
        const { soNumber, unitCode, companyCode } = req;
        const orderInfo  = await  this.soInfoRepo.findOne({ where: { soNumber, unitCode, companyCode, isActive: true } });
        if (orderInfo.isConfirmed==1) {
            throw new ErrorResponse(0, 'Sale order already confirmed.')
        }
        try {

            await manager.startTransaction();
            await manager.getRepository(SoInfoEntity).update({ soNumber, unitCode, companyCode, isActive: true }, { isConfirmed: 1, updatedUser: req.username })
            await manager.completeTransaction();
            return new GlobalResponseObject(true, 0, 'Sale order confirmed successfully');
        } catch (err) {
            await manager.releaseTransaction();
            throw err;
        }
    }

}