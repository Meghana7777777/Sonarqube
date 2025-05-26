import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { GetSectionDetailsBySectionCodeModel, SectionViewModel } from "@xpparel/shared-models";
import { DataSource, Repository } from "typeorm";
import { SectionEntity } from "./section.entity";

@Injectable()
export class SectionRepository extends Repository<SectionEntity> {
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
					.select(['section.id AS sectionId', 'section.secCode AS sectionCode', 'section.secName AS sectionName', 'section.sec_color AS sectionColor', 'sec_type AS secType'])
					.where(` company_code = '${companyCode}' AND unit_code = '${unitCode}' `)
					.getRawMany();
				return sections;
			} catch (error) {
				throw new Error(`Failed to fetch sections: ${error.message}`);
			}
		}

		async getAllSectionsDataBySectionCode(secCode:string)  : Promise<GetSectionDetailsBySectionCodeModel>{
				return await this.createQueryBuilder('sectionData')
				.select([
					'sectionData.secCode',
					'sectionData.secName',
					'sectionData.secHeadName'
				])
				.where('sectionData.secCode = :secCode', { secCode })
				.getOne()
			}
		
}
