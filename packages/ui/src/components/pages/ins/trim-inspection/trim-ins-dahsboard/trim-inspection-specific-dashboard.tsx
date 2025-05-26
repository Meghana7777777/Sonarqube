import { ReloadOutlined } from "@ant-design/icons";
import { CommonRequestAttrs, TrimTypeEnum, InsInspectionActivityStatusEnum, ItemStylesRequest, PoNumbersItemCodeRequest, CodesRequest } from "@xpparel/shared-models";
import { InspectionHelperService, PreIntegrationService } from "@xpparel/shared-services";
import { Button, Card, Col, Form, Row, Select, Space, Tooltip } from "antd";
import { AlertMessages } from "packages/ui/src/components/common/notifications";
import { useEffect, useState } from "react";
import { useAppSelector } from "../../../../../common";
import { InspectionColumnarCard } from "./trim-inspection-columnar-card";
import { InspectionDashboardHelper } from "./trim-inspection-dashboard-helper";



const helper = new InspectionDashboardHelper();

interface InspectionSpecificDashboardProps {
    typeOfInspection: TrimTypeEnum;
    dashboardMainHeading?: string;
}

export const InspectionSpecificDashboard = (props: InspectionSpecificDashboardProps) => {
    const [searchData, setSearchData] = useState("")
    const user = useAppSelector((state) => state.user.user.user);
    const [counter, setCounter] = useState<number>(0);
    const inspectionHelperService = new InspectionHelperService();
    const [styleData, setStyleData] = useState<any>();
    const [itemCode, setItemCode] = useState<any>([]);
    const [styleNumberData, setstyleNumberData] = useState<any>([])
    const [selectedItemCode, setSelectedItemCode] = useState<PoNumbersItemCodeRequest[]>([]);
    const [lotCodes, setLotCodes] = useState<string[]>([]);

    const [batchCodes, setBatchCodes] = useState<any>([]);

    useEffect(() => {
        getStyleData();
    }, [])


    //for getching all styles
    const getStyleData = () => {
        const req = new CommonRequestAttrs(user?.username, user?.orgData.unitCode, user?.orgData.companyCode, user?.userId)
        inspectionHelperService.getAllStyles(req).then((res) => {
            if (res.status) {
                setStyleData(res.Codes);
            }
            else {
                AlertMessages.getErrorMessage(res.internalMessage);
            }
        }).catch(err => console.log(err.message));
    }

    const reloadDashboard = () => {
        setCounter(preVal => preVal + 1);
        setBatchCodes([]);
        setItemCode([]);
        setSearchData("");

    }

    //for fetching itemcodes for selected styles
    const handleSelectChange = async (itemStyle: string) => {
        try {
            setstyleNumberData(itemStyle);
            const req = new CodesRequest(user?.username, user?.orgData.unitCode, user?.orgData.companyCode, user?.userId, [itemStyle]);
            const response = await inspectionHelperService.getLotsForStyle(req);
            if (response.status) {
                setLotCodes(response.Codes);
            }
            else {
                setLotCodes([]);
                setItemCode([]);
                setSearchData("");
                AlertMessages.getErrorMessage(response.internalMessage);
            }
        }
        catch (err) {
            setLotCodes([]);
            setItemCode([]);
            setSearchData("");
            AlertMessages.getErrorMessage(err.message);
        }
    };

    //for  itemcode
    const handleLotCodeChange = async (lotCode: string) => {
        try {
            if (!lotCode) {
                return;
            }
            const req = new CodesRequest(user?.username, user?.orgData.unitCode, user?.orgData.companyCode, user?.userId, [lotCode])
            const response = await inspectionHelperService.getItemCodesForLot(req);
            if (response.status) {
                setItemCode(response.Codes)
            }
            else {
                setItemCode([])
                setItemCode([]);
                setSearchData("");
                AlertMessages.getErrorMessage(response.internalMessage);
            }
        }
        catch (err) {
            setItemCode([]);
            setSearchData("");
            AlertMessages.getErrorMessage(err.message);
        }
    };

    const handleItemCodeChange = async (batchCode: string) => {
        setSearchData(batchCode);
    }



    const userInfo: CommonRequestAttrs = null;
    return (
        <Card size='small'
            title={
                <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: 8, margin: '5px' }}>
                    <div style={{ fontWeight: 'bold', fontSize: 16, whiteSpace: 'nowrap' }}>
                        {helper.getDahsboardHeading(props.typeOfInspection)}
                    </div>
                    <div style={{ display: 'flex', flexWrap: 'nowrap', gap: 8, alignItems: 'center' }}>
                        <Form key={counter} layout="inline" style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                            <Form.Item label="Style Numbers" name={'styleNumber'} rules={[{ required: true, message: 'Select Style Number' }]}>
                                <Select
                                    showSearch
                                    // allowClear
                                    onChange={handleSelectChange}
                                    placeholder="Select Style Number"
                                    style={{ width: '200px' }}
                                    filterOption={(input, option) =>
                                        (option.label as string).toLowerCase().indexOf(input.toLowerCase()) >= 0
                                    }
                                >
                                    {styleData?.map((data) => (
                                        <Select.Option key={data} value={data} label={data}>
                                            {data}
                                        </Select.Option>
                                    ))}
                                </Select>
                            </Form.Item>

                            {/* New dropdown for Lot Codes */}
                            <Form.Item label="Lot Codes" name={'lotCode'} rules={[{ required: true, message: 'Select Lot Code' }]} >
                                <Select
                                    showSearch
                                    allowClear
                                    onChange={handleLotCodeChange}
                                    placeholder="Select Lot Code"
                                    style={{ width: '200px' }}
                                    filterOption={(input, option) =>
                                        (option.label as string).toLowerCase().indexOf(input.toLowerCase()) >= 0
                                    }
                                >
                                    {lotCodes?.map((code) => (
                                        code && (
                                            <Select.Option key={code} value={code} label={code}>
                                                {code}
                                            </Select.Option>
                                        )
                                    ))}

                                </Select>
                            </Form.Item>

                            {/* New dropdown for Item Codes */}
                            <Form.Item label="Item Codes" name={'itemCode'} rules={[{ required: true, message: 'Select Item Code' }]}>
                                <Select
                                    showSearch
                                    // allowClear
                                    onChange={handleItemCodeChange}
                                    placeholder="Select Item Code"
                                    style={{ width: '200px' }}
                                    filterOption={(input, option) =>
                                        (option.label as string).toLowerCase().indexOf(input.toLowerCase()) >= 0
                                    }

                                >
                                    {itemCode?.map((code) => (
                                        <Select.Option key={code} value={code} label={code} po_number={code}>
                                            {code}
                                        </Select.Option>
                                    ))}
                                </Select>
                            </Form.Item>
                        </Form>

                        {/* <Input.Search
                        placeholder="Search"
                        allowClear
                        onChange={(e) => setSearchData(e.target.value)}
                        onSearch={(value) => setSearchData(value)}
                        style={{ width: 200, float: 'right' }}
                    /> */}
                        <Tooltip title="Reload & Clear">
                            <Button onClick={reloadDashboard} icon={<ReloadOutlined />} style={{ flexShrink: 0 }} />
                        </Tooltip>
                    </div>
                </div>
            }

        >
            <Row gutter={[16, 12]}>
                <Col xs={24} sm={24} md={12} lg={8} xl={6}>
                    <InspectionColumnarCard key={'PEN' + counter} columnarHeading={"Material Pending"} inspectionCurrentActivity={InsInspectionActivityStatusEnum.OPEN} typeOfInspection={props.typeOfInspection} reloadDashboard={reloadDashboard} searchData={searchData} />
                </Col>
                <Col xs={24} sm={24} md={12} lg={8} xl={6}>
                    <InspectionColumnarCard key={'REL' + counter} columnarHeading={"Material Received"} inspectionCurrentActivity={InsInspectionActivityStatusEnum.MATERIAL_RECEIVED} typeOfInspection={props.typeOfInspection} reloadDashboard={reloadDashboard} searchData={searchData} />
                </Col>
                <Col xs={24} sm={24} md={12} lg={8} xl={6}>
                    <InspectionColumnarCard key={'PROG' + counter} columnarHeading={"In Progress"} inspectionCurrentActivity={InsInspectionActivityStatusEnum.INPROGRESS} typeOfInspection={props.typeOfInspection} reloadDashboard={reloadDashboard} searchData={searchData} />
                </Col>
                <Col xs={24} sm={24} md={12} lg={8} xl={6}>
                    <InspectionColumnarCard key={'COM' + counter} columnarHeading={"Completed"} inspectionCurrentActivity={InsInspectionActivityStatusEnum.COMPLETED} typeOfInspection={props.typeOfInspection} reloadDashboard={reloadDashboard} searchData={searchData} />
                </Col>
            </Row>
        </Card>
    );
};
