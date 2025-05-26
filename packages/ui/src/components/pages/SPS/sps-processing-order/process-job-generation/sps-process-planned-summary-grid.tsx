
import { PJ_ProcessingJobSummaryForFeatureGroupModel, PJ_ProcessingJobsSummaryModel, PJ_ProcessingSerialRequest, ProcessTypeEnum } from "@xpparel/shared-models";
import { ProcessingJobsService } from "@xpparel/shared-services";
import { Space, Table, TableColumnsType, Tag, Tooltip } from "antd";
import { useAppSelector } from "packages/ui/src/common";
import { useEffect, useState } from "react";

import { ColumnProps } from "antd/es/table";
import { AlertMessages } from "packages/ui/src/components/common";
interface IGridProps {
    processingSerial: number
    processType?: ProcessTypeEnum;
    updateKey: number;
    processJobSummaryData?: PJ_ProcessingJobSummaryForFeatureGroupModel;
    isMakeApiCall: boolean;
}



const totalKey = 'Total';

interface SizeQty {
    originalQty: number;
    jobGeneratedQty: number;
    pendingQty: number;
}

interface ProductData {
    productType: string;
    productName: string;
    [size: string]: SizeQty | string;
}
const columns: ColumnProps<ProductData>[] = [
    {
        title: 'Product Type',
        dataIndex: 'productType',
        key: 'productType'
    },
    {
        title: 'Product Name',
        dataIndex: 'productName',
        key: 'productName'
    },
    {
        title: 'Fg Color',
        dataIndex: 'fgColor',
        key: 'fgColor'
    }
]

const SPSProcessPlannedSummaryGrid = (props: IGridProps) => {
    const user = useAppSelector((state) => state.user.user.user);
    const [sewCutTableData, setSewCutTableData] = useState<ProductData[]>([]);
    const [mainTblColumns, setMainTblColumns] = useState<TableColumnsType<ProductData>>(columns);
    const processService = new ProcessingJobsService();

    useEffect(() => {
        console.log("---",props.processJobSummaryData)
        console.log("---",props.isMakeApiCall)
        console.log("---",props.processType)
        if (props.processJobSummaryData) {
            processData(props.processJobSummaryData);
        } else {
            if (props.isMakeApiCall) {
                getProcessingJobSummaryForProcessType();
            }
        }

    }, [props.updateKey, props.processingSerial]);

    const getProcessingJobSummaryForProcessType = () => {

        const req = new PJ_ProcessingSerialRequest(user?.userName, user?.orgData?.unitCode, user?.orgData?.companyCode, user?.userId, props.processingSerial, props.processType);
        processService.getProcessingJobSummaryForProcessType(req).then((res => {
            if (res.status) {
                processData(res.data);
            } else {
                AlertMessages.getErrorMessage(res.internalMessage);
            }
        })).catch(error => {
            AlertMessages.getErrorMessage(error.message)
        });
    }

    // Process data to accumulate quantities and extract sizes
    const processData = (sewCutOrderData: PJ_ProcessingJobsSummaryModel) => {
        const tblData = [];
        const allSizes = new Set<string>();
        const totalKeyObj: any = {
            productCode: "Total",
        };
        // Accumulate quantities and gather all unique sizes
        sewCutOrderData.productFgQtyInfo.forEach((item) => {
            const { productCode, productType, productName, fgColor, sizeQtyInfo } = item;
            let product = tblData.find(
                (product) => product.productCode === productCode && product.productType === productType && product.productName === productName && product.fgColor === fgColor
            );

            if (!product) {
                product = {
                    productCode,
                    productType,
                    productName,
                    fgColor
                };
                tblData.push(product);
            }

            sizeQtyInfo.forEach((sizeDetail) => {
                const { size, originalQty, jobGeneratedQty, pendingQty } = sizeDetail;
                if (!product[size]) {
                    product[size] = {
                        originalQty: 0,
                        jobGeneratedQty: 0,
                        pendingQty: 0
                    };
                }
                if (!product[totalKey]) {
                    product[totalKey] = {
                        originalQty: 0,
                        jobGeneratedQty: 0,
                        pendingQty: 0
                    };
                }
                product[size].originalQty += Number(originalQty);
                product[size].jobGeneratedQty += Number(jobGeneratedQty);
                product[size].pendingQty += Number(pendingQty);
                // Total Column
                product[totalKey].originalQty += Number(originalQty);
                product[totalKey].jobGeneratedQty += Number(jobGeneratedQty);
                product[totalKey].pendingQty += Number(pendingQty);


                //for total row
                if (!totalKeyObj[size]) {
                    totalKeyObj[size] = {
                        originalQty: 0,
                        jobGeneratedQty: 0,
                        pendingQty: 0,
                    }
                }
                if (!totalKeyObj[totalKey]) {
                    totalKeyObj[totalKey] = {
                        originalQty: 0,
                        jobGeneratedQty: 0,
                        pendingQty: 0
                    };
                }
                totalKeyObj[size].originalQty += originalQty;
                totalKeyObj[size].jobGeneratedQty += jobGeneratedQty;
                totalKeyObj[size].pendingQty += pendingQty;
                // Total Column of total Row
                totalKeyObj[totalKey].originalQty += originalQty;
                totalKeyObj[totalKey].jobGeneratedQty += jobGeneratedQty;
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
                const sewJobGenQty = sizeQtyObj ? sizeQtyObj.jobGeneratedQty : 0;
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
                const sewJobGenQty = sizeQtyObj ? sizeQtyObj.jobGeneratedQty : 0;
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
            key={props.processingSerial+JSON.stringify(props.processJobSummaryData)}
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

export default SPSProcessPlannedSummaryGrid;