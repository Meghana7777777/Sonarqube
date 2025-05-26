export type Category = 'PROCESS' | 'QUALITY' | 'STYLE'

export class QMS_DefectRatesModel {
    label: string; // Can represent processType, qualityType, or style
    defectiveRate: number; // percentage
    category: Category;
    totalReported:number;
    totalChecked:number;

    constructor(label: string, defectiveRate: number, category: Category,totalReported:number,totalChecked:number) {
        this.label = label;
        this.defectiveRate = defectiveRate;
        this.category = category;
        this.totalReported = totalReported;
        this.totalChecked = totalChecked;
    }
}