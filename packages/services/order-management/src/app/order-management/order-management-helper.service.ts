import { Injectable } from "@nestjs/common";
import { DataSource, In } from "typeorm";

@Injectable()
export class OrderManagementHelperService {
  constructor(
    private dataSource: DataSource,
  ) {

  }

}