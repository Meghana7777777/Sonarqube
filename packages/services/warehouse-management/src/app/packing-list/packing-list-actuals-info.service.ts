import { Injectable } from '@nestjs/common';
import { ErrorResponse } from '@xpparel/backend-utils';
import { CommonResponse, GlobalResponseObject } from '@xpparel/shared-models';
import { DataSource } from 'typeorm';
import { GenericTransactionManager } from '../../database/typeorm-transactions';
import { PhItemLinesEntity } from './entities/ph-item-lines.entity';
import { PhItemLinesRepo } from './repository/ph-item-lines.repository';
import { AxiosRequestConfig } from 'axios';
const util = require('util');

@Injectable()
export class PackingListActualInfoService {
  constructor(
    private dataSource: DataSource,
    private phItemLinesRepo: PhItemLinesRepo

  ) {
    //
  }

  /**
   * 
   * @param rollId 
   * @param unitCode 
   * @param companyCode 
   */


  async getPONumbersByPhId(ph_id: number): Promise<string[]> {
    try {
      return await this.phItemLinesRepo.getPONumbersByPhId(ph_id);
    } catch (error) {
      console.error("Error in Service fetching PO numbers:", error);
      throw new Error("Failed to fetch PO numbers from service");
    }
  }

  // async getPONumbersByPhId(ph_id: number, config?: AxiosRequestConfig): Promise<CommonResponse> {
  //   try {
  //     const response = await this.axiosPostCall(
  //       this.getURLwithMainEndPoint(`getPONumbersByPhId/${ph_id}`),
  //       config
  //     );
  //     return response;
  //   } catch (error) {
  //     console.error("Error fetching PO numbers:", error);
  //     return { status: false, internalMessage: "Failed to fetch PO numbers" };
  //   }
  // }

  async updateIssuedQuantity(unitCode: string, companyCode: string, username: string, rollId: number, issuedQty: number, remarks: string, externalManager?: GenericTransactionManager): Promise<GlobalResponseObject> {
    const transManager = externalManager ? externalManager : new GenericTransactionManager(this.dataSource);
    try {
      // check if the issuing qty is exceeding the pending qty
      const rollInfo = await this.phItemLinesRepo.findOne({ select: ['issuedQuantity', 'inputQuantity'], where: { companyCode: companyCode, unitCode: unitCode, id: rollId } });
      if (!rollInfo) {
        throw new ErrorResponse(0, 'Roll not found');
      }

      const balance = (Number(rollInfo.inputQuantity) - Number(rollInfo.issuedQuantity)).toFixed(2);
      if (Number(issuedQty) > Number(balance)) {
        throw new ErrorResponse(0, 'Trying to issue more than pending roll quantity');
      }
      // update the issued quantity for the roll
      await transManager.getRepository(PhItemLinesEntity).update({ companyCode: companyCode, unitCode: unitCode, id: rollId },
        { issuedQuantity: () => `issued_quantity + ${issuedQty}` });
      if (!externalManager) {
        await transManager.completeTransaction();
      }
      return new GlobalResponseObject(true, 0, 'Material issued successfully');
    } catch (error) {
      if (!externalManager) {
        await transManager.releaseTransaction();
      }
      throw error;
    }
  }
}