import { CarOutlined, CopyOutlined, PhoneOutlined, ScanOutlined, UploadOutlined, UserOutlined } from '@ant-design/icons';
import { CheckCard } from '@ant-design/pro-components';
import { FgWhReqHeaderModel, FgWhReqSubItemModel, FgWhSrIdPlIdsRequest, GatexRefIdReqDto, PKMSReqItemTruckMapCreateDto, PkmsFgWhReqTypeEnum, ReferenceFeaturesEnum, VehicleRequestTypeEnum, cartonBarcodePatternRegExp, cartonBarcodeRegExp } from '@xpparel/shared-models';
import { FileUploadService, GatexService, PKMSFgWarehouseService } from '@xpparel/shared-services';
import { Button, Card, Col, Form, Input, Row, Tag, Upload } from 'antd';
import Search from 'antd/es/input/Search';
import { FaTruckIcon } from 'packages/ui/src/assets/icons/custom-antd-icons/fa-truck';
import { useAppSelector } from 'packages/ui/src/common';
import { AlertMessages, ImagesFilesAccepts } from 'packages/ui/src/components/common';
import { copyToCliBoard } from 'packages/ui/src/components/common/handle-to-cliboard-copy/handle-cliboard-write-text';
import { useEffect, useRef, useState } from 'react';

interface IProps {
    fgWhReqIds: number[],
    packListIds: number[],
}


const PKMSCartonToContainerLoading = (props: IProps) => {
    const { fgWhReqIds, packListIds } = props
    const user = useAppSelector((state) => state.user.user.user);
    const pkmsFgWarehouseService = new PKMSFgWarehouseService();
    const gatexService = new GatexService();
    const fileUploadService = new FileUploadService();
    const [truckDetailsDropDownData, setTruckDetailsDropDownData] = useState<{ truckNumber: string, driverName: string, contactNumber: string }[]>([])
    const [selectedTruckData, setSelectedTruckData] = useState<{ truckNumber: string, driverName: string, contactNumber: string }>(truckDetailsDropDownData[0])
    const [fgInFoWithCartons, setFgInfoWithCartons] = useState<FgWhReqHeaderModel[]>([]);
    const [fgCartons, setFgCartons] = useState<FgWhReqSubItemModel[]>([]);
    const [formRef] = Form.useForm();
    const cartonInputRef = useRef(null);
    const { userName, orgData, userId } = user;
    const [showFileSubmit, setShowFileSubmit] = useState<boolean>(true)



    useEffect(() => {
        getFgWhInfoForGivenPackListIds();
        getVehicleRecordForReferenceId();
    }, [fgWhReqIds, packListIds]);



    const getVehicleRecordForReferenceId = () => {
        const req = new GatexRefIdReqDto(String(fgWhReqIds[0]), undefined, undefined, VehicleRequestTypeEnum.IN);
        gatexService.getVehicleRecordForReferenceId(req).then((res) => {
            if (res.status) {
                const empty = [];
                res.data.vehicleINRRecords.forEach((rec) => {
                    empty.push({
                        truckNumber: rec.vehicleNo,
                        driverName: rec.dName,
                        contactNumber: rec.dContact,
                    })
                })
                setTruckDetailsDropDownData(empty)
            } else {
            }
        }).catch(err => console.log(err.message));

    };



    const getFgWhInfoForGivenPackListIds = () => {
        const req = new FgWhSrIdPlIdsRequest(userName, orgData?.unitCode, orgData?.companyCode, userId, packListIds, 'Remarks go here', true, false,
            false, true, true, fgWhReqIds, [], [PkmsFgWhReqTypeEnum.IN])
        pkmsFgWarehouseService.getFgWhInfoForGivenPackListIds(req).then(res => {
            if (res.status) {
                setFgInfoWithCartons(res.data);
                const cartons = [];
                res.data.forEach((p) => {
                    p.whReqItems.forEach((w) => {
                        w.cartonsInfo.forEach((c) => {
                            cartons.push(c)
                        })
                    })
                });
                setFgCartons(cartons);
            } else {
                setFgInfoWithCartons([]);
                setFgCartons([]);
            }
        }).catch(err => console.log(err.message));
    };

    const savePkmsItemRequestTruckMap = (cartonBarcode: string) => {
        const req = new PKMSReqItemTruckMapCreateDto(userName, orgData?.unitCode, orgData?.companyCode, userId, fgWhReqIds[0], undefined, selectedTruckData.truckNumber, cartonBarcode)
        pkmsFgWarehouseService.savePkmsItemRequestTruckMap(req).then(res => {
            if (res.status) {
                setFgCartons((prev) =>
                    prev.map((rec) =>
                        rec.barcode === cartonBarcode ? { ...rec, loadedInfo: true } : rec
                    )
                );
                formRef.resetFields();
                AlertMessages.getSuccessMessage(res.internalMessage);
            } else {
                AlertMessages.getErrorMessage(res.internalMessage);
            }
        }).catch(err => console.log(err.message))
    }


    let timeoutId;
    const scanBarcodeValue = (cartonBarcode: string) => {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => {
            if (cartonBarcode) {
                savePkmsItemRequestTruckMap(cartonBarcode)
            }
        }, 2)
    };

    const saveCartonAndContainerImages = () => {
        const formData = new FormData();
        formData.append('file', formRef.getFieldValue('file')?.file)
        formData.append('featuresRefNo', String(fgWhReqIds[0]) + '$@$' + selectedTruckData.truckNumber)
        formData.append('featuresRefName', ReferenceFeaturesEnum.CARTONS_LOADING_IN)
        formData.append('unitCode', orgData?.unitCode)
        formData.append('companyCode', orgData?.companyCode)
        formData.append('userName', userName)
        formData.append('userId', userId)
        //for only cartons loading to container 
        formData.append('loadedCartonsAlso', 'yes')
        fileUploadService.fileUpload(formData).then(res => {
            if (res.status) {
                setShowFileSubmit(true)
                AlertMessages.getSuccessMessage(res.internalMessage);
                formRef.setFieldValue('file', undefined);
            } else {
                AlertMessages.getErrorMessage(res.internalMessage);
            }
        }).catch(err => console.log(err.message));
    };



    return <>

        <Row gutter={24}>
            <Col xs={{ span: 24 }} sm={{ span: 24 }} md={{ span: 8 }} lg={{ span: 12 }} xl={{ span: 6 }}>
                <Card style={{ maxHeight: '75vh', overflowY: 'auto', minHeight: '50vh' }}>
                    {fgCartons?.map((rec, index) => (
                        <Tag
                            onClick={() => {
                                if (!rec.loadedInfo) {
                                    copyToCliBoard(rec.barcode, 'Barcode copied to clipboard');
                                }
                            }}
                            key={index}
                            style={{
                                cursor: !rec.loadedInfo ? 'pointer' : '',
                                backgroundColor: rec.loadedInfo ? 'green' : 'orange',
                                color: 'white',
                                marginBottom: '10px',
                                padding: '4px'
                            }}
                        >
                            <p style={{ margin: '2px', padding: '0px' }}>{!rec.loadedInfo ? <><CopyOutlined />{" "}</> : <></>}{rec.barcode}</p>
                        </Tag>
                    ))}
                </Card>
            </Col>
            <Col xs={{ span: 24 }} sm={{ span: 24 }} md={{ span: 8 }} lg={{ span: 12 }} xl={{ span: 18 }}>
                <Row gutter={24}>
                    <div style={{ display: 'flex', overflowX: 'auto', whiteSpace: 'nowrap', width: '100%', gap: '10px', padding: '5px', scrollbarWidth: 'thin' }}>
                        <CheckCard.Group
                            onChange={(e: any) => {
                                setSelectedTruckData(e)
                            }}
                            defaultValue={truckDetailsDropDownData[0]?.truckNumber}
                            size="small" style={{ width: '100%' }} >
                            {truckDetailsDropDownData
                                .map((type) => (
                                    <CheckCard value={type} style={{ width: '150px' }} title={<FaTruckIcon style={{ height: '20px', width: '20px', color: 'blue' }} />} key={type.truckNumber} subTitle={type.truckNumber} />
                                ))}
                        </CheckCard.Group>
                    </div>
                </Row>
                <Row gutter={24}>
                    <Col xs={{ span: 24 }} sm={{ span: 24 }} md={{ span: 8 }} lg={{ span: 12 }} xl={{ span: 19 }}>
                        {selectedTruckData?.truckNumber && <Card
                            title={<span style={{ display: 'flex', justifyContent: 'center' }}>Carton Loading To Container</span>}
                            extra={<>
                                <Button
                                    onClick={() => {
                                        saveCartonAndContainerImages()
                                    }}
                                    type='primary'
                                    disabled={showFileSubmit}
                                >
                                    Submit
                                </Button>
                            </>}
                        >

                            <Form layout='vertical' form={formRef} >
                                <Row gutter={16}>
                                    <Col span={9}>
                                        <Form.Item
                                            name='cartonNo'
                                            label='Scan Carton No'
                                            rules={[{
                                                required: true,
                                                pattern: new RegExp(cartonBarcodeRegExp),
                                                message: 'Please Provide Valid Carton Barcode'
                                            }]}
                                        >
                                            <Input
                                                autoFocus={true}
                                                onChange={(v) => {
                                                    if (cartonBarcodePatternRegExp.test(v.target.value)) {
                                                        scanBarcodeValue(v.target.value)
                                                    }
                                                }}
                                                ref={cartonInputRef}
                                                placeholder='Scan Carton No'
                                                prefix={<ScanOutlined />}
                                            />
                                        </Form.Item>
                                    </Col>
                                    <Col span={9}>
                                        <Form.Item
                                            name='enteredCartonNo'
                                            rules={[{
                                                required: true,
                                                pattern: new RegExp(cartonBarcodeRegExp),
                                                message: 'Please Provide Valid Carton Barcode'
                                            }]}
                                            style={{ marginTop: '32px' }}
                                        >
                                            <Search
                                                placeholder='Type Carton No'
                                                enterButton
                                                onChange={(v) => {
                                                    const pattern = cartonBarcodePatternRegExp;
                                                    if (pattern.test(v.target.value)) {
                                                        scanBarcodeValue(v.target.value)
                                                    }
                                                }}
                                            />
                                        </Form.Item>
                                    </Col>
                                    <Col span={6}>
                                        <Form.Item name='file' label='Upload File'>
                                            <Upload
                                                accept={ImagesFilesAccepts}
                                                beforeUpload={() => false}
                                                maxCount={1}
                                                onRemove={() => {
                                                    setShowFileSubmit(true)
                                                }}
                                                multiple={false}
                                                showUploadList
                                                progress={{
                                                    strokeColor: {
                                                        '0%': '#108ee9',
                                                        '100%': '#87d068',
                                                    },
                                                    strokeWidth: 3,
                                                    format: percent => `${parseFloat(percent.toFixed(2))}%`,
                                                }}
                                                onChange={({ fileList }) => {
                                                    if (fileList?.length) {
                                                        setShowFileSubmit(false)
                                                    } else {
                                                        setShowFileSubmit(true)
                                                    }
                                                }}
                                            >
                                                <Button
                                                    icon={<UploadOutlined />}
                                                >
                                                    Click To upload
                                                </Button>
                                            </Upload>
                                        </Form.Item>
                                    </Col>
                                </Row>
                            </Form>


                        </Card>}
                    </Col>

                    <Col xs={{ span: 24 }} sm={{ span: 24 }} md={{ span: 8 }} lg={{ span: 12 }} xl={{ span: 5 }}>
                        {selectedTruckData?.truckNumber && (
                            <Card
                                title={
                                    <span style={{ display: "flex", justifyContent: "center" }}>
                                        Truck Details
                                    </span>
                                }
                                style={{ borderRadius: 10, boxShadow: "0 4px 10px rgba(0, 0, 0, 0.1)" }}
                            >
                                <div style={{ display: "flex", alignItems: "center", marginBottom: 10 }}>
                                    <UserOutlined style={{ fontSize: "18px", marginRight: 10, color: "#1890ff" }} />
                                    <span style={{ fontSize: "16px", fontWeight: "500" }}>{selectedTruckData.driverName}</span>
                                </div>

                                <div style={{ display: "flex", alignItems: "center", marginBottom: 10 }}>
                                    <PhoneOutlined style={{ fontSize: "18px", marginRight: 10, color: "#52c41a" }} />
                                    <span style={{ fontSize: "16px", fontWeight: "500" }}>{selectedTruckData.contactNumber}</span>
                                </div>

                                <div style={{ display: "flex", alignItems: "center" }}>
                                    <CarOutlined style={{ fontSize: "18px", marginRight: 10, color: "#faad14" }} />
                                    <span style={{ fontSize: "16px", fontWeight: "500" }}>{selectedTruckData.truckNumber}</span>
                                </div>
                            </Card>
                        )}
                    </Col>
                </Row>
            </Col>

        </Row>
    </>
}

export default PKMSCartonToContainerLoading