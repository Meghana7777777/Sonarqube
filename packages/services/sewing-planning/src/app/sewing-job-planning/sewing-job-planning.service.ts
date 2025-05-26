import { Injectable, InternalServerErrorException, NotFoundException } from "@nestjs/common";
import { CommonRequestAttrs, GlobalResponseObject, IModuleIdRequest, SewingJobNoRequest, SewingJobPendingDataModel, SewingJobPendingDataResponse, SewingOrderIdRequest, SewingOrderLineIdRequest, SewingOrderLineModel, SewingOrderLineResponse, SewingOrderModel, SewingOrderResponse, SewingOrdersewSerialResponse, SewSerialIdRequest, SewSerialRequest, SJobLineOperationsModel, SJobLineOperationsResponse, MorderSewSerialModel, MorderSewSerialRequest, SJobFgModel, SJobFgResponse, SewingIJobNoRequest, GetModuleByJobNoResponse, GetModuleByJobNoModel, SewingJobPriorityResponse, SewingJobPriorityModel, SewingJobPriorityRequest } from "@xpparel/shared-models";

import { DataSource } from "typeorm";
import { GenericTransactionManager } from "../../database/typeorm-transactions";
import { SJobLineOperationsRepo } from "../entities/repository/s-job-line-operations";
import { SJobLinePlanRepo } from "../entities/repository/s-job-line-plan.repository"
import { SJobLinePlanEntity } from "../entities/s-job-line-plan";

import { error } from "console";


@Injectable()
export class SewingJobPlanningService {
    constructor(
        private dataSource: DataSource,
        // private sOrderLineRepo: SOrderLineRepo,
        // private sJobFgRepo: SJobFgRepo,
        private sJobLinePlanRepo: SJobLinePlanRepo,
        private sJobLineOperationsRepo: SJobLineOperationsRepo,
        //private sJobLinePlanLogRepo: SJobLinePlanLogRepo,
        // private sOrderRepo: SOrderRepo
    ) {

    }

    async getAllSewingOrders(req: CommonRequestAttrs): Promise<SewingOrderResponse> {
        try {
            // const orders = await this.dataSource.getRepository(SOrderEntity)
            //     .createQueryBuilder('order')
            //     .select(['order.id', 'order.orderRefNo', 'order.orderRefId', 'order.sewSerial'])
            //     .where(` company_code = '${req.companyCode}' AND unit_code = '${req.unitCode}' `)
            //     .getMany();

            // const ordersInfo = orders.map(
            //     (order) => new SewingOrderModel(order.id, order.orderRefNo, order.orderRefId.toString(), order.sewSerial.toString()),
            // );

            // return new SewingOrderResponse(true, 26072, 'Sewing Orders retrieved successfully', ordersInfo);
            return null;
        } catch (error) {
            return new SewingOrderResponse(false, 26073, `Failed to fetch orders: ${error.message}`, []);
        }
    }

    // async getSewingOrderLinesAgainstSewingOrder(req: SewingOrderIdRequest): Promise<SewingOrderLineResponse> {
    //     try {
    //         const orderLineData = await this.sOrderRepo.getOrderLinesByOrderId(req.mOrderId, req.unitCode, req.companyCode);
    //         const orderLinesInfo: SewingOrderLineModel[] = orderLineData.map((orderLine) =>
    //             new SewingOrderLineModel(orderLine.mOrderLineId, orderLine.mOrderId, orderLine.orderLineRefNo, orderLine.orderRefNo)
    //         );
    //         return new SewingOrderLineResponse(true, 26074, 'Sewing Order Lines retrieved successfully', orderLinesInfo);
    //     } catch (error) {
    //         return new SewingOrderLineResponse(false, 26075, `Failed to fetch order lines: ${error.message}`, []);
    //     }
    // }


    // async getSewSerialsBySOrderAndSOrderLine(req: MorderSewSerialRequest): Promise<SewingOrdersewSerialResponse> {
    //     try {
    //         const sewSerials = await this.sOrderRepo.getSewSerialsBySOrderAndSOrderLine(req.orderRefNo, req.orderLineRefNo, req.unitCode, req.companyCode);
    //         const dropdownData: MorderSewSerialModel[] = sewSerials.map(serial => new MorderSewSerialModel(
    //             serial.mo_desc,
    //             serial.sewSerial
    //         )
    //         );
    //         return new SewingOrdersewSerialResponse(true, 26076, 'Sewing Order sew serial retrieved successfully', dropdownData);
    //     } catch (error) {
    //         throw new SewingOrdersewSerialResponse(false, 26077, `Failed to fetch sew serials: ${error.message}`, []);
    //     }
    // }


    async getAllOperationsDataByJobId(req: SewingJobNoRequest): Promise<SJobLineOperationsResponse> {
        try {
            const operationsData = await this.sJobLineOperationsRepo.getOperationsByJobNo(req.jobNo, req.unitCode, req.companyCode);
            const operationsInfo = operationsData.map((operation) =>
                new SJobLineOperationsModel(operation.jobNumber, operation.operationCodes, operation.originalQty, operation.inputQty, operation.goodQty, operation.rejectionQty, operation.openRejections, null, operation.smv),
            );
            return new SJobLineOperationsResponse(true, 26078, 'Operations data fetched successfully', operationsInfo);
        } catch (error) {
            return new SJobLineOperationsResponse(false, 26079, `Failed to fetch operations data: ${error.message}`, []);
        }
    }

    // async getSewingJobDataBySewSerialCode(req: SewSerialIdRequest): Promise<SewingJobPendingDataResponse> {
    //     try {
    //         const sewingJobData = await this.sOrderLineRepo.getSewingJobData(req.sewSerialCode, req.unitCode, req.companyCode);
    //         if (!sewingJobData || sewingJobData.length === 0) {
    //             return new SewingJobPendingDataResponse(false, 26080, 'No sewing job data found', []);
    //         }
    //         const detailedData = await Promise.all(
    //             sewingJobData.map(async (job) => {
    //                 const operationsResponse = await this.sJobLineOperationsRepo.getOperationsByJobNo(job.jobNo, req.unitCode, req.companyCode);
    //                 const operationsInJob: SJobLineOperationsModel[] = operationsResponse.map(op =>
    //                     new SJobLineOperationsModel(op.jobNo, op.operationCode, op.originalQty, op.inputQty, op.goodQty, op.rejectionQty, op.openRejections, op.sJobLineId, op.smv));
    //                 return new SewingJobPendingDataModel(job.sewingOrderLineNo, job.productName, job.productType, job.plantStyle, job.jobNo, job.jobType, operationsInJob, job.planProductionDate, job.jobDispatchDate);
    //             })
    //         );
    //         return new SewingJobPendingDataResponse(true, 26081, 'Sewing job data with operations fetched successfully', detailedData);
    //     } catch (error) {
    //         return new SewingJobPendingDataResponse(false, 26082, `Failed to fetch sewing job data: ${error.message}`, []);
    //     }
    // }

    // async updateSewingJobStatus(req: SewingJobNoRequest): Promise<GlobalResponseObject> {
    //     const transactionalEntityManager = new GenericTransactionManager(this.dataSource);
    //     const jobLinePlan = await this.sJobLinePlanRepo.findOne({ where: { jobNo: req.jobNo, companyCode: req.companyCode, unitCode: req.unitCode } });

    //     if (!jobLinePlan) {
    //         throw new NotFoundException(`Sewing job with jobNo ${req.jobNo} not found`);
    //     }

    //     jobLinePlan.status = req.status;
    //     jobLinePlan.moduleNo = req.moduleCode;
    //     jobLinePlan.planInputDate = req.planInputDate;

    //     try {
    //         await transactionalEntityManager.startTransaction();
    //         const logEntry = this.sJobLinePlanLogRepo.create({
    //             jobNo: jobLinePlan.jobNo,
    //             sJobLineId: jobLinePlan.sJobLineId,
    //             moduleNo: req.moduleCode,
    //             status: req.status,
    //             rawMaterialStatus: jobLinePlan.rawMaterialStatus,
    //             smv: jobLinePlan.smv,
    //             planInputDate: req.planInputDate,
    //             jobPriority: jobLinePlan.jobPriority,
    //             sewSerial: jobLinePlan.sewSerial,
    //             companyCode: jobLinePlan.companyCode,
    //             unitCode: jobLinePlan.unitCode,
    //             createdAt: jobLinePlan.createdAt,
    //             updatedAt: new Date(),
    //         });
    //         await transactionalEntityManager.getRepository(SJobLinePlanEntity).save(jobLinePlan);
    //         await transactionalEntityManager.getRepository(SJobLinePlanLogEntity).save(logEntry);
    //         await transactionalEntityManager.completeTransaction();
    //         return new GlobalResponseObject(true, 26083, `Sewing job ${req.jobNo} status updated to in progress successfully`);
    //     } catch (error) {
    //         await transactionalEntityManager.releaseTransaction();
    //         throw new InternalServerErrorException(`Error updating status for jobNo ${req.jobNo}: ${error.message}`);
    //     }
    // }

    // async getSJobFgDataByJobNo(req: SewingIJobNoRequest): Promise<SJobFgResponse> {
    //     const { jobNo } = req;

    //     if (!jobNo) {
    //         return new SJobFgResponse(false,  26108, 'Job number is required', null);
    //     }

    //     try {
    //         const rawDataArray = await this.sJobFgRepo.findJobFgData(jobNo);

    //         if (rawDataArray.length === 0) {
    //             return new SJobFgResponse(false, 983, 'No data found for the provided job number', null);
    //         }

    //         const rawData = rawDataArray[0]; // Access the first row if relevant

    //         const transformedData = new SJobFgModel(
    //             jobNo,
    //             rawData.sewFgNumbers,
    //             rawData.fgColors,
    //             rawData.productName,
    //             rawData.sizes,
    //             parseInt(rawData.qty, 10),
    //         );

    //         return new SJobFgResponse(true, 969, 'Data fetched successfully', transformedData);
    //     } catch (error) {
    //         console.error('Error fetching job FG data:', error);
    //         return new SJobFgResponse(false,  968, 'Internal server error', null);
    //     }
    // }

    // async getModuleNoByJobNo(req: SewingIJobNoRequest): Promise<GetModuleByJobNoResponse> {
    //     const { jobNo } = req;
    //     if (!jobNo) {
    //         return new GetModuleByJobNoResponse(false,  26108, 'Job number is required', null);
    //     }

    //     try {
    //         const ModuleData = await this.sJobLinePlanRepo.findModuleData(jobNo);

    //         if (ModuleData.length === 0) {
    //             return new GetModuleByJobNoResponse(false, 983, 'No data found for the provided job number', null);
    //         }

    //         const rawData = ModuleData[0];
    //         console.log('ModuleData:', ModuleData);

    //         const Data = new GetModuleByJobNoModel(
    //             jobNo,
    //             rawData.moduleNo
    //         );

    //         return new GetModuleByJobNoResponse(true, 969, 'Data fetched successfully', Data);
    //     } catch (error) {
    //         console.error('Error fetching job FG data:', error);
    //         return new GetModuleByJobNoResponse(false,  968, 'Internal server error', null);
    //     }
    // }

    // async getInprogressJobForJobPriority(req: IModuleIdRequest): Promise<SewingJobPriorityResponse> {
    //     try {
    //         const priorityData = await this.sJobLinePlanRepo.getJobProrityData(req.moduleCode, req.unitCode, req.companyCode)
    //         if (priorityData.length == 0) {
    //             return new SewingJobPriorityResponse(false, 1, 'No jobs found for this Module', [])
    //         }
    //         const data: SewingJobPriorityModel[] = priorityData.map((priority) => new SewingJobPriorityModel(priority.jobNo, priority.jobPriority, priority.deliveryDate, priority.productType, priority.productName))
    //         return new SewingJobPriorityResponse(true, 0, 'Job Priority data retrived successfully', data)
    //     } catch (error) {
    //           return new SewingJobPriorityResponse(false, 1, `Failed to fetch module data: ${error.message}`, []);
    //     }
    // }

    // async updateInprogressJobsJobPriority(req: SewingJobPriorityRequest): Promise<GlobalResponseObject> {
    //     const transactionalEntityManager = new GenericTransactionManager(this.dataSource);
    //     const jobLinePlan = await this.sJobLinePlanRepo.findOne({ where: { moduleNo: req.moduleCode, jobNo: req.jobNo[0], companyCode: req.companyCode, unitCode: req.unitCode } });

    //     if (!jobLinePlan) {
    //         throw new NotFoundException(`Sewing job with jobNo ${req.jobNo} not found`);
    //     }

    //     jobLinePlan.jobPriority = req.jobPriority[0];

    //     try {
    //         await transactionalEntityManager.startTransaction();
    //         const logEntry = this.sJobLinePlanLogRepo.create({
    //             jobNo: req.jobNo[0],
    //             sJobLineId: jobLinePlan.sJobLineId,
    //             moduleNo: jobLinePlan.moduleNo,
    //             status: jobLinePlan.status,
    //             rawMaterialStatus: jobLinePlan.rawMaterialStatus,
    //             smv: jobLinePlan.smv,
    //             planInputDate: jobLinePlan.planInputDate,
    //             jobPriority: req.jobPriority[0],
    //             sewSerial: jobLinePlan.sewSerial,
    //             companyCode: jobLinePlan.companyCode,
    //             unitCode: jobLinePlan.unitCode,
    //             createdAt: jobLinePlan.createdAt,
    //             updatedAt: new Date(),
    //         });
    //         await transactionalEntityManager.getRepository(SJobLinePlanEntity).save(jobLinePlan);
    //         await transactionalEntityManager.getRepository(SJobLinePlanLogEntity).save(logEntry);
    //         await transactionalEntityManager.completeTransaction();
    //         return new GlobalResponseObject(true, 0, `Sewing job ${req.jobNo} job priority updated successfully`);
    //     } catch (error) {
    //         await transactionalEntityManager.releaseTransaction();
    //         throw new InternalServerErrorException(`Error updating job priority for jobNo ${req.jobNo}: ${error.message}`);
    //     }

    // }


}