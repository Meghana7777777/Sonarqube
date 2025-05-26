

export class LayDowntimeModel {
    layId: number;
    downtimeId: number;
    downtimeStartedOn: string;
    downtimeCompleteddOn: string;
    reasonId: number;
    reason: string;
    downtimeCompleted: boolean;
    totalDowntimeMinutes: number;
  
    constructor(
      layId: number,
      downtimeId: number,
      downtimeStartedOn: string,
      downtimeCompleteddOn: string,
      reasonId: number,
      reason: string,
      downtimeCompleted: boolean,
      totalDowntimeMinutes: number
    ) {
      this.layId = layId;
      this.downtimeId = downtimeId;
      this.downtimeStartedOn = downtimeStartedOn;
      this.downtimeCompleteddOn = downtimeCompleteddOn;
      this.reasonId = reasonId;
      this.reason = reason;
      this.downtimeCompleted = downtimeCompleted;
      this.totalDowntimeMinutes = totalDowntimeMinutes;
    }
  }