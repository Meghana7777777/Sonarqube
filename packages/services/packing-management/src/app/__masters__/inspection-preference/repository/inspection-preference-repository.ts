import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { BaseAbstractRepository } from "packages/services/packing-management/src/database/common-repositories";
import { Repository } from "typeorm";
import { InspectionPreferenceEntity } from "../entites/inspection-preference.entity";
import { InspectionPreferenceRepoInterface } from "./inspection-preference-repo-interface";
import { PackingListIdRequest, PoReqModel } from "@xpparel/shared-models";
import { PreferenceSummaryRes } from "./ins-pref-qry-res";

@Injectable()
export class InspectionPreferenceRepository extends BaseAbstractRepository<InspectionPreferenceEntity> implements InspectionPreferenceRepoInterface {
    constructor(
        @InjectRepository(InspectionPreferenceEntity)
        private readonly ipEntity: Repository<InspectionPreferenceEntity>
    ) {
        super(ipEntity)
    }
    async getSystemPreferences(req: PoReqModel): Promise<PreferenceSummaryRes> {
        const query = await this.ipEntity.createQueryBuilder()
            .select(`po as po,pick_percentage as pick_percentage,ins_selection_type as ins_selection_type,remarks as remarks,inspections`)
            .where(`po=${req.po} and inspections = '${req.preferenceInspection}'`)
            .andWhere(`unit_code='${req.unitCode}' and company_code='${req.companyCode}'`)
            .getRawOne()
        if (query) {
            const res = new PreferenceSummaryRes(query.po, query.pick_percentage, query.ins_selection_type, query.remarks, query.inspections)
            return res
        } else {
            return undefined
        }

    }
}
