import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ErrorResponse } from '@xpparel/backend-utils';
import { ApproverActivateDeactivateDto, ApproverDto, CommonResponse } from '@xpparel/shared-models';
import { ApproverAdapter } from './adapter/approver-adapter';
import { ApproverRepository } from './approver-repo';
import { ApproverEntity } from './entites/approver.entity';


@Injectable()
export class ApproverService {
    constructor(

        @InjectRepository(ApproverEntity)
        private repo: ApproverRepository,
        private adapters: ApproverAdapter,
    ) { }

    async createApprover(createDto: ApproverDto, isUpdate: boolean):
        Promise<CommonResponse> {
        try {
            const existingApprover = await this.repo.findOne({
                where: [{ approverName: createDto.approverName }]
            });
            if (isUpdate && existingApprover && existingApprover.id !== createDto.id) {
                return new CommonResponse(false, 1111, "the same Approver already exists");
            }
            if (!isUpdate) {
                if (existingApprover) {
                    return new CommonResponse(false, 1111, "the same Approver already exists");
                }
                const findRecord = await this.repo.findOne({
                    where: { approverName: createDto.approverName }
                });
                if (findRecord) {
                    return new CommonResponse(false, 1111, "Approver already exist");
                }
            }

            const save = this.adapters.convertDtoToEntity(createDto);
            const savedData = await this.repo.save(save);
            return new CommonResponse(true, 1, isUpdate ? 'Approver Updated Successfully' : 'Approver created Successfully', savedData);
        } catch (error) {
            console.error('Error creating/updating Approver:', error);
            return new CommonResponse(false, 0, 'Internal server error');
        }
    }


    async getAllApprovers(): Promise<CommonResponse> {
        try {
            const query = `SELECT id as id, approver_name as approverName, email_id as emailId, is_active as isActive FROM approver`
            const approverData = await this.repo.query(query);

            if (approverData.length > 0) {
                return new CommonResponse(true, 221, 'Data retrieved', approverData);
            } else {
                return new CommonResponse(false, 0, 'No data found');
            }
        } catch (err) {
            throw err;
        }
    }

    async activateOrDeactivateApprover(req: ApproverActivateDeactivateDto): Promise<any> {
        try {
            const existingApprover = await this.repo.findOne({ where: { id: req.id } })
            if (existingApprover) {
                if (!existingApprover) {
                    return new ErrorResponse(10113, 'Someone updated the current Approver information. Refresh and try again');
                } else {
                    const approverStatus = await this.repo.update(
                        { id: req.id },
                        { isActive: req.isActive }
                    );
                    if (existingApprover.isActive) {
                        if (approverStatus.affected) {
                            const approverResponse: any = new CommonResponse(true, 10115, 'Approver is Deactivated successfully');
                            return approverResponse;
                        } else {
                            return new CommonResponse(false, 10111, 'Approver is already Deactivated');
                        }
                    } else {
                        if (approverStatus.affected) {
                            const approverResponse: any = new CommonResponse(true, 10114, 'Approver is Activated successfully');
                            return approverResponse;
                        } else {
                            return new CommonResponse(false, 10112, 'Approver is already activated');
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

    async getAllActiveApprovers(): Promise<CommonResponse> {
        try {
            const data = await this.repo.find({ where: { isActive: true } });
            if (data) {
                return new CommonResponse(true, 1, 'Data Retrived Successfully ', data);
            }
            return new CommonResponse(true, 0, 'No active found', []);
        } catch (error) {
            console.error('Error occurred while fetching active :', error);
        }
    }

}


