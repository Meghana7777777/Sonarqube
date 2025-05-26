import { PoReqModel } from "@xpparel/shared-models";
import { BaseInterfaceRepository } from '../../../../database/common-repositories';
import { InspectionPreferenceEntity } from "../entites/inspection-preference.entity";
import { PreferenceSummaryRes } from "./ins-pref-qry-res";



export interface InspectionPreferenceRepoInterface extends BaseInterfaceRepository<InspectionPreferenceEntity> {
    getSystemPreferences(req:PoReqModel): Promise<PreferenceSummaryRes>
}