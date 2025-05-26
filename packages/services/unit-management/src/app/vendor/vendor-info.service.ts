import { Injectable } from "@nestjs/common";import { DataSource } from "typeorm";
import moment = require("moment");
import { VendorRepository } from "./repository/vendor.repository";
import { VendorCategoryRepository } from "./repository/vendor-category.repository";

@Injectable()
export class VendorInfoService {
  constructor(
    private dataSource: DataSource,
    private vendorRepo: VendorRepository,
    private vendorCatRepo: VendorCategoryRepository
  ) {

  }


}