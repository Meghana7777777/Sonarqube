import { OrderTypeDisplayValues, OrderTypeEnum, PoOqUpdateModel, PoSummaryModel } from "@xpparel/shared-models";
import { Button, Col, Popconfirm, Row, Space, Table } from "antd";
import { ExtendedOrderTypeEnum, IOQUpdatePoLineColumns, OQUpdatePoLineColumns } from "./oq-update-columns";
import { useEffect, useState } from "react";
import { ColumnsType } from "antd/es/table";
import { QuestionCircleOutlined } from "@ant-design/icons";

interface IOQUpdateProps {
    poInfo: PoSummaryModel;
    poOqData: PoOqUpdateModel;
    deleteRecord: (poSerial: number) => void;
}
const OqViewGrid = (props: IOQUpdateProps) => {
    const { poInfo, deleteRecord, poOqData } = props;
    const [tblData, setTblData] = useState<IOQUpdatePoLineColumns[]>([]);
    useEffect(() => {
        if (props.poInfo) {
            constructTblData(poInfo, poOqData)
        }

    }, [poOqData]);
    
    const getSizeWiseColumns = () => {
        return [...OQUpdatePoLineColumns,
        {
            title: 'Percentage', dataIndex: 'percentage', key: 'percentage', align: 'center', render: (text, record, index) => {
                return <div style={{ textAlign: 'end' }}>{(record.orderQtyType === 'Total') ? <></> : text}</div>
            }
        },
        ...poInfo.sizes.map(rec => {
            return {
                title: rec?.toLocaleUpperCase(), dataIndex: rec, key: rec, isDefaultSelect: true, align: 'center',
                render: (text, record, index) => {
                    return <div style={{ textAlign: 'end', fontWeight: (record.orderQtyType === 'Total') ? '700' :'' }}>{text ? text : 0}</div>
                }
            }
        })]
    };

    const constructTblData = (poData: PoSummaryModel, oQData: PoOqUpdateModel) => {
        const dataSource = [];
        const orderTypes = [OrderTypeEnum.ORIGINAL, OrderTypeEnum.EXTRA_SHIPMENT, OrderTypeEnum.SAMPLE, OrderTypeEnum.CUT_WASTAGE, 'Total'] as ExtendedOrderTypeEnum[];
        poData.poLines.forEach(poLine => {
            // Percentage and size wise order qty map
            const orderTypeQtySizeMap = new Map<string, number>();
            //Original Qty 
            poLine.subLines.filter(e => e.oqType == OrderTypeEnum.ORIGINAL).forEach(sizeObj => { orderTypeQtySizeMap.set(OrderTypeEnum.ORIGINAL + sizeObj.size, sizeObj.quantity) });
            //Excess Qty
            const excessQtyData = oQData?.linesOqUpdate.find(e => Number(e.ref1Value) == poLine.orderLineId);

            excessQtyData?.poLineQtys.forEach(oqPoLineObj => {
                // Percentage
                orderTypeQtySizeMap.set(oqPoLineObj.oqPerc.oqType, oqPoLineObj.oqPerc.perc);
                //Size Qty
                oqPoLineObj?.sizeQtys?.forEach(sizeQtyObj => {
                    orderTypeQtySizeMap.set(oqPoLineObj.oqPerc.oqType + sizeQtyObj.size, sizeQtyObj.addQuantity);
                })
            })
            const totalSizeQtyObj = {};
            orderTypes.forEach((key, i) => {
                const rowObj: IOQUpdatePoLineColumns = {
                    poLineId: poLine.id,
                    soLineId: poLine.orderLineId,
                    orderLineNo: poLine.orderLineNo,
                    productType: poLine.productType,
                    productName: poLine.productName,
                    orderQtyType: key,
                    percentage: (i !== 0) ? orderTypeQtySizeMap.get(key) : undefined,
                    rowSpan: (i !== 0) ? 0 : 5
                }
                poInfo.sizes.forEach(size => {
                    if (!totalSizeQtyObj.hasOwnProperty(size)) {
                        totalSizeQtyObj[size] = 0;
                    }
                    const qty = orderTypeQtySizeMap.get(key + size);
                    totalSizeQtyObj[size] = totalSizeQtyObj[size] + (qty ? qty : 0);
                    rowObj[size] = key == 'Total' ? totalSizeQtyObj[size] : qty;
                });
                dataSource.push(rowObj);
            });
        });
        setTblData(dataSource);
    }
    return <>
        <Table size="small" pagination={false} rowKey={(r, i) => i + r.productName} bordered columns={getSizeWiseColumns() as ColumnsType<IOQUpdatePoLineColumns>} dataSource={tblData} />
        <Row justify='space-around' style={{ marginTop: '15px' }}>
            <Col span={6}>
                <div style={{ display: 'flex', alignItems: 'center' }}>
                    <label style={{ marginRight: '8px', whiteSpace: 'nowrap' }}>Remarks: {poOqData?.remarks}</label>
                </div>
            </Col>
            <Col>
                <Space>

                    <Popconfirm
                        title="Delete Order Quantity Update"
                        description="Are you sure to delete this ?"
                        onConfirm={() => deleteRecord(poInfo.poSerial)}
                        // onCancel={cancel}
                        okText="Yes"
                        cancelText="No"
                        icon={<QuestionCircleOutlined style={{ color: 'red' }} />}
                    >
                        <Button type="primary" danger>Delete</Button>
                    </Popconfirm>
                </Space>
            </Col>
        </Row>
    </>
}

export default OqViewGrid