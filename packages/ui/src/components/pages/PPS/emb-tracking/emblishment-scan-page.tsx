import { CommonRequestAttrs, OpCategoryEnum, OpFormEnum, OperationCategoryFormRequest, OperationModel, ShiftModel } from "@xpparel/shared-models";
import { OperationService, ShiftService } from "@xpparel/shared-services";
import { useEffect, useState } from "react";
import { useAppSelector } from "packages/ui/src/common";
import { AlertMessages } from "../../../common";
import { Button, Card, Col, Form, Radio, Row, Select, Tabs, TabsProps } from "antd";
import ManualEmblishmentScanForm from "./manual-emb-scan-form";
import BarcodeEmblishmentScanForm from "./barcode-emb-scan-form";
import { OperationDirectionEnum } from "./operation-direction.enum";
const { Option } = Select


const EmblishmentScanPage = () => {
    useEffect(() => {
        getOpertionsByCategory()
        getShifts()
        form.setFieldsValue({ operationDirection: OperationDirectionEnum.FORWARD })
    }, [])
    const [form] = Form.useForm();
    const [operations, setOperations] = useState<OperationModel[]>([]);
    const [shifts, setShifts] = useState<ShiftModel[]>([]);
    const [tabsVisible, setTabsVisible] = useState<boolean>(false);
    const opService = new OperationService();
    const shiftService = new ShiftService();
    const user = useAppSelector((state) => state.user.user.user);

    const tabComponents: TabsProps['items'] = [
        {
            key: '1',
            label: 'Manual Scan',
            children: <ManualEmblishmentScanForm {...{ operation: form.getFieldValue('operation'), shift: form.getFieldValue('shift'), operationDirection: form.getFieldValue('operationDirection') }} />,
        },
        {
            key: '2',
            label: 'Barcode Scan',
            children: <BarcodeEmblishmentScanForm {...{ operation: form.getFieldValue('operation'), shift: form.getFieldValue('shift'), operationDirection: form.getFieldValue('operationDirection') }} />,
        },

    ];

    const onTabChange = () => {

    }
    /**
     * Get operations under category emblishmnet
     * @param Category 
     */
    const getOpertionsByCategory = () => {
        // TODO:CUT
        // const req = new OperationCategoryFormRequest(user?.userName, user?.orgData?.unitCode, user?.orgData?.companyCode, user?.userId, OpCategoryEnum.EMB, OpFormEnum.PF)
        // opService.getOperationsByCategory(req)
        //     .then((res) => {
        //         if (res.status) {
        //             setOperations(res.data);
        //         } else {
        //             setOperations([]);
        //         }
        //     })
        //     .catch((err) => {
        //         AlertMessages.getErrorMessage(err.message);
        //     });
    }

    /**
     * Get shifts
     * @param userName 
     * @param unitCode 
     * @param CompanyCode 
     * @param userId 
     */
    const getShifts = () => {
        const req = new CommonRequestAttrs(user?.userName, user?.orgData?.unitCode, user?.orgData?.companyCode, user?.userId)
        shiftService.getAllShifts(req)
            .then((res) => {
                if (res.status) {
                    setShifts(res.data);
                } else {
                    setShifts([]);
                }
            })
            .catch((err) => {
                AlertMessages.getErrorMessage(err.message);
            });
    }

    /**
     * Get shifts
     * @param Category 
     */
    const handleSubmit = (e) => {
        console.log(e);
        setTabsVisible(false);
        //get the bundle info here
        form.validateFields().then(() => {
            setTabsVisible(true);
        }).catch(() => {

        })
    }

    const refreshComp = () => {
        setTabsVisible(false);
    }

    return (
        <Card size="small" title="Embellishment Reporting">
            <Form form={form}>
                <Row gutter={24}>
                    <Col xs={24} sm={12} md={6}>
                        <Form.Item
                            label={`Operation`}
                            name={`operation`}
                            rules={[
                                {
                                    required: true,
                                    message: 'Select Operation',
                                },
                            ]}
                        >
                            <Select
                                allowClear
                                placeholder={'Select Operation Code'}
                                style={{ width: '100%' }}
                                onChange={refreshComp}
                            >
                                {operations.map((opInfo) => (
                                    <Option key={opInfo.opCode} value={opInfo.opCode}>
                                        {opInfo.opCode}
                                    </Option>
                                ))}
                            </Select>
                        </Form.Item>
                    </Col>
                    <Col xs={24} sm={12} md={6}>
                        <Form.Item
                            label={`Shift`}
                            name={`shift`}
                            rules={[
                                {
                                    required: true,
                                    message: 'Select Shift',
                                },
                            ]}
                        >
                            <Select
                                allowClear
                                placeholder={'Select Shift'}
                                style={{ width: '100%' }}
                                onChange={refreshComp}
                            >
                                {shifts.map((shift) => (
                                    <Option key={shift.shift} value={shift.shift}>
                                        {shift.shift}
                                    </Option>
                                ))}
                            </Select>
                        </Form.Item>

                    </Col>
                    <Col xs={24} sm={12} md={6}>
                        <Form.Item name="operationDirection">
                            <Radio.Group defaultValue={OperationDirectionEnum.FORWARD} buttonStyle="solid" onChange={refreshComp}>
                                <Radio.Button value={OperationDirectionEnum.FORWARD}>{OperationDirectionEnum.FORWARD}</Radio.Button>
                                <Radio.Button value={OperationDirectionEnum.REVERSE}>{OperationDirectionEnum.REVERSE}</Radio.Button>
                            </Radio.Group>
                        </Form.Item>
                    </Col>
                    <Col xs={24} sm={12} md={6}>
                        <Button className="btn-green" onClick={e => handleSubmit(e)} type="primary" >
                            Submit
                        </Button>
                    </Col>
                </Row>
            </Form>
            {tabsVisible ?
                <Tabs defaultActiveKey="1" className="dispatch-tab" items={tabComponents} onChange={onTabChange} />
                : <></>
            }
        </Card>


    )
}
export default EmblishmentScanPage