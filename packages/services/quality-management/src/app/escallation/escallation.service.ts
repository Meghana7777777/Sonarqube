import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ErrorResponse } from '@xpparel/backend-utils';
import { CommonResponse, EscallationDto, GlobalResponseObject, QualityTypeActivateDeactivateDto } from '@xpparel/shared-models';
import { EscallationAdapter } from './adapter/escallation.adapter';
import { EscallationEntity } from './entites/escallation.entity';
import { EscallationRepo } from './escallation.repo';

@Injectable()
export class EscallationService {
    constructor(

        @InjectRepository(EscallationEntity)
        private repo: EscallationRepo,
        private adapters: EscallationAdapter,
    ) { }

    async createEscallation(createDto: EscallationDto, isUpdate: boolean): Promise<CommonResponse> {
        try {
            const existingQualityType = await this.repo.findOne({
                where: [
                    {
                        escalationPerson: createDto.escalationPerson,
                        style: createDto.style,
                        buyer: createDto.buyer,
                        workOrder: createDto.workOrder
                    },

                ]
            });
            if (isUpdate && existingQualityType && existingQualityType.id !== createDto.id) {
                return new CommonResponse(false, 1111, "The Same Escalation type and  Escalation Person already exists");
            }
            if (!isUpdate) {
                if (existingQualityType) {
                    return new CommonResponse(false, 1111, "The Same Escalation type and  Escalation Person already exists");
                }
                const findRecord = await this.repo.findOne({
                    where: {
                        escalationPerson: createDto.escalationPerson,
                        style: createDto.style,
                        buyer: createDto.buyer,
                        workOrder: createDto.workOrder,


                    },
                });

                if (findRecord) {
                    return new CommonResponse(false, 1111, "The Same Escalation type and  Escalation Person already exists");
                }
            }

            const save = this.adapters.convertDtoToEntity(createDto);
            const savedData = await this.repo.save(save);

            return new CommonResponse(true, 1, isUpdate ? 'Updated Successfully' : 'created Successfully');
        } catch (error) {
            console.error('Error creating/updating Quality type:', error);
            return new CommonResponse(false, 0, 'Internal server error');
        }
    }

    async getAllEscallation(): Promise<CommonResponse> {
        const query = `
            SELECT 
            ec.id AS id,
            ec.escalation_type AS escalationType,
            ec.style ,
            ec.buyer ,
            ec.work_order AS workOrder,
            ec.escalation_percentage AS escalationPercentage,
            ec.escalation_person AS escalationPerson,
            ec.version_flag AS versionFlag,
            ec.is_active AS isActive,
            qt.quality_type AS qualityType,
            a.approver_name AS approverName
            FROM  escallation ec
            LEFT JOIN quality_type qt on qt.id = ec.quality_type
            LEFT JOIN approver a on a.id = ec.escalation_person
            `
        const result = await this.repo.query(query);
        if (!result.length) {
            return new GlobalResponseObject(false, 65645, "Data not found");
        }
        return new CommonResponse(true, 5465, "Data retrieved successfully", result);
    }



    async activateOrDeactivateEscallation(req: QualityTypeActivateDeactivateDto): Promise<any> {
        try {
            const escallationExists = await this.repo.findOne({ where: { id: req.id } })
            if (escallationExists) {
                if (!escallationExists) {
                    return new ErrorResponse(10113, 'Someone updated the current Escallation information. Refresh and try again');
                } else {
                    const EscalationStatus = await this.repo.update(
                        { id: req.id },
                        { isActive: req.isActive }
                    );
                    if (escallationExists.isActive) {
                        if (EscalationStatus.affected) {
                            const jigResponse: any = new CommonResponse(true, 10115, 'Escallation is Deactivated successfully');
                            return jigResponse;
                        } else {
                            return new CommonResponse(false, 10111, 'Escallation is already Deactivated');
                        }
                    } else {
                        if (EscalationStatus.affected) {
                            const jigResponse: any = new CommonResponse(true, 10114, 'Escallation is Activated successfully');
                            return jigResponse;
                        } else {
                            return new CommonResponse(false, 10112, 'Escallation is already activated');
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

    async getAllActiveEscallations(): Promise<CommonResponse> {
        try {
            const data = await this.repo.find({ where: { isActive: true } });
            if (data) {
                return new CommonResponse(true, 1, 'Data Retrived ', data);
            } else {
                return new CommonResponse(false, 0, 'No active found');
            }
        } catch (Err) {
            console.log(Err);
        }
    }
}


