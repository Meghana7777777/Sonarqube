import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { GBLocationModel, GBSectionRequest, GBSectionsModel, GetAllSectionsResDto, GetSectionDetailsBySectionCodeModel, SectionViewModel } from "@xpparel/shared-models";
import { DataSource, Repository } from "typeorm";
import { SectionEntity } from "../entity/section-entity";

@Injectable()
export class SectionRepository extends Repository<SectionEntity> {
	getUniqueDepartmentTypesByUnitCode(unitCode: string) {
		throw new Error("Method not implemented.");
	}
	constructor(
		@InjectRepository(SectionEntity)
		private repo: Repository<SectionEntity>,
		private datSource: DataSource) {
		super(repo.target, repo.manager, repo.queryRunner);
	}

	async findSections(unitCode: string, companyCode: string): Promise<SectionViewModel[]> {
		try {
			const sections = await this.repo
				.createQueryBuilder('section')
				.select(['section.id AS sectionId', 'section.secCode AS sectionCode', 'section.secName AS sectionName', 'section.sec_color AS sectionColor', 'sec_type AS processType'])
				.where(` company_code = '${companyCode}' AND unit_code = '${unitCode}' `)
				.getRawMany();
			return sections;
		} catch (error) {
			throw new Error(`Failed to fetch sections: ${error.message}`);
		}
	}

	async getAllSectionsDataBySectionCode(secCode: string): Promise<GetSectionDetailsBySectionCodeModel> {
		return await this.createQueryBuilder('sectionData')
			.select([
				'sectionData.secCode',
				'sectionData.secName',
				'sectionData.secHeadName'
			])
			.where('sectionData.secCode = :secCode', { secCode })
			.getOne()
	}

	async getAllSectiondataByDepartmentsFromGbC(req: GBSectionRequest): Promise<GBSectionsModel[]> {
		const query = this.createQueryBuilder('section')
			.select([ 'section.secCode AS secCode', 'section.secName AS secName', 'section.secDesc AS secDesc', 'section.depType AS depType', 'section.secColor AS secColor', 'section.secHeadName AS secHeadName', 'section.secOrder AS secOrder', 'section.isActive AS isActive', 'section.processType AS processType', 'section.deptCode AS deptCode', 'section.id AS id' ])
			.where('section.unitCode = :unitCode', { unitCode: req.unitCode });
	
		if (req.processType && req.processType.length > 0) {
			query.andWhere('section.processType IN (:...processType)', { processType: req.processType });
		}
	
		if (req.deptCode) {
			query.andWhere('section.deptCode = :deptCode', { deptCode: req.deptCode });
		}
	
		try {
			const result = await query.getRawMany();
			return result;
		} catch (error) {
			console.error('DB Query Error:', error);
			throw error;
		}
	}	

}
