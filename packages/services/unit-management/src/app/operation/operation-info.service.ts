import { Injectable } from "@nestjs/common";import { DataSource } from "typeorm";
import moment = require("moment");
import { OperationRepository } from "./repository/operation.repository";

@Injectable()
export class OperationInfoService {
  constructor(
    private dataSource: DataSource,
    private operationRepo: OperationRepository
  ) {

  }


}