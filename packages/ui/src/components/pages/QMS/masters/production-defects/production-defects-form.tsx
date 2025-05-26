import { ArrowLeftOutlined, PlusOutlined, QrcodeOutlined, UndoOutlined } from "@ant-design/icons"
import { PoNumberReq, ProdcutionDefectReq } from "@xpparel/shared-models"
import { ApproverServices, BarcodeScanningService, EscallationServices, OperationService, PoCreationService, ProductionDefectService, QualityCheckListServices, QualityTypeServices, ReasonsService } from "@xpparel/shared-services"
import { Button, Card, Col, Descriptions, Form, FormInstance, Input, message, Modal, Radio, Row, Select, Tag, Typography } from "antd"
import { useAppSelector } from "packages/ui/src/common"
import { useIAMClientState } from "packages/ui/src/common/iam-client-react"
import { AlertMessages } from "packages/ui/src/components/common"
import { useEffect, useRef, useState } from "react"
import { useNavigate } from "react-router-dom"
import QrScanner from "./scanners/qcscanner"

export interface ProductionDefectsFormProps {
    form: FormInstance<any>;
    onCancel?: (any)
}
export const ProductionDefectsForm = (props: ProductionDefectsFormProps) => {

    const { form, onCancel } = props
    const { Option } = Select
    const user = useAppSelector((state) => state.user.user.user);
    const poService = new PoCreationService()
    const defectService = new ProductionDefectService()
    const [defects, setDefects] = useState<any[]>([])
    const [operationData, setOperationData] = useState<any>([])
    const [showQrScan, setShowQrScan] = useState<boolean>(false);
    const [modal, setModal] = useState('')
    const navigate = useNavigate()
    const [passCount, setPassCount] = useState<any>("")
    const [failCount, setFailCount] = useState<any>("")
    const [pwdCount, setPwdCount] = useState<any>("")
    const [Pass, setPass] = useState({});
    const [Fail, setFail] = useState({});
    const [qualityType, setQualityType] = useState<any>([])
    const [qualityCheckListData, setQualityCheckListData] = useState<any>([])
    const qualityService = new QualityTypeServices()
    const qualityParameterService = new QualityCheckListServices()
    const [value, setValue] = useState<string>('Pass');
    const [parameters, setParameters] = useState<any>([]);
    const escallationService = new EscallationServices();
    const [escallationData, setEscallationData] = useState<any[]>([]);
    const approverService = new ApproverServices()
    const [approverData, setApproverData] = useState<any>([])
    const [filteredDefects, setFilteredDefects] = useState<any>([]);
    const [details, setDetails] = useState({ customerId: '', styleId: '', colorId: '', totalOriginalQty: "", quantity: 0, poNumber: "" });
    const barcodeServices = new BarcodeScanningService()
    const [barcodeData, setBarCodeData] = useState<any>([]);
    const [poData, setPodata] = useState<any>([]);
    const [barcodeValue, setBarCodeValue] = useState<any>("");
    const [moNumber, setMoNumber] = useState<any>("");
    const hasCalledRef = useRef(false);
    const useIamClient = useIAMClientState()
    const userData = useIamClient.IAMClientAuthContext?.user.userName
    const Text = Typography
    const operationService = new OperationService()
    const reasonsService = new ReasonsService()
    const [reasonsData, setReasonsData] = useState<any>([])

    const getBarcodeDetailsForManualScanning = () => {
        barcodeServices.getBarcodeDetailsForManualScanning().then((res) => {
            if (res.status) {
                setBarCodeData(res.data)
            } else {
                setBarCodeData([])
            }
        })
    }

    console.log(barcodeData, "barcodeDatabarcodeData");

    useEffect(() => {
        getAllActiveQualityType()
        getAllQualityParamsMapping()
        getAllEsclationCreteria()
        getApproverDetails()
        getByPoNumber()
        getBarcodeDetailsForManualScanning()
        getAllActiveOperations()
        getAllActiveReasons()
    }, [])

    const getAllActiveOperations = () => {
        operationService.getAllActiveOperations().then((res) => {
            if (res.status) {
                setOperationData(res.data);
            }
        }).catch(err => {
            console.log(err.message)
        })
    }

    const getAllActiveReasons = () => {
        reasonsService.getAllActiveReasons().then((res) => {
            if (res.status) {
                setReasonsData(res.data);
            }
        }).catch(err => {
            console.log(err.message)
        })
    }

    const getApproverDetails = () => {
        try {
            approverService.getAllActiveApprovers().then((res) => {
                if (res.status) {
                    setApproverData(res.data)
                } else (
                    setApproverData([])
                )
            })
        } catch (err) {
            console.log(err.message);
        }
    }

    const getAllEsclationCreteria = () => {
        escallationService.getAllActiveEscallations().then(res => {
            if (res.status) {
                setEscallationData(res.data);
            } else {
                setEscallationData([]);
            }
        })
    }

    const getAllQualityParamsMapping = () => {
        qualityParameterService.getAllActiveQualityCheckListParameter().then(res => {
            if (res.status) {
                setQualityCheckListData(res.data)
            } else {
                setQualityCheckListData([])
            }
        })
    }

    const onChangeQuality = (value) => {
        const data = qualityCheckListData.find((item) => item.qualityTypeId === value);
        setParameters([data?.parameter])
    };

    const getAllActiveQualityType = () => {
        qualityService.getAllActiveQualityType().then(res => {
            if (res.status) {
                setQualityType(res.data)
            } else {
                setQualityType([])
            }
        })
    }

    const getByPoNumber = () => {
        poService.getByPoNumber().then((res) => {
            if (res.status) {
                setPodata(res.data)
            } else {
                setPodata([])
            }
        })
    }

    const onAdd = () => {
        form.validateFields().then(() => {
            let inspectedQty = passCount + pwdCount + failCount
            if (inspectedQty >= form.getFieldValue('quantity')) {
                AlertMessages.getErrorMessage('Order Quantity already inspected')

            } else {
                const req = new ProdcutionDefectReq(
                    moNumber, form.getFieldValue('qualityTypeId'), null, null, null, JSON.parse(localStorage.getItem('currentUser')).user.roles, form.getFieldValue('operationCodeId'), form.getFieldValue('defectId'), value, form.getFieldValue('poId'), form.getFieldValue('employeeName'), form.getFieldValue('employeeId'), barcodeValue)
                defectService.createSewingDefect(req).then(res => {
                    if (res.status) {
                        onReset()
                        AlertMessages.getSuccessMessage(res.internalMessage)
                    } else {
                        AlertMessages.getErrorMessage(res.internalMessage)
                    }
                })
            }
        }).catch(() => {
            AlertMessages.getErrorMessage('Please fill all fields')
        })
    }

    const onReset = () => {
        form.resetFields()
        setPassCount(0)
        setFailCount(0)
        setPwdCount(0)
        setValue('Pass');
        setPass({});
        setFail({});
        form.setFieldsValue({
            'operationCodeId': undefined,
            'defectId': undefined,
            'employeeId': undefined,
            'testResult': undefined
        })
        setDetails({
            customerId: '',
            styleId: '',
            colorId: '',
            totalOriginalQty: '',
            quantity: 0,
            poNumber: '',
        });
        setParameters([])
    }

    const onSubmit = () => {
        onCancel()
    }

    const onTestresultChange = (event) => {
        const { value, checked } = event.target;
        if (value === "Pass" && checked) {
            setPass({ background: "#6aff00", color: "black" });
            setFail({});
            setDefects([" "]);
            form.setFieldsValue({ defectId: null })
        } else if (value === "Fail" && checked) {
            setFail({ background: "#fc3523" });
            setPass({});
        } else {
            setPass({});
            setFail({});
        }
        setValue(value);
    };

    const getPoNumber = (value) => {
        setShowQrScan(true);
        setModal('barcode');
    };

    useEffect(() => {
        if (failCount) {
            console.log('Updated Fail Count:', failCount);
        }
    }, [failCount]);

    const handlePoNumber = async (scannedValue) => {
        setShowQrScan(false);
        const matchedPoNumber = barcodeData?.barcode === scannedValue ? barcodeData.barcode : null;

        if (matchedPoNumber) {
            form.setFieldsValue({ barcode: matchedPoNumber });
            const data = barcodeData;
            const moNumber = data?.barcodeProps?.moNumber;
            form.setFieldsValue({ poNumber: moNumber });
            const colorAndSizeDetails = barcodeData.colorAndSizeDetails;
            const totalOriginalQty = colorAndSizeDetails.reduce((total, colorDetail) => {
                const colorTotal = colorDetail.sizesDetails.reduce((sum, sizeDetail) => {
                    return sum + sizeDetail.originalQty;
                }, 0);
                return total + colorTotal;
            }, 0);
            const findPoId = poData[0].poId;
            const quantity = poData[0].quantity;

            const matchingEscallationData = escallationData.find(item => item.style === data?.barcodeProps?.style);
            const escalationPercentage = matchingEscallationData?.escalationPercentage;
            const escalationPersonId = matchingEscallationData?.escalationPerson;
            const qualityType = matchingEscallationData?.qualityType;
            const failCountValue = await getPassFailCount(moNumber);
            if (escalationPersonId) {
                const approverDetails = approverData.find((item) => item.id === Number(escalationPersonId));
                const approverName = approverDetails?.approverName;
                const approverEmail = approverDetails?.emailId;
                // console.log(failCountValue, "failCountValue in escalation block");
                if (failCountValue > escalationPercentage) {
                    const emailRequest = {
                        from: 'jayanthpappala3@gmail.com',
                        to: approverEmail,
                        subject: `Escalation Alert: Quality Type :  ${qualityType} for Style : ${details.styleId}`,
                        text: `Dear ${approverName},\n\nMO Number : ${moNumber}\nFail  :  ${failCountValue}\nEscalation Percentage : ${escalationPercentage}\nPlease review the issue.\n\nBest regards,\nYour System`
                    };
                    try {
                        const sendMailResponse = await defectService.sendMail(emailRequest);
                        if (sendMailResponse) {
                            message.success("Mail Sent");
                        } else {
                            message.error("Error in Mail");
                        }
                    } catch (error) {
                        message.error("Error sending email: " + error.message);
                    }
                }
            }

            setDetails({
                customerId: data?.barcodeProps?.buyerPo,
                styleId: data?.barcodeProps?.style,
                colorId: data?.barcodeProps?.fgColor,
                totalOriginalQty: totalOriginalQty,
                quantity: poData[0]?.quantity,
                poNumber: moNumber,
            });

            form.setFieldsValue({
                customerId: data.buyerPo,
                styleId: data.style,
                colorId: data.fgColor,
                quantity: quantity,
                totalOriginalQty: totalOriginalQty,
                poId: findPoId,
                poNumber: data.moNumber,
                employeeId: useIamClient.IAMClientAuthContext?.user.userId,
                barcode: barcodeData.barcode,
            });

            setBarCodeValue(scannedValue);
            setMoNumber(moNumber);
            message.success('MO Number Scanned');
        } else {
            message.error('MO Number not found for this scanned QR code!');
            form.resetFields([
                'operationCodeId', 'employeeCode', 'employeeId', 'machineCode', 'machineId', 'defectId', 'subDefectId',
            ]);
        }
    };

    const getPassFailCount = async (moNumber) => {
        try {
            const req = new PoNumberReq(moNumber);
            const res = await defectService.getPassFailCount(req);
            if (res.status) {
                setPassCount(res.data[0].passCount);
                setFailCount(res.data[0].failCount);
                return res.data[0].failCount;
            }
        } catch (err) {
            console.log(err.message);
        }
    };

    const disableAddButton = () => {
        if (failCount) {
            const colorAndSizeDetails = barcodeData.colorAndSizeDetails;
            const totalOriginalQty = colorAndSizeDetails.reduce((total, colorDetail) => {
                const colorTotal = colorDetail.sizesDetails.reduce((sum, sizeDetail) => {
                    return sum + sizeDetail.originalQty;
                }, 0);
                return total + colorTotal;
            }, 0);
            return failCount > totalOriginalQty;
        }
        return false;
    };

    const getOperation = (value) => {
        setShowQrScan(true);
        setModal('operationCodeId');
    };

    const operationOnChange = (val, option) => {
        form.setFieldsValue({ operationname: option?.key });
        const matchingDefects = defects.filter((rec) => rec.operationId === val);
        setFilteredDefects(matchingDefects);
        form.setFieldsValue({ defectId: null });
    };

    const handleOperation = (scannedValue) => {
        setShowQrScan(false);
        const matchedOperation = operationData.find((item) => item.opName === scannedValue);
        if (matchedOperation) {
            form.setFieldsValue({ operationCodeId: matchedOperation.opName });
            message.success('Operation Scanned');
        } else {
            message.error('Operation not found for this scanned QR code!');
            form.resetFields(['operationCodeId', 'employeeCode', 'employeeId', 'machineCode', 'machineId', 'defectId', 'subDefectId',]);
        }
    };

    return (
        <>
            <Form form={form} layout='vertical'>
                <Row gutter={24}>
                    <Col xs={{ span: 24 }} lg={{ span: 8 }}>
                        <Form.Item label="Quality" name="qualityTypeId" rules={[{ required: true, message: "Quality Type Is Required" }]}>
                            <Select showSearch allowClear popupMatchSelectWidth={false} optionFilterProp="children" onChange={onChangeQuality} placeholder="Select Quality">
                                {qualityType.map((rec) => {
                                    return <Option value={rec.id} key={rec.id}>{rec.qualityType}</Option>
                                })}
                            </Select>
                        </Form.Item>
                    </Col>

                    <Col xs={{ span: 24 }} lg={{ span: 8 }}>
                        <Form.Item name='barcode' label='Barcode Scanner'
                            rules={[{ required: true, message: "Barcode Scanner Is Required" }]}>
                            {/* <Input
                                placeholder="Select or Scan Barcode Scanner"
                                onChange={handlePoNumber}
                                addonAfter={
                                    <QrcodeOutlined
                                        onClick={(e) => getPoNumber(e)}
                                        style={{ fontSize: "24px", cursor: "pointer" }}
                                    />
                                }
                            /> */}
                            <Select
                                placeholder='Select or Scan MO Number'
                                onChange={handlePoNumber}
                                suffixIcon={<QrcodeOutlined
                                    onClick={(e) => { getPoNumber(e.target) }}
                                    style={{ fontSize: '28px', marginLeft: '-7px' }} />}>
                                <Option key={barcodeData.barcode} value={barcodeData.barcode}>{barcodeData.barcode}</Option>
                            </Select>
                        </Form.Item>

                        <Form.Item name='poId' hidden><Input /></Form.Item>
                        <Form.Item name='module' hidden><Input /></Form.Item>
                    </Col>
                </Row>
                {details?.poNumber?.length > 0 && (
                    <Row gutter={[24, 4]}>
                        <Col style={{ marginRight: "20px" }}>
                            <Descriptions bordered column={1} style={{ marginTop: '20px' }}>
                                <Descriptions.Item label="MO Number" style={{ fontWeight: "bold" }}>
                                    {/* <Form.Item name="poNumber"> */}
                                    {details?.poNumber}
                                    {/* </Form.Item> */}
                                </Descriptions.Item>
                            </Descriptions>
                        </Col>
                        <Col style={{ marginRight: "20px" }}>
                            <Descriptions bordered column={1} style={{ marginTop: '20px' }}>
                                <Descriptions.Item label="Customer" style={{ fontWeight: "bold" }}>{details.customerId}</Descriptions.Item>
                            </Descriptions>
                        </Col>
                        <Col style={{ marginRight: "20px" }}>
                            <Descriptions bordered column={1} style={{ marginTop: '20px' }}>
                                <Descriptions.Item label="Style" style={{ fontWeight: "bold" }}>{details.styleId}</Descriptions.Item>
                            </Descriptions>
                        </Col>
                        <Col style={{ marginRight: "20px" }}>
                            <Descriptions bordered column={1} style={{ marginTop: '20px' }}>
                                <Descriptions.Item label="Color" style={{ fontWeight: "bold" }}>{details.colorId}</Descriptions.Item>
                            </Descriptions>
                        </Col>
                        <Col style={{ marginRight: "20px" }}>
                            <Descriptions bordered column={1} style={{ marginTop: '20px' }}>
                                <Descriptions.Item label="Bundle Quantity" style={{ fontWeight: "bold" }}>{details.totalOriginalQty}</Descriptions.Item>
                            </Descriptions>
                        </Col>
                        <Col style={{ marginRight: "20px" }}>
                            <Descriptions bordered column={1} style={{ marginTop: '20px' }}>
                                <Descriptions.Item label="Order Quantity" style={{ fontWeight: "bold" }}>{details.quantity}</Descriptions.Item>
                            </Descriptions>
                        </Col>
                    </Row>
                )}
                <br />
                <Card>
                    <Row gutter={40}>
                        <Col>
                            <Card title={<b>Pass : {passCount ? Number(passCount) : '-'}</b>} style={{ width: 160, height: 40, backgroundColor: '#52c41a' }}></Card>
                        </Col>
                        <Col>
                            <Card title={<b>Fail : {failCount ? Number(failCount) : '-'}</b>} style={{ width: 160, height: 40, backgroundColor: '#f5222d' }}></Card>
                        </Col>
                        <Col>
                            <Card title={<b>Mo Far Inspected Qty : {passCount || failCount ? passCount + failCount : '-'}</b>} style={{ width: 250, height: 40, backgroundColor: '#bfbfbf' }}></Card>
                        </Col>
                    </Row>
                    <br />
                    <Row gutter={24}>
                        <Col xs={{ span: 24 }} lg={{ span: 5 }}>
                            <Form.Item name={'employeeName'} label='Operator'
                                initialValue={userData}
                                rules={[{ required: true, message: 'Employee Is Required' }]}
                            >
                                <Input disabled />
                            </Form.Item>
                        </Col>
                        <Form.Item name='employeeId' hidden><Input /></Form.Item>
                        <Col xs={{ span: 24 }} lg={{ span: 5 }}>
                            <Form.Item label="Operation" name="operationCodeId" rules={[{ required: true, message: 'Missing Operation' }]}>
                                <Select showSearch allowClear optionFilterProp="children" placeholder="Select or Scan Operation"
                                    onChange={operationOnChange}
                                    suffixIcon={
                                        <QrcodeOutlined
                                            onClick={(e) => { getOperation(e.target) }}
                                            style={{ fontSize: '28px', marginLeft: '-7px' }}
                                        />
                                    }
                                >
                                    {operationData.map((data) => (
                                        <Option key={data.id} value={data.id}>
                                            {data.opName}
                                        </Option>
                                    ))}
                                </Select>
                            </Form.Item>
                        </Col>
                        <Col >
                            <Form.Item name="testResult" label='Test Result' initialValue={'Pass'}>
                                <Radio.Group buttonStyle="solid" onChange={onTestresultChange} value={value}>
                                    <Radio.Button value="Pass" className='ant-radio-checked' style={Pass}>Pass</Radio.Button>
                                    <Radio.Button value="Fail" style={Fail}>Fail</Radio.Button>
                                </Radio.Group>
                            </Form.Item>
                        </Col>
                        {value != 'Pass' && value != null ? (<>
                            <Col xs={{ span: 24 }} lg={{ span: 5 }}>
                                <Form.Item label='Defect' name={'defectId'}
                                    rules={[{ required: true, message: 'Missing Defect' }]}>
                                    <Select allowClear showSearch optionFilterProp="children" placeholder='Select Defect' >
                                        {reasonsData.map((rec) => (
                                            <Option key={rec.id} value={rec.id}>{rec.reasonName}</Option>
                                        ))}
                                    </Select>
                                </Form.Item>
                            </Col>
                        </>) : (<></>)}

                    </Row>
                    <Row gutter={24} justify="end">
                        <Col xs={{ span: 24 }} sm={{ span: 24 }} md={{ span: 10 }} lg={{ span: 12 }} xl={{ span: 3 }} style={{ marginTop: '1.7%' }}>
                            <Form.Item >
                                <Button type='dashed' style={{ backgroundColor: 'darkseagreen' }} block icon={<PlusOutlined />} onClick={() => onAdd()} disabled={disableAddButton()} >Add</Button>
                            </Form.Item>
                        </Col>
                    </Row>
                    <Col xs={{ span: 24 }} lg={{ span: 8 }}>
                        <div
                            style={{ marginTop: "16px", display: "flex", gap: "20px", flexWrap: "wrap", }}>
                            {Array.isArray(parameters) && parameters.length > 0 && (
                                parameters.map((param, index) => (
                                    <Tag key={index} color="blue" style={{ fontSize: "120%" }}>
                                        {param}
                                    </Tag>
                                ))
                            )}
                        </div>
                    </Col>
                </Card>
                <br />
                <Row justify={'end'}>
                    <Col >
                        <Form.Item>
                            <Button onClick={onSubmit} icon={<ArrowLeftOutlined />}>Back</Button>
                        </Form.Item>
                    </Col>
                    <Col >
                        <Form.Item>
                            <Button danger icon={<UndoOutlined />} onClick={onReset} style={{ marginLeft: 15 }}>Reset</Button>
                        </Form.Item>
                    </Col>
                </Row>

            </Form>
            <Modal
                className="qr-container"
                key={`modal-${Date.now()}`}
                width="45%"
                style={{ top: 10 }}
                bodyStyle={{ height: 'calc(50vh - 20%)' }}
                visible={showQrScan}
                onCancel={() => setShowQrScan(false)}
                footer={null}
                title="Scan QR Code"
            >
                {modal === 'barcode' ? <QrScanner handleScan={handlePoNumber} /> : modal === 'operationCodeId' && <QrScanner handleScan={handleOperation} />}
            </Modal>
        </>

    )

}

export default ProductionDefectsForm