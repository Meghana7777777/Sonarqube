import { Injectable } from "@nestjs/common";
import { DataSource } from "typeorm";

@Injectable()
export class PkDispatchReadyHelperService {
  constructor(
    private dataSource: DataSource
  ) {

  }

  
}
