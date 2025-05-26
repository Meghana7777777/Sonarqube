export class MaterialIssuedInfo {
  issuedRolls: number;
  issuedLength: number;
  pendingIssuedRolls: number;
  pendingIssuedLength: number;

  constructor(
    issuedRolls: number,
    issuedLength: number,
    pendingIssuedRolls: number,
    pendingIssuedLength: number
  ) {
    this.issuedRolls = issuedRolls;
    this.issuedLength = issuedLength;
    this.pendingIssuedRolls = pendingIssuedRolls;
    this.pendingIssuedLength = pendingIssuedLength;
  }
}
