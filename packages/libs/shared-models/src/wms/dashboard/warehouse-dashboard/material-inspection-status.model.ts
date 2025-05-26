export class MaterialInspectionStatus {
  approvedRolls: number;
  approvedLength: number;
  pendingRolls: number;
  pendingLength: number;

  constructor(
    approvedRolls: number,
    approvedLength: number,
    pendingRolls: number,
    pendingLength: number
  ) {
    this.approvedRolls = approvedRolls;
    this.approvedLength = approvedLength;
    this.pendingRolls = pendingRolls;
    this.pendingLength = pendingLength;
  }
}
