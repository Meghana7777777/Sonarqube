import { ReloadOutlined } from "@ant-design/icons";
import { CommonRequestAttrs, InsInspectionActivityStatusEnum, PackActivityStatusEnum, PackFabricInspectionRequestCategoryEnum, PackFabricInspectionRequestCategoryEnumDisplayValue, PackSerialDropDownModel, PoIdRequest } from "@xpparel/shared-models";
import { PackListViewServices, PreIntegrationServicePKMS } from "@xpparel/shared-services";
import { Button, Card, Col, Form, Row, Select, Space, Tooltip } from "antd";
import { useEffect, useState } from "react";
import { useAppSelector } from "../../../../../common";
import { InspectionDashboardHelper } from "../../../WMS/inspection/dahsboard/inspection-dashboard-helper";
import { PKMSInspectionColumnarCard } from "./inspection-columnar-card";



const helper = new InspectionDashboardHelper();

interface InspectionSpecificDashboardProps {
    typeOfInspection: PackFabricInspectionRequestCategoryEnum;
}

export const PKMSInspectionSpecificDashboard = (props: InspectionSpecificDashboardProps) => {
    const { typeOfInspection } = props;
    const [searchData, setSearchData] = useState("")
    const user = useAppSelector((state) => state.user.user.user);
    const [counter, setCounter] = useState<number>(0);
    const [poNumbers, setPoNumbers] = useState<PackSerialDropDownModel[]>()
    const [packListNumbers, setPackListNumbers] = useState<{ id: number, packListNo: string }[]>()
    const preIntegrationService = new PreIntegrationServicePKMS();
    const packListViewServices = new PackListViewServices();
    const [formRef] = Form.useForm();
    const [selectedSearchData, setSelectedSearchData] = useState<{ poNumber: number, packListNo: number }>()

    useEffect(() => {
        getAllPackSerialDropdownData()
    }, []);


    const getAllPackSerialDropdownData = () => {
        formRef.setFieldValue('packListNo', undefined)
        const req = new CommonRequestAttrs(user?.userName, user?.orgData?.unitCode, user?.orgData?.companyCode, user?.userId);
        preIntegrationService.getAllPackSerialDropdownData(req).then(res => {
            if (res.status) {
                setPoNumbers(res.data)
            } else {
                setPoNumbers([])
            }
        }).catch(err => console.log(err.message))
    };

    const getPackListByPoId = (poId: number) => {
        const req = new PoIdRequest(poId, user?.userName, user?.orgData?.unitCode, user?.orgData?.companyCode, user?.userId);
        packListViewServices.getPackListByPoId(req).then(res => {
            res.status ? setPackListNumbers(res.data) : setPackListNumbers([]);
        }).catch(err => console.log(err.message))
    }




    const reloadDashboard = () => {
        setCounter(preVal => preVal + 1);
        setSearchData("");

    }

    const handleSelectChange = async (poId: number) => {
        getPackListByPoId(poId)
    };


    const handleBatchCodeChange = async (packListNo: number) => {
        setSelectedSearchData({ poNumber: Number(formRef.getFieldValue('poNumber')), packListNo: packListNo })
    }

    const userInfo: CommonRequestAttrs = null;
    return (
        <Card  size='small'
            extra={
                 <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', alignItems: 'center', justifyContent: 'space-between', width: '100%', margin: '5px' }}>
                    <Form key={counter} layout="inline" form={formRef} style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', flex: 1, minWidth: 0 }}>
                        <Form.Item label="Pack Order Nos" name={'poNumber'} rules={[{ required: true, message: 'Select Pack Order No' }]}>
                            <Select
                                showSearch
                                allowClear
                                onChange={handleSelectChange}
                                placeholder="Select Pack Order No"
                                // style={{ width: '200px' }}
                                filterOption={(input, option) =>
                                    (option.label as string)?.toLowerCase()?.indexOf(input?.toLowerCase()) >= 0
                                }
                            >
                                {poNumbers?.map((po) => (
                                    <Select.Option key={po.packSerial} value={po.packSerial}>
                                        {po.packSerial}-{po.packOrderDescription}
                                    </Select.Option>
                                ))}

                            </Select>
                        </Form.Item>

                        {/* New dropdown for Batch Codes */}
                        <Form.Item label="Pack List Number" name={'packListNo'} rules={[{ required: true, message: 'Select Pack List Number' }]} >
                            <Select
                                showSearch
                                allowClear
                                onChange={handleBatchCodeChange}
                                placeholder="Select Pack List Number"
                                // style={{ width: '200px' }}
                                filterOption={(input, option) =>
                                    (option.label as string).toLowerCase().indexOf(input.toLowerCase()) >= 0
                                }
                            >
                                {packListNumbers?.map((code) => (
                                    <Select.Option key={code.packListNo} value={code.id} label={code.packListNo}>
                                        {code.packListNo}
                                    </Select.Option>
                                ))}

                            </Select>
                        </Form.Item>
                    </Form>
                    <Tooltip title="Reload & Clear">
                        <Button onClick={reloadDashboard} icon={<ReloadOutlined />} />
                    </Tooltip>
                </div>
            }

        >
            <Row gutter={16}>
                <Col xl={6} lg={8} md={8} sm={12} xs={12}>
                    <PKMSInspectionColumnarCard key={'PEN' + counter} columnarHeading={"Material Pending"} inspectionCurrentActivity={InsInspectionActivityStatusEnum.OPEN} typeOfInspection={props.typeOfInspection} reloadDashboard={reloadDashboard} searchData={searchData} selectedSearchData={selectedSearchData} />
                </Col>
                <Col xl={6} lg={8} md={8} sm={12} xs={12}>
                    <PKMSInspectionColumnarCard key={'REL' + counter} columnarHeading={"Material Received"} inspectionCurrentActivity={InsInspectionActivityStatusEnum.MATERIAL_RECEIVED} typeOfInspection={props.typeOfInspection} reloadDashboard={reloadDashboard} searchData={searchData} selectedSearchData={selectedSearchData} />
                </Col>
                <Col xl={6} lg={8} md={8} sm={12} xs={12}>
                    <PKMSInspectionColumnarCard key={'PROG' + counter} columnarHeading={"In Progress"} inspectionCurrentActivity={InsInspectionActivityStatusEnum.INPROGRESS} typeOfInspection={props.typeOfInspection} reloadDashboard={reloadDashboard} searchData={searchData} selectedSearchData={selectedSearchData} />
                </Col>
                <Col xl={6} lg={8} md={8} sm={12} xs={12}>
                    <PKMSInspectionColumnarCard key={'COM' + counter} columnarHeading={"Completed"} inspectionCurrentActivity={InsInspectionActivityStatusEnum.COMPLETED} typeOfInspection={props.typeOfInspection} reloadDashboard={reloadDashboard} searchData={searchData} selectedSearchData={selectedSearchData} />
                </Col>
            </Row>
        </Card>
    );
};
