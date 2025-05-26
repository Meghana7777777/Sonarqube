
import { CommonRequestAttrs, DateWiseJobs, GetSectionDetailsBySectionCodeModel, GetSectionDetailsBySectionCodeResponse, SectionCodeRequest, SectionCreateRequest, } from "@xpparel/shared-models";
import { Injectable } from "@nestjs/common";
import { ErrorResponse } from "@xpparel/backend-utils";
import { CommonResponse, GlobalResponseObject, InProgressJobDetails, SectionIdRequest, SectionModel, SectionResponse, SectionsModulesResponse, SewingModuleDetails, SewingModulesModel, SJobLineOperationsModel } from "@xpparel/shared-models";
import { DataSource, Not } from "typeorm";
import { GenericTransactionManager } from "../../../database/typeorm-transactions/generic-transaction-manager";
import { ModuleRepository } from "../module/repo/module-repo";
import { WorkstationRepository } from "../workstation/workstation.repository";
import { SectionDto } from "./dto/section-dto";
import { SectionEntity } from "./section.entity";
import { SectionRepository } from "./section.repository";
import { SJobLinePlanRepo } from "../../entities/repository/s-job-line-plan.repository";
import { SJobLineOperationsRepo } from "../../entities/repository/s-job-line-operations";
import dayjs from "dayjs";
import { ForecastPlanningRepo } from "../../forecast-planning/forecast-planning.repository";


@Injectable()
export class SectionService {
	constructor(
		private dataSource: DataSource,
		private SectionRepo: SectionRepository,
		private moduleRepo: ModuleRepository,
		private workStationRepo: WorkstationRepository,
		// private sOrderLineRepo: SOrderLineRepo,
		private sJobLineOperationsRepo: SJobLineOperationsRepo,
		private forecastPlanningRepo: ForecastPlanningRepo,
	) {

	}

	async createSection(reqModel: SectionCreateRequest): Promise<SectionResponse> {
		const transManager = new GenericTransactionManager(this.dataSource);
		try {
			
			await transManager.startTransaction();
			const resultEntity: SectionEntity[] = [];

			for (const section of reqModel.sections) {
				const records = await this.SectionRepo.find({ where: { secCode: section.secCode } });
				if (records.length > 0 && !section.id) {
					throw new ErrorResponse(55689, "Section code Already exists");
				}
			    const entity = new SectionEntity();	
				entity.secCode = section.secCode;
				entity.secName = section.secName;
				entity.secDesc = section.secDesc;
				entity.depType = section.depType;
				entity.secColor = section.secColor;
				entity.secHeadName = section.secHeadName;
				entity.secOrder = section.secOrder;
				entity.secType = section.secType;
				entity.companyCode = reqModel.companyCode;
				entity.createdUser = reqModel.username;
				entity.unitCode = reqModel.unitCode;
				if (section.id) {
					entity.id = section.id;
					entity.updatedUser = reqModel.username;
				}
				if (records.length === 0) {
					const saveData = await transManager.getRepository(SectionEntity).save(entity);
				} else if (section.id) {
					const saveData = await transManager.getRepository(SectionEntity).save(entity);
				} else {
					throw new ErrorResponse(26097, "Data exists with same component");
				}
			}
	
			await transManager.completeTransaction();
			return new SectionResponse(true, 26098, `Section "Updated" : "Created" Successfully`,resultEntity);
		} catch (error) {
			await transManager.releaseTransaction();
			throw error;
		}
	}


	async deleteSection(reqModel: SectionIdRequest): Promise<GlobalResponseObject> {
        if (!reqModel.id) {
            throw new ErrorResponse(26099, "Please give section Id");
        }
        const records = await this.SectionRepo.find({ where: { id: reqModel.id } });
        if (records.length === 0) {
            throw new ErrorResponse(26100, "Section Data not Found");
        }
        await this.SectionRepo.delete({ id: reqModel.id });
        return new GlobalResponseObject(true, 26101, 'Section Deleted Successfully');
    }

	
    async getSection(reqData: SectionIdRequest): Promise<SectionResponse> {
        try {
            const records = await this.SectionRepo.find({ where: { id: reqData.id } });
            if (records.length === 0) {
                throw new ErrorResponse(924, "No Data Found");
            }
            const resultData: SectionModel[] = records.map(data => {
                return new SectionModel( data.id, data.secCode, data.secName, data.secDesc, data.depType, data.secColor, data.secHeadName, data.secOrder, data.isActive, data.secType);
            });
            return new SectionResponse(true, 967, "Data Retrieved Successfully", resultData);
        } catch (error) {
            console.error("Error in getSection:", error);
            if (error instanceof ErrorResponse) {
                throw error;
            }
            throw new ErrorResponse(968, "Internal Server Error");
        }
    }

	
    // async updateSection(req: SectionCreateRequest): Promise<SectionResponse> {
    //     const section = await this.SectionRepo.findOne({ where: { id: req.section[0].id } });
    //     if (!section) {
    //         return new SectionResponse(false, 924, "No Data Found", req.section[0].id);
    //     }
    //     const duplicate = await this.SectionRepo.findOne({
    //         where: { secCode: req.section[0].secCode, id: Not(req.section[0].id) }
    //     });
    //     if (duplicate) {
    //         return new SectionResponse(false, 6542, "Section code already exists", req.section[0].id);
    //     }
    //     await this.SectionRepo.update({ id: req.section[0].id }, {
    //         secCode: req.section[0].secCode,
    //         secName: req.section[0].secName,
    //         secDesc: req.section[0].secDesc,
    //         depType: req.section[0].depType,
    //         secColor: req.section[0].secColor,
    //         secHeadName: req.section[0].secHeadName,
    //         secOrder: req.section[0].secOrder,
    //         secType: req.section[0].secType,
    //         companyCode: req.companyCode,
    //         createdUser: req.username,
    //         unitCode: req.unitCode,
    //         updatedUser: req.username,
    //     });
    //     return new SectionResponse(true, 65152, "Updated Successfully", req.section[0].id);
    // }




	async getAllSectionsData(req: CommonRequestAttrs): Promise<SectionsModulesResponse> {
		try {
			const sections = await this.SectionRepo.findSections(req.unitCode, req.companyCode);
			if (sections.length === 0) {
				return new SectionsModulesResponse(false, 26107, 'No sections found', []);
			}

			const result: SewingModulesModel[] = await Promise.all(
				sections.map(async (section) => {
					if (!section.sectionCode) {
						return new SewingModulesModel(section.sectionName, section.secType, []);
					}

					const modules = await this.moduleRepo.getModulesBySectionCode(section.sectionCode, req.unitCode, req.companyCode);

					if (modules.length === 0) {
					}
					const moduleDetails: SewingModuleDetails[] = [];
					for (const module of modules) {
						const workstations = await this.workStationRepo.getWorkStationsByModuleCode(module.moduleCode, req.unitCode, req.companyCode);
						const inProgressJobDetails = null;
						// await this.sOrderLineRepo.getSewingJobInprogressData(module.moduleCode, req.unitCode, req.companyCode);
						const forecastData = await this.forecastPlanningRepo.getForecastdataByModuleCode(module.moduleCode, req.unitCode, req.companyCode);

						let totalForecastMins = 0;
						forecastData.forEach((data) => {
							const smv = Math.round(parseFloat(String(data.smv).match(/^\d+(\.\d{1,2})?/)?.[0] || "0"));
							const planPcs = Math.round(data.planPcs || 0);
							totalForecastMins += smv * planPcs;
						});
						const insJobs: InProgressJobDetails[] = [];
						const jobsWithDates = new Map<string, DateWiseJobs>();
						let totalOriginalQtyForModule = 0;
						let totalSmvForModule = 0;
						for (const job of inProgressJobDetails) {
							const operations = await this.sJobLineOperationsRepo.getOperationsByJobNo(job.jobNo, req.unitCode, req.companyCode);
							const operationsDetails = operations.map((operation) => {
								const parsedSmv = Math.round(parseFloat(String(operation.smv).match(/^\d+(\.\d{1,2})?/)?.[0] || "0"));
								totalOriginalQtyForModule += operation.originalQty || 0;
								totalSmvForModule += parsedSmv
								return new SJobLineOperationsModel(operation.jobNumber, operation.operationCodes, operation.originalQty, operation.inputQty, operation.goodQty, operation.rejectionQty, operation.openRejections, null, operation.smv);
							});
							const inProgressData = new InProgressJobDetails(job.sewingOrderLineNo, job.productName, job.productType, job.plantStyle, job.jobNo, job.jobType, job.planInputDate, job.planProductionDate, operationsDetails);
							const date = dayjs(job.planInputDate).format('MM-DD-YYYY')
							if (!jobsWithDates.has(date)) {
								jobsWithDates.set(date, new DateWiseJobs(date, [inProgressData]));
							} else {
								jobsWithDates.get(date).datesWithJobs.push(inProgressData)
							}
							insJobs.push(inProgressData);
						}

						const alreadyPlannedMins = totalOriginalQtyForModule * totalSmvForModule
						const utilizationPercentage = totalForecastMins > 0 ? Math.round((alreadyPlannedMins / totalForecastMins) * 100) : 0;
						const empty: DateWiseJobs[] = []
						jobsWithDates.forEach((rec, keys) => empty.push(new DateWiseJobs(keys, rec.datesWithJobs)))
						moduleDetails.push(
							new SewingModuleDetails(module.moduleCode, module.moduleName, section.secType, workstations.length, 20, 85, module.moduleColor, totalForecastMins, alreadyPlannedMins, utilizationPercentage, insJobs, empty),
						);
					}
					return new SewingModulesModel(section.sectionCode, section.secType, moduleDetails);
				}),
			);

			return new SectionsModulesResponse(true, 26102, 'Sections data fetched successfully', result);
		} catch (error) {
			return new SectionsModulesResponse(false, 26103, `Failed to fetch section data: ${error.message}`, []);
		}
	}

	async activateDeactivateSection(reqModel: SectionIdRequest): Promise<SectionResponse> {
		const getRecord = await this.SectionRepo.findOne({ where: { companyCode: reqModel.companyCode, unitCode: reqModel.unitCode, id: reqModel.id } });
	if (!getRecord) {
		  throw new ErrorResponse(404, "Record not found");
		}
		const newStatus = !getRecord.isActive;
		await this.SectionRepo.update({ id: reqModel.id }, { isActive: newStatus });
		return new SectionResponse(
		  true,
		  newStatus ? 1 : 0,
		  newStatus ? "Section Activated Successfully" : "Section Deactivated Successfully"
		);
	  }
	
	async getAllSections(reqModel: CommonRequestAttrs): Promise<SectionResponse> {
		try {
			const { unitCode, companyCode } = reqModel;

			const records = await this.SectionRepo.find({
				where: {
					unitCode: unitCode,
					companyCode: companyCode
				}
			});
			if (records.length === 0) {
				return new SectionResponse(false, 26105, "No sections found for the given company code and unit code");
			}
			const resultData: SectionModel[] = records.map(data => {
				return new SectionModel(data.id,data.secCode,data.secName,data.secDesc,data.depType,data.secColor,data.secHeadName,data.secOrder,data.isActive,data.secType,);
			});

			return new SectionResponse(true, 26106, "Sections retrieved successfully", resultData);
		} catch (error) {
			console.error("Error in getAllSections:", error);
			if (error instanceof ErrorResponse) {
				throw error;
			}
			throw new ErrorResponse(968, "Internal Server Error");
		}
	}

	async getSectionDataBySectionCode (req : SectionCodeRequest) : Promise<GetSectionDetailsBySectionCodeResponse> {
		const {secCode} = req;
		if (!secCode) {
			return new GetSectionDetailsBySectionCodeResponse(false, 982, 'Job number is required', null);
		}
	
		try {
			const SectionData = await this.SectionRepo.getAllSectionsDataBySectionCode(secCode);
	
			if (!SectionData) {
				return new GetSectionDetailsBySectionCodeResponse(false, 26109, 'No data found for the provided job number', null);
			}
	
			
			
			const Data = new GetSectionDetailsBySectionCodeModel(
				secCode,
				SectionData.secName,
				SectionData.secHeadName
			);
	
			return new GetSectionDetailsBySectionCodeResponse(true, 969, 'Data fetched successfully', Data);
		} catch (error) {
			console.error('Error fetching job FG data:', error);
			return new GetSectionDetailsBySectionCodeResponse(false, 968, 'Internal server error', null);
		}
		}



}
