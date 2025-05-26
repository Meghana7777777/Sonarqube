import { FeatureGroupDetails, SewingCreationOptionsEnum, SewingJobPreviewForActualGenFeatureGroup } from "@xpparel/shared-models"
import { Space, Table, TableColumnsType, Tag } from "antd";
import { useEffect, useState } from "react";
import { sewingCreationDisplayName } from "./support";
import './sew-job-gen.css';
interface IProps {
    sewJobPreviewData: SewingJobPreviewForActualGenFeatureGroup;
    componentUpdateKey: number;
}

interface ISewJobTableDataType {
    sewJobNumber: string;
    productName: string[];
    productType: string[];
    moLine: string[];
    color: string[];
    cutNumber: string[];
    docketNumber: string[];
    bundleData: IBundleDataType[];
    [key: string]: any;
    isExpandable: boolean;
    isTotalRow?: boolean;
}
interface IBundleDataType {
    bundleNumber: string;
    docketNumber: string;
    productName: string;
    productType: string;
    [key: string]: any;
}
const columns: TableColumnsType<ISewJobTableDataType> = [
    {
        title: 'Sewing Job Number', dataIndex: 'sewJobNumber', width: 200, align: 'center', fixed: 'left', key: 'moLine',

        onCell: (r,) => ({
            colSpan: r.isTotalRow ? 5 : 1,
        }),
    },
    {
        title: 'Mo Line', dataIndex: 'moLine', width: 150, align: 'center', fixed: 'left', key: 'moLine', onCell: (r,) => ({
            colSpan: r.isTotalRow ? 0 : 1,
        }),
        render: (v: string[]) => v?.map(e => <Tag className='s-tag' color="green"> {e}</Tag>)
    },
    {
        title: 'Product Name', dataIndex: 'productName', width: 150, align: 'center', fixed: 'left', key: 'productName', onCell: (r,) => ({
            colSpan: r.isTotalRow ? 0 : 1,
        }),
        render: (v: string[]) => v?.map(e => <Tag className='s-tag' color="green"> {e}</Tag>)
    },
    {
        title: 'Product Type', dataIndex: 'productType', width: 150, align: 'center', fixed: 'left', key: 'productType', onCell: (r,) => ({
            colSpan: r.isTotalRow ? 0 : 1,
        }),
        render: (v: string[]) => v?.map(e => <Tag className='s-tag' color="green"> {e}</Tag>)
    },

    {
        title: 'Color', dataIndex: 'address', width: 150, align: 'center', fixed: 'left', key: 'color', onCell: (r,) => ({
            colSpan: r.isTotalRow ? 0 : 1,
        }),
        render: (v: string[]) => v?.map(e => <Tag className='s-tag' color="green"> {e}</Tag>)
    },

    {
        title: 'Cut No', dataIndex: 'cutNumber', width: 150, align: 'center', fixed: 'left', key: 'cutNumber',
        render: (v: string[]) =>{
        return  v?.map(e => <Tag className='s-tag' color="green"> {e}</Tag>)}
    },
    {
        title: 'Docket No', dataIndex: 'docketNumber', width: 150, align: 'center', fixed: 'left', key: 'docketNumber',
        render: (v: string[]) => v?.map(e => <Tag className='s-tag' color="green"> {e}</Tag>)
    },

];

const bundleColumns: TableColumnsType<IBundleDataType> = [
    { title: 'Bundle Number', dataIndex: 'bundleNumber', key: 'bundleNumber' },
    { title: 'Docket Number', dataIndex: 'docketNumber', key: 'docketNumber' },
    { title: 'Product Name', dataIndex: 'productName', },
    { title: 'Product Type', dataIndex: 'productType', },
];
const totalKey = 'Total';
const SewJobConfirmGrid = (props: IProps) => {
    const [sewJobTableData, setSewJobTableData] = useState<ISewJobTableDataType[]>([]);
    const [mainTblColumns, setMainTblColumns] = useState<TableColumnsType<ISewJobTableDataType>>(columns);
    const [childTblColumns, setChildTblColumns] = useState<TableColumnsType<IBundleDataType>>(bundleColumns);
    useEffect(() => {
        if (props.sewJobPreviewData) {
            setSewJobTableData([]);
            constructTableData(props.sewJobPreviewData);
        }
    }, [props.componentUpdateKey]);

    const constructTableData = (sewingCutBasedData: SewingJobPreviewForActualGenFeatureGroup) => {
        // Unique Sizes
        const uniqueSizes = new Set<string>();
        // Table Data
        const tblData: ISewJobTableDataType[] = [];
        const totalRow: ISewJobTableDataType = {
            sewJobNumber: 'Total', bundleData: [], cgName: '', color: [], cutNumber: undefined, deliveryDate: '', destination: '', docketNumber: [], isExpandable: false,
            isMainCg: false, planCutDate: '', planProductionDate: '', productName: [], productType: [], moLine: [], isTotalRow: true,

        }
        totalRow[totalKey] = 0;
        sewingCutBasedData.sewingJobInfo.forEach(sewJobI => {
            const row: ISewJobTableDataType = {
                sewJobNumber: sewJobI.sewingJobNumber,
                bundleData: [],
                color: [],
                cutNumber: [sewJobI.cutNumber],
                // deliveryDate: cutDetails.deliveryDate,
                // destination: cutDetails.destination,
                docketNumber: [],
                // isMainCg: cgInfo.isMainCg,
                // cgName: cgInfo.cgName,
                // planCutDate: cutDetails.planCutDate,
                // planProductionDate: cutDetails.planProductionDate,
                productName: [],
                productType: [],
                moLine: [],
                isExpandable: true,

            }
            const uniqueColor = new Set<string>();
            const uniqueDocketNumber = new Set<string>();
            const uniqueProductName = new Set<string>();
            const uniqueProductType = new Set<string>();
            const uniqueMoLines = new Set<string>();
            sewJobI.featureGroupDetails.cutInfo.forEach(cutInfo => {
                cutInfo.cutDetails.forEach(cutDetails => {
                    uniqueProductName.add(cutDetails.productName);
                    uniqueProductType.add(cutDetails.productType);
                    uniqueMoLines.add(cutDetails.moLine);

                    cutDetails.cgDetails.forEach(cgInfo => {
                        cgInfo.docketDetails.forEach(docInfo => {
                            uniqueColor.add(docInfo.color);
                            uniqueDocketNumber.add(docInfo.docketNumber);

                            let docketTotalSewGenQty = 0;
                            // Size wise quantities
                            docInfo.sizeQtyDetails.forEach(sizeQtyInfo => {
                                //Add to unique size
                                uniqueSizes.add(sizeQtyInfo.size);
                                docketTotalSewGenQty += Number(sizeQtyInfo.sewGeneratedQty);

                                if (!row[sizeQtyInfo.size]) {
                                    row[sizeQtyInfo.size] = 0;
                                }
                                row[sizeQtyInfo.size] += sizeQtyInfo.sewGeneratedQty;
                                //For total Row 
                                if (cgInfo.isMainCg) {
                                    if (!totalRow[sizeQtyInfo.size]) {
                                        totalRow[sizeQtyInfo.size] = 0
                                    }
                                    {
                                        totalRow[sizeQtyInfo.size] += Number(sizeQtyInfo.sewGeneratedQty);
                                    }
                                    totalRow[totalKey] += Number(sizeQtyInfo.sewGeneratedQty);

                                }
                            });

                            row[totalKey] = docketTotalSewGenQty;

                            // Bundle Data
                            docInfo.docketBundleInfo.forEach(docBundleInfo => {
                                let bundleTotalSewGenQty = 0;
                                const bundleRow: IBundleDataType = {
                                    bundleNumber: docBundleInfo.bundleNumber,
                                    docketNumber: docInfo.docketNumber,
                                    productName: cutDetails.productName,
                                    productType: cutDetails.productType
                                }
                                // Bundle Size wise data

                                bundleRow[docBundleInfo.sizeQtyDetails.size] = docBundleInfo.sizeQtyDetails.sewGeneratedQty;
                                // Sum bundle size wise total                              
                                bundleTotalSewGenQty += Number(docBundleInfo.sizeQtyDetails.sewGeneratedQty);
                                // Add total bundle qty
                                bundleRow[totalKey] = bundleTotalSewGenQty;
                                // Push bundle data to table row
                                row.bundleData.push(bundleRow);
                            });                           
                        });
                    });
                });
            });
            //Update cut numbers and other
            row.color = [...uniqueColor.values()].sort();
            row.docketNumber = [...uniqueDocketNumber.values()].sort();
            row.productName = [...uniqueProductName.values()].sort();
            row.productType = [...uniqueProductType.values()].sort();
            row.moLine = [...uniqueMoLines.values()].sort();
            tblData.push(row);
            console.log(row)
        });
        tblData.push(totalRow);
        console.log(tblData)
        setSewJobTableData(tblData);
        constructSizeColumns(uniqueSizes);
    }
    const constructSizeColumns = (uniqueSize: Set<string>) => {
        const sizeColumns: TableColumnsType<any> = [];
        uniqueSize.forEach(size => {
            sizeColumns.push({
                title: size, dataIndex: size,
                render: (v,r) => {
                    if (!v) {
                        return "-";
                    }
                    return <span className={`${r.isTotalRow ? "f-600": ''}`}>{v}</span>
                },
            });
        });
        sizeColumns.push({
            title: totalKey, dataIndex: totalKey,
            render: (v) => {
                if (!v) {
                    return "-";
                }
                return <span className="f-600">{v}</span>
            },
        });
        setMainTblColumns([...columns, ...sizeColumns]);
        setChildTblColumns([...bundleColumns, ...sizeColumns]);
    }

    // const renderTitle = (sewingCutBasedData: SewingJobPreviewForActualGenFeatureGroup) => {
    //     let isColor = false;
    //     return <Space wrap>{
    //         Object.keys(sewingCutBasedData.groupInfo).map(k => {
    //             isColor = !isColor;
    //             return <span className="f-600"> <Tag style={{ fontSize: '0.9rem', padding: '3px 5px' }} color={isColor ? '#ff5500' : '#b10d7a'}> {sewingCreationDisplayName[k]} : {sewingCutBasedData.groupInfo[k]}</Tag></span>
    //         })}
    //     </Space>
    // }
    const renderTitle = (sewingCutBasedData: SewingJobPreviewForActualGenFeatureGroup) => {
        let isColor = false;
        const enumKeys = Object.values(SewingCreationOptionsEnum);
        return <Space wrap>{
            Object.keys(sewingCutBasedData.groupInfo).map((k:any) => {
                if (enumKeys.includes(k)) {
                isColor = !isColor;
                return <div className= {`small-card ${isColor? "bg-lyellow" : ""}`}> 
                <span className="small-card-title">{sewingCreationDisplayName[k]}</span><span className="small-card-content"> {sewingCutBasedData.groupInfo[k]}</span> </div> 
                return <span className="f-600"> <Tag style={{ fontSize: '0.9rem', padding: '3px 5px' }} color={isColor ? '#ff5500' : '#b10d7a'}> {sewingCreationDisplayName[k]} : {sewingCutBasedData.groupInfo[k]}</Tag></span>
                } else {
                    return <></>;
                }
            })}
        </Space>
    }
    return <>
    <div>{renderTitle(props.sewJobPreviewData)}</div>
    <Table<ISewJobTableDataType>
                size='small'
                columns={mainTblColumns}
                pagination={false}
                rowKey={r => r.sewJobNumber}
                bordered
                scroll={{ x: true }}
                expandable={{
                    expandedRowRender: (record) => <Table size="small" columns={childTblColumns} bordered pagination={false} dataSource={record.bundleData} />,
                    rowExpandable: (record) => record.isExpandable,
                }}
                dataSource={sewJobTableData}
            />
    </>
}
export default SewJobConfirmGrid;