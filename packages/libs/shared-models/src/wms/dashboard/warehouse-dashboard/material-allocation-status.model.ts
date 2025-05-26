export class MaterialAllocationStatus {
  allocatedRolls: number;
  allocatedLength: number;
  pendingAllocatedRolls: number;
  pendingAllocatedLength: number;

  constructor(
    allocatedRolls: number,
    allocatedLength: number,
    pendingAllocatedRolls: number,
    pendingAllocatedLength: number
  ) {
    this.allocatedRolls = allocatedRolls;
    this.allocatedLength = allocatedLength;
    this.pendingAllocatedRolls = pendingAllocatedRolls;
    this.pendingAllocatedLength = pendingAllocatedLength;
  }
}
