import { AdBundleModel, PoEmbHeaderModel, PoRatioSizeModel, PoSummaryModel, sizesOrderArray } from "@xpparel/shared-models";
import { useEffect, useState } from "react";
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
    embJobInfo: PoEmbHeaderModel[];
    poSummary: PoSummaryModel
}
const EmbellishmentPrintSheet = (props: IProps) => {
    useEffect(() => {
        if (props.embJobInfo.length > 0) {
            constructTablesData(props.embJobInfo);
        }
    }, [])
    const { embJobInfo } = props;
    const [tablesData, setTablesData] = useState<IAllTableData>(undefined)

    const constructTablesData = (embs: PoEmbHeaderModel[]) => {
        const layPliesData: IPlieTable[] = [];
        const adBundles: AdBundleModel[] = [];
        const sizeRatioMap = new Map<string, PoRatioSizeModel>();

        embs.forEach(emb => {
            emb.embLines.forEach(e => {
                layPliesData.push({ layNumber: e.panelFormEmbProps.layNumber, plies: e.panelFormEmbProps.layedPlies });
                e.bundlesInfo.forEach(b => {
                    b.color = e.panelFormEmbProps.color;
                    adBundles.push(b)
                })
                // adBundles.push(...e.bundlesInfo);
                e.panelFormEmbProps.refSizeProps.forEach(s => sizeRatioMap.set(s.size, s));
            });
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
        {embJobInfo.length > 0 ?
            <div id='printArea'>
                <h3 style={{ textAlign: 'center' }}>Embellishment Bundle Sheet</h3>
                <hr />
                <table className="core-table header-tbl" style={{ width: '100%' }}>
                    <tbody>
                        <tr>
                            <td>Sale Order : {embJobInfo?.[0].moNo}</td>
                            <td>Sale Order Lines : {embJobInfo?.[0].moLines.join()}</td>
                            <td>Cut Number : {embJobInfo[0]?.embLines?.[0].panelFormEmbProps.cutSubNumber}</td>
                        </tr>
                        <tr>
                            <td>Docket No : {embJobInfo[0]?.embLines?.[0].panelFormEmbProps.docketGroup}</td>
                            <td>Cut Order : {props.poSummary?.poDesc}</td>
                            <td>Style : {props.poSummary?.style}</td>
                        </tr>
                        <tr>
                            <td>Component : {embJobInfo[0]?.embLines?.[0].panelFormEmbProps.components.join()}</td>
                            <td>Emb Number : {embJobInfo[0]?.embLines?.[0].embJobNumber}</td>
                            <td>Operation Code : {embJobInfo[0]?.operations?.map(o => o).join()}</td>
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
                                        totalRatioPlies += Number(r);
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

export default EmbellishmentPrintSheet;