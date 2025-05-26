import { forwardRef, Inject, Injectable } from "@nestjs/common";
import { CartonDataModel, CartonIdsRequest, CommonResponse, FgInsCreateExtRefRequest, FgInsFabInsSelectedLotModelAttrs, FgInsSelectedBatchResponse, GlobalResponseObject, InsCartonDataModel, InsCartonIdsRequest, InsCartonsDataResponse, InsFgInsSelectedBatchModelAttrs, InsFgInsSelectedCartonModel, InsFgInsSelectedCartonModelAttrs, InsFgInsSelectedLotModel, InsFgSelectedBatchModel, PKMSPackListIdsRequest, PKMSPackListInfoResponse } from "@xpparel/shared-models";
import { PackListService } from "../packing-list/packing-list.service";
import { CartonRepo } from "../packing-list/repositories/carton-repo";
import { DataSource, In } from "typeorm";
import { CrtnEntity } from "../packing-list/entities/crtns.entity";
import { ErrorResponse } from "@xpparel/backend-utils";

@Injectable()
export class InsPackingHelperService {
    constructor(
        @Inject(forwardRef(() => PackListService)) private packListService: PackListService,
        private dataSource: DataSource
    ) { }


    async getFgInspectionSelectedItems(req: FgInsCreateExtRefRequest): Promise<FgInsSelectedBatchResponse> {
        const userReq = { companyCode: req.companyCode, unitCode: req.unitCode };
        // req.iNeedCartonAttrs = false;
        const packListReq = new PKMSPackListIdsRequest(req.username, req.unitCode, req.companyCode, req.userId, req.packListIds, true, true, true, true, true);
        const packListResponse: PKMSPackListInfoResponse = await this.packListService.getPackListInfoByPackListId(packListReq);
        if (!packListResponse.status) {
            throw new ErrorResponse(65251, packListResponse.internalMessage)
        }

        for (const packList of packListResponse.data) {
            for (const packJob of packList.packJobs) {
                const cartons = []
                for (const carton of packJob.cartonsList) {
                    if (req.cartonBarCodes?.includes(carton.barcode)) {
                        cartons.push(carton);
                    }
                }
                packJob.cartonsList = cartons;
            }
        }
        const resposne: FgInsSelectedBatchResponse = await this.transformToFgInsSelectedBatchResponse(packListResponse);
        // console.log("resposneeee",resposne?.data[0]?.lotInfo[0]?.packJob);
        return resposne;
    }

    //transform function
    async transformToFgInsSelectedBatchResponse(pkmsResponse: PKMSPackListInfoResponse): Promise<FgInsSelectedBatchResponse> {
        const response: FgInsSelectedBatchResponse = { data: [], status: true, errorCode: 123, internalMessage: 'sucess' };
        // console.log("response", JSON.stringify(pkmsResponse, null, 2));

        for (const packList of pkmsResponse.data) {
            // Extract first pack job details for batch attributes
            const firstPackJob = packList?.packJobs?.[0];
            const attrData = firstPackJob?.attrs;
            const batchAttrs: InsFgInsSelectedBatchModelAttrs = {
                moNo: attrData?.moNos || [],
                delDate: attrData?.delDates || [],
                destination: attrData?.destinations || [],
                moLines: attrData?.vpos || [],
                buyer: attrData?.buyers || [],
                styles: attrData?.styles || [],
            }

            //list of pack Jobs 
            const lotInfo: InsFgInsSelectedLotModel[] = [];
            for (const packJob of packList?.packJobs) {
                //for cartons
                const cortons: InsFgInsSelectedCartonModel[] = [];
                for (const corton of packJob?.cartonsList) {
                    //constuct carton attributes 
                    const cartonAttrs: InsFgInsSelectedCartonModelAttrs = {
                        color: corton?.attrs?.map(attr => attr?.col),
                        size: corton?.attrs?.map(attr => attr?.sz),
                        quantity: corton?.attrs
                            .reduce((sum, attr) => sum + attr?.qty, 0) // Sum up quantities
                            .toString()

                    }
                    //each corton object
                    const cartonItem: InsFgInsSelectedCartonModel = {
                        packListId: corton?.packListId,
                        cartonId: corton?.cartonId,
                        cartonBarocde: corton?.barcode,
                        cartonQty: corton?.qty,
                        attrs: cartonAttrs
                    }
                    //add carton to corton list 
                    cortons.push(cartonItem);
                }
                //pack job attributes 
                const lotAttrs: FgInsFabInsSelectedLotModelAttrs = {
                    cortonCount: packJob?.cartonsList?.length
                };
                //constructing  pack Job(lot)
                const lotItem: InsFgInsSelectedLotModel = {
                    packListId: packJob?.packListId,
                    packJob: packJob?.packJobNo,
                    packOrderID: packJob?.packOrderId,
                    cortons: cortons,
                    attrs: lotAttrs,
                    packJobId: packJob?.packJobId,
                    packOrderNo: packJob?.packOrderNo,
                }
                //add to pack Jobs info 
                lotInfo.push(lotItem);
            }
            //packlist  - level 
            const packListItem: InsFgSelectedBatchModel = {
                packListId: packList?.packListId,
                batchNo: firstPackJob?.packJobNo,
                attrs: batchAttrs,
                lotInfo: lotInfo,

            }
            //add packlist (batch) to response data
            response.data.push(packListItem);
        }
        if (response.data.length == 0) {
            return new FgInsSelectedBatchResponse(false, 123, 'data not found!', []);
        }
        // console.log("rrrrr",response);
        return response;
    }


    async getCartonsDataByCartonId(req: InsCartonIdsRequest): Promise<InsCartonsDataResponse> {
        let data: CrtnEntity[] = [];

        if (req.cartonIds.length) {
            const res: CrtnEntity[] = await this.dataSource.getRepository(CrtnEntity).find({ where: { id: In(req.cartonIds) } });
            data.push(...res);
        }
        if (req.barcode?.trim()) {
            const res: CrtnEntity | null = await this.dataSource.getRepository(CrtnEntity).findOne({ where: { barcode: req.barcode } });
            if (res) {
                data.push(res);
            }
        }
        const model: InsCartonDataModel[] = data.map(
            res => new InsCartonDataModel(res.requiredQty, res.id, res.grossWeight, res.barcode, res.netWeight, res.pkJobId)
        );
        if (model.length) {
            return new InsCartonsDataResponse(true, 1234, 'Carton data fetched successfully!', model);
        }

        return new InsCartonsDataResponse(false, 345, 'Data not found!', []);
    }

}