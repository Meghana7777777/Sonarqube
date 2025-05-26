import { Injectable } from "@nestjs/common";
import { DataSource, Repository } from "typeorm";
import { ProcessingOrderEntity } from "../entities/processing-order-entity";
import { PoLineEntity } from "../entities/po-line-entity";
import { StyleMoRequest } from "@xpparel/shared-models";
import { ProcessingSerialRes } from "./query-response/processing-serial.qry-res";

@Injectable()
export class ProcessingOrderRepository extends Repository<ProcessingOrderEntity> {
    constructor(private dataSource: DataSource) {
        super(ProcessingOrderEntity, dataSource.createEntityManager());
    }

    /**
     * Retrieves a list of distinct processing serials for a given style code and MO numbers.
     *
     * @param {StyleMoRequest} req - The request object containing the style code, MO number(s), company code, and unit code.
     * @returns {Promise<ProcessingSerialRes[]>} - A promise that resolves to an array of processing serials.
    */
    async getPoSerialsForGivenStyleAndMONumbers(req: StyleMoRequest): Promise<ProcessingSerialRes[]> {
        const { styleCode, moNumber, companyCode, unitCode } = req
        return await this.createQueryBuilder('po')
            .select('DISTINCT(po.processing_serial)')
            .leftJoin(PoLineEntity, 'pol', 'pol.po_id = po.id')
            .where(`po.style_code='${styleCode}'`)
            .andWhere('pol.mo_number IN (:...moNumber)', { moNumber })
            .andWhere(`po.company_code = '${companyCode}' and po.unit_code = '${unitCode}'`)
            .andWhere(`po.status = ${req.status}`)
            .getRawMany()
    }
}


