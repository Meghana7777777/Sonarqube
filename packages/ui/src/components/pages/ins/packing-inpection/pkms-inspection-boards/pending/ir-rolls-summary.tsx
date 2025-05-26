import { CartonBarCodesReqDto, CartonPrintModel, CartonPrintReqDto, InsInspectionActivityStatusEnum, InsPKMSInsCartonsDto, InsPKMSInsCartonsResModel, InskInsRatioModel, PKMSInsCartonsDto, PKMSInsReqIdDto, PKMSPendingMaterialResponse, PackActivityStatusEnum, PackFabricInspectionRequestCategoryEnum, PackingStatusEnumDisplayValues, PkInsRatioModel, PkmsFgWhReqTypeEnum } from "@xpparel/shared-models";
import { FgInspectionInfoService, InspectionPreferenceService, PKMSFgWarehouseService, PackListService } from "@xpparel/shared-services";
import { Button, Card, Col, Modal, Row, Table, Tag, Tooltip } from "antd";
import { CustomColumn } from "packages/ui/src/schemax-component-lib";
import { Dispatch, SetStateAction, useEffect, useRef, useState } from "react";
import { getProperDateWithTime } from "../../../../../common/helper-functions";
import CheckListReport from "../../../../PKMS/__masters__/prints/check-list-report-print";
import { EyeOutlined } from "@ant-design/icons";
interface IrRollsSummaryProps {
    irInfo: PKMSPendingMaterialResponse;
    inspectionViewProgress: InsInspectionActivityStatusEnum;
    typeOfInspection: PackFabricInspectionRequestCategoryEnum;
    refreshKey?: number;
    user?: any;
}

export const PKMSIrRollsSummary = (props: IrRollsSummaryProps) => {
    const { irInfo, inspectionViewProgress, typeOfInspection, refreshKey, user } = props
    const [insCartons, setInsCartons] = useState<InsPKMSInsCartonsDto[]>();
    const insPreferenceService = new InspectionPreferenceService();
    const fgInspectionInfoService = new FgInspectionInfoService();
    const pKMSFgWarehouseService = new PKMSFgWarehouseService();
    const [packListIds, setPackListIds] = useState<number[]>([])
    const [printComponent, setPrintComponent] = useState(false);
    const pkListService = new PackListService();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [whReqIds, setWhReqIds] = useState<number[]>([]);

    useEffect(() => {
        getPKMSInsCartonsData();
    }, []);

    const getPKMSInsCartonsData = () => {
        const req = new PKMSInsReqIdDto(user?.userName, user?.orgData?.unitCode, user?.orgData?.companyCode, user?.userId, irInfo.insReqId);
        fgInspectionInfoService.getPKMSInsCartonsData(req).then(res => {
            if (res.status) {
                const data: InsPKMSInsCartonsResModel[] = res?.data;
                const reqD = new CartonPrintReqDto(data[0].packOrderId, data[0].packListId, user?.userName, user?.orgData?.unitCode, user?.orgData?.companyCode, user?.userId, 0, data[0].cartons,)
                pkListService.getCartonPrintData(reqD).then(res => {
                    if (res.status) {
                        const resData: CartonPrintModel[] = res.data;
                        const finalData: any = transformData(data, resData);
                        setInsCartons(finalData);
                    }
                })
                setInsCartons(res.data);
                setPackListIds([res.data[0].packListId])
            } else {
                setInsCartons([])
            }
        }).catch(err => console.log(err.message));
    }




    function transformData(
        insPKMSInsCartonsResModels: InsPKMSInsCartonsResModel[],
        cartonPrintReqDtos: CartonPrintModel[]
    ): InsPKMSInsCartonsDto[] {
        // Map the arrays to the target DTO array
        const insPKMSInsCartonsDtos: InsPKMSInsCartonsDto[] = insPKMSInsCartonsResModels.map((resModel) => {
            // Find the corresponding CartonPrintModel by matching a unique field (e.g., ctnNo)
            const cartonPrintModel = cartonPrintReqDtos.find((c) => c.ctnNo === resModel.ctnNo);

            if (!cartonPrintModel) {
                throw new Error(`No matching CartonPrintModel found for ctnNo`);
            }

            // Map the data to the DTO
            return new InsPKMSInsCartonsDto(
                resModel.ctnNo, // ctnNo
                cartonPrintModel.poNo, // poNo
                cartonPrintModel.style, // style
                cartonPrintModel.color, // color
                cartonPrintModel.sizeRatio.map((ratio) => new InskInsRatioModel(ratio.size, ratio.ratio)), // sizeRatio
                cartonPrintModel.cartonQty, // cartonQty
                resModel.destination || cartonPrintModel.destination, // destination
                cartonPrintModel.exFactory, // exFactory
                cartonPrintModel.packListNo, // packListNo
                resModel.buyerAddress || cartonPrintModel.buyerAddress, // buyerAddress
                resModel.packJobNumber || "", // packJobNumber
                resModel.attributes || [], // attributes
                null, // files
                resModel.inspectionResult, // inspectionResult
                resModel.insGrossWeight || 0, // insGrossWeight
                resModel.insNetWeight || 0, // insNetWeight
                resModel.finalInspectionResult, // finalInspectionResult
                resModel.cartons, // cartons
                resModel.packOrderId, // packOrderId
                resModel.packListId, // packListId
                cartonPrintModel.status,

            );
        });

        return insPKMSInsCartonsDtos;
    }

    const SizeAndRatioColumn = ({ v }: { v: PkInsRatioModel[] }) => {
        const [isModalOpen, setIsModalOpen] = useState(false);

        if (!v || v.length === 0) return "-";

        const MAX_VISIBLE_TAGS = 2; // Show 2 tags initially
        const visibleTags = v.slice(0, MAX_VISIBLE_TAGS);
        const hiddenTags = v.slice(MAX_VISIBLE_TAGS);

        return (
            <>
                {/* Render some visible tags */}
                {visibleTags.map((rec, index) => (
                    <Tag key={index} color="blue">
                        {rec.size}-{rec.ratio}
                    </Tag>
                ))}

                {/* Show View Icon if more tags exist */}
                {hiddenTags.length > 0 && (
                    <Button type="link" onClick={() => setIsModalOpen(true)}>
                        <EyeOutlined style={{ fontSize: "16px" }} /> View More
                    </Button>
                )}

                {/* Ant Design Modal to Show All Data */}
                <Modal
                    title="Size & Ratio Details"
                    open={isModalOpen}
                    footer={null}
                    onCancel={() => setIsModalOpen(false)}
                >
                    {v.map((rec, index) => (
                        <Tag key={index} color="blue" style={{ margin: "5px" }}>
                            {rec.size}-{rec.ratio}
                        </Tag>
                    ))}
                </Modal>
            </>
        );
    };
    const buttonRef = useRef<HTMLButtonElement | null>(null);

    const handleClose = () => {
        setIsModalOpen(false);
        buttonRef.current?.focus(); // Move focus to a safe element
    };
    const renderSizeAndRatio = (v: PkInsRatioModel[]) => {
        if (!v || v.length === 0) return "-";

        const MAX_VISIBLE_TAGS = 2;
        const visibleTags = v.slice(0, MAX_VISIBLE_TAGS);
        const hiddenCount = v.length - MAX_VISIBLE_TAGS;

        return (
            <div style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                flexWrap: "wrap",
                gap: 4,
                minHeight: 32
            }}>
                {visibleTags.map((rec, i) => (
                    <Tag key={`visible-tag-${i}-${rec.size}-${rec.ratio}`} color="blue">
                        {rec.size}-{rec.ratio}
                    </Tag>
                ))}

                {hiddenCount > 0 && (
                    <Tooltip
                        placement="top"
                        overlayStyle={{ maxWidth: 500, zIndex: 9999 }}
                        title={
                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
                                {v.slice(MAX_VISIBLE_TAGS).map((rec, i) => (
                                    <Tag key={`hidden-tag-${i}-${rec.size}-${rec.ratio}`} color="blue">
                                        {rec.size}-{rec.ratio}
                                    </Tag>
                                ))}
                            </div>
                        }
                    >
                        <Tag color="blue" style={{ cursor: "pointer" }}>
                            +{hiddenCount}
                        </Tag>
                    </Tooltip>
                )}
            </div>
        );
    };



    const columns: CustomColumn<InsPKMSInsCartonsDto>[] = [
        {
            title: 'Carton No',
            dataIndex: 'ctnNo',
            align: 'center',
            key: 'ctnNo',
        },
        {
            title: 'Po Number',
            dataIndex: 'packOrderId',
            align: 'center',
            key: 'poNo',
        },
        {
            title: 'Pack Job Number',
            dataIndex: 'packJobNumber',
            align: 'center',
            key: 'packJobNumber',
        },
        {
            title: 'Pack List Number',
            dataIndex: 'packListNo',
            align: 'center',
            key: 'packListNo',
        },
        {
            title: 'Carton Qty',
            dataIndex: 'cartonQty',
            align: 'center',
            key: 'cartonQty',
        },
        // {
        //     title: 'Ex Factory',
        //     dataIndex: 'exFactory',
        //     align: 'center',
        //     key: 'exFactory',
        // },
        {
            title: "Size And Ratio",
            dataIndex: "sizeRatio",
            align: "center",
            key: "sizeRatio",
            render: renderSizeAndRatio,
        },
        {
            title: 'Style',
            dataIndex: 'style',
            align: 'center',
            key: 'style',
        },
        {
            title: 'Status',
            dataIndex: 'status',
            align: 'center',
            key: 'status',
            render: (value: number) => PackingStatusEnumDisplayValues[value] || 'UNKNOWN'
        }

    ];

    const getFgWareHouseIdsByCartons = () => {
        const cbs = insCartons.map(rec => rec.ctnNo)
        const req = new CartonBarCodesReqDto(user?.userName, user?.orgData?.unitCode, user?.orgData?.companyCode, user?.userId, cbs)
        pKMSFgWarehouseService.getFgWareHouseIdsByCartons(req).then(res => {
            if (res.status) {
                setWhReqIds(res.data.map(rec => rec.id))
            } else {
                setWhReqIds([])
            }
        }).catch(err => console.log(err.message))
    }



    const aabbbss = () => {
        const modal = Modal.confirm({
            width: '95%',
            title: 'Are you sure to Print and Material Confirmation ?',
            content: (
                <div>
                    <CheckListReport
                        plIds={packListIds}
                        userFromModal={user}
                        packListCartoonIds={[]}
                        reqTyp={PkmsFgWhReqTypeEnum.IN}
                    />
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


            <h3>Inspection request no : B:{irInfo?.insCode?.toString()}</h3>
            <Row>
                <Col span={5}>
                    <><b>Inspection type </b> : {typeOfInspection}</>
                </Col>
                <Col span={5}>
                    <><b>Total items </b> : {irInfo.totalItemsForInspection}</>
                </Col>
            </Row>
            <Row>
                <Col span={5}>
                    <><b>Inspection created on </b> : {getProperDateWithTime(irInfo.insCreationTime)}</>
                </Col>
                <Col span={5}>
                    <><b>First item inspected on </b> : {irInfo.firstInspectionCompletedOn != "" ? irInfo.firstInspectionCompletedOn : 'Not yet started'}</>
                </Col>
                <Col span={5}>
                    <><b>Inspection status </b> : {irInfo.inspectionCompleted ? 'Completed' : irInfo.inspectionInProgress ? 'In Progress' : 'Not Started'}</>
                </Col>
            </Row>
            <br />
            <Card title={"Items list"} size="small" style={{ padding: 0 }} extra={<>
                {/* {(inspectionViewProgress === InsInspectionActivityStatusEnum.OPEN && typeOfInspection === PackFabricInspectionRequestCategoryEnum.POST_INSPECTION) && */}
                <Button
                    type="primary"
                    onClick={() => {
                        getFgWareHouseIdsByCartons();
                        aabbbss();
                    }}>Print</Button>
                {/* } */}
            </>


            }>
                <Table columns={columns} size="small" dataSource={insCartons} />
            </Card>
            <Modal
                open={printComponent}
                onCancel={() => setPrintComponent(false)}
                style={{ zIndex: 1300 }}

            >
                <CheckListReport
                    plIds={packListIds}
                    userFromModal={user}
                    packListCartoonIds={[]}
                    whReqIds={whReqIds}
                    reqTyp={PkmsFgWhReqTypeEnum.IN}
                />
            </Modal>
        </>
    );
};

export default PKMSIrRollsSummary;
