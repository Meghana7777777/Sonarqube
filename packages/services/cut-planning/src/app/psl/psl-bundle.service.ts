import { Injectable } from "@nestjs/common"; import { DataSource } from "typeorm";
import moment = require("moment");
import { GlobalResponseObject, PoSerialRequest, ProcessTypeEnum } from "@xpparel/shared-models";
import { GenericTransactionManager } from "../../database/typeorm-transactions";
import { ErrorResponse } from "@xpparel/backend-utils";
import { PoSubLineBundleRepository } from "../common/repository/po-sub-line-bundle.repo";
import { PoSubLineBundleEntity } from "../common/entity/po-sub-line-bundle.entity";
import { PslHelperService } from "./psl-helper.service";


@Injectable()
export class PslBundleService {
  constructor(
    private dataSource: DataSource,
    private helperService: PslHelperService,
    private poSubLineBundleRepo: PoSubLineBundleRepository
  ) {

  }


  // Called after po creation in the OES
  async createPslBundlesInCPS(req: PoSerialRequest): Promise<GlobalResponseObject> {
    const transManager = new GenericTransactionManager(this.dataSource);
    try {
      const { poSerial, companyCode, unitCode, username } = req;
      const pslBundles = await this.helperService.getPslBundlesForPoSerial(poSerial, companyCode, unitCode);
      if(pslBundles.length == 0) {
        throw new ErrorResponse(0, `No PSL bundles found in OES`);
      }

      const ents: PoSubLineBundleEntity[] = [];
      pslBundles.forEach(b => {
        const ent = new PoSubLineBundleEntity();
        ent.bundleNumber = b.bundleBarcode;
        ent.companyCode = companyCode;
        ent.createdUser = username;
        ent.moProductSubLineId = b.pslId;
        ent.procType = ProcessTypeEnum.CUT;
        ent.processingSerial = poSerial;
        ent.quantity = b.bundleQty;
        ent.unitCode = unitCode;
        ent.fgSku = b.fgSku;
        ents.push(ent);
      });
      await transManager.startTransaction();
      await transManager.getRepository(PoSubLineBundleEntity).save(ents, {reload: false});
      await transManager.completeTransaction();
      return new GlobalResponseObject(true, 0, 'Bundles created successfully');
    } catch (error) {
      await transManager.releaseTransaction();
      throw error;
    }
  }

  // Called after po deletion in the OES
  async deletePslBundlesInCPS(req: PoSerialRequest): Promise<GlobalResponseObject> {
    const { poSerial, companyCode, unitCode, username } = req;
    if(!poSerial) {
      throw new ErrorResponse(0, `Po Serial is not provided`);
    }
    const pslBundles = await this.poSubLineBundleRepo.find({select: ['id'], where: {companyCode, unitCode, processingSerial: poSerial, procType: ProcessTypeEnum.CUT}});
    if(pslBundles.length == 0) {
      throw new ErrorResponse(0, `No PSL bundles found for the po serial: ${poSerial}`);
    }
    await this.poSubLineBundleRepo.delete({processingSerial: poSerial, companyCode, unitCode});
    return new GlobalResponseObject(true, 0, 'Bundles deleted successfully');
  }
}
