import { TrimTypeEnum, InsInspectionActivityStatusEnum, TrimInspectionBasicInfoModel, InsIrIdRequest, InsIrRollsModel, TrimInsIrRollsModel } from "@xpparel/shared-models";
import { FabricInspectionInfoService, TrimInspectionInfoService } from "@xpparel/shared-services";
import { Card, Col, Row, Table } from "antd";
import { useEffect, useState } from "react";
import { AlertMessages } from "../../../../../common";
import { getProperDateWithTime } from "../../../../../common/helper-functions";
interface IrRollsSummaryProps {
    irInfo: TrimInspectionBasicInfoModel;
    inspectionViewProgress: InsInspectionActivityStatusEnum;
    typeOfInspection: TrimTypeEnum;
    refreshKey?: number;
    user?: any
}

export const IrRollsSummary = (props: IrRollsSummaryProps) => {
    const inspectionInfoService = new FabricInspectionInfoService();
    const [irRollsInfo, setIrRollsInfo] = useState<TrimInsIrRollsModel>();
    const trimInspectionInfoService=new TrimInspectionInfoService();
    console.log('inside the IrRollsSummary',props);
    useEffect(() => {
        if (props.irInfo) {
            getIrRolls(props.irInfo);
        }
    }, [props.irInfo, props.refreshKey]);

    const getIrRolls = (req: TrimInspectionBasicInfoModel) => {
        const irIdReq = new InsIrIdRequest(props.user?.userName, props.user?.orgData?.unitCode, props.user?.orgData?.companyCode, props.user?.userId, req.irId);
        trimInspectionInfoService.getInspectionRequestSpollsInfo(irIdReq, true).then(res => {
            if (res.status) {
                setIrRollsInfo(res.data);
            } else {
                AlertMessages.getErrorMessage(res.internalMessage);
            }
        }).catch(err => {
            AlertMessages.getErrorMessage(err.message);
        });
    }

    function getTableData(data: TrimInsIrRollsModel) {
        const tableData = [];
        data?.irRolls?.forEach(rec => {
            const rollInfo = rec.rollInfo;
            const obj = {
                rollId: rollInfo.rollId,
                rollBarcode: rec.barcode,
                shade: rollInfo.aShade,
                lot: rollInfo.lot,
                batch: rollInfo.batch,
                itemCategory: rollInfo.itemCategory,
                color: rollInfo.itemColor,
                supplierRoll: rollInfo.externalRollNumber,
                quantity: rollInfo.sQuantity + ' ' + rollInfo.inputQtyUom,
                width: rollInfo.sWidth + ' ' + rollInfo.inputWidthUom,
            }
            tableData.push(obj);
        });
        return tableData;
    }

    const columns = [
        {
            title: 'Sno',
            key: 'sno',
            render: (value, record, index) => {
                return index + 1;
            }
        }, 
        {
            title: 'Batch',
            key: 'batch',
            dataIndex: 'batch'
        }, 
        {
            title: 'Lot',
            key: 'lot',
            dataIndex: 'lot'
        }, 
        {
            title: 'Roll Barcode',
            key: 'rollBarcode',
            dataIndex: 'rollBarcode'
        },
        {
            title: 'Shade',
            key: 'shade',
            dataIndex: 'shade',
            textAlign: 'center',
        },
        {
            title: 'Item Category',
            key: 'itemCategory',
            dataIndex: 'itemCategory'
        }, {
            title: 'Supplier Roll No',
            key: 'supplierRoll',
            dataIndex: 'supplierRoll'
        }, {
            title: 'Color',
            key: 'color',
            dataIndex: 'color'
        }, {
            title: 'Quantity',
            key: 'quantity',
            dataIndex: 'quantity'
        }, {
            title: 'Width',
            key: 'width',
            dataIndex: 'width'
        }
    ];

    return (
        <>
            <h3>Inspection request no : B:{props.irInfo?.batches?.toString()}</h3>
            <Row>
                <Col span={5}>
                    <><b>Inspection type </b> : {props.typeOfInspection}</>
                </Col>
                <Col span={5}>
                    <><b>Total items </b> : {props.irInfo.totalItemsForInspection}</>
                </Col>
            </Row>
            <Row>
                <Col span={5}>
                    <><b>Inspection created on </b> : {getProperDateWithTime(props.irInfo.insCreatedOn)}</>
                </Col>
                {/* <Col span={5}>
						<><b>First item inspected on </b> : {props.irInfo.firstInspectionCompletedOn != "" ? props.irInfo.firstInspectionCompletedOn : 'Not yet started'}</>
					</Col> */}
                <Col span={5}>
                    <><b>Inspection status </b> : {props.irInfo.inspectionCompleted ? 'Completed' : props.irInfo.inspectionInProgress ? 'In Progress' : 'Not Started'}</>
                </Col>
            </Row>
            <br />
            <Card title={"Items list"} size="small" style={{ padding: 0 }}>
                <Table columns={columns} size="small" dataSource={getTableData(irRollsInfo)} />
            </Card>
        </>
    );
};

