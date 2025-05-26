import { Inject, Injectable, forwardRef } from "@nestjs/common";
import { DataSource, In } from "typeorm";
import moment = require("moment");

@Injectable()
export class EmbRejectionHelperService {
  constructor(
    private dataSource: DataSource
  ) {

  }
      
}