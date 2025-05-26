import { Injectable } from "@nestjs/common";
import { CommonRequestAttrs, CommonResponse, ConfigGcIdModelDto, DepartmentCreateModel, DepartmentResponseModel, GbDepartmentReqDto, GbGetAllDepartmentsResponseModal, GbGetAllLocationsResponseModal, GbGetAllSectionsResponseModal, GBLocationRequest, GBLocationResponse, GbMasterNamesEnum, GbSectionReqDto, GBSectionRequest, GBSectionsResponse, GetAllDepartmentsResDto, GlobalResponseObject, LocationCreateRequest, LocationModel, LocationResponse, LocationsIdRequest, SectionsCreateRequest, SectionsIdRequest, SectionsModel, SectionsResponse } from "@xpparel/shared-models";
import { DataSource, In } from "typeorm";
import { AttributesMasterRepository } from "./repo/attributes-repo";
import { ConfigMasterAttributesMappingRepository } from "./repo/config-master-attributes-repo";
import { ConfigMasterRepository } from "./repo/config-master-repo";
import { GlobalConfigMasterRepository } from "./repo/global-config-master-repo";
import { MasterService } from "./master-service";
import { ErrorResponse } from "@xpparel/backend-utils";
import { DepartmentEntity } from "./entity/department-master.entity";
import { DepartmentMasterRepo } from "./repo/department-master.repo";
import { GenericTransactionManager } from "../../database/typeorm-transactions";
import { LocationDto } from "./dto/location-dto";
import { SectionDto } from "./dto/section-dto";
import { LocationEntity } from "./entity/location-entity";
import { SectionEntity } from "./entity/section-entity";
import { SectionRepository } from "./repo/section-repo";
import { LocationRepository } from "./repo/location-repo";

@Injectable()
export class GlobalConfigHelperService {

    constructor(
        private dataSource: DataSource,
        private globalConfigRepo: GlobalConfigMasterRepository,
        private configMasterRepo: ConfigMasterRepository,
        private attributesMasterRepo: AttributesMasterRepository,
        private attributesMappingRepo: ConfigMasterAttributesMappingRepository,
        private masterService: MasterService,
        private departmentMasterRepo: DepartmentMasterRepo,
        private SectionRepo: SectionRepository,
        private LocationRepo: LocationRepository,


    ) { }



    async getAllLocationsByCommonReqFromGbC(req: CommonRequestAttrs): Promise<CommonResponse> {
        try {
            const commonReq = { companyCode: req.companyCode, unitCode: req.unitCode }
            const findMastersDepartmentList = await this.globalConfigRepo.findOne({ select: ['id'], where: { masterName: GbMasterNamesEnum.Department, ...commonReq } });
            const findMastersSectionsList = await this.globalConfigRepo.findOne({ select: ['id'], where: { parentId: findMastersDepartmentList.id, masterName: GbMasterNamesEnum.Section, ...commonReq } });
            const findMastersModulesList = await this.globalConfigRepo.findOne({ select: ['id'], where: { parentId: findMastersSectionsList.id, masterName: GbMasterNamesEnum.Location, ...commonReq } });
            const cReq = new ConfigGcIdModelDto(req.username, req.unitCode, req.companyCode, req.userId, findMastersModulesList.id)
            const mappedAttributes = await this.masterService.getConfigMasters(cReq);
            return new CommonResponse(mappedAttributes.status, mappedAttributes.errorCode, 'Locations Retrieved Successfully', mappedAttributes?.data?.data)
        } catch (error) {
            throw new ErrorResponse(6845, error.message)
        }
    }


    // async getAllDepartmentsFromGbC(req: GbDepartmentReqDto): Promise<GbGetAllDepartmentsResponseModal> {
    //     try {
    //         console.log(req,'oooooooooo');
    //         const commonReq = { companyCode: req.companyCode, unitCode: req?.unitCode };
    //         const findMastersDepartmentList = await this.globalConfigRepo.findOne({ select: ['id'], where: { masterName: GbMasterNamesEnum.Department, ...commonReq } });
    //         const cReq = new ConfigGcIdModelDto(req.username, req.unitCode, req.companyCode, req.userId, findMastersDepartmentList.id)
    //         // await this.SectionRepo.getAllSectionsByDepartmentsFromGbC(req.unitCode, req.secCode, req.secType);
    //         if (req?.departments?.length) {
    //             const configMasterAttributes = await this.configMasterRepo.getConfigMasterDataByConfigId(cReq, req.departments);
    //             const data = await this.masterService.attributesMappingAgainstToCmId(configMasterAttributes, req.companyCode, req.unitCode, findMastersDepartmentList.id)
    //             return new GbGetAllDepartmentsResponseModal(true, 6451, 'Data Retrieved Successfully', data)
    //         } else {
    //             const mappedAttributes = await this.masterService.getConfigMasters(cReq, req.departmentType);
    //             return new GbGetAllDepartmentsResponseModal(mappedAttributes.status, mappedAttributes.errorCode, 'Departments Retrieved Successfully', mappedAttributes?.data?.data)
    //         };
    //     } catch (error) {
    //         throw new ErrorResponse(6845, error.message)
    //     }

    // };


    // async getAllSectionsByDepartmentsFromGbC(req: GbSectionReqDto): Promise<GbGetAllSectionsResponseModal> {
    //     try {
    //         const commonReq = { companyCode: req.companyCode, unitCode: req?.unitCode };
    //         const findMastersDepartmentList = await this.globalConfigRepo.findOne({ select: ['id'], where: { masterName: GbMasterNamesEnum.Section, ...commonReq } });
    //         const cReq = new ConfigGcIdModelDto(req.username, req.unitCode, req.companyCode, req.userId, findMastersDepartmentList.id)
    //         if (req.unitCode && !req?.departments?.length) {
    //             const mappedAttributes = await this.masterService.getConfigMasters(cReq, req.deptCode);
    //             if (!mappedAttributes.status) {
    //                 throw new ErrorResponse(65123, mappedAttributes.internalMessage);
    //             }
    //             return new GbGetAllSectionsResponseModal(true, 53543, 'Sections Retrieved Successfully', mappedAttributes?.data?.data);
    //         }
    //         if (req.unitCode && req?.departments?.length) {
    //             const parentIdsReq = { parentIds: req.departments, companyCode: req.companyCode, unitCode: req.unitCode };
    //             const configMasterIdsByQuery = await this.configMasterRepo.getDistinctConfigIdsByParentIds(parentIdsReq);
    //             const configIds = configMasterIdsByQuery.map(rec => rec.configMasterId);
    //             const configMasterAttributes = await this.configMasterRepo.getConfigMasterDataByConfigId(cReq, configIds, req.deptCode, req.processType);
    //             const data = await this.masterService.attributesMappingAgainstToCmId(configMasterAttributes, req.companyCode, req.unitCode, findMastersDepartmentList.id);
    //             if (!data?.length) {
    //                 throw new ErrorResponse(41351, 'No Sections Found');
    //             }
    //             return new GbGetAllSectionsResponseModal(true, 5963, 'Sections Retrieved Successfully', data);
    //         }
    //     } catch (error) {
    //         throw new ErrorResponse(54613, error.message);
    //     }


    // } 

    // async getAllLocationsByDeptAndSectionsFromGbC(req: GbSectionReqDto): Promise<GbGetAllLocationsResponseModal> {
    //     try {
    //         const commonReq = { companyCode: req.companyCode, unitCode: req?.unitCode };
    //         const findMastersDepartmentList = await this.globalConfigRepo.findOne({ select: ['id'], where: { masterName: GbMasterNamesEnum.Location, ...commonReq } });
    //         const cReq = new ConfigGcIdModelDto(req.username, req.unitCode, req.companyCode, req.userId, findMastersDepartmentList.id)
    //         if (req.unitCode && !req?.departments?.length && !req?.sections?.length) {
    //             const mappedAttributes = await this.masterService.getConfigMasters(cReq, req.deptCode);
    //             if (!mappedAttributes.status) {
    //                 throw new ErrorResponse(65123, mappedAttributes.internalMessage)
    //             }
    //             return new GbGetAllLocationsResponseModal(true, 56561, 'Locations Retrieved Successfully', mappedAttributes?.data?.data)
    //         }
    //         if (req.unitCode && req?.departments?.length) {
    //             const departmentReq = { parentIds: req.departments, companyCode: req.companyCode, unitCode: req.unitCode }
    //             const sectionParentIds = await this.configMasterRepo.getDistinctConfigIdsByParentIds(departmentReq);
    //             if (!sectionParentIds?.length) {
    //                 return new GbGetAllLocationsResponseModal(false, 4561, "Please Provide Valid Departments", []);
    //             }
    //             departmentReq.parentIds = sectionParentIds.map(rec => rec.configMasterId)
    //             const configIdsByQuery = await this.configMasterRepo.getDistinctConfigIdsByParentIds(departmentReq);
    //             const configIds = configIdsByQuery.map(rec => rec.configMasterId);
    //             const configMasterAttributes = await this.configMasterRepo.getConfigMasterDataByConfigId(cReq, configIds, req.deptCode);
    //             const data = await this.masterService.attributesMappingAgainstToCmId(configMasterAttributes, req.companyCode, req.unitCode, findMastersDepartmentList.id)
    //             if (!data?.length) {
    //                 return new GbGetAllLocationsResponseModal(false, 65123, "Locations Not Found", []);
    //             }
    //             return new GbGetAllLocationsResponseModal(true, 6265, 'Locations Retrieved Successfully', data);
    //         }
    //         if (req.unitCode && req?.sections?.length) {
    //             const departmentReq = { parentIds: req.sections, companyCode: req.companyCode, unitCode: req.unitCode }
    //             const configIdsByQuery = await this.configMasterRepo.getDistinctConfigIdsByParentIds(departmentReq);
    //             const configIds = configIdsByQuery.map(rec => rec.configMasterId)
    //             const configMasterAttributes = await this.configMasterRepo.getConfigMasterDataByConfigId(cReq, configIds, req.deptCode);
    //             const data = await this.masterService.attributesMappingAgainstToCmId(configMasterAttributes, req.companyCode, req.unitCode, findMastersDepartmentList.id)
    //             if (!data?.length) {
    //                 return new GbGetAllLocationsResponseModal(false, 65256, "Locations Not Found", []);
    //             }
    //             return new GbGetAllLocationsResponseModal(true, 53543, 'Locations Retrieved Successfully', data);
    //         }
    //     } catch (error) {
    //         throw new ErrorResponse(68486, error.message)
    //     }


    // }

    async createDepartment(req: DepartmentCreateModel): Promise<CommonResponse> {
        try {
            const dept = new DepartmentEntity();
            const dummy = await this.dataSource.getRepository(DepartmentEntity).findOneBy({
                unit: req.unit,
                code: req.code,
            });

            if (dummy) {
                return new GlobalResponseObject(false, 1, 'Cannot create duplicate record. Try a different unit code or code.');
            }

            dept.unit = req.unit;
            dept.name = req.name;
            dept.code = req.code;
            dept.type = req.type;
            dept.companyCode = req.companyCode;
            dept.unitCode = req.unitCode;
            dept.createdUser = req.username;

            if (req.id) {
                dept.id = req.id;
                dept.updatedUser = req.username;
                await this.deleteDepartment(req.id);
            }

            await this.dataSource.getRepository(DepartmentEntity).save(dept);

            return new GlobalResponseObject(true, req?.id ? 209 : 210, req.id ? 'Updated Successfully' : 'Created Successfully');
        } catch (error) {
            throw new ErrorResponse(5611, error.message);
        }
    }

    async GetAllDepartments(req: CommonRequestAttrs): Promise<DepartmentResponseModel[]> {
        try {
            const departments = await this.departmentMasterRepo.find({
                select: ['id', 'unit', 'name', 'code', 'type', 'isActive'],
                where: {
                    companyCode: req.companyCode,
                    unitCode: req.unitCode,
                    // isActive: true
                }
            });
            const result = departments.map(
                (d) =>
                    new DepartmentResponseModel(
                        d.id,
                        d.unit,
                        d.name,
                        d.code,
                        d.type,
                        d.isActive
                    )
            );
            return result;
        } catch (error) {
            throw new ErrorResponse(5612, error.message);
        }
    }

    async deleteDepartment(req: number): Promise<GlobalResponseObject> {
        try {
            const repo = this.dataSource.getRepository(DepartmentEntity);
            const existing = await repo.findOneBy({ id: req });

            if (!existing) {
                return new GlobalResponseObject(false, 404, 'Department not found');
            }

            await repo.delete({ id: req });
            return new GlobalResponseObject(true, 209, 'Deleted Successfully');
        } catch (error) {
            throw new ErrorResponse(5613, error.message);
        }
    }

    async toggleDepartment(req: DepartmentCreateModel): Promise<CommonResponse> {
        try {
            const toggleDept = await this.departmentMasterRepo.findOneBy({ id: req.id });

            if (toggleDept) {
                const entity = new DepartmentEntity();
                entity.id = req.id;
                entity.isActive = !toggleDept.isActive;

                await this.departmentMasterRepo.save(entity);

                const message = toggleDept.isActive ? "Deactivated Successfully" : "Activated Successfully";
                return new CommonResponse(true, toggleDept.isActive ? 920 : 921, message);
            } else {
                return new CommonResponse(false, 924, "No Data Found");
            }
        } catch (error) {
            throw new ErrorResponse(5614, error.message);
        }
    }

    async getAllDepartmentsFromGbC2(req: CommonRequestAttrs): Promise<GbGetAllDepartmentsResponseModal> {
        try {
            const records = await this.departmentMasterRepo.find({
                where: { unit: req.unitCode, isActive: true },
                select: ['id', 'unit', 'name', 'code', 'type', 'isActive']
            });

            const result: GetAllDepartmentsResDto[] = records.map(
                (d) => new GetAllDepartmentsResDto(d.code, d.name, d.id));

            const message = result.length
                ? `${result.length} records fetched`
                : 'No records found based on the unit';

            return new GbGetAllDepartmentsResponseModal(true, 1, message, result);
        } catch (error) {
            throw new ErrorResponse(5615, error.message);
        }
    }



    async getUniqueDepartmentTypesByUnitCode(unitCode: string): Promise<CommonResponse> {
        try {
            const result = await this.departmentMasterRepo.createQueryBuilder('department')
                .select('DISTINCT(department.type)', 'type')
                .where('department.unitCode = :unitCode', { unitCode })
                .getRawMany();
            result.map((record) => record.type);
            return new CommonResponse(true, 1, 'Unique department types retrieved successfully', result);
        } catch (error) {
            throw new Error(`Failed to fetch unique department types: ${error.message}`);
        }
    }



    //section
    async createSection(reqModel: SectionsCreateRequest): Promise<SectionsResponse> {
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
                entity.processType = section.processType;
                entity.companyCode = reqModel.companyCode;
                entity.createdUser = reqModel.username;
                entity.unitCode = reqModel.unitCode;
                entity.deptCode = section.deptCode;
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
            return new SectionsResponse(true, 26098, `Section "Updated" : "Created" Successfully`, resultEntity);
        } catch (error) {
            await transManager.releaseTransaction();
            throw error;
        }
    }


    async deleteSection(reqModel: SectionsIdRequest): Promise<GlobalResponseObject> {
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


    async getSection(reqData: SectionsIdRequest): Promise<SectionsResponse> {
        try {
            const records = await this.SectionRepo.find({ where: { id: reqData.id } });
            if (records.length === 0) {
                throw new ErrorResponse(924, "No Data Found");
            }
            const resultData: SectionsModel[] = records.map(data => {
                return new SectionsModel(data.id, data.secCode, data.secName, data.secDesc, data.depType, data.secColor, data.secHeadName, data.secOrder, data.isActive, data.processType, data.deptCode);
            });
            return new SectionsResponse(true, 967, "Data Retrieved Successfully", resultData);
        } catch (error) {
            console.error("Error in getSection:", error);
            if (error instanceof ErrorResponse) {
                throw error;
            }
            throw new ErrorResponse(968, "Internal Server Error");
        }
    }

    // async activateDeactivateSection(reqModel: SectionDto): Promise<SectionsResponse> {
    //     const getRecord = await this.SectionRepo.findOne({ where: { id: reqModel.id } });
    //     const toggle = await this.SectionRepo.update(
    //         { id: reqModel.id },
    //         { isActive: getRecord.isActive == true ? false : true });
    //     return new SectionsResponse(true, getRecord.isActive ? 26104 : 26135, getRecord.isActive ? 'Section de-activated successfully' : 'Section activated successfully');

    // }


    async activateDeactivateSection(reqModel: SectionsIdRequest): Promise<SectionsResponse> {
        const getRecord = await this.SectionRepo.findOne({ where: { companyCode: reqModel.companyCode, unitCode: reqModel.unitCode, id: reqModel.id } });
        if (!getRecord) {
            throw new ErrorResponse(404, "Record not found");
        }
        const newStatus = !getRecord.isActive;
        await this.SectionRepo.update({ id: reqModel.id }, { isActive: newStatus });
        return new SectionsResponse(
            true,
            newStatus ? 1 : 0,
            newStatus ? "Section Activated Successfully" : "Section Deactivated Successfully"
        );
    }


    async getAllSections(reqModel: CommonRequestAttrs): Promise<SectionsResponse> {
        try {
            const { unitCode, companyCode } = reqModel;

            const records = await this.SectionRepo.find({
                where: {
                    unitCode: unitCode,
                    companyCode: companyCode
                }
            });
            if (records.length === 0) {
                return new SectionsResponse(false, 26105, "No sections found for the given company code and unit code");
            }
            const resultData: SectionsModel[] = records.map(data => {
                return new SectionsModel(data.id, data.secCode, data.secName, data.secDesc, data.depType, data.secColor, data.secHeadName, data.secOrder, data.isActive, data.processType, data.deptCode);
            });

            return new SectionsResponse(true, 26106, "Sections retrieved successfully", resultData);
        } catch (error) {
            console.error("Error in getAllSections:", error);
            if (error instanceof ErrorResponse) {
                throw error;
            }
            throw new ErrorResponse(968, "Internal Server Error");
        }
    }

    //location

    async createLocation(reqModel: LocationCreateRequest): Promise<LocationResponse> {
        const transManager = new GenericTransactionManager(this.dataSource);
        try {
            await transManager.startTransaction();
            const resultEntity: LocationEntity[] = [];

            for (const location of reqModel.location) {
                const records = await this.LocationRepo.find({ where: { locationCode: location.locationCode } });
                if (records.length > 0 && !location.id) {
                    throw new ErrorResponse(925, "Location Already exists");
                }
                const sections = await this.dataSource.getRepository(SectionEntity).findOne({ select: ['processType'], where: { secCode: location.secCode } })
                const entity = new LocationEntity();

                entity.locationCode = location.locationCode;
                entity.locationName = location.locationName;
                entity.locationDesc = location.locationDesc;
                entity.locationType = sections.processType;
                entity.locationCapacity = location.locationCapacity;
                entity.maxInputJobs = location.maxInputJobs;
                entity.maxDisplayJobs = location.maxDisplayJobs;
                entity.locationHeadName = location.locationHeadName;
                entity.locationHeadCount = location.locationHeadCount;
                entity.locationOrder = location.locationOrder;
                entity.locationColor = location.locationColor;
                entity.secCode = location.secCode;
                entity.companyCode = reqModel.companyCode;
                entity.createdUser = reqModel.username;
                entity.unitCode = reqModel.unitCode;
                entity.locationExtRef = location.locationExtRef;
                if (location.id) {
                    entity.id = location.id;
                    entity.updatedUser = reqModel.username;
                }

                if (records.length === 0) {
                    const saveData = await transManager.getRepository(LocationEntity).save(entity);
                } else if (location.id) {
                    const saveData = await transManager.getRepository(LocationEntity).save(entity);
                } else {
                    throw new ErrorResponse(26010, "Data exists w3ith same component");
                }
            }

            await transManager.completeTransaction();
            return new LocationResponse(true, 85552, `Location Updated : Created Successfully`, resultEntity);
        } catch (error) {
            await transManager.releaseTransaction();
            throw error;
        }
    }


    async deleteLocation(reqModel: LocationsIdRequest): Promise<GlobalResponseObject> {
        if (!reqModel.id) {
            throw new ErrorResponse(26012, "Please give Location Id")
        }
        if (reqModel.id) {
            const records = await this.LocationRepo.find({ where: { id: reqModel.id } });
            if (records.length === 0) {
                throw new ErrorResponse(26013, "Location Data not Found")
            }
            const deleteProduct = await this.LocationRepo.delete({ id: reqModel.id });
            return new GlobalResponseObject(true, 26014, ' Location Deleted Successfully');
        }

    }

    async getLocation(reqData: LocationsIdRequest): Promise<LocationResponse> {
        try {

            const records = await this.LocationRepo.find();

            if (records.length === 0) {
              throw new ErrorResponse(924, "No Data Found");
            }
            const resultData: LocationModel[] = records.map(data => {
                return new LocationModel(data.id, data.locationCode, data.locationName, data.locationDesc, data.locationType,
                    data.locationExtRef, data.locationCapacity, data.maxInputJobs, data.maxDisplayJobs, data.locationHeadName, data.locationHeadCount,
                    data.locationOrder, data.locationColor, data.secCode, data.isActive);
            });
            return new LocationResponse(true, 967, "Data Retrieved Successfully", resultData);
        } catch (error) {
            console.error("Error in getSelection:", error);
            if (error instanceof ErrorResponse) {
                throw error; // Custom error
            }
            throw new ErrorResponse(968, "Internal Server Error");
        }
    }


    async activateDeactivateLocation(reqModel: LocationDto): Promise<LocationResponse> {
        const getRecord = await this.LocationRepo.findOne({ where: { id: reqModel.id } });
        const toggle = await this.LocationRepo.update(
            { id: reqModel.id },
            { isActive: getRecord.isActive == true ? false : true });
        return new LocationResponse(true, getRecord.isActive ? 26016 : 26136, getRecord.isActive ? 'Location de-activated successfully' : 'Location activated successfully');

    }

    async getAllLocationsByDeptartmentAndSectionsFromGbC(req: GBLocationRequest): Promise<GBLocationResponse> {
        try {
            const result = await this.LocationRepo.getAllLocationsByDeptartmentAndSectionsFromGbC(req.unitCode, req.secCode);
            return new GBLocationResponse(true, 1, 'Data Retrieved Successfully', result);
        } catch (error) {
            throw new Error(`Failed to fetch locations: ${error.message}`);
        }
    }


    async getAllSectiondataByDepartmentsFromGbC(req: GBSectionRequest): Promise<GBSectionsResponse> {
        try {
            const result = await this.SectionRepo.getAllSectiondataByDepartmentsFromGbC(req);
            if (result.length === 0) {
                throw new ErrorResponse(26105, "No sections found for the given company code and unit code");
            }
            return new GBSectionsResponse(true, 1, 'Data Retrieved Successfully', result);
        } catch (error) {
            throw new Error(`Failed to fetch locations: ${error.message}`);
        }
    }


}    