import { Injectable } from "@nestjs/common";
import { CommonResponse, PoCreationRequest, PoViewFilterReq, PoViewModel } from "@xpparel/shared-models";
import { QualityTypeRepository } from "../quality-type/quality-type-repo";
import { PoCreationEntity } from "./entites/po-creation.entity";
import { PoCreationRepository } from "./repo/po-creation-repo";

@Injectable()
export class PoCreationService {

    constructor(
        private repo: PoCreationRepository,
        private qualityRepo: QualityTypeRepository,
    ) { }


    async createPo(req: PoCreationRequest, isUpdate: boolean): Promise<CommonResponse> {
        try {
            if (!isUpdate) {
                const checkPoNumber = await this.repo.find({ where: { poNumber: req.poNumber } })
                if (checkPoNumber.length > 0) {
                    return new CommonResponse(false, 0, 'Po Number already exist!')
                }
            }
            const poObj = new PoCreationEntity()
            poObj.poNumber = req.poNumber
            poObj.buyer = req.buyer
            poObj.color = req.color
            poObj.style = req.style
            poObj.quantity = req.quantity
            poObj.status = req.status
            poObj.estimatedClosedDate = req.estimatedClosedDate
            poObj.createdUser = req.createdUser
            if (isUpdate) {
                poObj.poId = req.poId
                poObj.updatedUser = req.createdUser
                poObj.poNumber = req.poNumber
            }
            const poSave = await this.repo.save(poObj)
            if (poSave) {
                return new CommonResponse(true, 1, isUpdate ? 'Po Updated Sucessfully' : 'Po Created successfully',)
            } else {
                return new CommonResponse(false, 0, 'Something went wrong in PO creation')
            }
        } catch (err) {
            throw err
        }
    }



    async getPoViewInfo(req: PoViewFilterReq): Promise<CommonResponse> {
        try {
            const sewingdata = await this.repo.getPoViewSewingInfo(req)
            const qualityData = await this.qualityRepo.find({ where: { isActive: true } })
            const dynamicQualityTypeColumns = qualityData.map((rec: any) => {
                const data = rec.qualityType
                return data
            })
            const poMap = new Map<string, PoViewModel>()
            if (sewingdata) {
                for (const rec of sewingdata) {
                    if (!poMap.has(rec.poNumber)) {
                        poMap.set(
                            rec.poNumber,
                            new PoViewModel(
                                rec.po_id,
                                rec.poNumber,
                                rec.buyerName,
                                rec.colorName,
                                rec.styleName,
                                rec.estimatedClosedDate,
                                rec.status,
                                rec.quantity,
                                rec.isActive,
                                rec.versionFlag,
                                {}
                            )
                        );
                    }
                    dynamicQualityTypeColumns.forEach((column: string) => {
                        const po = poMap.get(rec.poNumber);
                        if (!po.qualityData[column]) {
                            po.qualityData[column] = {
                                Pass: 0,
                                PassWithDefect: 0,
                                Fail: 0,
                            };
                        }
                        const columnData = po.qualityData[column];
                        if (rec.qualityType === column) {
                            columnData.Pass += parseInt(rec.pass || '0', 10);
                            columnData.PassWithDefect += parseInt(rec.passWithDefect || '0', 10);
                            columnData.Fail += parseInt(rec.fail || '0', 10);
                        }
                    });
                }
                const result = Array.from(poMap.values());
                return {
                    status: true,
                    errorCode: 9848032919,
                    internalMessage: "Data processed successfully",
                    data: result,
                };
            }
            const poModel: PoViewModel[] = []
            poMap.forEach((e) => poModel.push(e))
            return new CommonResponse(true, 1, 'Data retrieved', poModel)

        } catch (err) {
            throw err
        }
    }

}