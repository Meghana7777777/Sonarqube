import { Injectable } from "@nestjs/common";
import { ActualStages, CommonRequestAttrs,  PackageLists, PackingListActualVsPlanned, PackingListDashboardsResponse, RollAnalysis, StagesForPackingList, StagesRequest, StagesResoponse, StatusInfo, SupplierDetails, supplierScoreCard, TimeBasedCount, TimeBasedCountResponse, UnitDatetimeRequest, VehicleInfoResponse } from "@xpparel/shared-models";
import { DataSource, In, MoreThan, Not } from "typeorm";
import { PackingListRepo } from "../packing-list/repository/packing-list.repository";
import { PhItemLinesRepo } from "../packing-list/repository/ph-item-lines.repository";
import { PalletRollMapRepo } from "../location-allocation/repositories/pallet-roll-map.repository";
import { PalletBinMapEntity } from "../location-allocation/entities/pallet-bin-map.entity";
import { PalletBinMapRepo } from "../location-allocation/repositories/pallet-bin-map.repository";
import { PhItemLinesEntity } from "../packing-list/entities/ph-item-lines.entity";
import { PackingListEntity } from "../packing-list/entities/packing-list.entity";
import { PhItemsEntity } from "../packing-list/entities/ph-items.entity";
import moment from "moment";



@Injectable()
export class PackingListDashboardService {
    constructor(
        private dataSource: DataSource,
        private phRepo: PackingListRepo,
        private phItemLines: PhItemLinesRepo,
        private palletRollMapRepo: PalletRollMapRepo,
        private palletBinMap: PalletBinMapRepo,


    ) { }
    async getSupplierWisePaclingLists(req: UnitDatetimeRequest): Promise<PackingListDashboardsResponse> {
        console.log('1')
        const result: any = await this.phRepo.getSupplierWiseInfo(req.unitCode, req.fromDate, req.toDate);
        console.log('2', result.length);
        const supplierDataInfo: SupplierDetails[] = [];
        const supplierWiseNotArrivedPlCount = new Map<string, number>();
        const supplierWisePlIds = new Map<string, number[]>();
        for (const item of result) {
            if (!supplierWiseNotArrivedPlCount.has(item.supplier_code)) {
                supplierWiseNotArrivedPlCount.set(item.supplier_code, 0)
                supplierWisePlIds.set(item.supplier_code, []);
            }
            const idsArray = item.Id.split(',');
            supplierWisePlIds.get(item.supplier_code).push(...idsArray);
            const notArrivedQty = supplierWiseNotArrivedPlCount.get(item.supplier_code)
            supplierWiseNotArrivedPlCount.set(item.supplier_code, notArrivedQty + (item.arrived ? item.cnt : 0));
            console.log(supplierWiseNotArrivedPlCount);

        }
        console.log(supplierWisePlIds);
        for (const [supllierCode, pLIds] of supplierWisePlIds) {
            const insp = [];
            let inspectedItemsCount = 0;
            let inspPassCount = 0;
            let passedInspectionPercentage = 0;
            let delayPercentage = 0;
            const supplierScoreCardArr: supplierScoreCard[] = [];
            const supplierInfo = result.find(item => item.supplier_code == supllierCode);
            const packingListsInfo = [];
            let phDeliveryDate: PackingListEntity
            for (const id of pLIds) {
                phDeliveryDate = await this.phRepo.findOne({ where: { id: id, unitCode: req.unitCode }, select: ['deliveryDate'] });
                console.log('3')
                const packingListInfo = await this.getPackingListDetailsById(supplierInfo.supplier_name, id, req.unitCode, phDeliveryDate.deliveryDate);
                packingListsInfo.push(...packingListInfo);
                //console.log('4')
            }
            const inspectedItems = await this.phItemLines.count({ where: { phId: In(pLIds), inspectionPick: true } });
            console.log('5')
            inspectedItemsCount += inspectedItems;
            const inspPassRecords = await this.phItemLines.count({ where: { phId: In(pLIds), inspectionPick: false } });
            console.log('6')
            inspPassCount += inspPassRecords;

            passedInspectionPercentage = (inspectedItems / inspPassRecords) * 100
            const supplierscoreCarddData = new supplierScoreCard(inspectedItemsCount, passedInspectionPercentage, delayPercentage, 0);
            supplierScoreCardArr.push(supplierscoreCarddData);
            const supplierData = new SupplierDetails(supplierInfo.supplier_name, pLIds.length, 0, supplierWiseNotArrivedPlCount.get(supllierCode), packingListsInfo, supplierScoreCardArr, 0, 0);
            supplierDataInfo.push(supplierData);
            console.log('supplierDataInfo----', supplierDataInfo);
        }
        return new PackingListDashboardsResponse(true, 6256, "Supplier Wise Info retrived", supplierDataInfo);
    }

    async getPackingListDetailsById(supplierName: string, packingListId: number, unitCode: string, deliveryDate: Date): Promise<PackageLists[]> {
        const phItems = await this.phRepo.getSupplierWiseDataByPackingListId(packingListId, unitCode);
        console.log('8')
        console.log('9')
        const iemCodesArr: PackageLists[] = [];
        let issuedQty = '';
        let inputQty = '';
        let rollsInUnloading = 0;
        let rollsInGRN = 0;
        let rollsInInspection = 0;
        let rollsInWarehouse = 0;
        let formattedGrnDate = '';
        let maxUpdatedDateStatus = '';
        let phLineItems = [];
        for (const phItm of phItems) {
            const phitem = new PhItemsEntity();
            phitem.id = phItm.id
            const itemLinesRec = await this.phItemLines.find({ where: { phId: packingListId, unitCode: unitCode, phItemId: phitem } });
            console.log('10')
            const grnStatusMap = new Map<string, number>();
            for (const d of itemLinesRec) {
                grnStatusMap.set(d.grnStatus, d.id);
                let grnDateString = d.grnDate;
                let grnDate = new Date(grnDateString);
                formattedGrnDate = grnDate.toISOString().slice(0, 19).replace('T', ' ');
                if (d.grnStatus == 'OPEN') {
                    rollsInGRN += 1;
                }
                if (d.inspectionStatus == 'INPROGRESS') {
                    rollsInInspection += rollsInInspection + 1
                }
            }

            console.log('hi')
            const rolls = itemLinesRec.map(r => phLineItems.push(r.id));
            rollsInWarehouse = await this.palletRollMapRepo.getRollsInWarehouse(rolls);
            console.log('hiee')


            let grnStatus = '';
            if (grnStatusMap.has("DONE")) {
                grnStatus = "GRN COMPLETED"
            }
            if (grnStatus != "GRN COMPLETED") {
                // grnStatus ='DONE';
            }
            for (const isuuedRollQty of itemLinesRec) {
                issuedQty += isuuedRollQty.issuedQuantity;
                inputQty += isuuedRollQty.inputQuantity;
            }
            if (inputQty == issuedQty) {
                const maxUpdatedDate = await this.phItemLines.findOne({ where: { phId: packingListId, phItemId: phitem, unitCode: unitCode }, order: { updatedAt: 'DESC' } });
                console.log('13')
                maxUpdatedDateStatus = maxUpdatedDate.updatedAt.toISOString().slice(0, 19).replace('T', ' ');


            } else {
                maxUpdatedDateStatus = 'NOT COMPLETED'
            }
          
            const occupancyNeed = (itemLinesRec.length / 20);
            const rollStatus = new RollAnalysis(itemLinesRec.length, rollsInUnloading ? rollsInUnloading : 0, rollsInGRN, rollsInInspection, rollsInWarehouse, 0);
            // console.log(rollStatus);
            console.log('14')
            console.log('15')

            const planVsActual = new PackingListActualVsPlanned(packingListId, null, phItm.deliveryDate, null, '', formattedGrnDate, '', null,null, '', '');
            // console.log(planVsActual);
            const Plist = new PackageLists(supplierName, packingListId, phItm.itemCode, '', phItm.itemCategory, grnStatus, 'NULL', occupancyNeed, null, deliveryDate.toDateString(), maxUpdatedDateStatus, '', null, rollStatus, [planVsActual]);
            iemCodesArr.push(Plist);
        }
        // console.log(phItems);
        return iemCodesArr;


    }


    // async getStagesForPackingList(req: StagesRequest): Promise<StagesResoponse> {
    //     const unitCode = "B3";
    //     let maxStage = '';
    //     let actualStatus = "";
    //     let actualStage = "";
    //     let phLineItemsgrnRec: PhItemLinesEntity[] = []
    //     let maxStatus = '';
    //     const actualStagesArr: ActualStages[] = []

    //     const phLineItemsRec = await this.phItemLines.find({ where: { phId: req.packageId, unitCode: unitCode, inspectionStatus: Not(InspectionStatusEnum.COMPLETED) } })
    //     console.log(phLineItemsRec.length);

    //     if (phLineItemsRec.length > 0) {
    //         maxStatus = 'Not Completed';
    //         maxStage = 'INSPECTION';
    //     }
    //     else {
    //         maxStatus = "COMPLETED"
    //         maxStage = "INSPECTION"
    //     }
    //     actualStagesArr.push(new ActualStages(maxStatus, maxStage, ''));
    //     phLineItemsgrnRec = await this.phItemLines.find({ where: { phId: req.packageId, unitCode: unitCode, grnStatus: Not(PhLinesGrnStatusEnum.DONE) } })
    //     console.log(phLineItemsgrnRec.length);

    //     if (phLineItemsgrnRec.length > 0) {
    //         maxStatus = "Not Completed"
    //         maxStage = 'GRN'
    //     } else {
    //         maxStatus = "COMPLETED"
    //         maxStage = "GRN"
    //      }
    //     actualStagesArr.push(new ActualStages(maxStatus, maxStage, ''));

    //     const phVehicleRec = await this.phVehicle.findOne({ where: { phId: req.packageId, unitCode: unitCode } });
    //     maxStatus = phVehicleRec.status;
    //     console.log("2");
    //     if (phVehicleRec.status == PackListLoadingStatus.OUT) {
    //         maxStatus = phVehicleRec.status;
    //         actualStagesArr.push(new ActualStages("OUT", "Security CheckOut", ''));
    //         actualStagesArr.push(new ActualStages("COMPLETED", "Security CheckIn", ''));
    //         actualStagesArr.push(new ActualStages("UNLOADING DONE", "Vehicle Unloading", ''))
    //     }
    //     else if (phVehicleRec.status === PackListLoadingStatus.IN) {
    //         actualStagesArr.push(new ActualStages("IN", "Security CheckIn", ''));
    //     } else {
    //         actualStagesArr.push(new ActualStages("NOT OUT", "Security CheckOut", ''));
    //     }
    //     if (phVehicleRec.status == PackListLoadingStatus.UN_LOADING_COMPLETED ||
    //         phVehicleRec.status == PackListLoadingStatus.UN_LOADING_PAUSED ||
    //         phVehicleRec.status == PackListLoadingStatus.UN_LOADING_START) {
    //         maxStatus = phVehicleRec.status;
    //         maxStage = "Vehicle Unloading"
    //         actualStagesArr.push(new ActualStages(phVehicleRec.status, maxStage, ''));
    //         actualStagesArr.push(new ActualStages("COMPLETED", "Security CheckIn", ''));

    //     }

    //     const statusResponse = new StagesForPackingList(req.packageId, maxStatus, actualStagesArr)
    //     return new StagesResoponse(true, 11, "Stages Retrived Successfully", statusResponse);;

    // }

    // async getChartData(req:UnitDatetimeRequest) : Promise<TimeBasedCountResponse>{
    //     const getPhDeliveryData = await this.phRepo.getDeliveryCount(req.fromDate,req.toDate,req.group);
    //     //console.log(getPhDeliveryData);
    //     const response :TimeBasedCount[] = [];
    //     const delivaeryDateCountMap = new Map<string,number>();
    //     for(const delDate of getPhDeliveryData){
    //         delivaeryDateCountMap.set(moment(delDate.deliveryDate).format('YYYY-MM-DD'),delDate.count);
    //     }
    //     console.log(delivaeryDateCountMap);
    //     //return null;
    //     const getInatData = await this.phVehicle.getInAtCount(req.fromDate,req.toDate,req.group);
    //     const inAtDateCountMap = new Map<string,number>();
    //     for(const inAtDate of getInatData){
    //         //console.log(inAtDate.deliveryDate,inAtDate.count);
    //         inAtDateCountMap.set(inAtDate.deliveryDate,inAtDate.count);
    //         console.log(delivaeryDateCountMap.get(moment(inAtDate.deliveryDate).format('YYYY-MM-DD')));
    //         const timeBasedCount = new TimeBasedCount(moment(inAtDate.deliveryDate).format('YYYY-MM-DD') , inAtDate.count , delivaeryDateCountMap.get(moment(inAtDate.deliveryDate).format('YYYY-MM-DD')));
    //         response.push(timeBasedCount);
    //     }
        
    //     return new TimeBasedCountResponse(true,11,'success',response);
    // }
    async getStagesForPackingList(req:StagesRequest): Promise<StagesResoponse> {
        console.log("started");

        const getStagesData = await this.phItemLines.getStagesForPackingListIds(req.packageId,req.unitCode);
        console.log(getStagesData);
        
        const statusMap: Record<string, { unloading: string, vehicleIn: string, vehicleOut: string }> = {
            'OUT - Security CheckOut': { unloading: 'DONE', vehicleIn: 'DONE', vehicleOut: 'DONE' },
            'IN - Security CheckIn': { unloading: 'PENDING', vehicleIn: 'DONE', vehicleOut: 'PENDING' },
            'Vehicle Unloading': { unloading: 'IN-PROGRESS', vehicleIn: 'DONE', vehicleOut: 'PENDING' },
            
        };
        const statusMapForInsp: Record<string, { inspection : string }> = {
            'Inspection Open': { inspection: "OPEN" },
            'Inspection Completed': { inspection: "DONE" },
            'Inspection In Progress': { inspection: "IN-PROGRESS" },
            
        };
        const statusMapForGrn: Record<string, { grn : string }> = {
            'GRN Open': { grn: "OPEN" },
            'GRN Completed': { grn: "DONE" },
            'GRN In Progress': { grn: "IN-PROGRESS" },
            
        };
        console.log("test1");
        const responseArray : StagesForPackingList[] = [];
        for (const stagesRes of getStagesData) {
            const status = statusMap[stagesRes.vehicleStatus];
            const statusForInsp = statusMapForInsp[stagesRes.inspectionStatus];
            const statusForGrn = statusMapForGrn[stagesRes.grnStatus];
            const actualStagesArr: ActualStages[] = [];

            if (status) {
                actualStagesArr.push(new ActualStages(status.unloading, 'UNLOADING', ''));
                actualStagesArr.push(new ActualStages(status.vehicleIn, 'SECURITY CHECK IN', ''));
                actualStagesArr.push(new ActualStages(status.vehicleOut, 'SECURITY CHECKOUT', ''));
            }
            if(statusMapForInsp){
                actualStagesArr.push(new ActualStages(statusForInsp.inspection, 'INSPECTION', ''));
            }
            if(statusForGrn){
                actualStagesArr.push(new ActualStages(statusForGrn.grn, 'GRN', ''));
            }
            const response = new StagesForPackingList(stagesRes.phId, stagesRes.vehicleStatus , actualStagesArr);
            responseArray.push(response);
        }
        // for(const stagesRes of getStagesData){
            
        //     if(stagesRes.vehicleStatus == 'OUT - Security CheckOut'){
        //         unloadingstatus = 'DONE';
        //         unloadingStage = 'UNLOADING';
        //         vehicleInstatus = 'DONE';
        //         vehicleInStage = 'SECURITY CHECK IN';
        //         vehicleOutStage = 'SECURITY CHECKOUT';
        //         vehicleOutStatus = "DONE";
        //         actualStagesArr.push(new ActualStages(unloadingstatus, unloadingStage, ''));
        //         actualStagesArr.push(new ActualStages(vehicleInstatus, vehicleInStage, ''));
        //         actualStagesArr.push(new ActualStages(vehicleOutStatus, vehicleOutStage, ''));

        //     }
        //     if(stagesRes.vehicleStatus == 'IN - Security CheckIn'){
        //         unloadingstatus = 'PENDING';
        //         unloadingStage = 'UNLOADING';
        //         vehicleInstatus = 'DONE';
        //         vehicleInStage = 'SECURITY CHECK IN';
        //         vehicleOutStage = 'SECURITY CHECKOUT';
        //         vehicleOutStatus = "PENDING";
        //     }
        //     if(stagesRes.vehicleStatus == 'Vehicle Unloading'){
        //         unloadingstatus = 'IN-PROGRESS';
        //         unloadingStage = 'UNLOADING';
        //         vehicleInstatus = 'DONE';
        //         vehicleInStage = 'SECURITY CHECK IN';
        //         vehicleOutStage = 'SECURITY CHECKOUT';
        //         vehicleOutStatus = "PENDING";
        //     }

        //     const stagesResponse = new StagesForPackingList(stagesRes.phId,stagesRes.vehicleStatus,)
        // }
        const statusMaps = new Map<string, {ids: string }>();
        const statusInfoArray:StatusInfo[] = []

        responseArray.map(d=>{
                const currentStatus = statusMaps.get(d.status);
                if (currentStatus) {
                    // Increment count and concatenate IDs
                    //currentStatus.count += 1;
                    currentStatus.ids += `,${d.packageId}`;
                } else {
                    // Initialize with the first ID and count of 1
                    statusMaps.set(d.status, { ids: d.packageId });
                }
            })
            console.log(statusMaps);
            statusMaps.forEach((value, key) => {
                const refIds = value.ids.split(','); // Convert the concatenated string into an array
                const remarks = `Remarks for status ${key}`; // Customize as needed
                statusInfoArray.push(new StatusInfo(key, refIds, remarks));
            });
            console.log(statusInfoArray);
        return new StagesResoponse(true,967,"Data Retrieved Successfully",responseArray);
    }

    async getChartData(req:UnitDatetimeRequest) : Promise<TimeBasedCountResponse>{
        const response :TimeBasedCount[] = [];
        const inAtDateCountMap = new Map<string,number>();
       
        console.log(inAtDateCountMap);
      //  return null;
        const getPhDeliveryData = await this.phRepo.getDeliveryCount(req.fromDate,req.toDate,req.group);
        const delivaeryDateCountMap = new Map<string,number>();
        for(const  delDate of getPhDeliveryData){
            //console.log(inAtDate.deliveryDate,inAtDate.count);
            delivaeryDateCountMap.set(moment(delDate.deliveryDate).format('YYYY-MM-DD'),delDate.count);
            console.log(delivaeryDateCountMap);
            if(req.group == 'day'){
            const timeBasedCount = new TimeBasedCount(moment(delDate.deliveryDate).format('YYYY-MM-DD')  , inAtDateCountMap.get(moment(delDate.deliveryDate).format('YYYY-MM-DD')),delDate.count);
            response.push(timeBasedCount);
            }else{
                const timeBasedCount = new TimeBasedCount(delDate.deliveryDate  , inAtDateCountMap.get(delDate.deliveryDate),delDate.count);
            response.push(timeBasedCount);
            }
        }
        
        return new TimeBasedCountResponse(true,6258,'success',response);
    }

    async getVehicleInfoOfPackingListsTillToday(req: CommonRequestAttrs) : Promise<VehicleInfoResponse>{
        const packingListTillToday = await this.phRepo.find({where : {unitCode : req.unitCode, companyCode : req.companyCode},select: ['id']});
        const phIdaArr: number[] =[]
        packingListTillToday.map(d=>{phIdaArr.push(d.id)})
        
        return null;
    }

}

