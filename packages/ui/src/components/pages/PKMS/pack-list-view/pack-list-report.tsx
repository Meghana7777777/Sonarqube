import { FileExcelFilled } from "@ant-design/icons";
import { PKMSPackListViewResponseDto, PackIdRequest, PackListIdRequest } from "@xpparel/shared-models";
import { PackListService } from "@xpparel/shared-services";
import { Button, Card } from "antd";
import { useAppSelector } from "packages/ui/src/common";
import { useEffect, useState } from "react";
import './list.css';
import ReactHTMLTableToExcel from "./react-html-to-excel";
import { getCssFromComponent } from "../__masters__/print-barcodes/print-barcode-css.util";
import { HeaderTable } from "./report/header-table";
interface IPackListReport {
    selectedPackListId: number[];
};

class PackListHtmlTableInterface {
    block: string;
    country: string;
    ctn: number;
    plId: number;
    plNo: number;
    color: {
        color: string
        colorsRatio: { size: string, ratio: number[] }[];
        colorsQty: { size: string, qty: number[] }[];
    }[];
    constructor(
        block: string,
        country: string,
        ctn: number,
        plId: number,
        color: {
            color: string
            colorsRatio: { size: string, ratio: number[] }[],
            colorsQty: { size: string, qty: number[] }[],
        }[]
    ) {
        this.block = block;
        this.country = country;
        this.ctn = ctn;
        this.plId = plId;
        this.color = color;
    }
}



const PackListReport = (props: IPackListReport) => {
    const { selectedPackListId } = props;
    const service = new PackListService();
    const [data, setData] = useState<PKMSPackListViewResponseDto[]>([]);
    const [details, setDetails] = useState<any>({});
    const [columns, setColumns] = useState<any[]>([]);
    const [column, setColumn] = useState<any[]>([]);
    const user = useAppSelector((state) => state.user.user.user);
    const { userName, orgData, userId } = user;
    const [sizeColumns, setSizeColumns] = useState<{ size: string }[]>([]);
    const [packListRatioMaps, setPackListRatioMaps] = useState<Map<number, Map<string, Map<string, Map<string, number>>>>>(new Map());
    const [packListCountryMaps, setPackLisBlockMaps] = useState(new Map());
    const [packListQtyMaps, setPackListQtyMaps] = useState<Map<number, Map<string, Map<string, Map<string, number>>>>>(new Map());
    const [packListColorsMaps, setPackListColorsMaps] = useState<Map<number, Map<string, Map<string, {
        color: string;
        productName: string;
    }>>>>(new Map());
    const [packListData, setPackListData] = useState<Map<number, PackListHtmlTableInterface>>(new Map());
    const [pkListCartonCount, setPkListCartonCount] = useState(new Map());
    const [pkListCartonWeights, setPkListCartonWeights] = useState<Map<number, Map<number, { netWeight: number, grossWeight: number }>>>(new Map());
    const [pkListCartonDimension, setPkListCartonDimension] = useState<Map<number, Map<number, { length: number, width: number, height: number }>>>(new Map());
    const [colorQtyMaps, setColorQtyMaps] = useState<Map<string, { orderQty: number, packQty: number }>>(new Map());
    const [plColorQtyMaps, setPlColorQtyMaps] = useState<Map<number, Map<string, { orderQty: number, packQty: number }>>>(new Map());






    useEffect(() => {
        if (selectedPackListId.length > 0)
            handlePackListChange(selectedPackListId);
    }, [selectedPackListId]);

    const getPackListDetails = (packListId: number) => {
        const req = new PackListIdRequest(userName, orgData.unitCode, orgData.companyCode, userId, packListId);
        service.getPackListDetails(req).then((res) => {
            if (res.status) {
                setDetails(res.data);
            } else {
                setDetails({});
            }
        }).catch((err) => {
            console.log(err);
        });
    };

    const getPackListData = (packListId: number[]) => {
        const req = new PackIdRequest(userName, orgData.unitCode, orgData.companyCode, userId, packListId);
        service.getPackListData(req).then((res) => {
            if (res.status) {
                const data: PKMSPackListViewResponseDto[] = res.data.data;
                const packListParentMap = new Map<number, PackListHtmlTableInterface>();
                const packListCountryMap = new Map<number, Set<string>>();
                const pkListCartonCountMap = new Map<number, number>();
                const pkListCartonWeights = new Map<number, Map<number, { netWeight: number, grossWeight: number }>>();
                const pkListCartonDimension = new Map<number, Map<number, { length: number, width: number, height: number }>>();
                const colorsQtyMap = new Map<number, Map<string, Map<string, Map<string, number>>>>();//pl,block,color,size
                const colorsRatioMap = new Map<number, Map<string, Map<string, Map<string, number>>>>();
                const colorsMap = new Map<number, Map<string, Map<string, { color: string, productName: string }>>>();//pl,block,colors
                const colorQtyMaps: Map<string, { orderQty: number, packQty: number }> = new Map();
                const consumedPackOrders = new Set<number>();
                const packListConsumedPackOrders = new Set<number>();
                const plColorQtyMaps: Map<number, Map<string, {
                    orderQty: number;
                    packQty: number;
                }>> = new Map();

                for (const packList of data) {
                    const ratio = packList.ratio ? packList.ratio : 0;
                    if (!pkListCartonCountMap.has(packList.plId)) {
                        pkListCartonCountMap.set(packList.plId, packList.noOfCartons);
                    }
                    if (!pkListCartonWeights.has(packList.plId)) {
                        pkListCartonWeights.set(packList.plId, new Map());
                    }
                    if (!pkListCartonWeights.get(packList.plId).has(packList.cartonProtoId)) {
                        pkListCartonWeights.get(packList.plId).set(packList.cartonProtoId, {
                            netWeight: packList.netWeight,
                            grossWeight: packList.grossWeight
                        });
                    }
                    if (!pkListCartonDimension.has(packList.plId)) {
                        pkListCartonDimension.set(packList.plId, new Map());
                    }
                    if (!pkListCartonDimension.get(packList.plId).has(packList.cartonProtoId)) {
                        pkListCartonDimension.get(packList.plId).set(packList.cartonProtoId, {
                            length: packList.length,
                            width: packList.width,
                            height: packList.height
                        });
                    }
                    if (!packListCountryMap.has(packList.plId)) {
                        packListCountryMap.set(packList.plId, new Set([packList.country]));
                    } else {
                        packListCountryMap.get(packList.plId).add(packList.country);
                    }
                    //colors
                    if (!colorsMap.has(packList.plId)) {
                        colorsMap.set(packList.plId, new Map());
                    }

                    if (!colorsMap.get(packList.plId).has(packList.country)) {
                        colorsMap.get(packList.plId).set(packList.country, new Map())
                    }
                    if (!colorsMap.get(packList.plId).get(packList.country).has(packList.color)) {
                        colorsMap.get(packList.plId).get(packList.country).set(packList.color, { color: packList.color, productName: packList.productName })
                    }

                    //sizeRatios
                    if (!colorsRatioMap.has(packList.plId)) {
                        colorsRatioMap.set(packList.plId, new Map());
                        colorsQtyMap.set(packList.plId, new Map());
                    }

                    if (!colorsRatioMap.get(packList.plId).has(packList.country)) {
                        colorsRatioMap.get(packList.plId).set(packList.country, new Map())
                        colorsQtyMap.get(packList.plId).set(packList.country, new Map())
                    }
                    if (!colorsRatioMap.get(packList.plId).get(packList.country).has(packList.color)) {
                        colorsRatioMap.get(packList.plId).get(packList.country).set(packList.color, new Map())
                        colorsQtyMap.get(packList.plId).get(packList.country).set(packList.color, new Map())
                    }

                    if (!colorsRatioMap.get(packList.plId).get(packList.country).get(packList.color).has(packList.size)) {
                        colorsRatioMap.get(packList.plId).get(packList.country).get(packList.color).set(packList.size, ratio);

                        colorsQtyMap.get(packList.plId).get(packList.country).get(packList.color).set(packList.size, ratio * packList.noOfCartons);
                    }
                    if (!packListParentMap.has(packList.plId)) {
                        const dataForBlocks = new PackListHtmlTableInterface(packList.block, packList.country, packList.noOfCartons, packList.plId, []);
                        packListParentMap.set(packList.plId, dataForBlocks)
                    }


                    if (!colorQtyMaps.has(packList.color)) {
                        colorQtyMaps.set(packList.color, { packQty: ratio * packList.noOfCartons, orderQty: packList.orderQty });
                        consumedPackOrders.add(packList.pkOrderSubLineId);
                    } else {
                        const packQty = colorQtyMaps.get(packList.color).packQty + (ratio * packList.noOfCartons);
                        let currentOrderQty = 0;
                        if (!consumedPackOrders.has(packList.pkOrderSubLineId))
                            currentOrderQty = Number(packList.orderQty)
                        const orderQty = colorQtyMaps.get(packList.color).orderQty + currentOrderQty;
                        colorQtyMaps.set(packList.color, { packQty, orderQty });
                    }

                    if (!plColorQtyMaps.has(packList.plId)) {
                        plColorQtyMaps.set(packList.plId, new Map());
                    }

                    if (!plColorQtyMaps.get(packList.plId).has(packList.color)) {
                        let currentOrderQty = 0;
                        if (!packListConsumedPackOrders.has(packList.pkOrderSubLineId))
                            currentOrderQty = Number(packList.orderQty)
                        plColorQtyMaps.get(packList.plId).set(packList.color, { packQty: ratio * packList.noOfCartons, orderQty: currentOrderQty });
                        packListConsumedPackOrders.add(packList.pkOrderSubLineId);
                    } else {
                        const packQty = plColorQtyMaps.get(packList.plId).get(packList.color).packQty + (ratio * packList.noOfCartons);
                        let currentOrderQty = 0;
                        if (!packListConsumedPackOrders.has(packList.pkOrderSubLineId))
                            currentOrderQty = Number(packList.orderQty)
                        const orderQty = Number(plColorQtyMaps.get(packList.plId).get(packList.color).orderQty) + currentOrderQty;
                        plColorQtyMaps.get(packList.plId).set(packList.color, { packQty, orderQty });
                    }
                };
                setPackListRatioMaps(colorsRatioMap);
                setPackListQtyMaps(colorsQtyMap);
                setPackListColorsMaps(colorsMap);
                setPackLisBlockMaps(packListCountryMap);
                setPkListCartonCount(pkListCartonCountMap);
                setPackListData(packListParentMap)
                setPkListCartonWeights(pkListCartonWeights)
                setPkListCartonDimension(pkListCartonDimension);
                setColorQtyMaps(colorQtyMaps);
                setPlColorQtyMaps(plColorQtyMaps);
                setData(res.data.data);
                setSizeColumns(res.data.columns);
                getChildTableColumns(res.data.columns);
            } else {
                setPackListRatioMaps(new Map());
                setPackListQtyMaps(new Map());
                setPackListColorsMaps(new Map());
                setPackListData(new Map())
                setData([]);
                setSizeColumns([]);
                getChildTableColumns([]);
            };
        }).catch((err) => {
            console.log(err);
        });
    };




    const getChildTableColumns = (sizesData: any[]) => {


        const childColumns: any = [
            {
                title: 'Color Code',
                dataIndex: 'color',
            },
            {
                title: 'Size',
                dataIndex: 'qtysName',
            },
        ];
        sizesData.flatMap((rec) =>
            rec.size.map((s) => (
                childColumns.push(
                    {
                        title: s.size,
                        dataIndex: s.size
                    }
                )
            ))
        );
        setColumn(childColumns)

    }


    const handlePackListChange = (value: number[]) => {
        getPackListData(value);
        //0 for all packList deatils are same 
        getPackListDetails(value[0]);
    };

    const getPLExcelName = () => {
        return packListData?.get(selectedPackListId?.[0])?.block;
    }

    const handlePrint = () => {
        const divContents = document.getElementById("print").innerHTML;
        const element = window.open('', '', 'height=700, width=1024');

        // Write the content to the new window
        element.document.write(`${divContents}`);

        getCssFromComponent(document, element.document);
        element.document.close();

        // Allow time for images or other resources to load
        setTimeout(() => {
            element.print();
            element.close();
        }, 1000);
    };

    const getTotalsSummary = () => {
        let totalQty = 0;
        let totalCartons = 0;
        let grossWeight = 0;
        let netWeight = 0;
        let cubic = 0;
        let dimension = '';

        //pl,block,color,size
        packListQtyMaps.forEach((plMap, pkList) => {
            totalCartons += pkListCartonCount.get(pkList);
            const cartons = [...pkListCartonWeights.get(pkList).keys()]
            grossWeight += pkListCartonWeights.get(pkList).get(cartons[0]).grossWeight * pkListCartonCount.get(pkList);
            netWeight += pkListCartonWeights.get(pkList).get(cartons[0]).netWeight * pkListCartonCount.get(pkList);
            cubic += (pkListCartonDimension.get(pkList).get(cartons[0]).length * pkListCartonDimension.get(pkList).get(cartons[0]).width * pkListCartonDimension.get(pkList).get(cartons[0]).height * pkListCartonCount.get(pkList) / 1000000);
            if (!dimension) {
                dimension = `${pkListCartonDimension.get(pkList).get(cartons[0]).length}×${pkListCartonDimension.get(pkList).get(cartons[0]).width}×${pkListCartonDimension.get(pkList).get(cartons[0]).height}`
            }
            plMap.forEach((blockMap) => {
                blockMap.forEach(colorMap => {
                    colorMap.forEach(sizeQty => {
                        totalQty += sizeQty
                    })
                })
            })
        });
        return <table>
            <tr>
                <td></td>
                <td>
                    <tr>
                        <td><strong>TOTAL QTY:</strong></td>
                        <td>{totalQty}</td>
                    </tr>
                    <tr>
                        <td><strong>TOTAL CARTON:</strong></td>
                        <td>{totalCartons}</td>
                    </tr>
                    <tr>
                        <td><strong>TOTAL NET WEIGHT:</strong></td>
                        <td>{netWeight}</td>
                    </tr>
                    <tr>
                        <td><strong>TOTAL GROSS WEIGHT:</strong></td>
                        <td>{grossWeight}</td>
                    </tr>
                    <tr>
                        <td><strong>TOTAL CBM:</strong></td>
                        <td>{cubic.toFixed(3)}</td>
                    </tr>
                    <tr>
                        <td><strong>CARTON MEASUREMENT :</strong></td>
                        <td>{dimension}</td>
                    </tr>
                    <tr>
                        <td><strong>MERCHANDISE ARE FROM BANGLADESH ORIGIN</strong></td>
                    </tr>
                </td>
                <td></td>
            </tr>
        </table>

    }




    return (<Card extra={<><ReactHTMLTableToExcel
        id="test-table-xls-button"
        className="ant-btn css-dev-only-do-not-override-jxh3um ant-btn-default export-excel-btn"
        table="table-to-excel"
        filename={getPLExcelName()}
        sheet="sheet 1"
        buttonText="Excel"
    />
        &nbsp;
        <Button onClick={handlePrint}>Print</Button></>}>
        <div id={'print'} className="print">
            <div className="fabric-wo-print">

                <table id="table-to-excel" >
                    <HeaderTable details={details} sizes={sizeColumns} />
                    <br></br>
                    <tr>
                        {[...packListData.keys()].map((packList, _packListIndex) => {
                            return <table style={{ borderCollapse: 'collapse' }}>
                                <tr style={{ border: '1px solid black', padding: '8px' }}>
                                    <th style={{ border: '1px solid black', padding: '8px', alignContent: 'center' }} >Block</th>
                                    <th style={{ border: '1px solid black', padding: '8px', alignContent: 'center' }}>Country</th>
                                    <th style={{ border: '1px solid black', padding: '8px', alignContent: 'center' }}>CTN</th>
                                    <th style={{ border: '1px solid black', padding: '8px', alignContent: 'center' }}>Color</th>
                                    <th style={{ border: '1px solid black', padding: '8px', alignContent: 'center' }} colSpan={sizeColumns?.length}>SIZE / RATIO</th>
                                    <th style={{ border: '1px solid black', padding: '8px', alignContent: 'center' }} >Total</th>
                                    <th style={{ border: '1px solid black', padding: '8px', alignContent: 'center' }} colSpan={4}>Weight</th>
                                </tr>
                                <tr style={{ border: '1px solid black', padding: '8px' }}>
                                    <th style={{ border: '1px solid black', padding: '8px', alignContent: 'center' }}></th>
                                    <th style={{ border: '1px solid black', padding: '8px', alignContent: 'center' }}></th>
                                    <th style={{ border: '1px solid black', padding: '8px', alignContent: 'center' }}></th>
                                    <th style={{ border: '1px solid black', padding: '8px', alignContent: 'center' }}></th>
                                    {
                                        sizeColumns.map(rec => {
                                            return <th style={{ border: '1px solid black', padding: '8px', alignContent: 'center' }}>{rec.size}</th>
                                        })
                                    }
                                    <th style={{ border: '1px solid black', padding: '8px', alignContent: 'center' }} ></th>
                                    <th style={{ border: '1px solid black', padding: '8px', alignContent: 'center' }} >Net Weight</th>
                                    <th style={{ border: '1px solid black', padding: '8px', alignContent: 'center' }} >Gross Weight</th>
                                    <th style={{ border: '1px solid black', padding: '8px', alignContent: 'center' }} >Total NetWight</th>
                                    <th style={{ border: '1px solid black', padding: '8px', alignContent: 'center' }} >Total GrossWight</th>
                                </tr>
                                {Array.from(packListCountryMaps.get(packList)).map((country: any, _countryIndex: number) => {
                                    return [...packListColorsMaps.get(packList).get(country).keys()].map((color, _colorIndex) => {
                                        return [1, 2].map((_, _index) => {
                                            let ratioTotal = 0;
                                            let qtyTotal = 0;
                                            return <>
                                                <tr style={{ border: '1px solid black', padding: '8px' }}>

                                                    {(_packListIndex == 0 && _index == 0 && _colorIndex == 0) && <td style={{ border: '1px solid black', padding: '8px', alignContent: 'center' }} rowSpan={(_packListIndex == 0 && _index == 0) ? packListCountryMaps.get(packList).size * [...packListColorsMaps.get(packList).get(country).keys()].length * 2 : 0}>{packListData.get(packList).block}</td>}

                                                    {(_packListIndex == 0 && _index == 0 && _colorIndex == 0) && <td style={{ border: '1px solid black', padding: '8px', alignContent: 'center' }} rowSpan={(_packListIndex == 0 && _index == 0) ? packListCountryMaps.get(packList).size * [...packListColorsMaps.get(packList).get(country).keys()].length * 2 : 0}>{packListData.get(packList).country}</td>}

                                                    {(_packListIndex == 0 && _index == 0 && _colorIndex == 0) && <td style={{ border: '1px solid black', padding: '8px', alignContent: 'center' }} rowSpan={(_packListIndex == 0 && _index == 0) ? packListCountryMaps.get(packList).size * [...packListColorsMaps.get(packList).get(country).keys()].length * 2 : 0}>{
                                                        pkListCartonCount.get(packList)
                                                    }</td>}

                                                    <td style={{ border: '1px solid black', padding: '8px', alignContent: 'center' }}>{
                                                        _index == 0 ? packListColorsMaps.get(packList).get(country).get(color).productName : packListColorsMaps.get(packList).get(country).get(color).color
                                                    }</td>
                                                    {
                                                        sizeColumns.map(size => {
                                                            const ratio = Number(packListRatioMaps.get(packList).get(country).get(color).get(size.size) ? packListRatioMaps.get(packList).get(country).get(color).get(size.size) : 0);
                                                            const qty = Number(packListQtyMaps.get(packList).get(country).get(color).get(size.size) ? packListQtyMaps.get(packList).get(country).get(color).get(size.size) : 0);
                                                            ratioTotal += ratio;
                                                            qtyTotal += qty;
                                                            return <td style={{ border: '1px solid black', padding: '8px', alignContent: 'center' }}>
                                                                {
                                                                    _index == 0 ? ratio : qty
                                                                }
                                                            </td>
                                                        })
                                                    }
                                                    <td style={{ border: '1px solid black', padding: '8px', alignContent: 'center' }} >{
                                                        _index == 0 ? ratioTotal : qtyTotal
                                                    }</td>

                                                    {(_packListIndex == 0 && _index == 0 && _colorIndex == 0) && <td style={{ border: '1px solid black', padding: '8px', alignContent: 'center' }} rowSpan={(_packListIndex == 0 && _index == 0) ? packListCountryMaps.get(packList).size * [...packListColorsMaps.get(packList).get(country).keys()].length * 2 : 0} >
                                                        {
                                                            _index == 0 ? pkListCartonWeights.get(packList).get([...pkListCartonWeights.get(packList).keys()][0]).netWeight : ''
                                                        }
                                                    </td>}
                                                    {(_packListIndex == 0 && _index == 0 && _colorIndex == 0) && <td style={{ border: '1px solid black', padding: '8px', alignContent: 'center' }} rowSpan={(_packListIndex == 0 && _index == 0) ? packListCountryMaps.get(packList).size * [...packListColorsMaps.get(packList).get(country).keys()].length * 2 : 0}>
                                                        {
                                                            _index == 0 ? pkListCartonWeights.get(packList).get([...pkListCartonWeights.get(packList).keys()][0]).grossWeight : ''
                                                        }
                                                    </td>}
                                                    {(_packListIndex == 0 && _index == 0 && _colorIndex == 0) && <td style={{ border: '1px solid black', padding: '8px', alignContent: 'center' }} rowSpan={(_packListIndex == 0 && _index == 0) ? packListCountryMaps.get(packList).size * [...packListColorsMaps.get(packList).get(country).keys()].length * 2 : 0}>
                                                        {
                                                            _index == 0 ? pkListCartonWeights.get(packList).get([...pkListCartonWeights.get(packList).keys()][0]).netWeight * pkListCartonCount.get(packList) : ''
                                                        }
                                                    </td>}
                                                    {(_packListIndex == 0 && _index == 0 && _colorIndex == 0) && <td style={{ border: '1px solid black', padding: '8px', alignContent: 'center' }} rowSpan={(_packListIndex == 0 && _index == 0) ? packListCountryMaps.get(packList).size * [...packListColorsMaps.get(packList).get(country).keys()].length * 2 : 0}>
                                                        {
                                                            _index == 0 ? pkListCartonWeights.get(packList).get([...pkListCartonWeights.get(packList).keys()][0]).grossWeight * pkListCartonCount.get(packList) : ''
                                                        }
                                                    </td>}
                                                </tr>
                                            </>
                                        })

                                    })
                                })}
                            </table >
                        })
                        }
                    </tr>

                    <br></br>
                    <tr style={{ display: 'flex' }}>
                        <td>
                            {[...packListData.keys()].map((packList, _packListIndex) => {
                                return <table style={{ borderCollapse: 'collapse' }}>
                                    <tr style={{ border: '1px solid black', padding: '8px' }}>
                                        <th style={{ border: '1px solid black', padding: '8px', alignContent: 'center' }} colSpan={7}>Order Summary:</th>
                                    </tr>
                                    <tr style={{ border: '1px solid black', padding: '8px' }}>
                                        <th style={{ border: '1px solid black', padding: '8px', alignContent: 'center' }} >Block</th>
                                        <th style={{ border: '1px solid black', padding: '8px', alignContent: 'center' }}>Country</th>
                                        <th style={{ border: '1px solid black', padding: '8px', alignContent: 'center' }}>CTN</th>
                                        <th style={{ border: '1px solid black', padding: '8px', alignContent: 'center' }}>Color</th>
                                        <th style={{ border: '1px solid black', padding: '8px', alignContent: 'center' }} >Ord Qty (Pks)</th>
                                        <th style={{ border: '1px solid black', padding: '8px', alignContent: 'center' }} >Ship Qty ( Pks)</th>
                                        <th style={{ border: '1px solid black', padding: '8px', alignContent: 'center' }} >SHORT/EXCESS</th>
                                    </tr>
                                    {Array.from(packListCountryMaps.get(packList)).map((country: any, _countryIndex: number) => {
                                        return [...packListColorsMaps.get(packList).get(country).keys()].map((color, colorIndex) => {
                                            let qtyTotal = 0;
                                            sizeColumns.map(size => {
                                                const qty = Number(packListQtyMaps.get(packList).get(country).get(color).get(size.size));
                                                qtyTotal += qty;
                                            })
                                            return <>
                                                <tr style={{ border: '1px solid black', padding: '8px' }}>
                                                    {(_packListIndex == 0 && colorIndex == 0) && <td style={{ border: '1px solid black', padding: '8px', alignContent: 'center' }} rowSpan={(_packListIndex == 0 && colorIndex == 0) ? packListCountryMaps.get(packList).size * [...packListColorsMaps.get(packList).get(country).keys()].length : 0}>{packListData.get(packList).block}</td>}

                                                    {(_packListIndex == 0 && colorIndex == 0) && <td style={{ border: '1px solid black', padding: '8px', alignContent: 'center' }} rowSpan={(_packListIndex == 0 && colorIndex == 0) ? packListCountryMaps.get(packList).size * [...packListColorsMaps.get(packList).get(country).keys()].length : 0}>{packListData.get(packList).country}</td>}

                                                    {(_packListIndex == 0 && colorIndex == 0) && <td style={{ border: '1px solid black', padding: '8px', alignContent: 'center' }} rowSpan={(_packListIndex == 0 && colorIndex == 0) ? packListCountryMaps.get(packList).size * [...packListColorsMaps.get(packList).get(country).keys()].length : 0}>{
                                                        pkListCartonCount.get(packList)
                                                    }</td>}

                                                    <td style={{ border: '1px solid black', padding: '8px', alignContent: 'center' }}>{
                                                        colorIndex == 0 ? packListColorsMaps.get(packList).get(country).get(color).color : ''
                                                    }</td>

                                                    <td style={{ border: '1px solid black', padding: '8px', alignContent: 'center' }} >{
                                                        plColorQtyMaps.get(packList).get(color).orderQty
                                                    }</td>
                                                    <td style={{ border: '1px solid black', padding: '8px', alignContent: 'center' }} >{
                                                        plColorQtyMaps.get(packList).get(color).packQty
                                                    }</td>
                                                    <td style={{ border: '1px solid black', padding: '8px', alignContent: 'center' }} >{
                                                        plColorQtyMaps.get(packList).get(color).orderQty - plColorQtyMaps.get(packList).get(color).packQty
                                                    }</td>
                                                </tr>
                                            </>
                                        })
                                    })}
                                </table >
                            })
                            }
                        </td>
                        <td>
                            <table style={{ borderCollapse: 'collapse' }}>
                                <tr style={{ border: '1px solid black', padding: '8px' }}>
                                    <th style={{ border: '1px solid black', padding: '8px', alignContent: 'center', background: '#b6ff2d59' }}>Color</th>
                                    <th style={{ border: '1px solid black', padding: '8px', alignContent: 'center', background: '#b6ff2d59' }} >Ord Qty (Pks)</th>
                                    <th style={{ border: '1px solid black', padding: '8px', alignContent: 'center', background: '#b6ff2d59' }} >Ship Qty ( Pks)</th>
                                    <th style={{ border: '1px solid black', padding: '8px', alignContent: 'center', background: '#b6ff2d59' }} >SHORT/EXCESS</th>
                                </tr>
                                {[...colorQtyMaps.keys()].map((color, colorIndex) => {
                                    return <tr style={{ border: '1px solid black', padding: '8px' }}>
                                        <td style={{ border: '1px solid black', padding: '8px', alignContent: 'center' }}>{color}</td>
                                        <td style={{ border: '1px solid black', padding: '8px', alignContent: 'center' }} >{colorQtyMaps.get(color).orderQty}</td>
                                        <td style={{ border: '1px solid black', padding: '8px', alignContent: 'center' }} >{colorQtyMaps.get(color).packQty}</td>
                                        <td style={{ border: '1px solid black', padding: '8px', alignContent: 'center' }} >{
                                            colorQtyMaps.get(color).orderQty - colorQtyMaps.get(color).packQty
                                        }</td>
                                    </tr>
                                })}
                            </table>
                        </td>
                        <td></td>
                    </tr>

                    <br></br>
                    <tr>
                        <td>
                            {getTotalsSummary()}
                        </td>
                        <td>{''}</td>
                    </tr>

                </table>
            </div>
        </div>
    </Card>
    );
};

export default PackListReport;
