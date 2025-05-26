import { JobSewSerialReq, SewingIJobNoRequest, SewingJobPropsModel, SewJobBundleSheetModel, SewJobMaterialModel, SpsBundleSheetRequest } from "@xpparel/shared-models";
import { ProcessingJobsService, SewingProcessingOrderService } from "@xpparel/shared-services";
import { Flex } from "antd";
import moment from "moment";
import { useAppSelector } from "packages/ui/src/common";
import { AlertMessages } from "packages/ui/src/components/common";
import { useEffect, useState } from "react";

interface SpsJobSheetProps {
    jobNumber: string;
    refreshKey: number;
    iNeedInventory: boolean;
}

const SpsJobBundleSheet = (props: SpsJobSheetProps) => {
    const [jobData, setJobData] = useState<SewingJobPropsModel | null>(null);
    const processService = new ProcessingJobsService();
    const user = useAppSelector((state) => state.user.user.user);
    const [objectdata, setObjectdata] = useState<SewJobBundleSheetModel[]>([]);
    const processingOrder = new SewingProcessingOrderService();
    const [consumptionData, setConsumptionData] = useState<SewJobMaterialModel[]>([]);

    useEffect(() => {
        if (props.jobNumber) {
            fetchJobData(props.jobNumber);
            getObjectWiseDataByJobNumber(props.jobNumber);
            getItemCodeWiseConsumptionByJobNumber(props.jobNumber);
        }
    }, [props.jobNumber, props.refreshKey])

    const fetchJobData = async (jobNumber: string) => {
        const req = new JobSewSerialReq(user?.userName, user?.userId, user?.orgData?.unitCode, user?.orgData?.companyCode, jobNumber, undefined, false);
        try {
            const response = await processService.getSewingJobQtyAndPropsInfoByJobNumber(req);
            if (response.data) {
                setJobData(response.data);
            } else {
                AlertMessages.getErrorMessage(response.internalMessage)
                setJobData(null);
            }
        } catch (err) {
            AlertMessages.getErrorMessage(err.internalMessage)
            setJobData(null);
        }
    };

    const getObjectWiseDataByJobNumber = async (jobNumber: string) => {
        try {
            const req = new SpsBundleSheetRequest(user?.userName, user?.orgData?.unitCode, user?.orgData?.companyCode, user?.userId, jobNumber, props.iNeedInventory);
            const res = await processingOrder.getObjectWiseDataByJobNumber(req);
            if (res.status && res.data.length > 0) {
                setObjectdata(res.data);
            } else {
                AlertMessages.getErrorMessage(res.internalMessage);
                setObjectdata(null);
            }
        } catch (error) {
            AlertMessages.getErrorMessage(error.internalMessage);
            setObjectdata(null);
        }
    }

    const getItemCodeWiseConsumptionByJobNumber = async (jobNumber: string) => {
        try {
            const req = new SpsBundleSheetRequest(user?.userName, user?.orgData?.unitCode, user?.orgData?.companyCode, user?.userId, jobNumber, props.iNeedInventory);
            const res = await processingOrder.getItemCodeWiseConsumptionByJobNumber(req);
            if (res.status && res.data.length > 0) {
                setConsumptionData(res.data);
            } else {
                AlertMessages.getErrorMessage(res.internalMessage);
                setObjectdata(null);
            }
        } catch (error) {
            AlertMessages.getErrorMessage(error.internalMessage);
            setObjectdata(null);
        }
    }

    return (
        <>
            {jobData && (
                <div id='bundlePrint'>
                    <Flex justify="space-between" align="center">
                        <div style={{ width: "100px" }}></div>
                        <div>
                            <div style={{ textAlign: "center", fontWeight: 700, fontSize: "20px" }}>
                                Sewing Job
                            </div>
                            <div style={{ textAlign: "center", fontWeight: 700, fontSize: "14px" }}>
                                Sewing Job Number - {jobData.jobNumber} |{new Date().toLocaleDateString('en-GB')}
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
                                        <th>Style: {jobData.style}</th>
                                        <th>Mo Number: {jobData.moNumber}</th>
                                        <th>No Of Job Bundles: {jobData.noOfJobBundles}</th>
                                    </tr>
                                    <tr>
                                        <th style={{ wordBreak: "break-word", whiteSpace: "normal" }}>Color: {jobData.fgColors}</th>
                                        <th style={{ wordBreak: "break-word", whiteSpace: "normal" }}>Module: {jobData.moduleNumber}</th>
                                        <th style={{ wordBreak: "break-word", whiteSpace: "normal" }}>Product Name: {jobData.productName}</th>
                                    </tr>
                                    <tr>
                                        <th style={{ wordBreak: "break-word", whiteSpace: "normal" }}>Processing Type: {jobData.processingType}</th>
                                        <th style={{ wordBreak: "break-word", whiteSpace: "normal" }}>Sizes: {jobData.sizes}</th>
                                        <th style={{ wordBreak: "break-word", whiteSpace: "normal" }}>Buyer: {jobData.buyer}</th>
                                    </tr>
                                    <tr>
                                        <th style={{ wordBreak: "break-word", whiteSpace: "normal" }}>Destination: {jobData.destination}</th>
                                        <th style={{ wordBreak: "break-word", whiteSpace: "normal" }}>Co Line: {jobData.coLine}</th>
                                        <th colSpan={2} style={{ wordBreak: "break-word", whiteSpace: "normal" }}>Plan Production Date: {jobData.planProductionDate ? jobData.planProductionDate.split(',').map(date => moment(date).format('DD-MM-YYYY')).join(', ') : '-'}</th>

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
                                        <th>Size</th>
                                        <th>Required Qty</th>
                                        <th>Per Piece Consumption</th>
                                        <th>Total Consumption</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {(() => {
                                        const renderedItemCodes = new Set();
                                        return consumptionData.map((item, index) => {
                                            const isFirstOccurrence = !renderedItemCodes.has(item.itemCode);
                                            const sameItemEntries = consumptionData.filter(
                                                (d) => d.itemCode === item.itemCode
                                            );
                                            const rowspan = sameItemEntries.length;

                                            if (isFirstOccurrence) {
                                                renderedItemCodes.add(item.itemCode);
                                            }

                                            const requiredQty = parseFloat(item.requiredQty as any) || 0;
                                            const perPiece = parseFloat(item.consumption as any) || 0;
                                            const totalPerSize = perPiece * requiredQty;

                                            return (
                                                <tr key={index}>
                                                    {isFirstOccurrence && (
                                                        <td rowSpan={rowspan}>{item.itemCode}</td>
                                                    )}
                                                    <td>{item.size}</td>
                                                    <td>{requiredQty.toFixed(2)}</td>
                                                    <td>{perPiece.toFixed(2)}</td>
                                                    <td>{totalPerSize.toFixed(2)}</td>
                                                </tr>
                                            );
                                        });
                                    })()}
                                </tbody>
                            </table>
                        </Flex>
                        <div style={{ marginLeft: "20px" }}>
                            <table className="core-table tbl-border">
                                <thead>
                                    {objectdata?.length > 0 && (
                                        <tr>
                                            <th className="">Object Code</th>
                                            {/* <th className="">Requested Quantity</th> */}
                                            <th className="">Issued Quantity</th>
                                            <th className="">Location Code</th>
                                        </tr>
                                    )}
                                </thead>
                                <tbody>
                                    {objectdata?.length > 0 ? (
                                        objectdata.map((roll, index) => (<tr >
                                            <td>{roll.objectCode}</td>
                                            {/* <td>{roll.requiredQty}</td> */}
                                            <td>{roll.issuedQty}</td>
                                            <td>{roll.locationCode}</td>
                                        </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan={4}>No roll data</td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                    <br />
                    <div style={{ display: "flex", gap: "20px", alignItems: "flex-start" }}>
                        <div style={{ flex: 1 }}>
                            <table className="core-table tbl-border" style={{ width: "100%" }}>
                                <thead>
                                    <tr>
                                        <th style={{ width: "100%", textAlign: "left" }}>Remarks</th>
                                    </tr>
                                    <tr>
                                        <th style={{ whiteSpace: "pre-wrap", wordBreak: "break-word", height: "40px" }}></th>
                                    </tr>
                                </thead>
                            </table>
                        </div>
                        <div style={{ flex: 1 }}>
                            <table className="core-table tbl-border" style={{ width: "100%" }}>
                                <thead>
                                    <tr>
                                        <th style={{ width: "100%", textAlign: "left" }}>Special Comment</th>
                                    </tr>
                                    <tr>
                                        <th style={{ whiteSpace: "pre-wrap", wordBreak: "break-word", height: "40px" }}></th>
                                    </tr>
                                </thead>
                            </table>
                        </div>
                    </div>
                    <br />
                    <Flex justify="space-between" align="center" style={{ fontWeight: 500 }}>
                        <table className="core-table tbl-border">
                            <tbody>
                                <tr>
                                    <td colSpan={2}>Panel Movement</td>
                                    <td colSpan={2}>Sewing Line</td>
                                </tr>
                                <tr>
                                    <td>Panel Issued By</td>
                                    <td style={{ width: "130px" }}></td>
                                    <td>Line Supervisor</td>
                                    <td style={{ width: "130px" }}></td>
                                </tr>
                                <tr>
                                    <td colSpan={2}>Panel Receipt</td>
                                    <td>Sewing Line</td>
                                    <td></td>
                                </tr>
                                <tr>
                                    <td>Panel Received By</td>
                                    <td style={{ width: "130px" }}></td>
                                    <td>Bundle Tag Checked</td>
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
                                    <td >Sewing Operator</td>
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
                                <td>Sewing Start Time</td>
                                <td style={{ width: '130px' }} ></td>
                                <td>Sewing End Time</td>
                                <td style={{ width: '130px' }} ></td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            )}
        </>
    );
}
export default SpsJobBundleSheet;