export class ConfigMastersDropDownResponseDto {
  id: number;
  code: string;
  masterLabel: string;
  constructor(id: number, code: string, masterLabel:string) {
    this.code = code;
    this.id = id;
    this.masterLabel = masterLabel;
  }
}