import { BarcodeReportingModeEnum, BarcodeScanningStatusModel, BarcodeTransactionTypeEnum, PTS_R_BundleScanModel } from "@xpparel/shared-models"
import { Descriptions, Tag } from "antd";
import { useEffect } from "react";

interface BarcodeScanResultProps {
    reportingMode: string;
    transactionType: string;
    barcodeScanResult: PTS_R_BundleScanModel;
    status: boolean;
    internalMessage: string;
    barcodeForDisplay: string;
    updateKey: number;
}
export const BarcodeScanResultComp = (props: BarcodeScanResultProps) => {
    useEffect(() => {

    }, [props.barcodeForDisplay + props.updateKey])

    const { reportingMode, transactionType, barcodeScanResult, status, internalMessage, barcodeForDisplay } = props;
    const getStatusColor = (status) => {
        return status ? "green" : "red";
    };

    return <>
        <Descriptions bordered column={2} size="small">
            <Descriptions.Item label="Barcode">
                <strong style={{ fontSize: "17px" }}>{barcodeForDisplay}</strong>
            </Descriptions.Item>
            <Descriptions.Item label="Operation Group">
                <strong style={{ fontSize: "17px" }}>{barcodeScanResult?.opGroup}</strong>
            </Descriptions.Item>
            {/* <Descriptions.Item label="Barcode Type">
                <strong style={{ fontSize: "17px" }}>{barcodeScanResult?.barcodeType}</strong>
            </Descriptions.Item> */}
            <Descriptions.Item label="Good Quantity">
                <strong style={{ fontSize: "17px" }}>{barcodeScanResult?.gQtyScanned}</strong>
            </Descriptions.Item>
            <Descriptions.Item label="Rejected Quantity">
                <strong style={{ fontSize: "17px" }}>{barcodeScanResult?.rQtyScanned}</strong>
            </Descriptions.Item>
           
            {/* <Descriptions.Item label="Process Type">
                <strong style={{ fontSize: "17px" }}>{barcodeScanResult?.processType}</strong>
            </Descriptions.Item> */}
            {/* <Descriptions.Item label="Session ID">
                <strong style={{ fontSize: "17px" }}>{barcodeScanResult?.sessionId}</strong>
            </Descriptions.Item> */}
            <Descriptions.Item label="Reporting Mode">
                <strong style={{ fontSize: "17px" }}>{reportingMode}</strong>
            </Descriptions.Item>
            <Descriptions.Item label="Transaction Type" span={2}>
                <strong style={{ fontSize: "17px" }}>{transactionType}</strong>
            </Descriptions.Item>
            <Descriptions.Item label="Status" span={2}>
                <Tag style={{whiteSpace:'break-spaces',fontSize:'14px'}} color={getStatusColor(status)}>{internalMessage}</Tag>
                {/* {internalMessage} */}
            </Descriptions.Item>
        </Descriptions>
        {/* <div style={{ margin: '0px', padding: '10px', backgroundColor: '', borderRadius: '8px', width: '102%', maxWidth: '600px', display: "flex", justifyContent: "space-between" }}>
            <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                <p style={{ margin: 0, color: "white" }}> Barcode: <strong style={{ fontSize: "17px" }}>{barcodeScanResult?.barcode}</strong> </p>
                <p style={{ margin: 0, color: "white" }}> Barcode Type: <strong style={{ fontSize: "17px" }} >  {`${barcodeScanResult?.barcodeType}`} </strong>  </p>
                <p style={{ margin: 0, color: "white" }}> Total Good Quantity: <strong style={{ fontSize: "17px" }} > {barcodeScanResult?.totalGoodQuantity} </strong>  </p>
                <p style={{ margin: 0, color: "white" }}> Total Rejected Quantity: <strong style={{ fontSize: "17px" }} > {barcodeScanResult?.totalRejectedQuantity} </strong>  </p>
                <p style={{ margin: 0, color: "white" }}> Operation Code: <strong style={{ fontSize: "17px" }} > {barcodeScanResult?.operationCode} </strong>  </p>
                <p style={{ margin: 0, color: "white" }}> Process Type: <strong style={{ fontSize: "17px" }} > {barcodeScanResult?.processType} </strong>  </p>
                <p style={{ margin: 0, color: "white" }}> Session ID: <strong style={{ fontSize: "17px" }} > {barcodeScanResult?.sessionId} </strong>  </p>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                <p style={{ margin: 0, color: "white" }}> Reporting Mode: <strong style={{ fontSize: "17px" }} > {reportingMode}  </strong> </p>
                <p style={{ margin: 0, color: "white" }}> Transaction Type:  <strong style={{ fontSize: "17px" }} >  {transactionType}  </strong>  </p>
                <p style={{ margin: 0, color: "white" }}>  Status: <Tag style={{ marginLeft: "5px" }} color={getStatusColor(status)}> {internalMessage}</Tag>  </p>
            </div>
        </div> */}

    </>
}