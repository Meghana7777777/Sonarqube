import { Inject, Injectable, forwardRef } from '@nestjs/common';
import { StockObjectInfoResponse, StockCodesRequest, StockObjectInfoModel, ManufacturingOrderNumberRequest, FabIssuingEntityEnum, RollIdsRequest } from '@xpparel/shared-models';
import { DataSource, } from 'typeorm';
import { InjectDataSource } from '@nestjs/typeorm';
import { PhItemLinesRepo } from './repository/ph-item-lines.repository';
import { ErrorResponse } from '@xpparel/backend-utils';
import { GrnService } from '../grn/grn.service';
import { PhItemIssuanceRepo } from './repository/ph-item-issuance.repository';
import { MoToPoMapService } from '../mo-po-mapping/mo-to-po.service';
import { PalletInfoService } from '../location-allocation/pallet-info.service';

@Injectable()
export class StockInfoService {
  constructor(
    private phItemLinesRepo: PhItemLinesRepo,
    private phItemIssuanceRepo: PhItemIssuanceRepo,
    private moToPoMapService: MoToPoMapService,
    @Inject(forwardRef(() => GrnService)) private grnService: GrnService,
    private palletInfoService: PalletInfoService
  ) {
  }


  /**
   * READER
   * ENDPOINT
   * @param req 
   * @returns 
   */
  async getInStockObjectsForItemCode(req: StockCodesRequest): Promise<StockObjectInfoResponse> {
    if (!req.itemCode) {
      throw new ErrorResponse(6251, 'Item code is not provided to retrieve the stock');
    }
    if (!req.manufacturingOrderCode) {
      throw new ErrorResponse(6252, 'Manufacturing order code is not provided to retrieve the stock');
    }
    //get every PO of the Manufacturingorder
    const reqObject = new ManufacturingOrderNumberRequest(req.username, req.unitCode, req.companyCode, req.userId, req.manufacturingOrderCode);
    // todo:
    const poData: string[] = await this.moToPoMapService.getPONumbersMappedToGivenMo(reqObject);
    if (!poData.length) {
      throw new ErrorResponse(6253, 'No PO is found for the provided Manufacturing order');
    }

    const data = await this.phItemLinesRepo.getStockInformationAgainstToFilter(req.companyCode, req.unitCode, req.itemCode, req.batchNumbers, req.lotNumbers, poData);
    const allstockInformaiton: StockObjectInfoModel[] = [];
    if (!data.length) {
      throw new ErrorResponse(6254, 'Stock Not Available.');
    }
    for (const object of data) {
      let balance;
      /*Disabling Lock status of each roll due to partial allocation 20240515 */
      // balance = ((Number(roll.supQuantity) + Number(roll.returnQuantity)) - (Number(roll.allocatedQuantity) + Number(roll.issuedQuantity))).toFixed(2);
      const issuedRecordsManual = await this.phItemIssuanceRepo.getItemIssuanceQtyForItemId(req.unitCode, req.companyCode, object.objectId);
      const totalIssuedQuantity = issuedRecordsManual.reduce((sum, record) => sum + Number(record.issued_quantity), 0);
      let manualIssuedRec = issuedRecordsManual.find(r => r.issuing_entity == FabIssuingEntityEnum.MANUAL);
      let docketIssuedRec = issuedRecordsManual.find(d => d.issuing_entity == FabIssuingEntityEnum.PROCESS);
      balance = ((Number(object.supQuantity) + Number(object.returnQuantity)) - (Number(totalIssuedQuantity))).toFixed(2);
      if (Number(balance) > 0) {
        const palletInfo = await this.palletInfoService.getPalletAndBinbyRollIdData(new RollIdsRequest(req.username, req.unitCode, req.companyCode, req.userId, [object.objectId]), false);
        //TODO:
        const stockInfo = new StockObjectInfoModel(object.objectId, object.inspectionPick, object.objectBarcode, object.packListId, object.supQuantity, Number(balance), object.phlineId, object.batchNumber, object.lotNumber, object.supWidth, object.issuedQuantity, object.supQuantity, 'shrinkage', object.measuredWidth, object.actWidth, object.actGsm, object.returnQuantity, object.supNetWeight, object.supGrossWeight, object.actShade, object.actShadeGroup, object.itemCode, object.itemName, object.itemDesc, object.itemStyle, object.itemColor, object.itemSize, object.invoiceNumber, object.supplierCode, object.supplierName, object.description, object.packingListCode, object.supplierObjectNo, manualIssuedRec?.issued_quantity, docketIssuedRec?.issued_quantity, object.objectType, palletInfo.data?.[0]?.binBarcode, object.poNumber, palletInfo.data?.[0]?.palletBarcode);
        allstockInformaiton.push(stockInfo);
      }
    }
    return new StockObjectInfoResponse(true, 6255, 'Stock Data Retrieved Successfully', allstockInformaiton);
  }


}
