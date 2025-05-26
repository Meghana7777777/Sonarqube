import { Injectable } from "@nestjs/common";import { DataSource, In } from "typeorm";
import { dataSource } from "../../../database/type-orm-config/typeorm.config-migrations";
import { GenericTransactionManager } from "../../../database/typeorm-transactions";
import moment = require("moment");

@Injectable()
export class MarkerTypHelperService {
  constructor(
    private dataSource: DataSource,
  ) {

  }

}