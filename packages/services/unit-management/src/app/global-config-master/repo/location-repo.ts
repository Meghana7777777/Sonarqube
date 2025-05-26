import { DataSource, Repository } from "typeorm";
import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { LocationEntity } from "../entity/location-entity";
import { GBLocationModel, GBLocationRequest, GBSectionsModel } from "@xpparel/shared-models";

@Injectable()
export class LocationRepository extends Repository<LocationEntity> {
	constructor(
		@InjectRepository(LocationEntity)
		private repo: Repository<LocationEntity>,
		private datSource: DataSource) {
		super(repo.target, repo.manager, repo.queryRunner);
	
        }



		async getAllLocationsByDeptartmentAndSectionsFromGbC(unitCode:string, secCode:string[]): Promise<GBLocationModel[]> {
			try {
				const locations = await this.repo
					.createQueryBuilder('location')
					.select(['location.id AS locationId','location.locationCode AS locationCode','location.locationName AS locationName','location.locationDesc AS locationDesc','location.locationType AS processType','location.locationExtRef AS locationExtRef','location.locationCapacity AS locationCapacity','location.maxInputJobs AS maxInputJobs','location.maxDisplayJobs AS maxDisplayJobs','location.locationHeadName AS locationHeadName','location.locationHeadCount AS locationHeadCount','location.locationOrder AS locationOrder','location.locationColor AS locationColor','location.secCode AS secCode','location.locationColor AS locationColor', 'location.locationType AS locationType','location.isActive AS isActive'])
					.where('location.unit_code = :unitCode', { unitCode })
					if(secCode && secCode.length > 0) {
					locations.andWhere('location.secCode IN (:...secCode)', { secCode });
					}
					locations.orderBy('location.locationOrder', 'ASC');
					const result = locations.getRawMany();
		
				return result;
			} catch (error) {
				throw new Error(`Failed to fetch locations: ${error.message}`);
			}
		}
		
		
		  
}