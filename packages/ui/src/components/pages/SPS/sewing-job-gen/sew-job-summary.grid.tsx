
import { SewingJobSummaryForSewingOrder, SewingOrderReq } from "@xpparel/shared-models";
import { SewingJobGenActualService } from "@xpparel/shared-services";
import { Button, Card, Checkbox, Drawer, Form, InputNumber, Popover, Space, Table, TableColumnsType, Tag, Tooltip } from "antd"
import { useAppSelector } from "packages/ui/src/common";
import { useEffect, useState } from "react";
import { AlertMessages } from "../../../common";
import './sew-job-gen.css';

import { ColumnProps } from "antd/es/table";
interface IGridProps {
    sewingOrderId: number;
    updateKey: number;
}



const totalKey = 'Total';

interface SizeQty {
    originalQty: number;
    sewGeneratedQty: number;
    pendingQty: number;
}

interface ProductData {
    productType: string;
    productName: string;
    [size: string]: SizeQty | string;  // Allow dynamic size fields like "0-3M", "0-4M"
}
const columns: ColumnProps<ProductData>[] = [   
    {
        title: 'Product Name',
        dataIndex: 'productName',
        key: 'productName'
    },
    {
        title: 'Product Type',
        dataIndex: 'productType',
        key: 'productType'
    }
]

const SewingActualCutSummaryGrid = (props: IGridProps) => {
    const user = useAppSelector((state) => state.user.user.user);
    const [sewCutTableData, setSewCutTableData] = useState<ProductData[]>([]);
    const [mainTblColumns, setMainTblColumns] = useState<TableColumnsType<ProductData>>(columns);
    const sewingJobGenActualService = new SewingJobGenActualService();

    const [sewCutOrderInfo, setSewCutOrderInfo] = useState<SewingJobSummaryForSewingOrder>();


    useEffect(() => {
        if (props.sewingOrderId) {
            getSewingCutDocketInfoForJobFeatures();
        }

    }, [props.updateKey]);

    const getSewingCutDocketInfoForJobFeatures = () => {

        const req = new SewingOrderReq(user?.userName, user?.orgData?.unitCode, user?.orgData?.companyCode, user?.userId, props.sewingOrderId);
        sewingJobGenActualService.getSewingJobSummaryForSewingOrder(req).then((res => {
            if (res.status) {
                setSewCutOrderInfo(res.data);
                processData(res.data);
            } else {
                AlertMessages.getErrorMessage(res.internalMessage);
            }
        })).catch(error => {
            AlertMessages.getErrorMessage(error.message)
        });
    }

    // Process data to accumulate quantities and extract sizes
    const processData = (sewCutOrderData: SewingJobSummaryForSewingOrder) => {
        const tblData = [];
        const allSizes = new Set<string>();
        const totalKeyObj = {
            productType:"Total"
        }
        // Accumulate quantities and gather all unique sizes
        sewCutOrderData.sewingOrderLineInfo.forEach((item) => {
            const { productType, productName, sizeQtyDetails } = item;
            let product = tblData.find(
                (product) => product.productType === productType && product.productName === productName
            );

            if (!product) {
                product = {
                    productType,
                    productName
                };
                tblData.push(product);
            }

            sizeQtyDetails.forEach((sizeDetail) => {
                const { size, originalQty, sewGeneratedQty, pendingQty } = sizeDetail;
                if (!product[size]) {
                    product[size] = {
                        originalQty: 0,
                        sewGeneratedQty: 0,
                        pendingQty: 0
                    };
                }
                if (!product[totalKey]) {
                    product[totalKey] = {
                        originalQty: 0,
                        sewGeneratedQty: 0,
                        pendingQty: 0
                    };
                }
                product[size].originalQty += Number(originalQty);
                product[size].sewGeneratedQty += Number(sewGeneratedQty);
                product[size].pendingQty += Number(pendingQty);
                // Total Column
                product[totalKey].originalQty += Number(originalQty);
                product[totalKey].sewGeneratedQty += Number(sewGeneratedQty);
                product[totalKey].pendingQty += Number(pendingQty);


                //for total row
                if (!totalKeyObj[size]) {
                    totalKeyObj[size] = {
                        originalQty: 0,
                        sewGeneratedQty: 0,
                        pendingQty: 0
                    }
                }
                if (!totalKeyObj[totalKey]) {
                    totalKeyObj[totalKey] = {
                        originalQty: 0,
                        sewGeneratedQty: 0,
                        pendingQty: 0
                    };
                }
                totalKeyObj[size].originalQty += originalQty;
                totalKeyObj[size].sewGeneratedQty += sewGeneratedQty;
                totalKeyObj[size].pendingQty += pendingQty;
                // Total Column of total Row
                totalKeyObj[totalKey].originalQty += originalQty;
                totalKeyObj[totalKey].sewGeneratedQty += sewGeneratedQty;
                totalKeyObj[totalKey].pendingQty += pendingQty;
                // Add the size to the set of all sizes
                allSizes.add(size);
            });
        });
        tblData.push(totalKeyObj);
        setSewCutTableData(tblData);
        const tblColumns = constructColumns(Array.from(allSizes));
        setMainTblColumns(tblColumns);

    };



    const constructColumns = (uniqueSizes: string[]) => {
        const sizesColumns = uniqueSizes.map((size) => ({
            title: `${size}`,
            dataIndex: size,
            key: `${size}`,
            render: (sizeQtyObj: SizeQty) => {
                if (!sizeQtyObj) {
                    return "-";
                }
                const orderQty = sizeQtyObj ? sizeQtyObj.originalQty : 0;
                const sewJobGenQty = sizeQtyObj ? sizeQtyObj.sewGeneratedQty : 0;
                const pendingQty = sizeQtyObj ? sizeQtyObj.pendingQty : 0;
                const pQtyColor = pendingQty > 0 ? '#ff0000' : pendingQty === 0 ? "#5adb00" : "#001d24";
                return <>
                    <Space size={0}>
                        {/* <Space size={2} direction='vertical'> */}
                        <Tooltip mouseEnterDelay={0} mouseLeaveDelay={0} title='Order Qty'><Tag className='s-tag' color="#257d82">{orderQty}</Tag></Tooltip>
                        <Tooltip mouseEnterDelay={0} mouseLeaveDelay={0} title='Routing Job Generated Qty'><Tag className='s-tag' color="#da8d00">{sewJobGenQty}</Tag></Tooltip>
                        {/* </Space> */}
                        <Tooltip mouseEnterDelay={0} mouseLeaveDelay={0} className='s-tag' title={'Pending Qty'}><Tag
                            // style={{ height: '48px', paddingTop: '11px' }}
                            color={pQtyColor}>{Math.abs(pendingQty)}</Tag></Tooltip>
                    </Space>
                </>
            }
        }));
        sizesColumns.push({
            title: `Total`,
            dataIndex: totalKey,
            key: `total`,
            render: (sizeQtyObj: SizeQty) => {
                if (!sizeQtyObj) {
                    return "-";
                }
                const orderQty = sizeQtyObj ? sizeQtyObj.originalQty : 0;
                const sewJobGenQty = sizeQtyObj ? sizeQtyObj.sewGeneratedQty : 0;
                const pendingQty = sizeQtyObj ? sizeQtyObj.pendingQty : 0;
                const pQtyColor = pendingQty > 0 ? '#ff0000' : pendingQty === 0 ? "#5adb00" : "#001d24";
                return <>
                    <Space size={0}>
                        {/* <Space size={2} direction='vertical'> */}
                        <Tooltip mouseEnterDelay={0} mouseLeaveDelay={0} title='Order Qty'><Tag className='s-tag' color="#257d82">{orderQty}</Tag></Tooltip>
                        <Tooltip mouseEnterDelay={0} mouseLeaveDelay={0} title='Routing Job Generated Qty'><Tag className='s-tag' color="#da8d00">{sewJobGenQty}</Tag></Tooltip>
                        {/* </Space> */}
                        <Tooltip mouseEnterDelay={0} mouseLeaveDelay={0} className='s-tag' title={'Pending Qty'}><Tag
                            // style={{ height: '48px', paddingTop: '11px' }}
                            color={pQtyColor}>{Math.abs(pendingQty)}</Tag></Tooltip>
                    </Space>
                </>
            }
        })
        return [...columns, ...sizesColumns];
    }



    return <>      
            <Table<ProductData>
                size='small'
                columns={mainTblColumns}
                pagination={false}
                rowKey={r => r.productName + r.productType}
                bordered
                scroll={{ x: true }}

                dataSource={sewCutTableData}
            />
    </>
}

export default SewingActualCutSummaryGrid;