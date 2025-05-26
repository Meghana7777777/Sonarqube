import { Inject, Injectable, forwardRef } from '@nestjs/common';
import { GlobalResponseObject, PalletRollMappingRequest, RollIdRequest, RollIdsRequest, RollIssueQtyRequest } from '@xpparel/shared-models';
import { DataSource } from 'typeorm';
import { GenericTransactionManager } from '../../database/typeorm-transactions/generic-transaction-manager';
import { LcoationMappingHelperService } from './location-mapping-helper.service';
import { PackingListActualInfoService } from '../packing-list/packing-list-actuals-info.service';
import { RollPalletMappingService } from './roll-pallet-mapping.service';
import { TrayRollMappingService } from '../tray-trolly/tray-roll-mapping.service';
import { PhItemIssuanceEntity } from '../packing-list/entities/ph-item-issuance.entity';

@Injectable()
export class MaterialIssuanceService {

    constructor(
        private dataSource: DataSource,
        private locAllocHelper: LcoationMappingHelperService,
        @Inject(forwardRef(() => PackingListActualInfoService)) private packListActualInfoSerive: PackingListActualInfoService,
        @Inject(forwardRef(() => RollPalletMappingService)) private rollPalletMappinService: RollPalletMappingService,
        @Inject(forwardRef(() => TrayRollMappingService)) private trayRollMapService: TrayRollMappingService
    ) {

    }

    /**
     * Issues the roll quantity
     * @param req 
     * @returns 
     */
    async issueRollQuantity(req: RollIssueQtyRequest, needDeallocationOfPallet: boolean = false, externalManager?: GenericTransactionManager): Promise<GlobalResponseObject> {
        const transManager = externalManager ? externalManager : new GenericTransactionManager(this.dataSource);
        try {
            if (!externalManager) {
                await transManager.startTransaction();
            }
            const issuedQtyUpdate = await this.packListActualInfoSerive.updateIssuedQuantity(req.unitCode, req.companyCode, req.username, req.rollId, req.issuedQty, req.remarks, transManager);


            const phItemIssueEnt = this.getItemIssuanceEntity(req.unitCode, req.companyCode, req.username, req.remarks, req.issuedQty, req.rollId);
            // insert the record into the log table
            await transManager.getRepository(PhItemIssuanceEntity).save(phItemIssueEnt, { reload: false });

            // -------------------------------------------------------------------
            // NOTE: THIS IS A RECURSIVE CODE BLOCK. PLEASE BE ALERT
            if (needDeallocationOfPallet && req.deAllocateFromPallet) {
                // once after the issuance is done, if the pending roll qty is 0, then de-allocate it from the pallet
                const rollsInfo = await this.locAllocHelper.getBasicInfoForRollIds(req.companyCode, req.unitCode, [req.rollId]);
                const rollInfo = rollsInfo[0];
                // only if the roll is reconcile, then remove from the pallet
                const totalissuedQuantity = (Number(rollInfo.issuedQuantity) + Number(req.issuedQty)).toFixed(2);
                if (Number(totalissuedQuantity) == Number(rollInfo.inputQuantity)) {
                    // Once after the issuance, if the roll qty is no more, then de-allocate the roll from the pallet
                    // de-allocate the pallet to the roll
                    const rollInfo = new RollIdRequest(req.username, req.unitCode, req.companyCode, req.userId, req.rollId, null);
                    const deAllocReq = new PalletRollMappingRequest(req.username, req.unitCode, req.companyCode, req.userId, null, null, false, null, null, [rollInfo], false);
                    await this.rollPalletMappinService.deAllocateRollsToPalletatIssuance(deAllocReq, null, false, transManager);
                    // deallocate the roll from the tray if exist
                    await this.trayRollMapService.unmapRollFromTrayInternal(req.rollId, req.companyCode, req.unitCode, req.username, transManager);
                }
            }
            // --------------------------------------------------------------------

            if (!externalManager) {
                await transManager.completeTransaction();
            }
            return new GlobalResponseObject(true, 6082, 'Object quantity issued');
        } catch (error) {
            if (!externalManager) {
                await transManager.releaseTransaction();
            }
            throw error;
        }

    }

    getItemIssuanceEntity(unitCode: string, companyCode: string, username: string, remarks: string, issuedQty: number, rollId: number): PhItemIssuanceEntity {
        const ent = new PhItemIssuanceEntity();
        ent.companyCode = companyCode;
        ent.createdUser = username;
        ent.unitCode = unitCode;
        ent.phItemLineId = rollId;
        ent.issuedQuantity = issuedQty;
        ent.remarks = remarks;
        return ent;
      }

}