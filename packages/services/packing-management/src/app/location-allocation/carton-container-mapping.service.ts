import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { ErrorResponse } from '@xpparel/backend-utils';
import { FgContainerStatusChangeRequest, FgCurrentContainerLocationEnum, FgCurrentContainerStateEnum, FgContainerBehaviorEnum, FgContainerLocationStatusEnum, GlobalResponseObject, FGContainerGroupTypeEnum, ContainerCartonMappingRequest, CartonBasicInfoModel, CartonIssueQtyRequest, CartonContainerMappingValidationModel, CartonContainerMappingValidationResponse, CartonScanReqNoDto, CartonPalletMapRequest, CartonBarCodesReqDto, CartonIdRequest } from '@xpparel/shared-models';
import { DataSource } from 'typeorm';
import { GenericTransactionManager } from '../../database/typeorm-transactions/generic-transaction-manager';
import { FgContainerDataService } from '../__masters__/container/fg-container-data-service';
import { FGContainerCartonMapHistoryEntity } from './entities/container-carton-map-history.entity';
import { FGContainerCartonMapEntity } from './entities/container-carton-map.entity';
import { LocationMappingHelperService } from './location-mapping-helper.service';
import { MaterialIssuanceService } from './material-issuance.service';
import { ContainerGroupCreationService } from './container-group-creation.service';
import { FGContainerGroupInfoService } from './container-group-info.service';
import { ContainerInfoService } from './container-info.service';
import { ContainerCartonMapRepo } from './repositories/container-carton-map.repository';
import { CrtnEntity } from '../packing-list/entities/crtns.entity';
import { FgWarehouseBarcodeScanningService } from '../fg-warehouse/fg-wh-barcode-scanning.service';

@Injectable()
export class CartonContainerMappingService {
    private CAPACITY_TRIMMER = 1;
    constructor(
        private dataSource: DataSource,
        private containerInfoService: ContainerInfoService,
        private containerCartonMapRepo: ContainerCartonMapRepo,
        @Inject(forwardRef(() => LocationMappingHelperService)) private locAllocHelper: LocationMappingHelperService,
        @Inject(forwardRef(() => ContainerGroupCreationService)) private pgCreationService: ContainerGroupCreationService,
        @Inject(forwardRef(() => FGContainerGroupInfoService)) private pgInfoService: FGContainerGroupInfoService,
        @Inject(forwardRef(() => FgContainerDataService)) private containersMasterService: FgContainerDataService,
        @Inject(forwardRef(() => MaterialIssuanceService)) private materialIssuanceService: MaterialIssuanceService,
        private fgWarehouseBarcodeScanningService: FgWarehouseBarcodeScanningService,
    ) {

    }

    // ENDPOINT
    // VALIDATOR
    async validateConfirmCartonsToContainer(req: ContainerCartonMappingRequest): Promise<CartonContainerMappingValidationResponse> {
        const cartonId = req?.cartonInfo[0]?.cartonId;
        const incomingContainerId = req.containerId;
        if (!cartonId) {
            throw new ErrorResponse(36102, 'Enter the carton');
        }
        const cartonsInfo = await this.locAllocHelper.getBasicInfoForCartonIds(req.companyCode, req.unitCode, [cartonId]);
        const currCartonInfo = cartonsInfo[0];
        const isInspectionCarton = currCartonInfo.inspectionPick;
        const currBatch = currCartonInfo.packListCode;

        const incomingContainerInfo = await this.containerInfoService.getContainerInfoAndItsCartonIds(req.companyCode, req.unitCode, incomingContainerId, false);
        const currentConfirmedCartonsInContainer = Number(incomingContainerInfo.totalConfirmedCartons);
        console.log(incomingContainerInfo, 'incomingContainerInfo')
        // get the pre mapped container id for the carton 
        const pgType = isInspectionCarton ? FGContainerGroupTypeEnum.INSPECTION : FGContainerGroupTypeEnum.WAREHOUSE;
        const defaultContainerMapping = await this.pgInfoService.getDefaultContainerMappedForACarton(req.companyCode, req.unitCode, cartonId, pgType, true);
        console.log(defaultContainerMapping, 'defaultContainerMapping')
        const pgId = defaultContainerMapping?.pgId;
        let suggestedContainerId = defaultContainerMapping?.defaulContainerId;
        let suggestedContainerCode = '';
        // If the suggested container id is not present i.e when the carton under a PG is first time being put into a container, the suggested container will be empty
        if (suggestedContainerId) {
            const suggestedContainerInfo = await this.containerInfoService.getContainerInfoAndItsCartonIds(req.companyCode, req.unitCode, suggestedContainerId, false);
            suggestedContainerCode = suggestedContainerInfo.containerCode;
        } else {
            suggestedContainerId = incomingContainerId;
            suggestedContainerCode = incomingContainerInfo.containerCode;
        }

        // get tha bathces of the current container
        const batchesInContainer = await this.getBatchesInCurrentContainer(req.companyCode, req.unitCode, req.containerId);

        // have to return 
        // 1 - trying to override the container capacity
        // 2 - trying to mix diffrenet batches if its a warehouse carton
        // 3 - trying to allocate a different container other then suggested

        const cartonContainerPreInfo = new CartonContainerMappingValidationModel(cartonsInfo, incomingContainerInfo.containerId, incomingContainerInfo.containerCode, suggestedContainerId, suggestedContainerCode, incomingContainerInfo.maxItems, currentConfirmedCartonsInContainer, batchesInContainer);

        return new CartonContainerMappingValidationResponse(true, 46042, 'Carton container allocation validation info retrieved', [cartonContainerPreInfo]);
    }

    // ENDPOINT
    // WRITER
    async confirmCartonsToContainer(req: ContainerCartonMappingRequest): Promise<GlobalResponseObject> {
        const transManager = new GenericTransactionManager(this.dataSource);
        try {
            const containerCartonMapHistoryEnts: FGContainerCartonMapHistoryEntity[] = [];
            // check what type the carton is
            const cartonId = req?.cartonInfo[0]?.cartonId;
            const incomingContainerId = req.containerId;
            if (!cartonId) {
                throw new ErrorResponse(36102, 'Please Enter Valid Carton Barcode');
            }
            const cartonsInfo = await this.locAllocHelper.getBasicInfoForCartonIds(req.companyCode, req.unitCode, [cartonId]);
            const currCartonInfo = cartonsInfo[0];
            const isInspectionCarton = currCartonInfo.inspectionPick;
            const containerInfo = await this.containerInfoService.getContainerInfoAndItsCartonIds(req.companyCode, req.unitCode, req.containerId, false);
            // 1. EXCEEDING PALLET CAPACITY
            // chekc if the container has some free capacity to be fulfilled
            if (!req.isOverRideSysAllocation) {
                const supportableCartonsToContainer = Number(containerInfo.maxItems) - Number(containerInfo.totalConfirmedCartons);
                if (supportableCartonsToContainer <= 0) {
                    throw new ErrorResponse(46043, 'Container capacity is already filled, you cannot add more cartons');
                }
            }
            // get the pre mapped container id for the carton 
            const pgType = isInspectionCarton ? FGContainerGroupTypeEnum.INSPECTION : FGContainerGroupTypeEnum.WAREHOUSE;
            const initialContainerInfo = await this.pgInfoService.getDefaultContainerMappedForACarton(req.companyCode, req.unitCode, cartonId, pgType, true);
            const pgId = initialContainerInfo?.pgId;
            const existingContainerId = initialContainerInfo?.defaulContainerId;

            // 2. OVERRIDING THE SUGGESTED PALLET
            // now check if the incoming container and the initial container are same if override is not chosen
            if (!req.isOverRideSysAllocation) {
                if (existingContainerId && existingContainerId != incomingContainerId) {
                    throw new ErrorResponse(46044, 'System suggested and the incoming container is not matching');
                }
            }
            // now check if we are trying to put a carton that is for a different Batch/Lot -- only for warehouse cartons
            if (!currCartonInfo.inspectionPick) {
                // 3. OVERRIDING THE MULTIPLE BATCH ROLLS INTO 1 PALLET
                if (!req.isOverRideSysAllocation) {
                    const batchesInContainer = await this.getBatchesInCurrentContainer(req.companyCode, req.unitCode, req.containerId);
                    // If the current incoming batch is not matching the already existing batches in the container, then throw error
                    if (!batchesInContainer.includes(currCartonInfo.packListCode)) {
                        throw new ErrorResponse(46045, 'Cartons with different bacth numbers cannot be assigned to same container for warehouse storage');
                    }
                }
            }


            if (!req.insCartonOverride) {
                // check if we are not mixing the warehouse & inspection cartons into the same container
                await this.checkIfInsAndWhCartonsAreBeingMixed(req, currCartonInfo);
            }


            await transManager.startTransaction();
            // if the container is empty, the it means we are scanning it for the first time
            if (!existingContainerId) {
                // if no any warehouse cartons mapped to the container then map the incoming container id
                await this.pgCreationService.updateContainerIdToPg(req.companyCode, req.unitCode, pgId, incomingContainerId, req.username, transManager);
            }

            // finally map the carton to the container with confirmed status
            // if the current carton is already mapped to a container, then update it
            const cartonAlreadyMapped = await this.containerCartonMapRepo.findOne({ select: ['id', 'confirmedContainerId'], where: { companyCode: req.companyCode, unitCode: req.unitCode, itemLinesId: cartonId } });
            if (cartonAlreadyMapped?.confirmedContainerId == incomingContainerId) {
                throw new ErrorResponse(46046, 'The current carton you are scanning is already in the current container you selected');
            }
            if (cartonAlreadyMapped) {
                await transManager.getRepository(FGContainerCartonMapEntity).update({ itemLinesId: cartonId }, { companyCode: req.companyCode, unitCode: req.unitCode, status: FgContainerLocationStatusEnum.CONFIRMED, updatedUser: req.username, confirmedContainerId: incomingContainerId });

                // construct the history entity
                const containerCartonMapHistoryEnt = this.getContainerCartonMapHistoryEntity(req.companyCode, req.unitCode, cartonAlreadyMapped.confirmedContainerId, incomingContainerId, cartonId, currCartonInfo.packOrderId, req.username);
                containerCartonMapHistoryEnts.push(containerCartonMapHistoryEnt);
                await transManager.getRepository(FGContainerCartonMapHistoryEntity).save(containerCartonMapHistoryEnt, { reload: false });
            } else {
                const containerCartonMapEnt = this.getContainerCartonMapEntity(req.companyCode, req.unitCode, currCartonInfo.packOrderId, incomingContainerId, incomingContainerId, cartonId, FgContainerLocationStatusEnum.CONFIRMED, req.username);
                await transManager.getRepository(FGContainerCartonMapEntity).save(containerCartonMapEnt);
            }
            // after all, check for the current PG id, if it do not have any cartons mapped under it, then make its container id to null
            await this.checkAndUpdateContainerIdToPg(req.companyCode, req.unitCode, pgId, req.username, transManager);

            // After all, change the container status based on the cartons in it
            await this.updateTheCurrentLocationForAContainer(req.companyCode, req.unitCode, incomingContainerId, req.username, transManager);
            if (cartonAlreadyMapped) {
                if (cartonAlreadyMapped.confirmedContainerId != incomingContainerId) {
                    await this.updateTheCurrentLocationForAContainer(req.companyCode, req.unitCode, cartonAlreadyMapped.confirmedContainerId, req.username, transManager);
                }
            }
            await this.fgWarehouseBarcodeScanningService.fgInPalletisation(new CartonPalletMapRequest(req.cartonInfo[0].barcode, containerInfo.barcode, req.username, req.unitCode, req.companyCode, req.userId));
            await transManager.completeTransaction();
            return new GlobalResponseObject(true, 46047, 'Carton mapped to container successfully');
        } catch (error) {
            console.log(error)
            await transManager.releaseTransaction();
            throw error;
        }
    }

    // HELPER
    // VALIDATOR
    async getBatchesInCurrentContainer(companyCode: string, unitCode: string, containerId: number): Promise<string[]> {
        const batchesInContainer: string[] = [];
        // get all the cartons in the current container
        const containerCartonsInfo = await this.containerCartonMapRepo.getConfirmedCartonIdsForContainerId(companyCode, unitCode, containerId);
        if (containerCartonsInfo.length > 0) {
            const cartonIdsInContainer: number[] = [];
            containerCartonsInfo.forEach(r => cartonIdsInContainer.push(r.item_lines_id));

            // get the basic carton info for all the cartons in the container
            const cartonsInfo = await this.locAllocHelper.getBasicInfoForCartonIds(companyCode, unitCode, cartonIdsInContainer);
            cartonsInfo.forEach(r => batchesInContainer.push(r.packListCode));
        }
        return batchesInContainer;
    }

    // TODO: Have to implement the validation for the same packing list also
    // HELPER
    // VALIDATOR
    async checkIfInsAndWhCartonsAreBeingMixed(req: ContainerCartonMappingRequest, currCartonInfo: CartonBasicInfoModel): Promise<boolean> {
        // ---------------------------------------- OPPOSITE ROLL VALIATION --------------------------------
        let oppositeCartons = [];
        let infoText = '';
        // check if that container id is not conataining any warehouse cartons/ inspection cartons based on the carton type
        if (currCartonInfo.inspectionPick) {
            oppositeCartons = await this.containerCartonMapRepo.getWarehouseCartonIdsForContainerId(req.companyCode, req.unitCode, req.containerId);
            infoText = 'warehouse';
        } else {
            oppositeCartons = await this.containerCartonMapRepo.getInspectionCartonIdsForContainerId(req.companyCode, req.unitCode, req.containerId);
            infoText = 'insepction';
        }
        if (oppositeCartons.length > 0) {
            throw new ErrorResponse(46041, 'Container is having cartons that were allocated for the ' + infoText + ' storage');
        }
        // --------------------------------------------------------------------------------------------------
        return true;
    }

    // HELPER
    // WRITER
    async checkAndUpdateContainerIdToPg(companyCode: string, unitCode: string, pgId: number, username: string, transManager: GenericTransactionManager): Promise<boolean> {
        const cartonsInPg = await this.pgInfoService.getCartonIdsMappedForPg(companyCode, unitCode, pgId, transManager);
        const containersMappedToCartonIds = await this.containerCartonMapRepo.getConfirmedContainerIdsForCartonIds(companyCode, unitCode, cartonsInPg, transManager);
        if (containersMappedToCartonIds.length == 0) {
            // updae the ref container id to null
            await this.pgCreationService.updateContainerIdToPg(companyCode, unitCode, pgId, null, username, transManager);
        }
        if (containersMappedToCartonIds.length == 1) {
            // updae the ref container id to container id
            await this.pgCreationService.updateContainerIdToPg(companyCode, unitCode, pgId, containersMappedToCartonIds[0], username, transManager);
        }
        return true;
    }


    // HELPER
    getContainerCartonMapHistoryEntity(companyCode: string, unitCode: string, fromContainerId: number, toContainerId: number, cartonId: number, packListId: number, username: string): FGContainerCartonMapHistoryEntity {
        const cartonMapHistoryEnt = new FGContainerCartonMapHistoryEntity();
        cartonMapHistoryEnt.companyCode = companyCode;
        cartonMapHistoryEnt.unitCode = unitCode;
        cartonMapHistoryEnt.fromContainerId = fromContainerId;
        cartonMapHistoryEnt.toContainerId = toContainerId;
        cartonMapHistoryEnt.itemLinesId = cartonId;
        cartonMapHistoryEnt.movedBy = username;
        cartonMapHistoryEnt.packListId = packListId;
        cartonMapHistoryEnt.createdUser = username;
        return cartonMapHistoryEnt;
    }

    // HELPER
    getContainerCartonMapEntity(companyCode: string, unitCode: string, packListId: number, suggestedContainerId: number, confirmedContainerId: number, cartonId: number, status: FgContainerLocationStatusEnum, username: string): FGContainerCartonMapEntity {
        const cartonMapEnt = new FGContainerCartonMapEntity();
        cartonMapEnt.companyCode = companyCode;
        cartonMapEnt.unitCode = unitCode;
        cartonMapEnt.packListId = packListId;
        cartonMapEnt.suggestedContainerId = suggestedContainerId;
        cartonMapEnt.confirmedContainerId = confirmedContainerId;
        cartonMapEnt.itemLinesId = cartonId;
        cartonMapEnt.status = status;
        cartonMapEnt.createdUser = username;
        return cartonMapEnt;
    }

    // HELPER
    async updateTheCurrentLocationForAContainer(companyCode: string, uniCode: string, containerId: number, username: string, transManager: GenericTransactionManager): Promise<boolean> {
        const confirmedCartons = await transManager.getRepository(FGContainerCartonMapEntity).find({ select: ['itemLinesId'], where: { companyCode: companyCode, unitCode: uniCode, confirmedContainerId: containerId, status: FgContainerLocationStatusEnum.CONFIRMED } });

        let behaviorStatus: FgContainerBehaviorEnum = null;
        let locStatus: FgCurrentContainerLocationEnum = null;
        let workStatus: FgCurrentContainerStateEnum = null;
        if (confirmedCartons.length == 0) {
            // move the status of the container to FREE
            workStatus = FgCurrentContainerStateEnum.FREE;
            locStatus = FgCurrentContainerLocationEnum.NONE;
            behaviorStatus = FgContainerBehaviorEnum.GENERAL;
        } else {
            const cartonIds = confirmedCartons.map(r => r.itemLinesId);
            // move the status of the container to ONWORK
            let inspectionCarton = false;
            const cartonsInfo = await this.locAllocHelper.getBasicInfoForCartonIds(companyCode, uniCode, cartonIds);
            cartonsInfo.forEach(r => {
                if (r.inspectionPick) { inspectionCarton = true; }
            });

            locStatus = inspectionCarton ? FgCurrentContainerLocationEnum.INSPECTION : FgCurrentContainerLocationEnum.WAREHOUSE;
            workStatus = FgCurrentContainerStateEnum.ONWORK;
            behaviorStatus = inspectionCarton ? FgContainerBehaviorEnum.QUARANTINE : FgContainerBehaviorEnum.GENERAL;
        }
        await this.locAllocHelper.updateContainerLocWorkBehState(companyCode, uniCode, [containerId], locStatus, behaviorStatus, workStatus, username, transManager);
        return true;

    }



    async deAllocateCartonsToContainerAtFgOutLocation(req: CartonBarCodesReqDto): Promise<GlobalResponseObject> {
        try {
            const findCartonBarCodeId = await this.dataSource.getRepository(CrtnEntity).findOne({ select: ['id'], where: { barcode: req.cartonBarCodes[0] } })
            const cartonAlreadyMapped = await this.pgInfoService.getConfirmedContainerMappedForACarton(req.companyCode, req.unitCode, findCartonBarCodeId.id);
            const cartonsReq = [new CartonIdRequest(req.username, req.unitCode, req.companyCode, req.userId, findCartonBarCodeId.id, req.cartonBarCodes[0])]
            const allocationReq = new ContainerCartonMappingRequest(req.username, req.unitCode, req.companyCode, req.userId, undefined, cartonAlreadyMapped.defaulContainerId, false, FgCurrentContainerLocationEnum.PACKING, false, cartonsReq, false, false)
            const deAllocation = await this.deAllocateCartonsToContainer(allocationReq);
            if (!deAllocation.status) {
                throw new ErrorResponse(65414, deAllocation.internalMessage)
            }
            return deAllocation
        } catch (error) {
            console.log(error)
            throw new ErrorResponse(4561, error.message)
        }

    }


    // ENDPOINT
    // WRITER
    async deAllocateCartonsToContainer(req: ContainerCartonMappingRequest, needToIssueAfterCartonDeAllocation: boolean = false, externalManager?: GenericTransactionManager): Promise<GlobalResponseObject> {
        const transManager = externalManager ? externalManager : new GenericTransactionManager(this.dataSource);
        try {
            // check if the carton mapping really eixst
            const cartonId = req.cartonInfo[0].cartonId;
            const markAsIssued = req.markAsIssued;
            if (!cartonId) {
                throw new ErrorResponse(36100, 'Carton id is not provided');
            }
            const cartonAlreadyMapped = await this.pgInfoService.getConfirmedContainerMappedForACarton(req.companyCode, req.unitCode, cartonId);
            if (!cartonAlreadyMapped.defaulContainerId) {
                throw new ErrorResponse(36101, 'Carton is not mapped to the selected container.');
            }

            // now unmap the record and insert into the log
            const containerCartonMapHistoryEnt = this.getContainerCartonMapHistoryEntity(req.companyCode, req.unitCode, cartonAlreadyMapped.defaulContainerId, 0, cartonId, cartonAlreadyMapped.packListId, req.username);
            containerCartonMapHistoryEnt.remarks = 'REMOVED BY USER : ' + req.username;
            if (!externalManager) {
                await transManager.startTransaction();
            }
            // save the history entity
            await transManager.getRepository(FGContainerCartonMapHistoryEntity).save(containerCartonMapHistoryEnt, { reload: false });
            // delete the current mapping entity
            await transManager.getRepository(FGContainerCartonMapEntity).delete({ companyCode: req.companyCode, unitCode: req.unitCode, isActive: true, itemLinesId: cartonId });


            //Assign container to normal Stage
            const cartonsInContainer = await this.containerCartonMapRepo.getCartonIdsForContainerId(req.companyCode, req.unitCode, req.containerId);
            const cartonIds = new Set<number>();
            cartonsInContainer.forEach(r => cartonIds.add(r.item_lines_id));
            const currCartonIds = Array.from(cartonIds);
            if (currCartonIds.length == 1 && req.containerId > 0) {
                const containerStatusChangeRequest = new FgContainerStatusChangeRequest(req.username, req.unitCode, req.companyCode, req.userId, req.containerId, FgCurrentContainerStateEnum.FREE, FgCurrentContainerLocationEnum.NONE, FgContainerBehaviorEnum.QUARANTINE);
                await this.containersMasterService.updateContainerLocationStatus(containerStatusChangeRequest, transManager);
            }

            // -------------------------------------------------------------------
            // NOTE: THIS IS A RECURSIVE CODE BLOCK. PLEASE BE ALERT
            if (markAsIssued && needToIssueAfterCartonDeAllocation) {
                const cartonsInfo = await this.locAllocHelper.getBasicInfoForCartonIds(req.companyCode, req.unitCode, [cartonId]);
                const cartonInfo = cartonsInfo[0];
                const pendingQty = cartonInfo.originalQty - (Number(cartonInfo.scannedQuantity) ?? 0);
                const issuanceReq = new CartonIssueQtyRequest(req.username, req.unitCode, req.companyCode, req.userId, cartonId, pendingQty, 'SYSTEM REMOVED ON RECONCILIATION', false);
                await this.materialIssuanceService.issueCartonQuantity(issuanceReq, false, transManager);
            }
            // --------------------------------------------------------------------

            if (!externalManager) {
                await transManager.completeTransaction();
            }
            return new GlobalResponseObject(true, 36099, 'Cartons deallocated from the container');
        } catch (error) {
            if (!externalManager) {
                await transManager.releaseTransaction();
            }
            throw error;
        }
    }

    // ENDPOINT
    // WRITER
    async deAllocateCartonsToContaineratIssuance(req: ContainerCartonMappingRequest, extRemarks: string, needToIssueAfterCartonDeAllocation: boolean = false, externalManager?: GenericTransactionManager): Promise<GlobalResponseObject> {
        const transManager = externalManager ? externalManager : new GenericTransactionManager(this.dataSource);
        try {
            // check if the carton mapping really eixst
            // console.log('---function called here');
            const cartonId = req.cartonInfo[0].cartonId;
            const markAsIssued = req.markAsIssued;
            if (!cartonId) {
                throw new ErrorResponse(36100, 'Carton id is not provided');
            }
            const cartonAlreadyMapped = await this.pgInfoService.getConfirmedContainerMappedForACarton(req.companyCode, req.unitCode, cartonId);
            if (!cartonAlreadyMapped?.defaulContainerId) {
                // throw new ErrorResponse(36101, 'Carton is not mapped to the selected container.');
                return new GlobalResponseObject(true, 46048, 'Carton quantity issued');
            } else {
                // now unmap the record and insert into the log
                const containerCartonMapHistoryEnt = this.getContainerCartonMapHistoryEntity(req.companyCode, req.unitCode, cartonAlreadyMapped.defaulContainerId, 0, cartonId, cartonAlreadyMapped.packListId, req.username);
                containerCartonMapHistoryEnt.remarks = extRemarks ? extRemarks : 'REMOVED BY USER : ' + req.username;
                if (!externalManager) {
                    await transManager.startTransaction();
                }
                await transManager.getRepository(FGContainerCartonMapHistoryEntity).save(containerCartonMapHistoryEnt, { reload: false });
                // delete the current mapping entity
                await transManager.getRepository(FGContainerCartonMapEntity).delete({ companyCode: req.companyCode, unitCode: req.unitCode, isActive: true, itemLinesId: cartonId });
                //Assign container to normal Stage
                const cartonsInContainer = await this.containerCartonMapRepo.getCartonIdsForContainerId(req.companyCode, req.unitCode, cartonAlreadyMapped.defaulContainerId, transManager);
                const cartonIds = new Set<number>();
                cartonsInContainer.forEach(r => cartonIds.add(r.item_lines_id));
                const currCartonIds = Array.from(cartonIds);
                // console.log('---level-3---'+req.containerId);
                if (currCartonIds.length == 0 && cartonAlreadyMapped.defaulContainerId) {
                    const containerStatusChangeRequest = new FgContainerStatusChangeRequest(req.username, req.unitCode, req.companyCode, req.userId, cartonAlreadyMapped.defaulContainerId, FgCurrentContainerStateEnum.FREE, FgCurrentContainerLocationEnum.NONE, FgContainerBehaviorEnum.QUARANTINE);
                    await this.containersMasterService.updateContainerLocationStatus(containerStatusChangeRequest, transManager);
                }
            }
            if (!externalManager) {
                await transManager.completeTransaction();
            }
            return new GlobalResponseObject(true, 36099, 'Cartons deallocated from the container');
        } catch (error) {
            if (!externalManager) {
                await transManager.releaseTransaction();
            }
            throw error;
        }
    }

    async deAllocateCartonByBarCode(req: CartonScanReqNoDto): Promise<GlobalResponseObject> {
        const transManager = new GenericTransactionManager(this.dataSource);
        try {
            const carton = await transManager.getRepository(CrtnEntity).findOne({ where: { barcode: req.cartonBarcode } });
            if (!carton) {
                throw new ErrorResponse(46049, 'Carton not found with given barcode')
            }
            const cartonAlreadyMapped = await this.pgInfoService.getConfirmedContainerMappedForACarton(req.companyCode, req.unitCode, carton.id);
            if (!cartonAlreadyMapped.defaulContainerId) {
                throw new ErrorResponse(36101, 'Carton is not mapped to the selected container.');
            }

            // now unmap the record and insert into the log
            const containerCartonMapHistoryEnt = this.getContainerCartonMapHistoryEntity(req.companyCode, req.unitCode, cartonAlreadyMapped.defaulContainerId, 0, carton.id, cartonAlreadyMapped.packListId, req.username);
            containerCartonMapHistoryEnt.remarks = 'REMOVED BY USER : ' + req.username;

            await transManager.startTransaction();

            // save the history entity
            await transManager.getRepository(FGContainerCartonMapHistoryEntity).save(containerCartonMapHistoryEnt, { reload: false });
            // delete the current mapping entity
            await transManager.getRepository(FGContainerCartonMapEntity).delete({ companyCode: req.companyCode, unitCode: req.unitCode, isActive: true, itemLinesId: carton.id });


            //Assign container to normal Stage
            const cartonsInContainer = await this.containerCartonMapRepo.getCartonIdsForContainerId(req.companyCode, req.unitCode, cartonAlreadyMapped.defaulContainerId);
            const cartonIds = new Set<number>();
            cartonsInContainer.forEach(r => cartonIds.add(r.item_lines_id));
            const currCartonIds = Array.from(cartonIds);
            if (currCartonIds.length == 1 && cartonAlreadyMapped.defaulContainerId > 0) {
                const containerStatusChangeRequest = new FgContainerStatusChangeRequest(req.username, req.unitCode, req.companyCode, req.userId, cartonAlreadyMapped.defaulContainerId, FgCurrentContainerStateEnum.FREE, FgCurrentContainerLocationEnum.NONE, FgContainerBehaviorEnum.QUARANTINE);
                await this.containersMasterService.updateContainerLocationStatus(containerStatusChangeRequest, transManager);
            }
            return new GlobalResponseObject(true, 811, '')
        } catch (err) {
            await transManager.releaseTransaction();
            throw err;
        }
    }
}