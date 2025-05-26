import { Injectable } from "@nestjs/common"; import { DataSource } from "typeorm";
import moment = require("moment");
import { ShiftHelperService } from "./shift-helper.service";
import { ShiftInfoService } from "./shift-info.service";
import { ShiftRepository } from "./repository/shift.repository";

@Injectable()
export class ShiftService {
  constructor(
    private dataSource: DataSource,
    private infoService: ShiftInfoService,
    private helperService: ShiftHelperService,
    private shiftRepo: ShiftRepository
  ) {

  }

  
}