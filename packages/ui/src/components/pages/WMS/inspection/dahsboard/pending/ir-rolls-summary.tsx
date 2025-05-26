import { InsFabricInspectionRequestCategoryEnum, InsFabricInspectionRequestCategoryEnumDisplayValue, InsInspectionActivityStatusEnum, InsInspectionBasicInfoModel, InsIrIdRequest, InsIrRollsModel } from "@xpparel/shared-models";
import { FabricInspectionInfoService } from "@xpparel/shared-services";
import { Button, Card, Col, Modal, Row, Table } from "antd";
import { useEffect, useState } from "react";
import { AlertMessages } from "../../../../../common";
import { getProperDateWithTime } from "../../../../../common/helper-functions";
import { useAppSelector } from "packages/ui/src/common";
import FabricCheckListReport from "../../../../PKMS/__masters__/prints/fabric-check-list-report-print";
// import FabricCheckListReport from "../../../../PKMS/__masters__/prints/check-list-report-print";
interface IrRollsSummaryProps {
    irInfo: InsInspectionBasicInfoModel;
    inspectionViewProgress: InsInspectionActivityStatusEnum;
    typeOfInspection: InsFabricInspectionRequestCategoryEnum;
    refreshKey?: number;
   
}

export const IrRollsSummary = (props: IrRollsSummaryProps) => {
    const inspectionInfoService = new FabricInspectionInfoService();
    const [irRollsInfo, setIrRollsInfo] = useState<InsIrRollsModel>();
    const user = useAppSelector((state) => state.user.user.user);
    const [printComponent, setPrintComponent] = useState(false);
    const [packListIds, setPackListIds] = useState<number[]>([])


    useEffect(() => {
        if (props.irInfo) {
            getIrRolls(props.irInfo);
        }
    }, [props.irInfo, props.refreshKey]);

    const getIrRolls = (req: InsInspectionBasicInfoModel) => {
        const irIdReq = new InsIrIdRequest(user?.userName, user?.orgData?.unitCode, user?.orgData?.companyCode, user?.userId, req.irId);
        inspectionInfoService.getInspectionRequestRollsInfo(irIdReq, true).then(res => {
            if (res.status) {
                console.log(res.data.irRolls[0].rollInfo.packListId, 'packListIds')
                setIrRollsInfo(res.data);

                setPackListIds([props?.irInfo?.packListId]);
                
            } else {
                AlertMessages.getErrorMessage(res.internalMessage);
            }
        }).catch(err => {
            AlertMessages.getErrorMessage(err.message);
        });
    }


    function getTableData(data: InsIrRollsModel) {
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

    const aabbbss = () => {
        const modal = Modal.confirm({
            width: '95%',
            title: 'Are you sure to Print and Material Confirmation ?',
            content: (
                <div>
                    <FabricCheckListReport plIds={packListIds} userFromModal={user} packListCartoonIds={[]} insId={props?.irInfo.irId} />
                </div>
            ),
            okButtonProps: {
                onClick: function () {

                    // This statement is mandatory. This statement will not close the model. It will only change the state variable 
                    setPrintComponent(false);

                    // this is the instruction that destroys the model manually using the reference
                    modal.destroy();

                    return null;
                }
            },
            maskClosable: true,
            closable: true,
            // cancelButtonProps: { disabled: false, title: "Cancel" },
            // onOk() {
            //     setShowModal(false);
            // },
            onCancel() {
                // mandatory
                setPrintComponent(false);
            }
        });
    }

    return (
        <>
            <h3>Inspection request no : B:{props.irInfo?.batches?.toString()}</h3>
            <Row>
                <Col span={5}>
                    <><b>Inspection type </b> : {InsFabricInspectionRequestCategoryEnumDisplayValue[props.typeOfInspection]}</>
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
            <Card title={"Items list"} size="small" style={{ padding: 0 }}
                extra={<>
                    {/* {(inspectionViewProgress === InsInspectionActivityStatusEnum.OPEN && typeOfInspection === PackFabricInspectionRequestCategoryEnum.POST_INSPECTION) && */}
                    <Button type="primary" onClick={() => {
                        aabbbss();
                    }}>Print</Button>
                    {/* } */}
                </>
                }>
                <Table columns={columns} size="small" dataSource={getTableData(irRollsInfo)} />
            </Card>
            <Modal
                open={printComponent}
                onCancel={() => setPrintComponent(false)}
                style={{ zIndex: 1300 }}

            >
                <FabricCheckListReport plIds={packListIds} userFromModal={user} packListCartoonIds={[]} insId={props?.irInfo.irId}/>
            </Modal>
        </>
    );
};

