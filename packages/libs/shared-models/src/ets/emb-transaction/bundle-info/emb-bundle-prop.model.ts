
export class EmbBundlePropsModel {
    cutNumber: string;
    cutSubNumber: number;
    docketNumber: string;
    docketGroup: string;
    size: string;
    color: string;
    shade: string;
    moNo: string;
    moLines: string;
    
    constructor(
        cutNumber: string,
        cutSubNumber: number,
        docketNumber: string,
        docketGroup: string,
        size: string,
        color: string,
        shade: string,
        moNo: string,
        moLines: string
    ) {
        this.cutNumber = cutNumber;
        this.cutSubNumber = cutSubNumber;
        this.docketNumber = docketNumber;
        this.docketGroup = docketGroup;
        this.size = size;
        this.color = color;
        this.shade = shade;
        this.moNo = moNo;
        this.moLines = moLines;
    }
}