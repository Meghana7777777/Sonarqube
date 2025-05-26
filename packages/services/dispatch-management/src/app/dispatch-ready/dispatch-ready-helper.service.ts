import { Injectable } from "@nestjs/common";
import { DataSource } from "typeorm";

@Injectable()
export class DispatchReadyHelperService {
  constructor(
    private dataSource: DataSource
  ) {

  }

  
}
