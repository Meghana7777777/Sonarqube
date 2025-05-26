import { PrinterTwoTone, ScanOutlined } from "@ant-design/icons"
import { GrnRollInfoModel, PhBatchLotRollRequest, RollIdRequest, RollInfoModel } from "@xpparel/shared-models"
import { PackingListService } from "@xpparel/shared-services"
import { Button, Col, Form, Input, Modal, QRCode, Row, Space } from "antd"
import Search from "antd/es/input/Search"
import layout from "antd/es/layout"
import * as htmlToImage from "html-to-image"
import { useAppSelector } from "packages/ui/src/common"
import { ScxCard } from "packages/ui/src/schemax-component-lib"
import printJS from "print-js"
import React, { useRef, useState } from "react"
import Barcode from "react-barcode"
import { AlertMessages } from "../../../common"
import './../print-barcodes/lable-4-2.css'; // Import the CSS for styling
import { getCssFromComponent } from './../print-barcodes/print-barcode-css.util';
import RollBarcode4By2 from "../print-barcodes/print-barcod-4-2"
import { PrintTableModel } from "../print-barcodes"

export const SwitchBarcodes = () => {
    const [scannedRollInfo, setScannedRollInfo] = useState<GrnRollInfoModel>();
    const [barcodeVal, setBarcodeVal] = useState<string>();
    const [manualBarcodeVal, setManualBarcodeVal] = useState<string>();
    const [openModal, setOpenModal] = useState(false)
    const [form] = Form.useForm();
    const rollInputRef = useRef(null);
    const palletInputRef = useRef(null);
    const user = useAppSelector((state) => state.user.user.user);
    const packingService = new PackingListService();



    const scanBarcode = (fullBarcode: string) => {
        const prefix = fullBarcode.charAt(0);
        const barcode = Number(fullBarcode.substring(1));
        setBarcodeVal(fullBarcode);
        if (prefix == 'R') {
            form.setFieldValue('existingPallet', '')
            form.setFieldValue('otherPallet', '')
            const rollIdReq = new RollIdRequest(user?.userName, user?.orgData?.unitCode, user?.orgData?.companyCode, user?.userId, barcode, fullBarcode);
            packingService.getGrnRollInfoForRollId(rollIdReq).then((res => {
                if (res.status) {
                    form.setFieldValue('measuredWidth', res.data.rollInfo.measuredWidth)
                    form.setFieldValue('measuredWeight', res.data.rollInfo.measuredWeight)
                    setScannedRollInfo(res.data);
                    if (palletInputRef.current) {
                        palletInputRef.current.focus();
                    }
                } else {
                    AlertMessages.getErrorMessage(res.internalMessage);
                }
                setBarcodeVal('');
                setManualBarcodeVal('');
                form.setFieldValue('rollBarcode', '')
            })).catch(error => {
                AlertMessages.getErrorMessage(error.message)
            })
        } else {
            AlertMessages.getErrorMessage('Please Enter Valid Barcode');
            restForms();
        }

    }

    const manualBarcode = (val: string) => {
        setManualBarcodeVal(val.trim());
        scanBarcode(val.trim());
    }

    const restForms = () => {
        if (rollInputRef.current) {
            rollInputRef.current.focus();
        }
        form.resetFields();
        setScannedRollInfo(undefined);
        setBarcodeVal('');
        setManualBarcodeVal('');
    }

    const handlePrint = () => {
        setOpenModal(true)
    }

    const handelCancle = () => {
        setOpenModal(false)
    }

    const printBarCodes = (data: RollInfoModel) => {
        setOpenModal(false)
    }

    return (
        <ScxCard style={{ width: '384', height: '192' }} className="lable">
            <Row justify="center">
                <Form
                    form={form}
                >
                    <Form.Item name="rollBarcode" label="Scan Object Barcode" rules={[{ required: false }]}>
                        <Space>
                            <Col>
                                <Input placeholder="Scan Object Barcode" ref={rollInputRef} value={barcodeVal} autoFocus onChange={(e) => scanBarcode(e.target.value)} prefix={<ScanOutlined />} />
                            </Col>
                            <Col>
                                <Search placeholder="Type Object Barcode" defaultValue={manualBarcodeVal} onSearch={manualBarcode} enterButton />
                            </Col>
                        </Space>
                    </Form.Item>
                </Form>
            </Row>
            <Row justify="center">
                {scannedRollInfo && <>
                    <Form
                        {...layout}
                        form={form}
                        name="pallet-form"
                        labelAlign="left"
                    >
                        <Row>
                            <Col flex="100px"></Col>
                            <div style={{ marginRight: '30px', display: 'flex' }} >

                                <table className="table">
                                    <thead>
                                        <tr>
                                            <th>Roll No</th>
                                            <th>Roll BarCode</th>
                                            <th>Roll Lot Number</th>
                                            <th>Roll Batch Number</th>
                                            <th>Roll Type</th>
                                            <th>Item Code</th>
                                            <th>PL Width</th>
                                            <th>Width(CM)</th>
                                            <th>PL Length</th>
                                            <th>Length(Meters)</th>
                                            <th>Shade</th>
                                            <th>Inspection</th>
                                            <th>Print</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr>
                                            <td>{scannedRollInfo.rollInfo.externalRollNumber}</td>
                                            <td>{scannedRollInfo.rollInfo.barcode}</td>
                                            <td>{scannedRollInfo.rollInfo.lotNumber}</td>
                                            <td>{scannedRollInfo.rollInfo.batchNumber}</td>
                                            <td>{scannedRollInfo.rollInfo.itemCategory}</td>
                                            <td>{scannedRollInfo.rollInfo.materialItemCode}</td>
                                            <td>{scannedRollInfo.rollInfo.inputWidth}</td>
                                            <td>{scannedRollInfo.rollInfo.supplierWidth}</td>
                                            <td>{scannedRollInfo.rollInfo.inputLength}</td>
                                            <td>{scannedRollInfo.rollInfo.supplierLength}</td>
                                            <td>{scannedRollInfo.rollInfo.shade}</td>
                                            <td>
                                                {scannedRollInfo.rollInfo.pickForInspection ? "Yes" : "No"}
                                            </td>
                                            <td>
                                                <Button onClick={() => handlePrint()} icon={<PrinterTwoTone style={{ fontSize: '25px' }} />}/>                                               
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </Row>
                    </Form>                    
                        {openModal && (
                        <RollBarcode4By2    
                        key={Date.now()}    
                        printBarCodes={() => printBarCodes(scannedRollInfo.rollInfo)}
                        rollBarcodeData={[scannedRollInfo.rollInfo]}
                        />        
                    )}
                </>
                }
            </Row>
        </ScxCard>
    )
}

function addDisplayMsg(arg0: string) {
    throw new Error("Function not implemented.")
}

