import { KC_KnitJobIdRequest, KC_KnitOrderJobsModel, KnitJobConsumptionRequest, KnitJobNumberRequest, KnitJobObjectModel, KnitJobSizeWiseConsumptionModel } from "@xpparel/shared-models";
import { KnittingJobsService } from "@xpparel/shared-services";
import { Flex } from "antd";
import { useAppSelector } from "packages/ui/src/common";
import { useEffect, useState } from "react";
import { ProcessTypeEnum } from "../SPS/components";
import moment from "moment";
import { AlertMessages } from "../../common";

interface knitJobSheetProps {
    jobNumber: string;
}

export const KnitJobSheet = (props: knitJobSheetProps) => {
    const knittingService = new KnittingJobsService()
    const [knitJobObjectData, setKnitJobObjectData] = useState<KnitJobObjectModel[]>()
    const user = useAppSelector((state) => state.user.user.user);
    const [plannedKnitJobData, setPlannedKnitJobData] = useState<KC_KnitOrderJobsModel>(null);
    const [knitConsumptionData, setKnitConsumptionData] = useState<KnitJobSizeWiseConsumptionModel[]>(null);

    useEffect(() => {
        if (props.jobNumber) {
            getKnitJobDetailsForKnitJobId(props.jobNumber)
            getKnitJobObjectDetailsByJobNumber(props.jobNumber)
        }
    }, [props.jobNumber])

    useEffect(() => {
        if (plannedKnitJobData?.knitJobs?.[0]) {
            getSizeWiseConsumptionDataForJobNumber(plannedKnitJobData.knitJobs[0]);
        }
    }, [plannedKnitJobData]);


    const getKnitJobDetailsForKnitJobId = async (jobNumber: string) => {
        try {
            const req = new KC_KnitJobIdRequest(user?.userName, user?.orgData?.unitCode, user?.orgData?.companyCode, user?.userId, null, jobNumber, false, true, false, true)
            const res = await knittingService.getKnitJobDetailsForKnitJobId(req)
            if (res.status) {
                setPlannedKnitJobData(res.data[0]);
            } else {
                AlertMessages.getErrorMessage(res.internalMessage)
            }
        } catch (err) {
            AlertMessages.getErrorMessage(err.internalMessage)
        }
    }

    const getKnitJobObjectDetailsByJobNumber = async (jobNumber: string) => {
        try {
            const req = new KnitJobNumberRequest(user?.userName, user?.orgData?.unitCode, user?.orgData?.companyCode, user?.userId, jobNumber)
            const res = await knittingService.getKnitJobObjectDetailsByJobNumber(req)
            if (res.status) {
                setKnitJobObjectData(res.data);
            } else {
                AlertMessages.getErrorMessage(res.internalMessage)
            }
        } catch (err) {
            AlertMessages.getErrorMessage(err.internalMessage)
        }
    }

    const getSizeWiseConsumptionDataForJobNumber = async (job: KC_KnitOrderJobsModel["knitJobs"][0]) => {
        try {
            const { jobNumber, productSpecs, processingSerial, colorSizeInfo, knitGroup } = job;

            const fgColor = colorSizeInfo?.[0]?.fgColor ?? null;
            const req = new KnitJobConsumptionRequest(user?.userName, user?.orgData?.unitCode, user?.orgData?.companyCode, user?.userId, jobNumber, productSpecs?.productCode, processingSerial, fgColor, knitGroup, ProcessTypeEnum.KNIT);

            const res = await knittingService.getSizeWiseConsumptionDataForJobNumber(req);
            if (res.status) {
                setKnitConsumptionData(res.data);
            } else {
                AlertMessages.getErrorMessage(res.internalMessage)
            }
        } catch (err) {
            AlertMessages.getErrorMessage(err.internalMessage)
        }
    };

    return (
        <>
            {plannedKnitJobData && (
                <div id="printArea">
                    <Flex justify="space-between" align="center">
                        <div style={{ width: "100px" }}></div>
                        <div>
                            <div style={{ textAlign: "center", fontWeight: 700, fontSize: "20px" }}>
                                DOCKET
                            </div>
                            <div style={{ textAlign: "center", fontWeight: 700, fontSize: "14px" }}>
                                Document No: DOCKET | Docket Number - {plannedKnitJobData.knitJobs[0]?.jobFeatures?.moNumber} |{new Date().toLocaleDateString('en-GB')}
                            </div>
                        </div>
                        <div>
                            <table className="core-table">
                                <thead>
                                    <tr>
                                        <th>Date : </th>
                                        <th>{new Date().toLocaleDateString('en-GB')}</th>
                                    </tr>
                                    <tr>
                                        <th>Time : </th>
                                        <th>{new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</th>
                                    </tr>
                                </thead>
                            </table>
                        </div>
                    </Flex>
                    <hr />
                    <Flex justify="space-between" align="center">
                        <div style={{ flex: "1 1 auto" }}>
                            <table className="core-table doc-header-tbl">
                                <tbody>
                                    <tr>
                                        <th>Style : {plannedKnitJobData.knitJobs[0]?.jobFeatures?.styleCode}</th>
                                        <th>CO Number : {plannedKnitJobData.knitJobs[0]?.jobFeatures?.coNumber}</th>
                                        <th>MO Number : {plannedKnitJobData.knitJobs[0]?.jobFeatures?.moNumber}</th>
                                    </tr>
                                    <tr>
                                        <th style={{ wordBreak: "break-word", whiteSpace: "normal" }}>
                                            MO Lines : {plannedKnitJobData.knitJobs[0]?.jobFeatures?.moLineNumber}
                                        </th>
                                        <th style={{ wordBreak: "break-word", whiteSpace: "normal" }}>
                                            Color : {plannedKnitJobData.knitJobs[0]?.colorSizeInfo?.map(info => info.fgColor).join(", ")}
                                        </th>
                                        <th style={{ wordBreak: "break-word", whiteSpace: "normal" }}>
                                            Product Type : {plannedKnitJobData.knitJobs[0]?.productSpecs?.productType}
                                        </th>
                                    </tr>
                                    <tr>
                                        <th style={{ wordBreak: "break-word", whiteSpace: "normal" }}>
                                            Product Name : {plannedKnitJobData.knitJobs[0]?.productSpecs?.productName}
                                        </th>
                                        <th style={{ wordBreak: "break-word", whiteSpace: "normal" }}>
                                            Ex Factory Date : {moment(plannedKnitJobData.knitJobs[0]?.jobFeatures?.exFactoryDate).format("DD/MM/YYYY")}
                                        </th>
                                        <th style={{ wordBreak: "break-word", whiteSpace: "normal" }}>
                                            Material Status: {Number(plannedKnitJobData.knitJobs[0]?.materialStatus) === 0 ? "OPEN" : Number(plannedKnitJobData.knitJobs[0]?.materialStatus) === 1 ? "REQUESTED" : Number(plannedKnitJobData.knitJobs[0]?.materialStatus) === 2 ? "PARTIAL ISSUED" : Number(plannedKnitJobData.knitJobs[0]?.materialStatus) === 4 ? "COMPLETELY ISSUED" : ''}
                                        </th>

                                    </tr>
                                    <tr>
                                        <th colSpan={2} style={{ wordBreak: "break-word", whiteSpace: "normal" }}>
                                            Components : {plannedKnitJobData.knitJobs[0]?.jobRm?.map(info => info.componentNames).join(", ")}
                                        </th>
                                        <th colSpan={1} style={{ wordBreak: "break-word", whiteSpace: "normal" }}>
                                            Customer Name : {plannedKnitJobData.knitJobs[0]?.jobFeatures?.customerName}
                                        </th>
                                    </tr>
                                    <tr>
                                        <th style={{ wordBreak: "break-word", whiteSpace: "normal" }}>
                                            Item Code : {plannedKnitJobData.knitJobs[0]?.jobRm?.map(info => info.itemCode).join(", ")}
                                        </th>
                                        <th colSpan={2} style={{ wordBreak: "break-word", whiteSpace: "normal" }}>
                                            Item Type : {plannedKnitJobData.knitJobs[0]?.jobRm?.map(info => info.itemType).join(", ")}
                                        </th>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                        <div style={{ flex: "0 0 200px", marginLeft: "5px" }}>
                            <div
                                style={{
                                    width: "100%",
                                    height: "163px",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    border: "1px solid black",
                                }}
                            >
                                Sample
                            </div>
                        </div>
                    </Flex>
                    <br />
                    <div style={{ display: "flex", alignItems: "flex-start" }}>
                        <Flex>
                            <table className="core-table tbl-border">
                                <thead>
                                    <tr>
                                        <th>Item Code</th>
                                        <th>Component</th>
                                        <th>Size</th>
                                        <th>Quantity</th>
                                        <th>Per Piece Consumption</th>
                                        <th>Total Consumption</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {knitConsumptionData?.map((item, index) => {
                                        const sizeQtyMap = {};
                                        plannedKnitJobData?.knitJobs?.[0]?.colorSizeInfo?.forEach(info => {
                                            info.sizeQtys.forEach(sizeQty => {
                                                sizeQtyMap[sizeQty.size] = sizeQty.qty;
                                            });
                                        });

                                        const filteredSizeCons = item?.sizeCons?.filter(sizeItem => sizeQtyMap[sizeItem.size]);

                                        return filteredSizeCons?.map((sizeItem, subIndex) => {
                                            const qty = sizeQtyMap[sizeItem.size] || 0;
                                            const cons = (sizeItem.cons);
                                            const totalCons = qty * cons;

                                            return (
                                                <tr key={`${index}-${subIndex}`}>
                                                    {subIndex === 0 && (
                                                        <>
                                                            <td rowSpan={filteredSizeCons?.length}>{item.itemCode}</td>
                                                            <td rowSpan={filteredSizeCons?.length}>{item.component}</td>
                                                        </>
                                                    )}
                                                    <td>{sizeItem.size}</td>
                                                    <td>{qty}</td>
                                                    <td>{cons}</td>
                                                    <td>{totalCons.toFixed(2)}</td>
                                                </tr>
                                            );
                                        });
                                    })}
                                </tbody>
                            </table>
                        </Flex>
                        <div style={{ marginLeft: "20px" }}>
                            <table className="core-table tbl-border">
                                <thead>
                                    <tr>
                                        <th style={{ width: "500px" }}>Remarks</th>
                                    </tr>
                                    <tr>
                                        <th style={{ whiteSpace: "pre-wrap", wordBreak: "break-word", height: "40px" }}>
                                        </th>
                                    </tr>
                                </thead>
                            </table>
                        </div>
                    </div>
                    <br />
                    <table className="core-table tbl-border" style={{ width: "100%" }}>
                        <thead>
                            <tr>
                                <th style={{ width: "120px", textAlign: "left" }}>Special Comment</th>
                                <th>
                                </th>
                            </tr>
                        </thead>
                    </table>
                    <br />
                    <table className="core-table tbl-border">
                        <thead>
                            {knitJobObjectData?.length > 0 && (
                                <tr>
                                    <th className="">Object Code</th>
                                    {/* <th className="">GroupCode</th> */}
                                    <th className="">Requested Quantity</th>
                                    <th className="">Issued Quantity</th>
                                    <th className="">Location Code</th>
                                    {/* <th className="">Object Qty</th> */}
                                </tr>
                            )}
                        </thead>
                        <tbody>
                            {knitJobObjectData?.length > 0 ? (
                                knitJobObjectData.map((roll, index) => (<tr >
                                    <td>{roll.objectCode}</td>
                                    {/* <td>{roll.groupCode}</td> */}
                                    <td>{roll.requiredQty}</td>
                                    <td>{roll.issuedQty}</td>
                                    <td>{roll.locationCode}</td>
                                    {/* <td>{roll.objectQty}</td> */}
                                </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={4}>No roll data</td>
                                </tr>
                            )}
                        </tbody>
                    </table>

                    <br />
                    <Flex justify="space-between" align="center" style={{ fontWeight: 500 }}>
                        <table className="core-table tbl-border">
                            <tbody>
                                <tr>
                                    <td colSpan={2}>For Stores</td>
                                    <td colSpan={2}>For Knitting</td>
                                </tr>
                                <tr>
                                    <td>Fabric Issued Person</td>
                                    <td style={{ width: "130px" }}></td>
                                    <td>Spreader Operator</td>
                                    <td style={{ width: "130px" }}></td>
                                </tr>
                                <tr>
                                    <td colSpan={2}>For Knitting</td>
                                    <td>Knitter</td>
                                    <td></td>
                                </tr>
                                <tr>
                                    <td>Received Person</td>
                                    <td style={{ width: "130px" }}></td>
                                    <td>Bundle Ticket</td>
                                    <td style={{ width: "130px" }}></td>
                                </tr>
                            </tbody>
                        </table>
                        <table className="core-table tbl-border" style={{ fontWeight: 500 }}>
                            <tbody>
                                <tr>
                                    <td colSpan={2}>For Operator</td>

                                </tr>
                                <tr>
                                    <td >Plotter Operator</td>
                                    <td style={{ width: '130px' }} ></td>

                                </tr>
                                <tr>
                                    <td colSpan={2}>For Quality</td>
                                </tr>
                                <tr>
                                    <td >QC</td>
                                    <td style={{ width: '130px' }} ></td>

                                </tr>
                            </tbody>
                        </table>
                    </Flex>
                    <br />
                    <table className="core-table tbl-border" style={{ fontWeight: 500 }}>
                        <tbody>
                            <tr>
                                <td>Knit Start Time</td>
                                <td style={{ width: '130px' }} ></td>
                                <td>Knit End Time</td>
                                <td style={{ width: '130px' }} ></td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            )}
        </>
    )
}