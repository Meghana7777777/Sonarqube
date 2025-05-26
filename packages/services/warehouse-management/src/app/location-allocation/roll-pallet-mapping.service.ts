import { Inject, Injectable, forwardRef } from '@nestjs/common';
import { CurrentPalletLocationEnum, CurrentPalletStateEnum, GlobalResponseObject, InspectionPalletRollConfirmationRequest, InspectionPalletRollsModel, InspectionPalletRollsResponse, PackingListInfoModel, PackingListInfoResponse, PalletBehaviourEnum, PalletBinStatusEnum, PalletDetailsModel, PalletDetailsResponse, PalletGroupTypeEnum, PalletIdRequest, PalletRollMappingRequest, PalletSortPrefEnum, PhBatchLotRollRequest, RollBasicInfoModel, RollBasicInfoResponse, RollInfoModel, RollIssueQtyRequest, RollsGrnRequest, RollPalletMappingValidationModel, RollPalletMappingValidationResponse, PalletstatusChangeRequest } from '@xpparel/shared-models';
import { PalletBinMapRepo } from './repositories/pallet-bin-map.repository';
import { PalletRollMapRepo } from './repositories/pallet-roll-map.repository';
import { PalletBinMapHistoryRepo } from './repositories/pallet-bin-map-history.repository';
import { PalletRollMapHistoryRepo } from './repositories/pallet-roll-map-history.repository';
import { DataSource } from 'typeorm';
import { ErrorResponse } from '@xpparel/backend-utils';
import { PalletRollMapEntity } from './entities/pallet-roll-map.entity';
import { GenericTransactionManager } from '../../database/typeorm-transactions/generic-transaction-manager';
import { PalletRollMapHistoryEntity } from './entities/pallet-roll-map-history.entity';
import { LcoationMappingHelperService } from './location-mapping-helper.service';
import { PalletsDataService } from '../master-data/master-services/pallets/pallets.service';
import { PalletBinMapEntity } from './entities/pallet-bin-map.entity';
import { PalletBinMappingService } from './pallet-bin-mapping.service';
import { dataSource } from '../../database/type-orm-config/typeorm.config-migrations';
import { PalletInfoService } from './pallet-info.service';
import { PalletGroupInfoService } from './pallet-group-info.service';
import { PalletGroupCreationService } from './pallet-group-creation.service';
import { MaterialIssuanceService } from './material-issuance.service';

@Injectable()
export class RollPalletMappingService {
    private CAPACITY_TRIMMER = 1;
    constructor(
        private dataSource: DataSource,
        private palletInfoService: PalletInfoService,
        private palletRollMapRepo: PalletRollMapRepo,
        @Inject(forwardRef(() => LcoationMappingHelperService)) private locAllocHelper: LcoationMappingHelperService,
        @Inject(forwardRef(() => PalletGroupCreationService)) private pgCreationService: PalletGroupCreationService,
        @Inject(forwardRef(() => PalletGroupInfoService)) private pgInfoService: PalletGroupInfoService,
        @Inject(forwardRef(() => PalletsDataService)) private palletsMasterService: PalletsDataService,
        @Inject(forwardRef(() => MaterialIssuanceService)) private materialIssuanceService: MaterialIssuanceService,
    ) {

    }

    // ENDPOINT
    // VALIDATOR
    async validateConfirmRollsToPallet(req: PalletRollMappingRequest): Promise<RollPalletMappingValidationResponse> {
        const rollId = req?.rollInfo[0]?.rollId;
        const incomingPalletId = req.palletId;
        if (!rollId) {
            throw new ErrorResponse(6113, 'Enter the Object');
        }
        const rollsInfo = await this.locAllocHelper.getBasicInfoForRollIds(req.companyCode, req.unitCode, [rollId]);
        const currRollInfo = rollsInfo[0];
        const isInspectionRoll = currRollInfo.inspectionPick;
        const currBatch = currRollInfo.batch;

        const incomingPalletInfo = await this.palletInfoService.getPalletInfoAndItsRollIds(req.companyCode, req.unitCode, incomingPalletId, false);
        const currentConfirmedRollsInPallet = Number(incomingPalletInfo.totalConfirmedRolls);

        // get the pre mapped pallet id for the roll 
        const pgType = isInspectionRoll ? PalletGroupTypeEnum.INSPECTION : PalletGroupTypeEnum.WAREHOUSE;
        const defaultPalletMapping = await this.pgInfoService.getDefaultPalletMappedForARoll(req.companyCode, req.unitCode, rollId, pgType);
        const pgId = defaultPalletMapping.pgId;
        let suggestedPalletId = defaultPalletMapping.defaulPalletId;
        let suggestedPalletCode = '';
        // If the suggested pallet id is not present i.e when the roll under a PG is first time being put into a pallet, the suggested pallet will be empty
        if (suggestedPalletId) {
            const suggestedPalletInfo = await this.palletInfoService.getPalletInfoAndItsRollIds(req.companyCode, req.unitCode, suggestedPalletId, false);
            suggestedPalletCode = suggestedPalletInfo.palletCode;
        } else {
            suggestedPalletId = incomingPalletId;
            suggestedPalletCode = incomingPalletInfo.palletCode;
        }

        // get tha bathces of the current pallet
        const batchesInPallet = await this.getBatchesInCurrentPallet(req.companyCode, req.unitCode, req.palletId);

        // have to return 
        // 1 - trying to override the pallet capacity
        // 2 - trying to mix diffrenet batches if its a warehouse roll
        // 3 - trying to allocate a different pallet other then suggested

        const rollPalletPreInfo = new RollPalletMappingValidationModel(rollsInfo, incomingPalletInfo.palletId, incomingPalletInfo.palletCode, suggestedPalletId, suggestedPalletCode, incomingPalletInfo.maxItems, currentConfirmedRollsInPallet, batchesInPallet);

        return new RollPalletMappingValidationResponse(true, 6114, 'Object pallet allocation validation info retrieved', [rollPalletPreInfo]);
    }

    // ENDPOINT
    // WRITER
    async confirmRollsToPallet(req: PalletRollMappingRequest): Promise<GlobalResponseObject> {
        const transManager = new GenericTransactionManager(this.dataSource);
        try {
            const palletRollMapHistoryEnts: PalletRollMapHistoryEntity[] = [];
            // check what type the roll is
            const rollId = req?.rollInfo[0]?.rollId;
            const incomingPalletId = req.palletId;
            if (!rollId) {
                throw new ErrorResponse(6115, 'Enter the Object');
            }
            const rollsInfo = await this.locAllocHelper.getBasicInfoForRollIds(req.companyCode, req.unitCode, [rollId]);
            console.log(rollsInfo,'llllll')
            const currRollInfo = rollsInfo[0];
            const isInspectionRoll = currRollInfo.inspectionPick;
            const palletInfo = await this.palletInfoService.getPalletInfoAndItsRollIds(req.companyCode, req.unitCode, req.palletId, false);
            // 1. EXCEEDING PALLET CAPACITY
            // chekc if the pallet has some free capacity to be fulfilled
            if (!req.isOverRideSysAllocation) {
                const supportableRollsToPallet = Number(palletInfo.maxItems) - Number(palletInfo.totalConfirmedRolls);
                if (supportableRollsToPallet <= 0) {
                    throw new ErrorResponse(6116, 'Pallet capacity is already filled, you cannot add more rolls');
                }
            }
            // get the pre mapped pallet id for the roll 
            const pgType = isInspectionRoll ? PalletGroupTypeEnum.INSPECTION : PalletGroupTypeEnum.WAREHOUSE;
            const initialPalletInfo = await this.pgInfoService.getDefaultPalletMappedForARoll(req.companyCode, req.unitCode, rollId, pgType);
            const pgId = initialPalletInfo.pgId;
            const existingPalletId = initialPalletInfo.defaulPalletId;

            // 2. OVERRIDING THE SUGGESTED PALLET
            // now check if the incoming pallet and the initial pallet are same if override is not chosen
            if (!req.isOverRideSysAllocation) {
                if (existingPalletId && existingPalletId != incomingPalletId) {
                    throw new ErrorResponse(6117, 'System suggested and the incoming pallet is not matching');
                }
            }
            // now check if we are trying to put a roll that is for a different Batch/Lot -- only for warehouse rolls
            if (!currRollInfo.inspectionPick) {
                // 3. OVERRIDING THE MULTIPLE BATCH ROLLS INTO 1 PALLET
                if (!req.isOverRideSysAllocation) {
                    const batchesInPallet = await this.getBatchesInCurrentPallet(req.companyCode, req.unitCode, req.palletId);
                    // If the current incoming batch is not matching the already existing batches in the pallet, then throw error
                    if (!batchesInPallet.includes(currRollInfo.batch)) {
                        throw new ErrorResponse(6118, 'Objects with different bacth numbers cannot be assigned to same pallet for warehouse storage');
                    }
                }
            }


            if (!req.insRollOverride) {
                // check if we are not mixing the warehouse & inspection rolls into the same pallet
                await this.checkIfInsAndWhRollsAreBeingMixed(req, currRollInfo);
            }


            await transManager.startTransaction();
            // if the pallet is empty, the it means we are scanning it for the first time
            if (!existingPalletId) {
                // if no any warehouse rolls mapped to the pallet then map the incoming pallet id
                await this.pgCreationService.updatePalletIdToPg(req.companyCode, req.unitCode, pgId, incomingPalletId, req.username, transManager);
            }

            // finally map the roll to the pallet with confirmed status
            // if the current roll is already mapped to a pallet, then update it
            const rollAlreadyMapped = await this.palletRollMapRepo.findOne({ select: ['id', 'confirmedPalletId'], where: { companyCode: req.companyCode, unitCode: req.unitCode, itemLinesId: rollId } });
            if (rollAlreadyMapped?.confirmedPalletId == incomingPalletId) {
                throw new ErrorResponse(6119, 'The current Object you are scanning is already in the current pallet you selected');
            }
            if (rollAlreadyMapped) {
                await transManager.getRepository(PalletRollMapEntity).update({ itemLinesId: rollId }, { companyCode: req.companyCode, unitCode: req.unitCode, status: PalletBinStatusEnum.CONFIRMED, updatedUser: req.username, confirmedPalletId: incomingPalletId });

                // construct the history entity
                const palletRollMapHistoryEnt = this.getPalletRollMapHistoryEntity(req.companyCode, req.unitCode, rollAlreadyMapped.confirmedPalletId, incomingPalletId, rollId, currRollInfo.packListId, req.username);
                palletRollMapHistoryEnts.push(palletRollMapHistoryEnt);
                await transManager.getRepository(PalletRollMapHistoryEntity).save(palletRollMapHistoryEnt, { reload: false });
            } else {
                const palletRollMapEnt = this.getPalletRollMapEntity(req.companyCode, req.unitCode, currRollInfo.packListId, incomingPalletId, incomingPalletId, rollId, PalletBinStatusEnum.CONFIRMED, req.username);
                await transManager.getRepository(PalletRollMapEntity).save(palletRollMapEnt);
            }
            // after all, check for the current PG id, if it do not have any rolls mapped under it, then make its pallet id to null
            await this.checkAndUpdatePalletIdToPg(req.companyCode, req.unitCode, pgId, req.username, transManager);

            // After all, change the pallet status based on the rolls in it
            await this.updateTheCurrentLocationForAPallet(req.companyCode, req.unitCode, incomingPalletId, req.username, transManager);
            if (rollAlreadyMapped) {
                if (rollAlreadyMapped.confirmedPalletId != incomingPalletId) {
                    await this.updateTheCurrentLocationForAPallet(req.companyCode, req.unitCode, rollAlreadyMapped.confirmedPalletId, req.username, transManager);
                }
            }
            // check and confirm GRN automatically
            await this.locAllocHelper.updateGrnCompleteForRollAndPackListAutomatically(req.companyCode, req.unitCode, currRollInfo.rollId, currRollInfo.packListId, req.username, transManager);
            await transManager.completeTransaction();
            return new GlobalResponseObject(true, 6120, 'Object mapped to pallet successfully');
        } catch (error) {
            await transManager.releaseTransaction();
            throw error;
        }
    }

    // HELPER
    // VALIDATOR
    async getBatchesInCurrentPallet(companyCode: string, unitCode: string, palletId: number): Promise<string[]> {
        const batchesInPallet: string[] = [];
        // get all the rolls in the current pallet
        const palletRollsInfo = await this.palletRollMapRepo.getConfirmedRollIdsForPalletId(companyCode, unitCode, palletId);
        if (palletRollsInfo.length > 0) {
            const rollIdsInPallet: number[] = [];
            palletRollsInfo.forEach(r => rollIdsInPallet.push(r.item_lines_id));

            // get the basic roll info for all the rolls in the pallet
            const rollsInfo = await this.locAllocHelper.getBasicInfoForRollIds(companyCode, unitCode, rollIdsInPallet);
            rollsInfo.forEach(r => batchesInPallet.push(r.batch));
        }
        return batchesInPallet;
    }

    // TODO: Have to implement the validation for the same packing list also
    // HELPER
    // VALIDATOR
    async checkIfInsAndWhRollsAreBeingMixed(req: PalletRollMappingRequest, currRollInfo: RollBasicInfoModel): Promise<boolean> {
        // ---------------------------------------- OPPOSITE ROLL VALIATION --------------------------------
        let oppositeRolls = [];
        let infoText = '';
        // check if that pallet id is not conataining any warehouse rolls/ inspection rolls based on the roll type
        if (currRollInfo.inspectionPick) {
            oppositeRolls = await this.palletRollMapRepo.getWarehouseRollIdsForPalletId(req.companyCode, req.unitCode, req.palletId);
            infoText = 'warehouse';
        } else {
            oppositeRolls = await this.palletRollMapRepo.getInspectionRollIdsForPalletId(req.companyCode, req.unitCode, req.palletId);
            infoText = 'inspection';
        }
        if (oppositeRolls.length > 0) {
            throw new ErrorResponse(6121, 'Pallet is having rolls that were allocated for the ' + infoText + ' storage');
        }
        // --------------------------------------------------------------------------------------------------
        return true;
    }

    // HELPER
    // WRITER
    async checkAndUpdatePalletIdToPg(companyCode: string, unitCode: string, pgId: number, username: string, transManager: GenericTransactionManager): Promise<boolean> {
        const rollsInPg = await this.pgInfoService.getRollIdsMappedForPg(companyCode, unitCode, pgId, transManager);
        const palletsMappedToRollIds = await this.palletRollMapRepo.getConfirmedPalletIdsForRollIds(companyCode, unitCode, rollsInPg, transManager);
        if (palletsMappedToRollIds.length == 0) {
            // updae the ref pallet id to null
            await this.pgCreationService.updatePalletIdToPg(companyCode, unitCode, pgId, null, username, transManager);
        }
        if (palletsMappedToRollIds.length == 1) {
            // updae the ref pallet id to pallet id
            await this.pgCreationService.updatePalletIdToPg(companyCode, unitCode, pgId, palletsMappedToRollIds[0], username, transManager);
        }
        return true;
    }


    // HELPER
    getPalletRollMapHistoryEntity(companyCode: string, unitCode: string, fromPalletId: number, toPalletId: number, rollId: number, packListId: number, username: string): PalletRollMapHistoryEntity {
        const rollMapHistoryEnt = new PalletRollMapHistoryEntity();
        rollMapHistoryEnt.companyCode = companyCode;
        rollMapHistoryEnt.unitCode = unitCode;
        rollMapHistoryEnt.fromPalletId = fromPalletId;
        rollMapHistoryEnt.toPalletId = toPalletId;
        rollMapHistoryEnt.itemLinesId = rollId;
        rollMapHistoryEnt.movedBy = username;
        rollMapHistoryEnt.packListId = packListId;
        rollMapHistoryEnt.createdUser = username;
        return rollMapHistoryEnt;
    }

    // HELPER
    getPalletRollMapEntity(companyCode: string, unitCode: string, packListId: number, suggestedPalletId: number, confirmedPalletId: number, rollId: number, status: PalletBinStatusEnum, username: string): PalletRollMapEntity {
        const rollMapEnt = new PalletRollMapEntity();
        rollMapEnt.companyCode = companyCode;
        rollMapEnt.unitCode = unitCode;
        rollMapEnt.packListId = packListId;
        rollMapEnt.suggestedPalletId = suggestedPalletId;
        rollMapEnt.confirmedPalletId = confirmedPalletId;
        rollMapEnt.itemLinesId = rollId;
        rollMapEnt.status = status;
        rollMapEnt.createdUser = username;
        return rollMapEnt;
    }

    // HELPER
    async updateTheCurrentLocationForAPallet(companyCode: string, uniCode: string, palletId: number, username: string, transManager: GenericTransactionManager): Promise<boolean> {
        const confirmedRolls = await transManager.getRepository(PalletRollMapEntity).find({ select: ['itemLinesId'], where: { companyCode: companyCode, unitCode: uniCode, confirmedPalletId: palletId, status: PalletBinStatusEnum.CONFIRMED } });

        let behaviourStatus: PalletBehaviourEnum = null;
        let locStatus: CurrentPalletLocationEnum = null;
        let workStatus: CurrentPalletStateEnum = null;
        if (confirmedRolls.length == 0) {
            // move the status of the pallet to FREE
            workStatus = CurrentPalletStateEnum.FREE;
            locStatus = CurrentPalletLocationEnum.NONE;
            behaviourStatus = PalletBehaviourEnum.GENERAL;
        } else {
            const rollIds = confirmedRolls.map(r => r.itemLinesId);
            // move the status of the pallet to ONWORK
            let inspectionRoll = false;
            const rollsInfo = await this.locAllocHelper.getBasicInfoForRollIds(companyCode, uniCode, rollIds);
            rollsInfo.forEach(r => {
                if (r.inspectionPick) { inspectionRoll = true; }
            });

            locStatus = inspectionRoll ? CurrentPalletLocationEnum.INSPECTION : CurrentPalletLocationEnum.WAREHOUSE;
            workStatus = CurrentPalletStateEnum.ONWORK;
            behaviourStatus = inspectionRoll ? PalletBehaviourEnum.QUARANTINE : PalletBehaviourEnum.GENERAL;
        }
        await this.locAllocHelper.updatePalletLocWorkBehState(companyCode, uniCode, [palletId], locStatus, behaviourStatus, workStatus, username, transManager);
        return true;

    }

    // ENDPOINT
    // WRITER
    async deAllocateRollsToPallet(req: PalletRollMappingRequest, needToIssueAfterRollDeAllocation: boolean = false, externalManager?: GenericTransactionManager): Promise<GlobalResponseObject> {
        const transManager = externalManager ? externalManager : new GenericTransactionManager(this.dataSource);
        try {
            // check if the roll mapping really eixst
            const rollId = req.rollInfo[0].rollId;
            const markAsIssued = req.markAsIssued;
            if (!rollId) {
                throw new ErrorResponse(6339, 'Object id is not provided');
            }
            const rollAlreadyMapped = await this.pgInfoService.getConfirmedPalletMappedForARoll(req.companyCode, req.unitCode, rollId);
            if (!rollAlreadyMapped.defaulPalletId) {
                throw new ErrorResponse(6122, 'Object is not mapped to the selected pallet.');
            }

            // now unmap the record and insert into the log
            const palletRollMapHistoryEnt = this.getPalletRollMapHistoryEntity(req.companyCode, req.unitCode, rollAlreadyMapped.defaulPalletId, 0, rollId, rollAlreadyMapped.packListId, req.username);
            palletRollMapHistoryEnt.remarks = 'REMOVED BY USER : ' + req.username;
            if (!externalManager) {
                await transManager.startTransaction();
            }
            // save the history entity
            await transManager.getRepository(PalletRollMapHistoryEntity).save(palletRollMapHistoryEnt, { reload: false });
            // delete the current mapping entity
            await transManager.getRepository(PalletRollMapEntity).delete({ companyCode: req.companyCode, unitCode: req.unitCode, isActive: true, itemLinesId: rollId });


            //Assign pallet to normal Stage
            const rollsInPallet = await this.palletRollMapRepo.getRollIdsForPalletId(req.companyCode, req.unitCode, req.palletId);
            const rollIds = new Set<number>();
            rollsInPallet.forEach(r => rollIds.add(r.item_lines_id));
            const currRollIds = Array.from(rollIds);
            if (currRollIds.length == 1 && req.palletId > 0) {
                const palletStatusChangeRequest = new PalletstatusChangeRequest(req.username, req.unitCode, req.companyCode, req.userId, req.palletId, CurrentPalletStateEnum.FREE, CurrentPalletLocationEnum.NONE, PalletBehaviourEnum.QUARANTINE);
                await this.palletsMasterService.updatePalletLocationStatus(palletStatusChangeRequest, transManager);
            }

            // -------------------------------------------------------------------
            // NOTE: THIS IS A RECURSIVE CODE BLOCK. PLEASE BE ALERT
            if (markAsIssued && needToIssueAfterRollDeAllocation) {
                const rollsInfo = await this.locAllocHelper.getBasicInfoForRollIds(req.companyCode, req.unitCode, [rollId]);
                const rollInfo = rollsInfo[0];
                const pendingQty = rollInfo.originalQty - (Number(rollInfo.issuedQuantity) ?? 0);
                const issuanceReq = new RollIssueQtyRequest(req.username, req.unitCode, req.companyCode, req.userId, rollId, pendingQty, 'SYSTEM REMOVED ON RECONCILIATION', false);
                await this.materialIssuanceService.issueRollQuantity(issuanceReq, false, transManager);
            }
            // --------------------------------------------------------------------

            if (!externalManager) {
                await transManager.completeTransaction();
            }
            return new GlobalResponseObject(true, 6338, 'Objects deallocated from the pallet');
        } catch (error) {
            if (!externalManager) {
                await transManager.releaseTransaction();
            }
            throw error;
        }
    }

    // ENDPOINT
    // WRITER
    async deAllocateRollsToPalletatIssuance(req: PalletRollMappingRequest, extRemarks: string, needToIssueAfterRollDeAllocation: boolean = false, externalManager?: GenericTransactionManager): Promise<GlobalResponseObject> {
        const transManager = externalManager ? externalManager : new GenericTransactionManager(this.dataSource);
        try {
            // check if the roll mapping really eixst
            // console.log('---function called here');
            const rollId = req.rollInfo[0].rollId;
            const markAsIssued = req.markAsIssued;
            if (!rollId) {
                throw new ErrorResponse(6339, 'Object id is not provided');
            }
            const rollAlreadyMapped = await this.pgInfoService.getConfirmedPalletMappedForARoll(req.companyCode, req.unitCode, rollId);
            if (!rollAlreadyMapped?.defaulPalletId) {
                // throw new ErrorResponse(0, 'Roll is not mapped to the selected pallet.');
                return new GlobalResponseObject(true, 6123, 'Object quantity issued');
            } else {
                // now unmap the record and insert into the log
                const palletRollMapHistoryEnt = this.getPalletRollMapHistoryEntity(req.companyCode, req.unitCode, rollAlreadyMapped.defaulPalletId, 0, rollId, rollAlreadyMapped.packListId, req.username);
                palletRollMapHistoryEnt.remarks = extRemarks ? extRemarks : 'REMOVED BY USER : ' + req.username;
                if (!externalManager) {
                    await transManager.startTransaction();
                }
                await transManager.getRepository(PalletRollMapHistoryEntity).save(palletRollMapHistoryEnt, { reload: false });
                // delete the current mapping entity
                await transManager.getRepository(PalletRollMapEntity).delete({ companyCode: req.companyCode, unitCode: req.unitCode, isActive: true, itemLinesId: rollId });
                //Assign pallet to normal Stage
                const rollsInPallet = await this.palletRollMapRepo.getRollIdsForPalletId(req.companyCode, req.unitCode, rollAlreadyMapped.defaulPalletId, transManager);
                const rollIds = new Set<number>();
                rollsInPallet.forEach(r => rollIds.add(r.item_lines_id));
                const currRollIds = Array.from(rollIds);
                // console.log('---level-3---'+req.palletId);
                if (currRollIds.length == 0 && rollAlreadyMapped.defaulPalletId) {
                    const palletStatusChangeRequest = new PalletstatusChangeRequest(req.username, req.unitCode, req.companyCode, req.userId, rollAlreadyMapped.defaulPalletId, CurrentPalletStateEnum.FREE, CurrentPalletLocationEnum.NONE, PalletBehaviourEnum.QUARANTINE);
                    await this.palletsMasterService.updatePalletLocationStatus(palletStatusChangeRequest, transManager);
                }
            }
            if (!externalManager) {
                await transManager.completeTransaction();
            }
            return new GlobalResponseObject(true, 6338, 'Objects deallocated from the pallet');
        } catch (error) {
            if (!externalManager) {
                await transManager.releaseTransaction();
            }
            throw error;
        }
    }
}