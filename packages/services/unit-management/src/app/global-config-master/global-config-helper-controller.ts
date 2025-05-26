import { Body, Controller, Post } from "@nestjs/common";
import { ApiBody } from "@nestjs/swagger";
import { returnException } from "@xpparel/backend-utils";
import { CommonRequestAttrs, CommonResponse, DepartmentCreateModel, GbDepartmentReqDto, GbGetAllDepartmentsResponseModal, GbGetAllLocationsResponseModal, GbGetAllSectionsResponseModal, GBLocationRequest, GBLocationResponse, GbSectionReqDto, GBSectionRequest, GBSectionsResponse, GlobalResponseObject, LocationCreateRequest, LocationResponse, LocationsIdRequest, SectionCreateRequest, SectionIdRequest, SectionResponse, SectionsResponse } from "@xpparel/shared-models";
import { LocationDto } from "./dto/location-dto";
import { SectionDto } from "./dto/section-dto";
import { GlobalConfigHelperService } from "./global-config-helper-service";

@Controller('global-config-helper')
export class GlobalConfigHelperController {
    constructor(
        private globalConfigHelperService: GlobalConfigHelperService,

    ) {

    };

    // @Post('getAllDepartmentsFromGbC')
    // async getAllDepartmentsFromGbC(@Body() req: GbDepartmentReqDto): Promise<GbGetAllDepartmentsResponseModal> {
    //     try {
    //         return this.globalConfigHelperService.getAllDepartmentsFromGbC(req);
    //     } catch (error) {
    //         return returnException(GbGetAllDepartmentsResponseModal, error);
    //     }
    // }

    // @Post('getAllSectionsByDepartmentsFromGbC')
    // async getAllSectionsByDepartmentsFromGbC(@Body() req: GbSectionReqDto): Promise<GbGetAllSectionsResponseModal> {
    //     try {
    //         return this.globalConfigHelperService.getAllSectionsByDepartmentsFromGbC(req)
    //     } catch (error) {
    //         return returnException(GbGetAllSectionsResponseModal, error)
    //     }
    // }

    // @Post('getAllLocationsByDeptAndSectionsFromGbC')
    // async getAllLocationsByDeptAndSectionsFromGbC(@Body() req: GbSectionReqDto): Promise<GbGetAllLocationsResponseModal> {
    //     try {
    //         return this.globalConfigHelperService.getAllLocationsByDeptAndSectionsFromGbC(req)
    //     } catch (error) {
    //         return returnException(GbGetAllLocationsResponseModal, error)
    //     }
    // }

    @Post('getAllDepartments')
    async getAllDepartments(@Body() req: CommonRequestAttrs): Promise<CommonResponse> {
        try {
            const data = await this.globalConfigHelperService.GetAllDepartments(req);
            return new CommonResponse(true, 967, "Data Retrieved Successfully", data);
        } catch (error) {
            console.error("getAllDepartments error:", error);
            return new CommonResponse(false, 500, "Failed to retrieve departments", []);
        }
    }

    @Post('createDepartment')
    async createDepartment(@Body() req: DepartmentCreateModel): Promise<CommonResponse> {
        try {
            return await this.globalConfigHelperService.createDepartment(req);
        } catch (error) {
            console.error("createDepartment error:", error);
            return new CommonResponse(false, 500, "Failed to create department", null);
        }
    }

    @Post('toggleDepartment')
    async toggleDepartment(@Body() req: DepartmentCreateModel): Promise<CommonResponse> {
        try {
            return await this.globalConfigHelperService.toggleDepartment(req);
        } catch (error) {
            console.error("toggleDepartment error:", error);
            return new CommonResponse(false, 500, "Failed to toggle department", null);
        }
    }

    @Post('getAllDepartmentsFromGbC')
    async getAllDepartmentsFromGbC2(@Body() req: CommonRequestAttrs): Promise<GbGetAllDepartmentsResponseModal> {
        try {
            return await this.globalConfigHelperService.getAllDepartmentsFromGbC2(req);
        } catch (error) {
            console.error("getDataByUnit error:", error);
            return new GbGetAllDepartmentsResponseModal(false, 500, "Failed to get departments by unit", null);
        }
    }



    @ApiBody({ type: GBSectionRequest })
    @Post('getUniqueDepartmentTypesByUnitCode')
    async getUniqueDepartmentTypesByUnitCode(@Body() body: GBSectionRequest): Promise<CommonResponse> {
        try {
            return this.globalConfigHelperService.getUniqueDepartmentTypesByUnitCode(body.unitCode);

        }
        catch (error) {
            return returnException(CommonResponse, error);
        }
    }



    //sections

    @ApiBody({ type: SectionCreateRequest })
    @Post('createSection')
    async createSection(@Body() req: any): Promise<SectionsResponse> {
        try {
            return await this.globalConfigHelperService.createSection(req);
        } catch (error) {
            return returnException(SectionsResponse, error)
        }
    }

    @Post('deleteSection')
    async deleteSection(@Body() req: SectionIdRequest): Promise<GlobalResponseObject> {
        try {
            return await this.globalConfigHelperService.deleteSection(req);
        } catch (error) {
            return returnException(GlobalResponseObject, error)
        }
    }

    @ApiBody({ type: SectionIdRequest })
    @Post('getSection')
    async getSection(@Body() req: SectionIdRequest): Promise<SectionsResponse> {
        try {
            return await this.globalConfigHelperService.getSection(req);
        } catch (error) {
            return returnException(SectionsResponse, error);
        }
    }


    @Post('activeDeactiveSection')
    @ApiBody({ type: SectionIdRequest })
    async activateDeactivateSection(@Body() req: SectionIdRequest): Promise<SectionsResponse> {
        try {
            return await this.globalConfigHelperService.activateDeactivateSection(req);
        }
        catch (error) {
            return returnException(SectionsResponse, error);
        }
    }


    @ApiBody({ type: CommonRequestAttrs })
    @Post('/getAllSections')
    async getAllSections(@Body() req: CommonRequestAttrs): Promise<SectionsResponse> {
        try {
            return await this.globalConfigHelperService.getAllSections(req);
        } catch (error) {
            return returnException(SectionsResponse, error);
        }
    }


    //location

    @Post('createLocation')
    @ApiBody({ type: LocationCreateRequest })
    async createLocation(@Body() req: any): Promise<LocationResponse> {
        try {
            return await this.globalConfigHelperService.createLocation(req);
        } catch (error) {
            return returnException(LocationResponse, error)
        }
    }

    @Post('deleteLocation')
    async deleteLocation(@Body() req: LocationsIdRequest): Promise<GlobalResponseObject> {
        try {
            return await this.globalConfigHelperService.deleteLocation(req);
        } catch (error) {
            return returnException(GlobalResponseObject, error)
        }
    }

    @ApiBody({ type: LocationsIdRequest })
    @Post('getLocation')
    async getLocation(@Body() req: LocationsIdRequest): Promise<LocationResponse> {
        try {
            return await this.globalConfigHelperService.getLocation(req);
        } catch (error) {
            return returnException(LocationResponse, error);
        }
    }


    @ApiBody({ type: LocationDto })
    @Post('activateDeactivateLocation')
    async activateDeactivateLocation(@Body() req: LocationDto): Promise<LocationResponse> {

        try {
            return await this.globalConfigHelperService.activateDeactivateLocation(req);
        }
        catch (error) {
            return returnException(LocationResponse, error);
        }
    } 

    @ApiBody({ type: GBLocationRequest })
    @Post('getAllLocationsByDeptAndSectionsFromGbC')
    async getAllLocationsByDeptartmentAndSectionsFromGbC(@Body() body: GBLocationRequest): Promise<GBLocationResponse> {
        try {
        return this.globalConfigHelperService.getAllLocationsByDeptartmentAndSectionsFromGbC(body);
        }
        catch (error) {
            return returnException(GBLocationResponse, error);
        }
    }

    @ApiBody({ type: GBSectionRequest })
    @Post('getAllSectionsByDepartmentsFromGbC')
    async getAllSectiondataByDepartmentsFromGbC(@Body() req: GBSectionRequest): Promise<GBSectionsResponse> {
        try {
            return await this.globalConfigHelperService.getAllSectiondataByDepartmentsFromGbC(req);
        }
        catch (error) {
            return returnException(GBSectionsResponse, error);
        }
    }

}   