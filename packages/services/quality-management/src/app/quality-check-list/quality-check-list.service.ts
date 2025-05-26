import { Injectable } from '@nestjs/common';
import { ErrorResponse } from '@xpparel/backend-utils';
import { CommonResponse } from '@xpparel/shared-models';
import { QualityCheckListDto } from './dto/quality-check-list.dto';
import { QualityCheckListEntity } from './entites/quality-check-list.entity';
import { QualityCheckListRepository } from './quality-check-list.repo';

@Injectable()
export class QualityCheckListService {
    constructor(
        private repo: QualityCheckListRepository,
    ) { }

    async createQualityCheckListParameter(createDto: QualityCheckListDto): Promise<CommonResponse> {
        try {
            const entity = new QualityCheckListEntity()
            entity.qualityTypeId = createDto.qualityTypeId
            entity.parameter = createDto.parameter
            const savedData = await this.repo.save(entity);
            return new CommonResponse(true, 1, 'Quality Parameter Created Successfully', savedData);
        } catch (error) {
            console.error('Error Creating Quality Parameter:', error);
            return new CommonResponse(false, 0, 'Internal server error');
        }
    }

    async getAllQualityCheckListParameter(): Promise<CommonResponse> {
        try {
            const result = await this.repo.getAllQualityCheckListParameter()
            if (result) {
                return new CommonResponse(true, 1, 'Data Retrived', result);
            } else {
                return new CommonResponse(false, 0, 'No Data Found');
            }
        } catch (err) {
            console.log(err);
        }
    }

    async getAllActiveQualityCheckListParameter(): Promise<CommonResponse> {
        try {
            const result = await this.repo.getAllActiveQualityCheckListParameter()
            if (result) {
                return new CommonResponse(true, 1, 'Data Retrived', result);
            } else {
                return new CommonResponse(false, 0, 'No Data Found');
            }
        } catch (err) {
            console.log(err);
        }
    }

    async getAllQualityCheckListParamsMapping(): Promise<CommonResponse> {
        try {
            const result = await this.repo.getAllQualityCheckListParamsMapping()
            if (result) {
                return new CommonResponse(true, 1, 'Data Retrived', result);
            } else {
                return new CommonResponse(false, 0, 'No Data Found');
            }
        } catch (err) {
            console.log(err);
        }
    }

    async updateQualityCheckListParameter(req: any): Promise<CommonResponse> {
        try {
            const result = await this.repo.update({ qualityCheckListId: req.qualityCheckListId }, { qualityTypeId: req.qualityTypeId, parameter: req.parameter })
            if (result) {
                return new CommonResponse(true, 1, 'Data Retrived', result);
            } else {
                return new CommonResponse(false, 0, 'No Data Found');
            }
        } catch (err) {
            console.log(err);
        }
    }

    async activateDeactivateQualityCheckListParameter(req: any): Promise<any> {
        try {
            const qualityTypeExists = await this.repo.findOne({ where: { qualityCheckListId: req.qualityCheckListId } })
            if (qualityTypeExists) {
                if (!qualityTypeExists) {
                    return new ErrorResponse(10113, 'Someone updated the current Quality Parameter information. Refresh and try again');
                } else {
                    const data = await this.repo.update(
                        { qualityCheckListId: req.qualityCheckListId },
                        { isActive: req.isActive }
                    );
                    if (qualityTypeExists.isActive) {
                        if (data.affected) {
                            const res: any = new CommonResponse(true, 10115, 'Quality Parameter is Deactivated successfully');
                            return res;
                        } else {
                            return new CommonResponse(false, 10111, 'Quality Parameter is already Deactivated');
                        }
                    } else {
                        if (data.affected) {
                            const res: any = new CommonResponse(true, 10114, 'Quality Parameter is Activated successfully');
                            return res;
                        } else {
                            return new CommonResponse(false, 10112, 'Quality Parameter is already activated');
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



}


