import { Inject, Injectable, LoggerService } from "@nestjs/common";
import { ErrorResponse } from "@xpparel/backend-utils";
import { CartonBarCodesReqDto, CartonBarcodeLocationRequest, CartonBarcodeRequest, CartonHeadInfoResponse, CartonPalletMapRequest, FgWhReportResponseModel, GlobalResponseObject, PKMSFgWhReqIdDto, PKMSWhCodeReqDto, PkmsFgWhCurrStageEnum } from "@xpparel/shared-models";
import { FGLocationAllocationService, PackListService } from "@xpparel/shared-services";
import dayjs from "dayjs";
import { FgWhRequestStatusEnum } from "packages/libs/shared-models/src/pkms/enum/fg-wh-reqstatus.enum";
import { In, Not } from "typeorm";
import { TransactionalBaseService } from "../../base-services";
import { ITransactionManager } from "../../database/typeorm-transactions";
import { FgWhReqHeaderEntity } from "./entity/fg-wh-req-header.entity";
import { FgWhReqSubLinesEntity } from "./entity/fg-wh-req-sub-lines.entity";
import { FgWhReqHeaderRepo } from "./repository/fg-wh-req-header.repo";
import { FgWhReqSubLineRepo } from "./repository/fg-wh-req-sub-line.repo";
import { CartonContainerMappingService } from "../location-allocation/carton-container-mapping.service";

@Injectable()
export class FgWarehouseBarcodeScanningService extends TransactionalBaseService {
    constructor(
        @Inject('FgWhReqHeaderRepoInterface')
        private readonly fgHeaderRepository: FgWhReqHeaderRepo,
        @Inject('FgWhReqSubLineRepoInterface')
        private readonly fgSubRepository: FgWhReqSubLineRepo,
        private packingListService: PackListService,
        @Inject('TransactionManager')
        transactionManager: ITransactionManager,
        @Inject('LoggerService')
        logger: LoggerService,
        private fGLocationAllocationService: FGLocationAllocationService
    ) {
        super(transactionManager, logger)
    }

    /**
     * Service to get barcode details for the carton barcode id
     * @param cartonBarcode 
     * @returns 
    */
    async FgWarehouseInBarcodeFgIn(cartonBarcode: CartonBarcodeRequest): Promise<CartonHeadInfoResponse> {
        const subEntityWhereClause = new FgWhReqSubLinesEntity();
        subEntityWhereClause.barcode = cartonBarcode.barcode;
        subEntityWhereClause.status = FgWhRequestStatusEnum.OPEN;
        if (cartonBarcode.fgwhreqHeadId) {
            subEntityWhereClause.fgWhRhId = cartonBarcode.fgwhreqHeadId;
        }
        const cartonDetails = await this.fgSubRepository.findOne({ where: subEntityWhereClause, select: ['id', 'fgWhRhId'] });
        if (!cartonDetails) {
            throw new ErrorResponse(46089, 'Carton Barcode Not Found Or Already scanned. Please check')
        }
        return this.executeWithTransaction(async (transactionManager) => {
            const subLineWhereClause = new FgWhReqSubLinesEntity();
            subLineWhereClause.id = cartonDetails.id;
            if (cartonBarcode.fgwhreqHeadId) {
                subLineWhereClause.fgWhRhId = cartonBarcode.fgwhreqHeadId;
            }
            await transactionManager.getRepository(FgWhReqSubLinesEntity).update(subLineWhereClause, { status: FgWhRequestStatusEnum.FG_IN, scanEndTime: dayjs().format('YYYY-MM-DD  H:mm:ss') });
            const scannedCount = await transactionManager.getRepository(FgWhReqSubLinesEntity).count({ where: { fgWhRhId: cartonDetails.fgWhRhId, status: FgWhRequestStatusEnum.FG_IN } })
            const pendingCount = await transactionManager.getRepository(FgWhReqSubLinesEntity).count({ where: { fgWhRhId: cartonDetails.fgWhRhId, status: FgWhRequestStatusEnum.OPEN } })
            if (scannedCount > 0 && pendingCount) {
                await transactionManager.getRepository(FgWhReqHeaderEntity).update({ id: cartonDetails.id }, { currentStage: PkmsFgWhCurrStageEnum.FG_IN_PROGRESS })
            }
            if (!pendingCount) {
                await transactionManager.getRepository(FgWhReqHeaderEntity).update({ id: cartonDetails.fgWhRhId }, { currentStage: PkmsFgWhCurrStageEnum.FG_IN_COMPLETE, scanEndTime: dayjs().format('YYYY-MM-DD  H:mm:ss') })
            }
            const barcodeInfo: CartonHeadInfoResponse = await this.packingListService.getBarcodeHeadInfo(cartonBarcode);
            if (!barcodeInfo.status) {
                throw new ErrorResponse(barcodeInfo.errorCode, barcodeInfo.internalMessage);
            }
            barcodeInfo.data.pendingCartonsForFgIn = await this.getPendingFgCartonsCountByReqHeadIdAndStatus(cartonDetails.fgWhRhId, FgWhRequestStatusEnum.OPEN, transactionManager);
            barcodeInfo.internalMessage = 'Barcode Scanned successfully';
            return barcodeInfo;
        })

    }


    /**
     * Service to get barcode details for the carton barcode id
     * @param cartonBarcode 
     * @returns 
    */
    async FgWarehouseInBarcodeFgOut(cartonBarcode: CartonBarcodeRequest): Promise<CartonHeadInfoResponse> {
        const cartonDetails = await this.fgSubRepository.findOne({ where: { barcode: cartonBarcode.barcode, status: FgWhRequestStatusEnum.LOCATION_OUT, fgWhRhId: cartonBarcode.fgwhreqHeadId }, select: ['id', 'fgWhRhId'] });
        if (!cartonDetails) {
            throw new ErrorResponse(46089, 'Carton Barcode Not Found Or Already scanned. Please check')
        }
        if (cartonDetails.status == FgWhRequestStatusEnum.FG_Out) {
            throw new ErrorResponse(46090, 'Barcode Already Scanned')
        }

        // if (cartonDetails.status != FgWhRequestStatusEnum.LOCATION_OUT) {
        //     throw new ErrorResponse(0, 'You should scan the location out to proceed for fg out')
        // }

        // await this.fgSubRepository.update({ id: cartonDetails.id }, { status: FgWhRequestStatusEnum .FG_Out });
        // const scannedCount = await this.fgSubRepository.count({where:{fgWhRhId:cartonDetails.fgWhRhId,status : FgWhRequestStatusEnum .FG_Out}})
        // const pendingCount = await this.fgSubRepository.count({where:{fgWhRhId:cartonDetails.fgWhRhId,status : FgWhRequestStatusEnum .FG_IN}})
        // if(scannedCount > 0 && pendingCount){
        // await this.fgHeaderRepository.update({id:cartonDetails.id},{currentStage:PkmsFgWhCurrStageEnum.FG_OUT_PROGRESS})
        await this.fgSubRepository.update({ id: cartonDetails.id }, { status: FgWhRequestStatusEnum.FG_Out });
        const scannedCount = await this.fgSubRepository.count({ where: { fgWhRhId: cartonDetails.fgWhRhId, status: FgWhRequestStatusEnum.FG_Out } })
        const pendingCount = await this.fgSubRepository.count({ where: { fgWhRhId: cartonDetails.fgWhRhId, status: FgWhRequestStatusEnum.LOCATION_OUT } })
        if (scannedCount > 0 && pendingCount) {
            await this.fgHeaderRepository.update({ id: cartonDetails.id }, { currentStage: PkmsFgWhCurrStageEnum.FG_OUT_PROGRESS })
        }
        if (!pendingCount) {
            await this.fgHeaderRepository.update({ id: cartonDetails.fgWhRhId }, { currentStage: PkmsFgWhCurrStageEnum.FG_OUT_COMPLETE })
        }
        const barcodeInfo: CartonHeadInfoResponse = await this.packingListService.getBarcodeHeadInfo(cartonBarcode);

        if (!barcodeInfo.status) {
            throw new ErrorResponse(barcodeInfo.errorCode, barcodeInfo.internalMessage);
        }
        barcodeInfo.internalMessage = "Carton Scanned Successfully";
        barcodeInfo.data.pendingCartonsForFgOut = await this.getPendingFgOutCartonsCountByReqHeadId(cartonDetails.fgWhRhId, FgWhRequestStatusEnum.LOCATION_OUT);
        return barcodeInfo;
    }

    async FgWarehouseInBarcodeLocationOut(req: CartonBarcodeRequest): Promise<CartonHeadInfoResponse> {
        const cartonDetails = await this.fgSubRepository.findOne({ where: { barcode: req.barcode, status: FgWhRequestStatusEnum.OPEN, fgWhRhId: req.fgwhreqHeadId }, select: ['id', 'fgWhRhId'] });
        if (!cartonDetails) {
            throw new ErrorResponse(46089, 'Carton Barcode Not Found Or Already scanned. Please check')
        }
        if (cartonDetails.status == FgWhRequestStatusEnum.LOCATION_OUT) {
            throw new ErrorResponse(46090, 'Barcode Already Scanned')
        }
        await this.fgSubRepository.update({ id: cartonDetails.id }, { status: FgWhRequestStatusEnum.LOCATION_OUT, location: null });
        const scannedCount = await this.fgSubRepository.count({ where: { fgWhRhId: cartonDetails.fgWhRhId, status: FgWhRequestStatusEnum.LOCATION_OUT } })
        const pendingCount = await this.fgSubRepository.count({ where: { fgWhRhId: cartonDetails.fgWhRhId, status: FgWhRequestStatusEnum.OPEN } })
        if (scannedCount > 0 && pendingCount) {
            await this.fgHeaderRepository.update({ id: cartonDetails.id }, { currentStage: PkmsFgWhCurrStageEnum.LOC_UNMAP_PROGRESS })
        }
        if (!pendingCount) {
            await this.fgHeaderRepository.update({ id: cartonDetails.fgWhRhId }, { currentStage: PkmsFgWhCurrStageEnum.LOC_UNMAP_COMPLETED })
        }
        const barcodeInfo: CartonHeadInfoResponse = await this.packingListService.getBarcodeHeadInfo(req);

        if (!barcodeInfo.status) {
            throw new ErrorResponse(barcodeInfo.errorCode, barcodeInfo.internalMessage);
        };
        const deAllocReq = new CartonBarCodesReqDto(req.username, req.unitCode, req.companyCode, req.userId, [req.barcode])
        await this.fGLocationAllocationService.deAllocateCartonsToContainerAtFgOutLocation(deAllocReq)
        barcodeInfo.internalMessage = "Carton Scanned Successfully";
        barcodeInfo.data.pendingCartonsForFgOut = await this.getPendingFgOutCartonsCountByReqHeadId(cartonDetails.fgWhRhId, FgWhRequestStatusEnum.FG_IN);
        return barcodeInfo;
    }



    async getPendingFgCartonsCountByReqHeadIdAndStatus(reqHeadId: number, status: FgWhRequestStatusEnum, transactionManager?: ITransactionManager) {
        if (transactionManager) {
            return await transactionManager.getRepository(FgWhReqSubLinesEntity).count({ where: { fgWhRhId: reqHeadId, status } })
        } else {
            const cartonInfo = await this.fgSubRepository.count({ where: { fgWhRhId: reqHeadId, status } });
            return cartonInfo;
        }
    }

    async getPendingFgOutCartonsCountByReqHeadId(reqHeadId: number, status: FgWhRequestStatusEnum) {
        const cartonInfo = await this.fgSubRepository.count({ where: { fgWhRhId: reqHeadId, status } });
        return cartonInfo;
    }

    /**
    * Service to get barcode details for the carton barcode id
    * @param cartonBarcode 
    * @returns 
   */
    async FgWarehouseInBarcodeLocationMapping(cartonBarcode: CartonBarcodeLocationRequest): Promise<GlobalResponseObject> {
        const cartonDetails = await this.fgSubRepository.find({ where: { barcode: In(cartonBarcode.barcode) }, select: ['id', 'fgWhRhId'] });
        if (!cartonDetails.length) {
            throw new ErrorResponse(46033, 'FG In Request is not available for given Container Cartons');
        }
        return this.executeWithTransaction(async (transactionManager) => {
            const fgWhIds = new Set<number>();
            cartonDetails.forEach(item => fgWhIds.add(item.fgWhRhId));
            for (const cartonFG of cartonDetails) {
                await this.fgSubRepository.update({ id: cartonFG.id }, { location: cartonBarcode.location });
                await transactionManager.getRepository(FgWhReqSubLinesEntity).update({ id: cartonFG.id }, { status: FgWhRequestStatusEnum.LOCATION_IN, location: cartonBarcode.location });
            }

            for (const fgWhId of fgWhIds) {
                const scannedCount = await transactionManager.getRepository(FgWhReqSubLinesEntity).count({ where: { fgWhRhId: fgWhId, status: FgWhRequestStatusEnum.LOCATION_IN } })
                const pendingCount = await transactionManager.getRepository(FgWhReqSubLinesEntity).count({ where: { fgWhRhId: fgWhId, status: FgWhRequestStatusEnum.PELLETIZED } });
                if (scannedCount > 0 && pendingCount) {
                    await transactionManager.getRepository(FgWhReqHeaderEntity).update({ id: fgWhId, currentStage: Not(PkmsFgWhCurrStageEnum.LOC_MAP_PROGRESS) }, { currentStage: PkmsFgWhCurrStageEnum.LOC_MAP_PROGRESS })
                }
                if (!pendingCount) {
                    await transactionManager.getRepository(FgWhReqHeaderEntity).update({ id: fgWhId }, { currentStage: PkmsFgWhCurrStageEnum.LOC_MAP_COMPLETED })
                }
            }

            return new GlobalResponseObject(true, 46034, 'Location mapped successfully')
        })

    }

    async getWhReqReport(req: PKMSWhCodeReqDto): Promise<FgWhReportResponseModel> {
        const reportData = await this.fgHeaderRepository.getFgWhLocationReport(req);
        if (!reportData.length) {
            throw new ErrorResponse(965, "Data Not Found")
        } else {
            return new FgWhReportResponseModel(true, 967, "Data Retrieved Successfully", reportData)
        }
    }



    async startFgInReqSession(req: PKMSFgWhReqIdDto): Promise<GlobalResponseObject> {
        const userReq = { unitCode: req.unitCode, companyCode: req.companyCode };
        return this.executeWithTransaction(async (transactionManager) => {
            await transactionManager.getRepository(FgWhReqHeaderEntity).update({ id: req.fgWhRequestId }, { scanStartTime: dayjs().format('YYYY-MM-DD H:mm:ss'), updatedUser: req.username })
            const findFgWhCartons = await transactionManager.getRepository(FgWhReqSubLinesEntity).update({ fgWhRhId: req.fgWhRequestId, ...userReq }, { scanStartTime: dayjs().format('YYYY-MM-DD H:mm:ss'), updatedUser: req.username });
            if (findFgWhCartons.affected) {
                return new GlobalResponseObject(true, 46035, "Session started successfully!")
            } else {
                return new GlobalResponseObject(false, 46036, "Session Not Started")
            }
        })

    }

    async fgInPalletisation(cartonBarcode: CartonPalletMapRequest): Promise<CartonHeadInfoResponse> {
        const subEntityWhereClause = new FgWhReqSubLinesEntity();
        subEntityWhereClause.barcode = cartonBarcode.cartonBarcode;
        subEntityWhereClause.status = FgWhRequestStatusEnum.FG_IN;
        if (cartonBarcode.fgWhReqHeadId) {
            subEntityWhereClause.fgWhRhId = cartonBarcode.fgWhReqHeadId;
        }
        const cartonDetails = await this.fgSubRepository.findOne({ where: subEntityWhereClause, select: ['id', 'fgWhRhId'] });
        if (!cartonDetails) {
            throw new ErrorResponse(46089, 'Carton Barcode Not Found Or Already scanned. Please check')
        }
        return this.executeWithTransaction(async (transactionManager) => {
            const subLineWhereClause = new FgWhReqSubLinesEntity();
            subLineWhereClause.id = cartonDetails.id;
            if (cartonBarcode.fgWhReqHeadId) {
                subLineWhereClause.fgWhRhId = cartonBarcode.fgWhReqHeadId;
            }
            await transactionManager.getRepository(FgWhReqSubLinesEntity).update(subLineWhereClause, { status: FgWhRequestStatusEnum.PELLETIZED, pallet: cartonBarcode.palletBarcode });
            const scannedCount = await transactionManager.getRepository(FgWhReqSubLinesEntity).count({ where: { fgWhRhId: cartonDetails.fgWhRhId, status: FgWhRequestStatusEnum.PELLETIZED } })
            const pendingCount = await transactionManager.getRepository(FgWhReqSubLinesEntity).count({ where: { fgWhRhId: cartonDetails.fgWhRhId, status: FgWhRequestStatusEnum.FG_IN } });
            if (scannedCount > 0 && pendingCount) {
                await transactionManager.getRepository(FgWhReqHeaderEntity).update({ id: cartonDetails.fgWhRhId, currentStage: Not(PkmsFgWhCurrStageEnum.PALLET_MAP_PROGRESS) }, { currentStage: PkmsFgWhCurrStageEnum.PALLET_MAP_PROGRESS })
            }
            if (!pendingCount) {
                await transactionManager.getRepository(FgWhReqHeaderEntity).update({ id: cartonDetails.fgWhRhId }, { currentStage: PkmsFgWhCurrStageEnum.PALLET_MAP_COMPLETED })
            }
            const barcodeInfo: CartonHeadInfoResponse = await this.packingListService.getBarcodeHeadInfo(new CartonBarcodeRequest(cartonBarcode.cartonBarcode, cartonBarcode.username, cartonBarcode.unitCode, cartonBarcode.companyCode, cartonBarcode.userId, cartonDetails.fgWhRhId));
            if (!barcodeInfo.status) {
                throw new ErrorResponse(barcodeInfo.errorCode, barcodeInfo.internalMessage);
            }
            barcodeInfo.data.pendingCartonsForFgIn = await this.getPendingFgCartonsCountByReqHeadIdAndStatus(cartonDetails.fgWhRhId, FgWhRequestStatusEnum.FG_IN, transactionManager);
            barcodeInfo.internalMessage = 'Barcode Scanned successfully';
            return barcodeInfo;
        })

    }



}
