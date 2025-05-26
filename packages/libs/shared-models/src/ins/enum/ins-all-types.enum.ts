import { PackFabricInspectionRequestCategoryEnum, PackFabricInspectionRequestCategoryEnumDisplayValue } from "../../pkms";
import { InsFabricInspectionRequestCategoryEnum, InsFabricInspectionRequestCategoryEnumDisplayValue } from "./inspection-request-category.enum";
import { ThreadTypeEnum, ThreadTypeEnumDisplayValue } from "./thread-ins.enum";
import { TrimTypeEnum, TrimTypeEnumDisplayValue } from "./trim-ins.enum";
import { YarnTypeEnum, YarnTypeEnumDisplayValue } from "./yarn-ins.enum";

export const InsTypesEnum = {
    ...InsFabricInspectionRequestCategoryEnum,
    ...ThreadTypeEnum,
    ...YarnTypeEnum,
    ...TrimTypeEnum,
    ...PackFabricInspectionRequestCategoryEnum
} as const;
export type InsTypesEnumType = typeof InsTypesEnum[keyof typeof InsTypesEnum];


export const AllInspectionDisplayValues = {
    ...InsFabricInspectionRequestCategoryEnumDisplayValue,
    ...ThreadTypeEnumDisplayValue,
    ...YarnTypeEnumDisplayValue,
    ...TrimTypeEnumDisplayValue,
    ...PackFabricInspectionRequestCategoryEnumDisplayValue
}