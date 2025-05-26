import { BaseInterfaceRepository } from "../../../database/common-repositories";
import { CartonParentQurrey } from "../dto/carton-parent-qurrey.dto";
import { CartonParentHierarchyEntity } from "../entities/carton-config-parent-hierarchy.entity";
import { CartonConfigParentHierarchyRepo } from "./carton-config-parent-hierarchy.repo";

export interface CartonConfigParentHierarchyRepoInterface extends BaseInterfaceRepository<CartonParentHierarchyEntity> {
    getCartonProto(configId: number): Promise<CartonParentQurrey[]>
}
