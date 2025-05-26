export class SizeCompPanelInfo {
    productName: string;
    fgColor: string;
    size: string;
    componentName: string;
    panelStartNumber: number;
    panelEndNumber: number;

    constructor(productName: string, fgColor: string, size: string, componentName: string, panelStartNumber: number, panelEndNumber: number) {
        this.productName = productName;
        this.fgColor = fgColor;
        this.size = size;
        this.componentName = componentName;
        this.panelStartNumber = panelStartNumber;
        this.panelEndNumber = panelEndNumber;
    }
}
