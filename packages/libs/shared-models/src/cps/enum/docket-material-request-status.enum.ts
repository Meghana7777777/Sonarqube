
// NOT USED
export enum DocketMaterialRequestStatusEnum {
    OPEN = 0,
    REQUESTED = 1, // when we plan the docket/some one confirms for a WH request then this will come to REQUESTED
    PREPARING_MATERIAL = 2, // when the warehouse person moved the request to preparing-material
    MATERIAL_NOT_AVL = 3, // after verification whent he warehouse team
    MATERIAL_CONFIRMED = 4, // when the WH confirms the requested material
    LOADED_ON_TROLLY = 5,
    INTRANSIT = 6, // when the WH moves the metrial from WH
    RECEIVED_AT_CUT_TABLE = 7 // 
} 