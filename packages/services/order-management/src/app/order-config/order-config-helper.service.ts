import { Injectable } from "@nestjs/common";
import { ErrorResponse } from "@xpparel/backend-utils";
import { SI_MoNumberRequest } from "@xpparel/shared-models";
import { DataSource } from "typeorm";
import moment = require("moment");
import { CpsPslService, FgCreationService } from "@xpparel/shared-services";

@Injectable()
export class OrderConfigHelperService {
  constructor(
    private dataSource: DataSource,
    private ptsFgCreationService: FgCreationService,
    private cpsPslService: CpsPslService
  ) {
  }

  async sendMoConfirmationStatusToPTS(moNumber: string, companyCode: string, unitCode: string, username: string): Promise<boolean> {
    // Don't remove the try catch as this can be called without an await keyword.
    try {
      const m1 = new SI_MoNumberRequest(username, unitCode, companyCode, 0, moNumber, 0, false, false, false, false, false, false, false, false, false, false, false, null);
      const res = await this.ptsFgCreationService.createOslRefIdsForMo(m1);
      if(!res.status) {
        throw new ErrorResponse(0, `PTS Says : ${res.internalMessage}`);
      }
      return true;
    } catch (error) {
      throw error;
    }
  }

  async sendMoDeConfirmationStatusToPTS(moNumber: string, companyCode: string, unitCode: string, username: string): Promise<boolean> {
    // Don't remove the try catch as this can be called without an await keyword.
    try {
      const m1 = new SI_MoNumberRequest(username, unitCode, companyCode, 0, moNumber, 0, false, false, false, false, false, false, false, false, false, false, false, null);
      const res = await this.ptsFgCreationService.deleteOslRefIdsForMo(m1);
      if(!res.status) {
        throw new ErrorResponse(0, `PTS Says : ${res.internalMessage}`);
      }
      return true;
    } catch (error) {
      throw error;
    }
  }

  async sendMoConfirmationStatusToCPS(moNumber: string, companyCode: string, unitCode: string, username: string): Promise<boolean> {
    // Don't remove the try catch as this can be called without an await keyword.
    try {
      const m1 = new SI_MoNumberRequest(username, unitCode, companyCode, 0, moNumber, 0, false, false, false, false, false, false, false, false, false, false, false, null);
      const res = await this.cpsPslService.createOslRefIdsForMo(m1);
      if(!res.status) {
        throw new ErrorResponse(0, `PTS Says : ${res.internalMessage}`);
      }
      return true;
    } catch (error) {
      throw error;
    }
  }

  async sendMoDeConfirmationStatusToCPS(moNumber: string, companyCode: string, unitCode: string, username: string): Promise<boolean> {
    // Don't remove the try catch as this can be called without an await keyword.
    try {
      const m1 = new SI_MoNumberRequest(username, unitCode, companyCode, 0, moNumber, 0, false, false, false, false, false, false, false, false, false, false, false, null);
      const res = await this.cpsPslService.deleteOslRefIdsForMo(m1);
      if(!res.status) {
        throw new ErrorResponse(0, `PTS Says : ${res.internalMessage}`);
      }
      return true;
    } catch (error) {
      throw error;
    }
  }
}



