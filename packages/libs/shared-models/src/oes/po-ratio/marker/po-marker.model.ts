export class PoMarkerModel {
    id: number;
    mName: string;
    mVersion: string;
    mWidth: string;
    mLength: string;
    pVersion: string;
    defaultMarker: boolean;
    endAllowance: string;
    perimeter: string;
    cadRemarks: string;
    docRemarks: string;
  
    constructor(
      id: number,
      mName: string,
      mVersion: string,
      mWidth: string,
      mLength: string,
      pVersion: string,
      defaultMarker: boolean,
      endAllowance: string,
      perimeter: string,
      cadRemarks: string,
      docRemarks: string
    ) {
      this.id = id;
      this.mName = mName;
      this.mVersion = mVersion;
      this.mWidth = mWidth;
      this.mLength = mLength;
      this.pVersion = pVersion;
      this.defaultMarker = defaultMarker;
      this.endAllowance = endAllowance;
      this.perimeter = perimeter;
      this.cadRemarks = cadRemarks;
      this.docRemarks = docRemarks;
    }
  }
  