export class MaterialGRNStatus {
  completedRolls: number;
  completedLength: number;
  pendingRolls: number;
  pendingLength: number;

  constructor(
    completedRolls: number,
    completedLength: number,
    pendingRolls: number,
    pendingLength: number
  ) {
    this.completedRolls = completedRolls;
    this.completedLength = completedLength;
    this.pendingRolls = pendingRolls;
    this.pendingLength = pendingLength;
  }
}
