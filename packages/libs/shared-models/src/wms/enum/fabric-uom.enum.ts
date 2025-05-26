import { WeightUOM } from "../../pkms";

export enum FabricUOM {
  YARD = 'yard',
  METER = 'meter',
  CENTIMETER = 'centimeter',
  INCH = 'inch',
  FOOT = 'foot',
  KGS = 'KGS',
  LBS = 'LBS',
  PCS='PCS'
}

export const UOMEnum = {
    ...FabricUOM,
    ...WeightUOM
} as const;
export type UOMEnumType = typeof UOMEnum[keyof typeof UOMEnum];

export const conversionToMeter: Map<FabricUOM, number> = new Map([
  [FabricUOM.YARD, 0.9144],
  [FabricUOM.METER, 1],
  [FabricUOM.CENTIMETER, 0.01],
  [FabricUOM.INCH, 0.0254],
  [FabricUOM.FOOT, 0.3048],
  [FabricUOM.LBS, 1],
  [FabricUOM.KGS, 1],
]);


export const conversionToCentimeter: Map<FabricUOM, number> = new Map([
  [FabricUOM.YARD, 0.9144 * 100],
  [FabricUOM.METER, 1 * 100],
  [FabricUOM.CENTIMETER, 0.01 * 100],
  [FabricUOM.INCH, 0.0254 * 100],
  [FabricUOM.FOOT, 0.3048 * 100],
  [FabricUOM.LBS, 1 * 100],
  [FabricUOM.KGS, 1 * 100],
]);