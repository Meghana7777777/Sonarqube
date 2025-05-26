import { Injectable } from "@nestjs/common"; import { DataSource } from "typeorm";
import moment = require("moment");
import { ShiftHelperService } from "./shift-helper.service";
import { ShiftInfoService } from "./shift-info.service";
import { ShiftRepository } from "./repository/shift.repository";
import { CommonRequestAttrs, GlobalResponseObject, ShiftCreateRequest, ShiftModel, ShiftResponse } from "@xpparel/shared-models";
import { GenericTransactionManager } from "../../database/typeorm-transactions";
import { ShiftEntity } from "./entity/shift.entity";
import { ErrorResponse } from "@xpparel/backend-utils";

@Injectable()
export class ShiftService {
  constructor(
    private dataSource: DataSource,
    private infoService: ShiftInfoService,
    private helperService: ShiftHelperService,
    private shiftRepo: ShiftRepository
  ) {

  }
  async createShift(req: ShiftCreateRequest): Promise<GlobalResponseObject> {
    const transManager = new GenericTransactionManager(this.dataSource);
    try {
      await transManager.startTransaction();
      const entityshift = new ShiftEntity();
      entityshift.shift = req.shift;
      entityshift.startTime = moment(req.startAt).format('HH:MM');
      entityshift.endTime = moment(req.endAt).format('HH:MM');
      entityshift.companyCode = req.companyCode;
      entityshift.createdUser = req.username;
      entityshift.unitCode = req.unitCode;
      if (req.id) {
        // An update operation
        entityshift.id = req.id;
        entityshift.updatedUser = req.username;
      } else {
        const shiftExists = await this.shiftRepo.findOne({ where: { unitCode: req.unitCode, companyCode: req.companyCode, shift:req.shift } });
        if(shiftExists) {
          throw new ErrorResponse(0, `Shift  ${req.shift} already exist`);
        }
      }
      await transManager.getRepository(ShiftEntity).save(entityshift, {reload: false});
      await transManager.completeTransaction();
      return new GlobalResponseObject(true, 85552, `Shift ${req.id ? "Updated" : "Created"} Successfully`);
    } catch (error) {
      await transManager.releaseTransaction();
      throw error;
    }
  }
  async deleteShift(req: ShiftCreateRequest): Promise<GlobalResponseObject> {
    if(!req.shift) {
      throw new ErrorResponse(0, "Shift code must be provided");
    }
    const records = await this.shiftRepo.find({ where: {  unitCode: req.unitCode, companyCode: req.companyCode,shift:req.shift } });
    if (records.length === 0) {
      throw new ErrorResponse(0, "Shift code is not Found");
    }
    // check if this op is utilized in the oes
    await this.shiftRepo.delete({  unitCode: req.unitCode, companyCode: req.companyCode,shift: req.shift });
    return new GlobalResponseObject(true, 85552, 'Shift Deleted Successfully');
  }

  async getAllShifts(req: CommonRequestAttrs): Promise<ShiftResponse> {
    const records = await this.shiftRepo.find({ where: { unitCode: req.unitCode, companyCode: req.companyCode } });
    const resultModel: ShiftModel[] = [];
    if (records.length === 0) {
      throw new ErrorResponse(55689, "Shifts not Found")
    }
    for (const allShifts of records) {
      const res = new ShiftModel(allShifts.shift,allShifts.startTime,allShifts.endTime);
      resultModel.push(res);
    }
    return new ShiftResponse(true, 85552, 'Shifts Retrieved Successfully', resultModel);
  }
}