import { Injectable } from "@nestjs/common"; import { DataSource, In } from "typeorm";
import moment = require("moment");
import { EmbRejectionHelperService } from "./emb-rejection-helper.service";
import { EmbRejectionInfoService } from "./emb-rejection-info.service";
import { EmbRejectionHeaderRepository } from "./repository/emb-rejection-header.repository";
import { EmbRejectionLineRepository } from "./repository/emb-rejection-line.repository";
import { RejectionScanModel } from "packages/libs/shared-models/src/ets/emb-transaction/rejection/rejection-scan.model";
import { EmbRejectionHeaderEntity } from "./entity/emb-rejection-header.entity";
import { GenericTransactionManager } from "../../database/typeorm-transactions";
import { EmbRejectionLineEntity } from "./entity/emb-rejection-line.entity.";
import { ErrorResponse } from "@xpparel/backend-utils";

@Injectable()
export class EmbRejectionService {
  constructor(
    private dataSource: DataSource,
    private infoService: EmbRejectionInfoService,
    private helperService: EmbRejectionHelperService,
    private embRejHeaderRepo: EmbRejectionHeaderRepository,
    private embRejLineRepo: EmbRejectionLineRepository
  ) {

  }

  // NOT AN ENDPOINT
  // NOT AND ENDPOINT. Called from the emb tracking service
  async createEmbRejectionsInternally(poSerial: number, embJobNumber: string, barcode: string, opCode: string, opGroup: string, rejQty: number, reqsonWiseQtys: RejectionScanModel[], companyCode: string, unitCode: string, username: string, transManager: GenericTransactionManager): Promise<boolean> {

    const embRejHeaderEnt = new EmbRejectionHeaderEntity();
    embRejHeaderEnt.companyCode = companyCode;
    embRejHeaderEnt.unitCode = unitCode;
    embRejHeaderEnt.createdUser = username;
    embRejHeaderEnt.poSerial = poSerial;
    embRejHeaderEnt.embJobNumber = embJobNumber;
    embRejHeaderEnt.opGroup = opGroup;
    embRejHeaderEnt.operationCode = opCode;
    embRejHeaderEnt.rejQuantity = rejQty;

    const reasonIds = reqsonWiseQtys.map(r => r.reasonId);
    // TODO
    // get the reasons info from the UMS
    // const reasonsInfo = 

    const savedHeader = await transManager.getRepository(EmbRejectionHeaderEntity).save(embRejHeaderEnt);
    for(const rej of reqsonWiseQtys) {
      const embRejLine = new EmbRejectionLineEntity();
      embRejLine.companyCode = companyCode;
      embRejLine.unitCode = unitCode;
      embRejLine.createdUser = username;
      embRejLine.poSerial = poSerial;
      embRejLine.reasonId = rej.reasonId.toString();
      embRejLine.reasonDesc = null;
      embRejLine.rejQuantity = rej.quantity;
      embRejLine.rhId = savedHeader.id;
      embRejLine.operationCode = opCode;
      embRejLine.opGroup = opGroup;
      embRejLine.barcode = barcode;

      await transManager.getRepository(EmbRejectionHeaderEntity).save(embRejHeaderEnt, {reload: false});
    }
    return true;
  }

  // NOT AN ENDPOINT
  // Reverses the emb rejections internally
  async reverseEmbRejectionsInternally(poSerial: number, embJobNumber: string, barcode: string, opCode: string, companyCode: string, unitCode: string, username: string,transManager: GenericTransactionManager): Promise<boolean> {

    const rejLineRecs = await transManager.getRepository(EmbRejectionLineEntity).find({ where: { companyCode: companyCode, unitCode: unitCode, barcode: barcode, operationCode: opCode, poSerial: poSerial } });
    if(rejLineRecs.length == 0) {
      throw new ErrorResponse(16035, `Rejection are not found for : ${barcode} `);
    }
    const rhIds: number[] = [];
    rejLineRecs.forEach(r => rhIds.push(r.rhId));
    
    await transManager.getRepository(EmbRejectionLineEntity).delete({ companyCode: companyCode, unitCode: unitCode, rhId: In(rhIds) });
    await transManager.getRepository(EmbRejectionHeaderEntity).delete({ companyCode: companyCode, unitCode: unitCode, id: In(rhIds) });

    return true;
  }
  
}