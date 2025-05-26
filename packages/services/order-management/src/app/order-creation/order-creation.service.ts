import { Injectable } from "@nestjs/common";
import { ErrorResponse } from "@xpparel/backend-utils";
import { BomItemTypeEnum, ConfirmationStatusEnum, CustomerIdRequest, GlobalResponseObject, ItemCreateRequest, ItemModel, ManufacturingOrderDumpRequest, MoCombinationDetails, MoCombinationRequest, MoCombinationWithPslIdsModel, MoCombinationWithPslIdsResponse, MoPslIdsOrderFeatures, MoPslIdsOrderFeaturesResponse, MoPslIdsRequest, ProductsIdRequest, ProductsModel, ProductTypeIdRequest, SI_MoNumberRequest, SI_SoNumberRequest, StyleIdRequest } from "@xpparel/shared-models";
import { CustomerSharedService, ItemSharedService, ProductSharedService, ProductTypeServices, StyleSharedService } from "@xpparel/shared-services";
import { DataSource, In } from "typeorm";
import { GenericTransactionManager } from "../../database/typeorm-transactions";
import { MoInfoEntity } from "../entity/mo-info.entity";
import { MoLineProductEntity } from "../entity/mo-line-product.entity";
import { MoLineEntity } from "../entity/mo-line.entity";
import { MoProductSubLineEntity } from "../entity/mo-product-sub-line.entity";
import { PslOperationRmEntity, } from '../entity/psl-operation-rm.entity';
import { PslOperationEntity } from "../entity/psl-operation.entity";
import { RmInfoEntity } from "../entity/rm-info.entity";
import { MoProductFgColorService } from "../order-config/mo-product-fg-colo.service";
import { MoOpVersionRepository } from "../order-config/repository/mo-op-version.repository";
import { MOProductFgColorRepository } from "../order-config/repository/mo-product-fg-color.repository";
import { MoInfoRepository } from "../repository/mo-info.repository";
import { MoLineProductRepository } from "../repository/mo-line-product.repository";
import { MoLineRepository } from "../repository/mo-line.repository";
import { MoProductSubLineRepository } from "../repository/mo-product-sub-line.repository";
import { PslOpRawMaterialRepository } from "../repository/psl-opearation-rm.repository";
import { PslOperationRepository } from "../repository/psl-operation.repository";
import { RawMaterialInfoRepository } from "../repository/rm-info.repository";
import { SoInfoRepository } from "../repository/so-info-repository";
import { SaleOrderCreationInfoService } from "../sale-order-creation/sale-order-creation-info.service";
import moment = require("moment");


@Injectable()
export class OrderCreationService {
    constructor(
        private dataSource: DataSource,
        private moInfoRepo: MoInfoRepository,
        private moLineRepo: MoLineRepository,
        private moLineProductRepo: MoLineProductRepository,
        private moProductSubLineRepo: MoProductSubLineRepository,
        private pslOperationRepo: PslOperationRepository,
        private pslOperationRmRepo: PslOpRawMaterialRepository,
        private rmInfoRepo: RawMaterialInfoRepository,
        private customerService: CustomerSharedService,
        private styleService: StyleSharedService,
        private productService: ProductSharedService,
        private productTypeService: ProductTypeServices,
        private moProductFgColorRepo: MOProductFgColorRepository,
        private moOpVersionRepo: MoOpVersionRepository,
        private soInfoRepo: SoInfoRepository,
        private moProductFgColorService: MoProductFgColorService,
        private itemSharedService: ItemSharedService,
        private saleOrderCreationInfoService: SaleOrderCreationInfoService

    ) {

    }

    // CALLED FROM EXCEL UPLOAD API
    /**
     * Service to upload Manufacturing orders
     * @param req 
     * @returns 
    */
    async upLoadOrders(req: ManufacturingOrderDumpRequest): Promise<GlobalResponseObject> {
        // construct the body required by createOrders and call that service for every MO
        // call only 1 manufacturing order save at a time and pass to createOrders
        for (const eachMo of req.manufacturingOrderDumpData) {
            const eachOrder = new ManufacturingOrderDumpRequest(req.username, req.unitCode, req.companyCode, req.userId, [eachMo])
            await this.createOrders(eachOrder)
        }
        return new GlobalResponseObject(true, 0, "Order Uploaded Successfully");
    }

    // Called from UI if a form exist.
    // Also called from upLoadOrders
    async createOrders(req: ManufacturingOrderDumpRequest): Promise<GlobalResponseObject> {
        // save the manufacturing orders inside a loop. only 1 at a time and commit and rebegin the transaction
        const transactionalEntityManager = new GenericTransactionManager(this.dataSource);
        try {
            await transactionalEntityManager.startTransaction();
            for (const manufacturingOrderDump of req.manufacturingOrderDumpData) {
                
                //Sale Order Match Check
                for (const eachLine of manufacturingOrderDump.moLines) {
                    const soConfirmed = await this.soInfoRepo.findOne({ where: { soNumber: eachLine.soNumber } })
                    if (soConfirmed === null || soConfirmed === undefined) {
                        throw new ErrorResponse(1, "Sale Order not created,Please create before proceeding");
                    }
                    if (soConfirmed?.isConfirmed == 0) {
                        throw new ErrorResponse(1, "Sale Order not confirmed,Please confirm sale order before proceeding");
                    }
                }
                const existingUnconfirmedMoInfo = await this.moInfoRepo.findOne({ where: { moNumber: manufacturingOrderDump.moNumber, unitCode: req.unitCode, companyCode: req.companyCode, isActive: true } });

                //existing Mo check
                if (existingUnconfirmedMoInfo && existingUnconfirmedMoInfo?.isConfirmed > 0) {
                    throw new ErrorResponse(0, 'Given MO already confirmed / Processed / Completed you cannot upload it again. Please un confirm and try again')
                }

                //MO to SO Validation
                const MoToSovalidatorMapFromMo = new Set<string>();
                const uniqueSoNumbers = new Set<string>();
                manufacturingOrderDump.moLines.forEach((line) => {
                    line.moLineProducts.forEach((prod) => {
                        prod.moProductSubLines.forEach((subLine) => {
                            const uniquekey = `${line.soNumber}-${manufacturingOrderDump.styleCode}-${prod.productCode}-${subLine.fgColor}`

                            MoToSovalidatorMapFromMo.add(uniquekey)
                        })
                    }
                    )
                    uniqueSoNumbers.add(line.soNumber)
                }
                )
                const MoToSovalidatorMapFromSo = new Set<string>();
                for (const eachSo of uniqueSoNumbers) {
                    const soRreq = new SI_SoNumberRequest(req.username, req.unitCode, req.companyCode, req.userId, eachSo, null, false, true, false, true, false, true, false)
                    const soInfo = await this.saleOrderCreationInfoService.getOrderInfoBySaleOrderNo(soRreq)
                    soInfo?.data[0]?.soLineModel?.forEach((line) => {
                        line.soLineProducts.forEach((prod) => {
                            prod.subLines.forEach((subLine) => {
                                const uniquekey = `${soInfo.data[0].soNumber}-${soInfo.data[0].style}-${prod.productName}-${subLine.color}`
                                MoToSovalidatorMapFromSo.add(uniquekey)
                            })
                        }
                        )
                    }
                    )
                }
                for (const each of MoToSovalidatorMapFromMo) {
                    if (!MoToSovalidatorMapFromSo.has(each)) {
                        throw new ErrorResponse(0, 'The Manufacturing Order does not match with the Sales Order')
                    }
                }
                //customer Master Fetch
                const customerReq = new CustomerIdRequest(req.username, req.unitCode, req.companyCode, req.userId, null, null, manufacturingOrderDump.customerCode)
                const customerData = await this.customerService.getCustomerByCustomerCode(customerReq);
                console.log(customerReq, customerData, "dsv")
                if (!customerData.status) {
                    throw new ErrorResponse(1, "Customer Details  Not Found Please add in the Master to Proceed");
                }
                const customerInfo = customerData?.data[0];

                //style master Fetch
                const styleReq = new StyleIdRequest(req.username, req.unitCode, req.companyCode, req.userId, null, null, manufacturingOrderDump.styleCode);
                const stylesData = await this.styleService.getStyleByStyleCode(styleReq);
                if (!stylesData.status) {
                    throw new ErrorResponse(0, "Style Details Not Found Please add in the Master to Proceed");
                }
                const styleInfo = stylesData?.data[0]
                const allProductsData: ProductsModel[] = [];
                for (let i = 0; i < manufacturingOrderDump.moLines.length; i++) {
                    const moLine = manufacturingOrderDump.moLines[i];
                    for (const product of moLine.moLineProducts) {

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
                //Delete Existing Mo if not confirmed
                await this.deleteMOInfo(manufacturingOrderDump.moNumber, req.unitCode, req.companyCode, transactionalEntityManager);
                //Insert into MoInfo
                const moEntity = new MoInfoEntity();
                moEntity.companyCode = req.companyCode;
                moEntity.unitCode = req.unitCode;
                moEntity.createdUser = req.username;
                moEntity.moNumber = manufacturingOrderDump.moNumber;
                moEntity.style = manufacturingOrderDump.styleCode;
                moEntity.plantStyleRef = manufacturingOrderDump.plantStyleRef;
                moEntity.coNumber = manufacturingOrderDump.coNumber;
                moEntity.customerName = customerInfo.customerName;
                moEntity.moRefNo = manufacturingOrderDump.moRefNumber;
                moEntity.customerLoc = customerInfo.customerLocation;
                moEntity.quantity = manufacturingOrderDump.quantity;
                moEntity.packMethod = manufacturingOrderDump.packMethod;
                moEntity.isConfirmed = 0;
                moEntity.customerCode = manufacturingOrderDump.customerCode;
                moEntity.profitCenterCode = manufacturingOrderDump.profitCenterCode;
                moEntity.profitCenterName = manufacturingOrderDump.profitCenterName;
                moEntity.styleName = styleInfo.styleName;
                moEntity.styleCode = styleInfo.styleCode;
                moEntity.styleDescription = styleInfo.description;
                moEntity.moProgressStatus = 0;
                moEntity.businessHead = manufacturingOrderDump.businessHead;
                moEntity.moItem = manufacturingOrderDump.moItem;
                moEntity.customerStylesDesignNo = manufacturingOrderDump.customerStylesDesignNo;
                moEntity.moCreationDate = manufacturingOrderDump.moCreationDate;
                moEntity.moClosedDate = manufacturingOrderDump.moClosedDate;
                moEntity.exFactoryDate = manufacturingOrderDump.exFactoryDate;
                moEntity.uploadedDate = new Date().toISOString();
                const moInfoEntity = await transactionalEntityManager.getRepository(MoInfoEntity).save(moEntity);
                for (const moLine of manufacturingOrderDump.moLines) {
                    const moLineEntity = new MoLineEntity();
                    moLineEntity.companyCode = req.companyCode;
                    moLineEntity.unitCode = req.unitCode;
                    moLineEntity.createdUser = req.username;
                    moLineEntity.moNumber = moInfoEntity.moNumber;
                    moLineEntity.moId = moInfoEntity.id;
                    moLineEntity.moLineNumber = moLine.moLineNumber;
                    moLineEntity.soNumber = moLine.soNumber;
                    moLineEntity.soLineNumber = moLine.soLineNumber;
                    const savedMoLineEntity = await transactionalEntityManager.getRepository(MoLineEntity).save(moLineEntity)
                    let index = 0;
                    for (const eachMoLineProduct of moLine.moLineProducts) {
                        const moLineProductEntity = new MoLineProductEntity();
                        moLineProductEntity.companyCode = req.companyCode;
                        moLineProductEntity.unitCode = req.unitCode;
                        moLineProductEntity.createdUser = req.username;
                        moLineProductEntity.moNumber = moInfoEntity.moNumber;
                        moLineProductEntity.moLineId = savedMoLineEntity.id;
                        moLineProductEntity.moLineNumber = moLineEntity.moLineNumber
                        moLineProductEntity.productCode = eachMoLineProduct.productCode;
                        // moLineProductEntity.productName = allProductsData.find(pro => pro.productCode == eachMoLineProduct.productCode).productName;
                        moLineProductEntity.productName = eachMoLineProduct.productCode;
                        moLineProductEntity.productType = eachMoLineProduct.productType;
                        moLineProductEntity.sequence = ++index;
                        moLineProductEntity.moLineNumber = moLineEntity.moLineNumber;
                        const savedMoLineProduct = await transactionalEntityManager.getRepository(MoLineProductEntity).save(moLineProductEntity)
                        for (const eachMoLineProductSubLine of eachMoLineProduct.moProductSubLines) {
                            const moProductSubLineEntity = new MoProductSubLineEntity();
                            moProductSubLineEntity.companyCode = req.companyCode;
                            moProductSubLineEntity.unitCode = req.unitCode;
                            moProductSubLineEntity.createdUser = req.username;
                            moProductSubLineEntity.moNumber = moInfoEntity.moNumber;
                            moProductSubLineEntity.moLineProductId = savedMoLineProduct.id;
                            moProductSubLineEntity.fgColor = eachMoLineProductSubLine.fgColor;
                            moProductSubLineEntity.size = eachMoLineProductSubLine.size;
                            moProductSubLineEntity.quantity = eachMoLineProductSubLine.quantity;
                            moProductSubLineEntity.destination = eachMoLineProductSubLine.destination;
                            moProductSubLineEntity.deliveryDate = eachMoLineProductSubLine.deliveryDate;
                            moProductSubLineEntity.schedule = eachMoLineProductSubLine.schedule;
                            moProductSubLineEntity.zFeature = eachMoLineProductSubLine.zFeature;
                            moProductSubLineEntity.planProdDate = eachMoLineProductSubLine.planProdDate;
                            moProductSubLineEntity.planCutDate = eachMoLineProductSubLine.planCutDate;
                            moProductSubLineEntity.moLineNumber = savedMoLineProduct.moLineNumber;
                            moProductSubLineEntity.productCode = savedMoLineProduct.productCode;
                            // moProductSubLineEntity.productName = allProductsData.find(pro => pro.productCode == savedMoLineProduct.productCode).productName;
                            moProductSubLineEntity.productName = savedMoLineProduct.productCode;
                            moProductSubLineEntity.productType = savedMoLineProduct.productType;
                            moProductSubLineEntity.styleCode = styleInfo.styleCode;
                            moProductSubLineEntity.soNumber = moLine.soNumber;
                            moProductSubLineEntity.soLineNumber = moLine.soLineNumber;
                            moProductSubLineEntity.buyerPo = eachMoLineProductSubLine.buyerPo;
                            const savedMoProductSubLineProduct = await transactionalEntityManager.getRepository(MoProductSubLineEntity).save(moProductSubLineEntity)
                            for (const eachOps of eachMoLineProductSubLine.pslOperations) {
                                const pslOperationEntity = new PslOperationEntity();
                                pslOperationEntity.companyCode = req.companyCode;
                                pslOperationEntity.unitCode = req.unitCode;
                                pslOperationEntity.createdUser = req.username;
                                pslOperationEntity.moNumber = moInfoEntity.moNumber;
                                pslOperationEntity.moProductSubLineId = savedMoProductSubLineProduct.id;
                                pslOperationEntity.opForm = eachOps.opForm;
                                pslOperationEntity.opCode = eachOps.opCode;
                                pslOperationEntity.iOpCode = eachOps.iOpCode;
                                pslOperationEntity.eOpCode = eachOps.eOpCode;
                                pslOperationEntity.opName = eachOps.opName;
                                pslOperationEntity.processType = eachOps.processType;
                                pslOperationEntity.opSmv = parseFloat(eachOps.opSmv) || 0;
                                pslOperationEntity.opWkStation = eachOps.opWkStation;
                                const savedPslOperation = await transactionalEntityManager.getRepository(PslOperationEntity).save(pslOperationEntity);
                                for (const eachMaterial of eachOps.pslOpRawMaterials) {
                                    const pslOperationRmEntity = new PslOperationRmEntity();
                                    pslOperationRmEntity.companyCode = req.companyCode;
                                    pslOperationRmEntity.unitCode = req.unitCode;
                                    pslOperationRmEntity.createdUser = req.username;
                                    pslOperationRmEntity.moNumber = moInfoEntity.moNumber;
                                    pslOperationRmEntity.pslOperationId = savedPslOperation.id;
                                    pslOperationRmEntity.itemCode = eachMaterial.itemCode;
                                    pslOperationRmEntity.opCode = eachMaterial.opCode;
                                    await transactionalEntityManager.getRepository(PslOperationRmEntity).save(pslOperationRmEntity);
                                }
                            }
                        }
                    }
                }
                const rmInfoEntities = [];
                manufacturingOrderDump.rawMaterials = manufacturingOrderDump.rawMaterials.filter(i => !!i?.itemCode);             
                for (const rawMaterial of manufacturingOrderDump.rawMaterials) {
                    const rmInfoEntity = new RmInfoEntity();
                    rmInfoEntity.companyCode = req.companyCode;
                    rmInfoEntity.unitCode = req.unitCode;
                    rmInfoEntity.createdUser = req.username;
                    rmInfoEntity.moNumber = moInfoEntity.moNumber;
                    rmInfoEntity.itemCode = rawMaterial.itemCode;
                    rmInfoEntity.itemName = rawMaterial.itemDesc;
                    rmInfoEntity.itemDesc = rawMaterial.itemDesc;
                    rmInfoEntity.sequence = manufacturingOrderDump.rawMaterials.indexOf(rawMaterial) + 1;
                    rmInfoEntity.consumption = rawMaterial.consumption;
                    rmInfoEntity.wastage = rawMaterial.wastage;
                    rmInfoEntity.itemType = rawMaterial.itemType;
                    rmInfoEntity.itemSubType = rawMaterial.itemSubType;
                    rmInfoEntity.itemColor = rawMaterial.itemColor;
                    rmInfoEntity.itemUom = rawMaterial.itemUom;
                    rmInfoEntities.push(rmInfoEntity);
                }
                await transactionalEntityManager.getRepository(RmInfoEntity).save(rmInfoEntities);

                const items: ItemModel[] = []

                for (const rawMaterial of manufacturingOrderDump.rawMaterials) {
                    const itemCode = rawMaterial.itemCode;
                    const itemName = rawMaterial.itemDesc;
                    const itemDesc = rawMaterial.itemDesc;
                    const itemType = rawMaterial.itemType;
                    const itemColor = rawMaterial.itemColor;

                    const eacItem = new ItemModel(null, itemName, itemCode, itemDesc, itemCode, true, itemType, BomItemTypeEnum.RM, itemColor);
                    items.push(eacItem);
                }

                const saveItems = await this.itemSharedService.checkAndSaveItems(new ItemCreateRequest(req.username, req.unitCode, req.companyCode, req.userId, items));

                if (!saveItems.status) {
                    throw new ErrorResponse(1, "Error in saving items");
                }

                // const moLineResults:MoLineEntity[] = await this.moLineRepo.save(moLineEntities);
                // const moLineProductEntities = [];
                // const moProductSubLineEntities = [];
                // const pslOperationEntities = [];
                // const pslOperationRmEntities = [];
                // for (let i = 0; i < manufacturingOrderDump.moLines.length; i++) {
                //     const moLine = manufacturingOrderDump.moLines[i];
                //     for (const product of moLine.moLineProducts) {
                //         const lineData = moLineResults.find((ml)=>ml.moLineNumber==moLine.moLineNumber);

                //         const moLineProductEntity = new MoLineProductEntity();

                //         //Product master Fetch
                //         const productReq = new ProductsIdRequest(req.username, req.unitCode, req.companyCode, req.userId, null, null, product.productCode)
                //         const productsData = await this.productService.getProductByProductCode(productReq);

                //         const productInfo = productsData?.data[0]




                //         moLineProductEntity.companyCode = req.companyCode;
                //         moLineProductEntity.unitCode = req.unitCode;
                //         moLineProductEntity.createdUser = req.username;
                //         moLineProductEntity.moNumber = moInfoEntity.moNumber;
                //         moLineProductEntity.moLineId = lineData.id;
                //         moLineProductEntity.moLineNumber = lineData.moLineNumber
                //         moLineProductEntity.productCode = product.productCode;
                //         moLineProductEntity.productName = productInfo.productName;
                //         moLineProductEntity.productType = product.productType;
                //         moLineProductEntity.sequence = moLine.moLineProducts.indexOf(product) + 1;
                //         moLineProductEntity.moLineNumber = lineData.moLineNumber;

                //         moLineProductEntities.push(moLineProductEntity);
                //     }
                // }
                // const moLineProductResults: MoLineProductEntity[] = await this.moLineProductRepo.save(moLineProductEntities);
                // for (let i = 0; i < manufacturingOrderDump.moLines.length; i++) {
                //     const moLine = manufacturingOrderDump.moLines[i];
                //     for (const product of moLine.moLineProducts) {
                //         const productLineData = moLineProductResults.find((prod) => prod.productCode = product.productCode);
                //         for (const subLine of product.moProductSubLines) {
                //             const moProductSubLineEntity = new MoProductSubLineEntity();
                //             moProductSubLineEntity.companyCode = req.companyCode;
                //             moProductSubLineEntity.unitCode = req.unitCode;
                //             moProductSubLineEntity.createdUser = req.username;
                //             moProductSubLineEntity.moNumber = moInfoEntity.moNumber;
                //             moProductSubLineEntity.moLineProductId = productLineData.id;
                //             moProductSubLineEntity.fgColor = subLine.fgColor;
                //             moProductSubLineEntity.size = subLine.size;
                //             moProductSubLineEntity.quantity = subLine.quantity;
                //             moProductSubLineEntity.destination = subLine.destination;
                //             moProductSubLineEntity.deliveryDate = new Date(subLine.deliveryDate).toISOString();
                //             moProductSubLineEntity.schedule = subLine.schedule;
                //             moProductSubLineEntity.zFeature = subLine.zFeature;
                //             moProductSubLineEntity.planProdDate = new Date(subLine.planProdDate).toISOString();
                //             moProductSubLineEntity.planCutDate = new Date(subLine.planCutDate).toISOString();
                //             moProductSubLineEntity.moLineNumber = productLineData.moLineNumber;
                //             moProductSubLineEntity.productCode = productLineData.productCode;
                //             moProductSubLineEntity.productName = productLineData.productName;
                //             moProductSubLineEntity.productType = productLineData.productType;
                //             moProductSubLineEntity.styleCode = styleInfo.styleCode;
                //             moProductSubLineEntity.soNumber = moLine.soNumber;
                //             moProductSubLineEntity.soLineNumber = moLine.soLineNumber;

                //             console.log(moProductSubLineEntity)
                //             moProductSubLineEntities.push(moProductSubLineEntity);
                //         }
                //     }
                // }
                // const moProductSubLineResults: MoProductSubLineEntity[] = await this.moProductSubLineRepo.save(moProductSubLineEntities);
                // console.log(moProductSubLineResults);


                // for (const eachSubLine of moProductSubLineResults) {
                //     const excelProductData = 
                // }

                // for (let i = 0; i < manufacturingOrderDump.moLines.length; i++) {
                //     const moLine = manufacturingOrderDump.moLines[i];    
                //     for (const product of moLine.moLineProducts) {
                //         for (const subLine of product.moProductSubLines) {
                //             const productSubLineData = moProductSubLineResults.find((sl) => sl.moLineNumber == moLine.moLineNumber && sl.productCode == product.productCode && sl.fgColor == subLine.fgColor && sl.size == subLine.size);
                //             for (const operation of subLine.pslOperations) {
                //                 const pslOperationEntity = new PslOperationEntity();
                //                 pslOperationEntity.companyCode = req.companyCode;
                //                 pslOperationEntity.unitCode = req.unitCode;
                //                 pslOperationEntity.createdUser = req.username;
                //                 pslOperationEntity.moNumber = moInfoEntity.moNumber;
                //                 pslOperationEntity.moProductSubLineId = productSubLineData.id;
                //                 pslOperationEntity.opForm = operation.opForm;
                //                 pslOperationEntity.opCode = operation.opCode;
                //                 pslOperationEntity.iOpCode = operation.iOpCode;
                //                 pslOperationEntity.eOpCode = operation.eOpCode;
                //                 pslOperationEntity.opName = operation.opName;
                //                 pslOperationEntity.processType = operation.processType;
                //                 pslOperationEntity.opSmv = parseFloat(operation.opSmv) || 0;
                //                 pslOperationEntity.opWkStation = operation.opWkStation;
                //                 pslOperationEntities.push(pslOperationEntity);
                //                 // for (const rm of operation.pslOpRawMaterials) {
                //                 //     const pslOperationRmEntity = new PslOperationRmEntity();
                //                 //     pslOperationRmEntity.companyCode = req.companyCode;
                //                 //     pslOperationRmEntity.unitCode = req.unitCode;
                //                 //     pslOperationRmEntity.createdUser = req.username;
                //                 //     pslOperationRmEntity.moNumber = moInfoEntity.moNumber;
                //                 //     pslOperationRmEntity.pslOperationId = 1;//Todo
                //                 //     pslOperationRmEntity.itemCode = rm.itemCode;
                //                 //     pslOperationRmEntity.opCode = rm.opCode;
                //                 //     pslOperationRmEntities.push(pslOperationRmEntity);
                //                 // }
                //             }

                //         }
                //     }
                // }
                // const pslOperationResults = await this.pslOperationRepo.save(pslOperationEntities);
                // for (let i = 0; i < manufacturingOrderDump.moLines.length; i++) {
                //     const moLine = manufacturingOrderDump.moLines[i];
                //     for (const product of moLine.moLineProducts) {
                //         for (const subLine of product.moProductSubLines) {
                //             const productSubLineData = moProductSubLineResults.find((sl) => sl.moLineNumber == moLine.moLineNumber && sl.productCode == product.productCode && sl.fgColor == subLine.fgColor && sl.size == subLine.size);

                //             for (let j = 0; j < subLine.pslOperations.length; j++) {
                //                 const operation = subLine.pslOperations[j];
                //                 const savedPslOperation = pslOperationResults.find(
                //                     (op) => op.opCode === operation.opCode && op.moProductSubLineId === productSubLineData.id
                //                 );
                //                 if (savedPslOperation) {
                //                     for (const rm of operation.pslOpRawMaterials) {
                //                         const pslOperationRmEntity = new PslOperationRmEntity();
                //                         pslOperationRmEntity.companyCode = req.companyCode;
                //                         pslOperationRmEntity.unitCode = req.unitCode;
                //                         pslOperationRmEntity.createdUser = req.username;
                //                         pslOperationRmEntity.moNumber = moInfoEntity.moNumber;
                //                         pslOperationRmEntity.pslOperationId = savedPslOperation.id;
                //                         pslOperationRmEntity.itemCode = rm.itemCode;
                //                         pslOperationRmEntity.opCode = rm.opCode;
                //                         pslOperationRmEntities.push(pslOperationRmEntity);
                //                     }
                //                 }
                //             }
                //         }
                //     }
                // }
                // await this.pslOperationRmRepo.save(pslOperationRmEntities);
            }
            await transactionalEntityManager.completeTransaction();
            const reqObj = new SI_MoNumberRequest(req.username, req.unitCode, req.companyCode, req.userId, req?.manufacturingOrderDumpData[0]?.moNumber, null, false, false, false, false, false, false, false, false, false, false, false, null, null)
            await this.moProductFgColorService.getAndSaveMoProductFgColorForMO(reqObj)
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
    async deleteOrders(req: SI_MoNumberRequest): Promise<GlobalResponseObject> {
        const manager = new GenericTransactionManager(this.dataSource);
        try {
            const moInfo = await this.moInfoRepo.findOne({ where: { moNumber: req.moNumber, unitCode: req.unitCode, companyCode: req.companyCode, isActive: true } });
            if (!moInfo) {
                throw new ErrorResponse(0, 'Manufacturing order info not found. Please check and try again')
            }
            await manager.startTransaction();
            await this.deleteMOInfo(req.moNumber, req.unitCode, req.companyCode, manager);
            await manager.completeTransaction();
            return new GlobalResponseObject(true, 0, 'Manufacturing order deleted successfully');
        } catch (err) {
            await manager.releaseTransaction();
            throw err;
        }


    }

    // called from UI
    async confirmManufacturingOrder(req: SI_MoNumberRequest): Promise<GlobalResponseObject> {
        const { moNumber, unitCode, companyCode, username, userId } = req;
        const manager = new GenericTransactionManager(this.dataSource);
        // update the is_confirmed column in the orders_info table
        const orderInfo = await this.moInfoRepo.findOne({ where: { moNumber, unitCode, companyCode, isActive: true } });
        if (orderInfo.isConfirmed == 1) {
            throw new ErrorResponse(0, 'Manufacturing order already confirmed.')
        }
        try {
            const moInfo = await this.moInfoRepo.findOne({ where: { moNumber, unitCode, companyCode, isActive: true } });
            if (!moInfo) {
                throw new ErrorResponse(0, 'Mo Give is not exists. Please check and try again');
            }
            const moProductFgColorInfo = await this.moProductFgColorRepo.find({ where: { moNumber, unitCode, companyCode, isActive: true } });
            if (!moProductFgColorInfo) {
                throw new ErrorResponse(0, 'Style product fg color info not found , Please try again');
            }
            await manager.startTransaction();
            for (const eachProductFgColor of moProductFgColorInfo) {
                const moProductFgColorVersion = await this.moOpVersionRepo.findOne({ where: { moProductFgColorId: eachProductFgColor.id, unitCode, companyCode, isActive: true } });
                if (!moProductFgColorVersion) {
                    throw new ErrorResponse(0, 'Operation Version does not exists for the the product ' + eachProductFgColor.productCode + 'AND color' + eachProductFgColor.fgColor)
                }
                const subLineInfo = await this.moProductSubLineRepo.getMoSizesInfoForMoProduct(moNumber, eachProductFgColor.productCode, eachProductFgColor.fgColor, unitCode, companyCode);
                if (!subLineInfo.length) {
                    throw new ErrorResponse(0, 'Sizes does not exists for the the product ' + eachProductFgColor.productCode + 'AND color' + eachProductFgColor.fgColor)
                }

            }
            await manager.getRepository(MoInfoEntity).update({ id: moInfo.id, unitCode, companyCode }, { isConfirmed: ConfirmationStatusEnum.CONFIRMED });
            await manager.completeTransaction();
            return new GlobalResponseObject(true, 0, 'Manufacturing order confirmed successfully');
        } catch (err) {
            await manager.releaseTransaction();
            throw err;
        }

    }

    /**
     * 
     * @param moNumber 
     * @param unitCode 
     * @param companyCode 
     * @param manager 
     * @returns 
    */
    async deleteMOInfo(moNumber: string, unitCode: string, companyCode: string, manager: GenericTransactionManager): Promise<boolean> {
        // Deleting existing mo number info
        await manager.getRepository(PslOperationRmEntity).delete({ moNumber: moNumber, unitCode: unitCode, companyCode: companyCode, isActive: true })
        await manager.getRepository(RmInfoEntity).delete({ moNumber: moNumber, unitCode: unitCode, companyCode: companyCode, isActive: true })
        await manager.getRepository(PslOperationEntity).delete({ moNumber: moNumber, unitCode: unitCode, companyCode: companyCode, isActive: true })
        await manager.getRepository(MoProductSubLineEntity).delete({ moNumber: moNumber, unitCode: unitCode, companyCode: companyCode, isActive: true })
        await manager.getRepository(MoLineProductEntity).delete({ moNumber: moNumber, unitCode: unitCode, companyCode: companyCode, isActive: true })
        await manager.getRepository(MoLineEntity).delete({ moNumber: moNumber, unitCode: unitCode, companyCode: companyCode, isActive: true })
        await manager.getRepository(MoInfoEntity).delete({ moNumber: moNumber, unitCode: unitCode, companyCode: companyCode, isActive: true });
        return true;
    }


    async checkAndSaveItemsForMO(req: SI_MoNumberRequest): Promise<GlobalResponseObject> {
        const items: ItemModel[] = []
        const rawMaterials = await this.rmInfoRepo.find({ where: { moNumber: req.moNumber, unitCode: req.unitCode, companyCode: req.companyCode, isActive: true } });
        if (!rawMaterials.length) {
            throw new ErrorResponse(0, 'Raw materials not found for the given mo number')
        }
        for (const rawMaterial of rawMaterials) {
            const itemCode = rawMaterial.itemCode;
            const itemName = rawMaterial.itemName;
            const itemDesc = rawMaterial.itemDesc;
            const itemType = rawMaterial.itemType;
            const itemColor = rawMaterial.itemColor;

            const eacItem = new ItemModel(null, itemName, itemCode, itemDesc, itemCode, true, itemType, BomItemTypeEnum.RM, itemColor);
            items.push(eacItem);
        }
        const saveItems = await this.itemSharedService.checkAndSaveItems(new ItemCreateRequest(req.username, req.unitCode, req.companyCode, req.userId, items));
        return new GlobalResponseObject(saveItems.status, saveItems.errorCode, saveItems.internalMessage);
    }

    async getPslIdsForMoCombinations(req: MoCombinationRequest): Promise<MoCombinationWithPslIdsResponse> {
        const pslIDsRes = await this.moProductSubLineRepo.getPslIdsForMoCombinaitons(req)
        if (!pslIDsRes.length) {
            throw new ErrorResponse(0, 'No PSL IDs found for the given mo number')
        }
        const moInfo: MoCombinationWithPslIdsModel[] = []
        for (const eachMoInfo of pslIDsRes) {
            const combinationDetails: MoCombinationDetails = {
                product: eachMoInfo.productCode,
                destination: eachMoInfo.destination,
                deliveryDate: moment(eachMoInfo.deliveryDate).format('MM-DD-YYYY'),
                color: eachMoInfo.fgColor

            }
            const moPslIds: number[] = eachMoInfo.pslIds?.split(',')?.map((v) => Number(v))
            const moInfoModel = new MoCombinationWithPslIdsModel(moPslIds, combinationDetails,pslIDsRes[0].moNumber)
            moInfo.push(moInfoModel)
        }
        return new MoCombinationWithPslIdsResponse(true, 1, "Daat retreived", moInfo)
    }

    async getOrderFeaturesForGivenPslIds(req: MoPslIdsRequest): Promise<MoPslIdsOrderFeaturesResponse> {
        const orderFeatuesArr = await this.moProductSubLineRepo.find({ select: ['fgColor', 'productCode', 'size', 'destination', 'deliveryDate', 'quantity', 'id','moNumber','oQType'],where:{id:In(req.moPslIds),companyCode:req.companyCode,unitCode:req.unitCode} })
        const moPslIdsOrderFeaturesArr: MoPslIdsOrderFeatures[] = []
        if (orderFeatuesArr.length) {

            for (const eachRec of orderFeatuesArr) {
                const moPslIdsOrderFeatures = new MoPslIdsOrderFeatures(eachRec.productCode, moment(eachRec.deliveryDate).format("MM-DD-YYYY"), eachRec.destination, eachRec.size, eachRec.fgColor, eachRec.quantity, eachRec.id,eachRec.moNumber,eachRec.oQType)
                moPslIdsOrderFeaturesArr.push(moPslIdsOrderFeatures)
            }
        }
        return new MoPslIdsOrderFeaturesResponse(true, 1, "Data retreived", moPslIdsOrderFeaturesArr)
    }

    

}