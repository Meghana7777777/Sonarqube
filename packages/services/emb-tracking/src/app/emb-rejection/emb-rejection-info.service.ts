import { Injectable } from "@nestjs/common";import { DataSource } from "typeorm";
import moment = require("moment");
import { EmbRejectionHeaderRepository } from "./repository/emb-rejection-header.repository";
import { EmbRejectionLineRepository } from "./repository/emb-rejection-line.repository";

@Injectable()
export class EmbRejectionInfoService {
  constructor(
    private dataSource: DataSource,
    private embRejHeaderRepo: EmbRejectionHeaderRepository,
    private embRejLineRepo: EmbRejectionLineRepository
  ) {

  }


}