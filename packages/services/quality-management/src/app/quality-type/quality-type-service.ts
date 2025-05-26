import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ErrorResponse } from '@xpparel/backend-utils';
import { CommonResponse, QualityTypeActivateDeactivateDto, QualityTypeDto } from '@xpparel/shared-models';
import { QualityTypeAdapter } from './adapter/quality-type-adapter';
import { QualityTypeEntity } from './entites/quality-type-entity';
import { QualityTypeRepository } from './quality-type-repo';

@Injectable()
export class QualityTypeService {
    constructor(

        @InjectRepository(QualityTypeEntity)
        private repo: QualityTypeRepository,
        private adapters: QualityTypeAdapter,
    ) { }

    async createQualityType(createDto: QualityTypeDto, isUpdate: boolean): Promise<CommonResponse> {
        try {
            const existingQualityType = await this.repo.findOne({
                where: [{ qualityType: createDto.qualityType }]
            });
            if (isUpdate && existingQualityType && existingQualityType.id !== createDto.id) {
                return new CommonResponse(false, 1111, "the same Quality type already exists");
            }
            if (!isUpdate) {
                if (existingQualityType) {
                    return new CommonResponse(false, 1111, "the same Quality type already exists");
                }
                const findRecord = await this.repo.findOne({
                    where: { qualityType: createDto.qualityType }
                });
                if (findRecord) {
                    return new CommonResponse(false, 1111, "Quality type already exist");
                }
            }

            const save = this.adapters.convertDtoToEntity(createDto);
            const savedData = await this.repo.save(save);
            return new CommonResponse(true, 1, isUpdate ? 'Quality Type Updated Successfully' : 'Quality Type created Successfully', savedData);
        } catch (error) {
            console.error('Error creating/updating Quality type:', error);
            throw new error
        }
    }


    async getAllQualityType(): Promise<CommonResponse> {
        try {
            const query = `SELECT id as id, quality_type as qualityType, is_active as isActive FROM quality_type`
            const qualitytypeData = await this.repo.query(query);
            if (qualitytypeData) {
                return new CommonResponse(true, 1, 'Data retrieved', qualitytypeData);
            } else {
                return new CommonResponse(false, 0, 'No data found');
            }
        } catch (err) {
            throw err;
        }
    }

    async activateOrDeactivateQualityType(req: QualityTypeActivateDeactivateDto): Promise<any> {
        try {
            const qualityTypeExists = await this.repo.findOne({ where: { id: req.id } })
            if (qualityTypeExists) {
                if (!qualityTypeExists) {
                    return new ErrorResponse(10113, 'Someone updated the current Quality type information. Refresh and try again');
                } else {
                    const jigStatus = await this.repo.update(
                        { id: req.id },
                        { isActive: req.isActive }
                    );
                    if (qualityTypeExists.isActive) {
                        if (jigStatus.affected) {
                            const jigResponse: any = new CommonResponse(true, 10115, 'Quality type is Deactivated successfully');
                            return jigResponse;
                        } else {
                            return new CommonResponse(false, 10111, 'Quality type is already Deactivated');
                        }
                    } else {
                        if (jigStatus.affected) {
                            const jigResponse: any = new CommonResponse(true, 10114, 'Quality type is Activated successfully');
                            return jigResponse;
                        } else {
                            return new CommonResponse(false, 10112, 'Quality type is already activated');
                        }
                    }
                }
            } else {
                return new CommonResponse(false, 99998, 'No Records Found');
            }
        } catch (err) {
            return err;
        }
    }

    async getAllActiveQualityType(): Promise<CommonResponse> {
        try {
            const data = await this.repo.find({ where: { isActive: true } });
            if (data) {
                return new CommonResponse(true, 1, 'Data Retrived ', data);
            } else {
                return new CommonResponse(false, 0, 'No active found');
            }
        } catch (error) {
            console.error('Error occurred while fetching active :', error);
            throw error
        }
    }
}


