export class RollAnalysis {
    totalNumOfRolls: number; // getPackListSummery
    rollsInUnloading: number; // 
    rollsInGRN: number; 
    rollsInInspection: number; 
    rollsInWarehouse: number;
    rollsInCutting: number;

    constructor(
        totalNumOfRolls: number, // getPackListSummery
        rollsInUnloading: number, // 
        rollsInGRN: number, 
        rollsInInspection: number,
        rollsInWarehouse: number,
        rollsInCutting: number,
    ){
        this.totalNumOfRolls= totalNumOfRolls; // getPackListSummery
        this.rollsInUnloading= rollsInUnloading; // 
        this.rollsInGRN= rollsInGRN; 
        this.rollsInInspection= rollsInInspection; 
        this.rollsInWarehouse= rollsInWarehouse;
        this.rollsInCutting= rollsInCutting;
    }
}