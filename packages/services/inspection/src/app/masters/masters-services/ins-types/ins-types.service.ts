import { Injectable } from "@nestjs/common";
import { ErrorResponse } from "@xpparel/backend-utils";
import { In } from "typeorm";
import { InsTypesRepo } from "../../repositories/ins-types.repository";
import { InsTypesModel, InsTypesRequest, InsTypesRequestById, InsTypesResponse } from "@xpparel/shared-models";
import { InsConfigEntity } from "../../entity/ins-config.entity";
import { InsTypesAdapter } from "./ins-type.adapter";

@Injectable()
export class InsTypesService {
    constructor(
        private insTypesAdapter: InsTypesAdapter,
        private insTypesRepo: InsTypesRepo
    ) {

    }

    async createInsType(req: InsTypesRequest): Promise<InsTypesResponse> {
        let entity;
        if (req.id) {
            entity = await this.insTypesRepo.findOne({ where: { id: req.id } });
            if (entity) {
                entity = this.insTypesAdapter.convertDtoToEntity(req);
                await this.insTypesRepo.update({ id: req.id }, entity);
                return new InsTypesResponse(true, req.id, `InsTypes Updated Successfully`, [entity]);
            } else {
                return new InsTypesResponse(false, 0, `InsTypes with ID ${req.id} not found`, []);
            }
        } else {
            entity = this.insTypesAdapter.convertDtoToEntity(req);
            const response = await this.insTypesRepo.save(entity);
            return new InsTypesResponse(true, response.id, `InsTypes Created Successfully`, [response]);
        }
    }


    async getInsTypes(req: InsTypesRequestById): Promise<InsTypesResponse> {
        let response: InsConfigEntity[] = [];
        if (req.ids.length > 0) {
            response = await this.insTypesRepo.find({ where: { id: In(req.ids) } });
        } else {
            response = await this.insTypesRepo.find();
        }
        if (response.length === 0) {
            throw new ErrorResponse(55689, "Data Not Found");
        }

        const resultData: InsTypesModel[] = response.map(data => new InsTypesModel(
            data.itemCategoryType,
            data.insTypeI1,
            data.insTypeI2,
            data.materialReady,
            data.selected,
            data.defaultPerc
        ));

        return new InsTypesResponse(true, 85553, 'Data fetched successfully!', resultData);
    }

    async deleteInsTypes(req: InsTypesRequestById): Promise<InsTypesResponse> {
        if (req.ids.length === 0) {
            throw new ErrorResponse(400, 'At least one ID is required for deletion');
        }
        const response = await this.insTypesRepo.delete({ id: In(req.ids) });
        if (response.affected === 0) {
            throw new ErrorResponse(55689, "Data Not Found");
        }
        return new InsTypesResponse(true, 85554, 'Data deleted successfully');
    }
}