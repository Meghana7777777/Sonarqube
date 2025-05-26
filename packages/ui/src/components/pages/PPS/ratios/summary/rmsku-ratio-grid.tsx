import { PoFabricRatioModel, PoItemCodeRequest } from "@xpparel/shared-models";
import React, { useEffect, useState } from 'react';
import { Table, Space, Tag } from 'antd';
import { useAppSelector } from "packages/ui/src/common";
import { ColumnsType } from "antd/es/table";
import { PoRatioService } from "@xpparel/shared-services";
import { AlertMessages } from "packages/ui/src/components/common";
const mockData: any = {
    iCode: 'ABC123',
    iColor: 'Blue',
    prodcutTypes: 'Type1',
    productNames: 'ProductA',
    component: 'cmp1',
    poQtys: [
    ],
    fabricRatios: [
        {
            id: 1,
            poSerial: 123,
            rName: 'RatioName1',
            rDesc: 'RatioDescription1',
            rCode: 456,
            sharingRatio: false,
            sandwichRatio: true,
            plies: 2,
            markerInfo: {

            },
            rLines: [
                {
                    id: 101,
                    productType: 'Type1',
                    productName: 'ProductA',
                    color: 'Red',
                    ratioPlies: 1,
                    ratioFabric: [
                        {
                            iCode: 'FabricCode1',
                            iColor: 'White',
                            iDesc: 'FabricDescription1',
                            maxPlies: 2,
                        },
                        // Add more fabric data as needed
                    ],
                    sizeRatios: [
                        {
                            size: 'S',
                            ratio: 2,
                        },
                        {
                            size: 'M',
                            ratio: 5,
                        },
                        // Add more size ratio data as needed
                    ],
                },
                // Add more line data as needed
            ],
        },
        // Add more fabric ratio data as needed
    ],
};




interface FabricRatioTableProps {
    poSerial: number;
    itemCode: string;
}
interface ITblData {
    rName: string;
    rDesc: string;
    plies: number;
    components: string;
    colors: string;
    productNames: string;
    [key: string]: any;
}
const FabricRatioTable: React.FC<FabricRatioTableProps> = ({ poSerial, itemCode }) => {
    const [fabricRatioData, setFabricRatioData] = useState<PoFabricRatioModel>(undefined);
    const [tblColumns, setTblColumns] = useState<ColumnsType<ITblData>>();
    const [tblData, setTblData] = useState<ITblData[]>([]);
    const user = useAppSelector((state) => state.user.user.user);
    const poRatioService = new PoRatioService();
    const [stateKey, setStateKey] = useState<number>(0);
    useEffect(() => {
        if (poSerial) {
            getCumRatioQtyFabricWiseForPo(poSerial, itemCode);
        }
        // constructColumns(fabricRatioData)
        // constructTblData(fabricRatioData)
    }, []);

    const getCumRatioQtyFabricWiseForPo = (poSerialNo: number, itemCode: string) => {
        const req = new PoItemCodeRequest(user?.userName, user?.orgData?.unitCode, user?.orgData?.companyCode, user?.userId, poSerialNo, itemCode);
        poRatioService.getAllRatiosForPoFabric(req).then((res => {
            if (res.status) {
                const data = res.data.length > 0 ? res.data[0] : undefined;
                setFabricRatioData(data);
                setStateKey(preState => preState + 1);
                if (data) {
                    constructColumns(data)
                    constructTblData(data)
                }
            } else {
                AlertMessages.getErrorMessage(res.internalMessage);
            }
        })).catch(error => {
            AlertMessages.getErrorMessage(error.message)
        });
    }
    const constructColumns = (ratioData) => {
        const columns: ColumnsType<ITblData> = [
            {
                title: 'Ratio Name',
                dataIndex: 'rName',
                // key: 'rName',
                align: 'center',
                width: '8%'
            },
            {
                title: 'Ratio Desc',
                dataIndex: 'rDesc',
                // key: 'rName',
                align: 'center',
                width: '15%'
            },
            {
                title: 'Components',
                dataIndex: 'components',
                // key: 'rName',
                align: 'center',
                render: (comps: string) => {
                    return comps.split(',')?.map(c => <Tag color="blue">{c}</Tag>)
                }
            },
            {
                title: 'Colors',
                dataIndex: 'colors',
                // key: 'rName',
                align: 'center',
            },
            {
                title: 'Product Names',
                dataIndex: 'productNames',
                // key: 'rName',
                align: 'center',
            },
            {
                title: 'Plies',
                dataIndex: 'plies',
                align: 'center',
                // key: 'plies',
            }]

        ratioData && ratioData?.fabricRatios[0]?.rLines[0]?.sizeRatios.forEach((sizeRatio, index) => (columns.push({
            title: sizeRatio.size,
            dataIndex: sizeRatio.size,
            align: 'center',
            // key: `sizeRatios[${index}].ratio`,
        })));
        setTblColumns(columns);
    }
    const convertSetToString = (value:Set<string>) => {
        return Array.from(value).join(', ');
     }
    const constructTblData = (ratioData:PoFabricRatioModel) => {
        const dataSource = ratioData ? ratioData.fabricRatios.map(fabricRatio => {
            const colorsSet = new Set<string>();
            const productNames = new Set<string>();
            const dataObj: ITblData = {
                rName: fabricRatio.rName,
                plies: fabricRatio.plies,
                components: fabricRatio.components.join(),
                colors: '',
                productNames: '',
                rDesc: fabricRatio.rDesc
            }
            fabricRatio.rLines.forEach(rLine => {
                colorsSet.add(rLine.color);
                productNames.add(rLine.productName);
                rLine.sizeRatios.forEach(sizeRatio => {
                    dataObj[sizeRatio.size] = sizeRatio.ratio;
                })
            });
            dataObj.colors = convertSetToString(colorsSet);
            dataObj.productNames = convertSetToString(productNames);
            return dataObj;
        }) : [];
        setTblData(dataSource);
    }



    return <Table columns={tblColumns} size="small" bordered scroll={{ x: 'max-content' }} pagination={false} dataSource={tblData} />;
};

export default FabricRatioTable;
