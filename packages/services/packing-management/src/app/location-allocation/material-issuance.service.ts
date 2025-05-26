import { Inject, Injectable, forwardRef } from '@nestjs/common';
import { GlobalResponseObject, ContainerCartonMappingRequest, CartonIdRequest, CartonIssueQtyRequest } from '@xpparel/shared-models';
import { DataSource } from 'typeorm';
import { GenericTransactionManager } from '../../database/typeorm-transactions/generic-transaction-manager';
import { LocationMappingHelperService } from './location-mapping-helper.service';
import { CartonContainerMappingService } from './carton-container-mapping.service';

@Injectable()
export class MaterialIssuanceService {

    constructor(
        private dataSource: DataSource,
        private locAllocHelper: LocationMappingHelperService,
        @Inject(forwardRef(() => CartonContainerMappingService)) private cartonContainerMappinService: CartonContainerMappingService
    ) {

    }

    /**
     * Issues the carton quantity
     * @param req 
     * @returns 
     */
    async issueCartonQuantity (req: CartonIssueQtyRequest, needDeallocationOfContainer: boolean = false, externalManager?: GenericTransactionManager): Promise<GlobalResponseObject> {
        const transManager = externalManager ? externalManager : new GenericTransactionManager(this.dataSource);
        try {
            if(!externalManager) {
                await transManager.startTransaction();
            }
            
            // -------------------------------------------------------------------
            // NOTE: THIS IS A RECURSIVE CODE BLOCK. PLEASE BE ALERT
            if(needDeallocationOfContainer && req.deAllocateFromContainer) {
                // once after the issuance is done, if the pending carton qty is 0, then de-allocate it from the container
                const cartonsInfo = await this.locAllocHelper.getBasicInfoForCartonIds(req.companyCode, req.unitCode, [req.cartonId]);
                const cartonInfo = cartonsInfo[0];
                // only if the carton is reconcile, then remove from the container
                const totalissuedQuantity= (Number(cartonInfo.scannedQuantity) + Number(req.issuedQty)).toFixed(2); 
                if(Number(totalissuedQuantity) == Number(cartonInfo.originalQty)) {
                    // Once after the issuance, if the carton qty is no more, then de-allocate the carton from the container
                    // de-allocate the container to the carton
                    const cartonInfo = new CartonIdRequest(req.username, req.unitCode, req.companyCode, req.userId, req.cartonId, null);
                    const deAllocReq = new ContainerCartonMappingRequest(req.username, req.unitCode, req.companyCode, req.userId, null, null, false, null, null, [cartonInfo], false);
                    await this.cartonContainerMappinService.deAllocateCartonsToContaineratIssuance(deAllocReq, null, false, transManager);
                    // deallocate the carton from the tray if exist
                    //TODO://
                    // await this.trayCartonMapService.unmapCartonFromTrayInternal(req.cartonId, req.companyCode, req.unitCode, req.username, transManager);
                }
            }
            // --------------------------------------------------------------------

            if(!externalManager) {
                await transManager.completeTransaction();
            }
            return new GlobalResponseObject(true,46080, 'Carton quantity issued');
        } catch (error) {
            if(!externalManager) {
                await transManager.releaseTransaction();
            }
            throw error;
        }
       
    }

}