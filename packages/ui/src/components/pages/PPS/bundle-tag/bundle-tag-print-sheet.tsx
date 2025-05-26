import { ActualDocketBasicInfoModel, AdBundleModel, CutStatusEnum, LayingStatusEnum, PoRatioSizeModel, PoSummaryModel, sizesOrderArray } from "@xpparel/shared-models";
import { useEffect, useState } from "react";
const data = [
    {
        layId: 1,
        poSerial: 1234,
        docketNumber: "DOCKET001",
        itemCode: "ITEM001",
        itemDesc: "Description for Item1",
        docketPlies: 20,
        actualDocketPlies: 20,
        productName: "Product A",
        productType: "Type A",
        cutNumber: 1,
        layNumber: 1,
        totalAdbs: 50,
        layStatus: LayingStatusEnum.COMPLETED,
        cutStatus: CutStatusEnum.OPEN,
        labelsPrintStatus: false,
        soNo: "SO001",
        soLines: ["Line1", "Line2"],
        components: ["Component1", "Component2"],
        sizeRatios: [
            { size: "S", ratio: 5 },
            { size: "M", ratio: 2 },
            { size: "XS", ratio: 2 },
            { size: "XXL", ratio: 2 },
            { size: "XXXL", ratio: 2 },
            { size: "XXS", ratio: 2 },
            { size: "L", ratio: 3 },
            { size: "32A", ratio: 3 }
        ],
        adBundles: [
            {
                adbId: 1,
                shade: "Shade1",
                bundleNo: "BUNDLE001",
                quantity: 50,
                color: "Blue",
                size: "M",
                panelStart: 1,
                panelEnd: 10,
                barcode: "BARCODE001"
            }
            // Add more AdBundleModel objects as needed
        ],
        isMainDoc: true
    },
    {
        layId: 2,
        poSerial: 1234,
        docketNumber: "DOCKET001",
        itemCode: "ITEM001",
        itemDesc: "Description for Item1",
        docketPlies: 2,
        actualDocketPlies: 2,
        productName: "Product A",
        productType: "Type A",
        cutNumber: 1,
        layNumber: 2,
        totalAdbs: 5,
        layStatus: LayingStatusEnum.COMPLETED,
        cutStatus: CutStatusEnum.COMPLETED,
        labelsPrintStatus: false,
        soNo: "SO001",
        soLines: ["Line1", "Line2"],
        components: ["Component1", "Component2"],
        sizeRatios: [
            { size: "S", ratio: 5 },
            { size: "M", ratio: 2 },
            { size: "L", ratio: 3 }
        ],
        adBundles: [
            {
                adbId: 1,
                shade: "Shade1",
                bundleNo: "BUNDLE001",
                quantity: 50,
                color: "Blue",
                size: "M",
                panelStart: 1,
                panelEnd: 10,
                barcode: "BARCODE001"
            }
            // Add more AdBundleModel objects as needed
        ],
        isMainDoc: true
    }
    // Add more ActualDocketBasicInfoModel objects as needed
]
interface IPlieTable {
    layNumber: number;
    plies: number;
}
interface IAllTableData {
    layPliesData: IPlieTable[];
    sizeRatios: { [key: string]: number }[];
    adBundles: AdBundleModel[]
}
interface IProps {
    adBundles: ActualDocketBasicInfoModel[];
    poSummary: PoSummaryModel
}
const BundleTagPrintSheet = (props: IProps) => {
    useEffect(() => {
        if (props.adBundles.length > 0) {
            constructTablesData(props.adBundles);
        }
    }, [])
    const { adBundles } = props;
    const [tablesData, setTablesData] = useState<IAllTableData>(undefined)

    const constructTablesData = (aDs: ActualDocketBasicInfoModel[]) => {
        const layPliesData: IPlieTable[] = [];
        const adBundles: AdBundleModel[] = [];
        const sizeRatioMap = new Map<string, PoRatioSizeModel>();

        aDs.forEach(a => {
            layPliesData.push({ layNumber: a.layNumber, plies: a.actualDocketPlies });
            a.adBundles.forEach(aDB=> {
                aDB.color = a.color;
                adBundles.push(aDB);
            })
            // adBundles.push(...a.adBundles);
            a.sizeRatios.forEach(s => sizeRatioMap.set(s.size, s));
        });

        const sizeSBreakDownArray = constructSizeBreakDownArray(sizeRatioMap);

        setTablesData({ adBundles, layPliesData, sizeRatios: sizeSBreakDownArray });
    }

    const constructSizeBreakDownArray = (sizeRatioMap: Map<string, PoRatioSizeModel>): { [key: string]: number }[] => {
        const sizes: string[] = []
        const extraSizes = new Set<string>();
        sizesOrderArray.forEach(sO => {
            [...sizeRatioMap.keys()].forEach(aS => {
                if (sO == aS) {
                    sizes.push(aS)
                } else {
                    extraSizes.add(aS)
                }
            })
        });
        const sizeOrderSet = new Set([...sizes, ...extraSizes]);

        const sizeBreakDownArray: { [key: string]: number }[] = [];
        let tempSizeBreakDown: { [key: string]: number } = {};
        const sizeBreakDownCount = 15;
        [...sizeOrderSet].forEach((s, i) => {
            if (i > 0 && i % sizeBreakDownCount === 0) {
                sizeBreakDownArray.push(tempSizeBreakDown);
                tempSizeBreakDown = {};
            }
            tempSizeBreakDown[s] = sizeRatioMap.get(s).ratio;
        });

        if (Object.keys(tempSizeBreakDown).length > 0) {
            sizeBreakDownArray.push(tempSizeBreakDown);
        }

        return sizeBreakDownArray;
    }
    return <>
        {adBundles.length > 0 ?
            <div id='printArea'>
                <h3 style={{ textAlign: 'center' }}>Docket Bundle Sheet</h3>
                <hr />
                <table className="core-table header-tbl" style={{ width: '100%' }}>
                    <tbody>
                        <tr>
                            <td>Sale Order : {adBundles?.[0].moNo}</td>
                            <td>Sale Order Lines : {adBundles?.[0].moLines.join()}</td>
                            <td>Cut Number : {adBundles[0]?.cutSubNumber}</td>
                        </tr>
                        <tr>
                            <td>Docket No : {adBundles[0]?.docketGroup}</td>
                            <td>Cut Order : {props.poSummary?.poDesc}</td>
                            <td>Style : {props.poSummary?.style}</td>
                        </tr>

                    </tbody>
                </table>
                <hr />
                {
                    tablesData && tablesData.sizeRatios.map(sizeRatioObj => {
                        let totalRatioPlies = 0;

                        return <><table className="core-table tbl-border">
                            <thead>
                                <tr>
                                    <th>Size</th>
                                    {Object.keys(sizeRatioObj).map(size => <th>{size}</th>)}
                                    <th>Plies</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td>Ratio</td>
                                    {Object.values(sizeRatioObj).map((r, i) => {
                                        totalRatioPlies += r;
                                        return <td>{r}</td>
                                    })}
                                    <td>{totalRatioPlies}</td>
                                </tr>
                            </tbody>

                        </table>
                            <br /></>
                    })
                }

                <table className="core-table tbl-border">
                    <thead>
                        <th>Lay Number</th>
                        <th>Plies</th>
                    </thead>
                    <tbody>
                        {tablesData && tablesData.layPliesData.map(layObj => {
                            return <tr>
                                <td>{layObj.layNumber}</td>
                                <td>{layObj.plies}</td>
                            </tr>
                        })}

                    </tbody>
                </table>
                <br />
                <table className="core-table tbl-border">
                    <thead>
                        <th>Color</th>
                        <th>Size</th>
                        <th>Shade</th>
                        <th>Start No</th>
                        <th>End No</th>
                        <th>Qty</th>
                        <th>Barcode Number</th>

                    </thead>
                    <tbody>
                        {tablesData && tablesData.adBundles.map(adObj => {
                            return <tr>
                                <td>{adObj.color}</td>
                                <td>{adObj.size}</td>
                                <td>{adObj.shade}</td>
                                <td>{adObj.panelStart}</td>
                                <td>{adObj.panelEnd}</td>
                                <td>{adObj.quantity}</td>
                                <td>{adObj.barcode}</td>
                            </tr>
                        })}
                    </tbody>
                </table>
            </div>
            : ''}
    </>
}

export default BundleTagPrintSheet;