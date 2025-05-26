import { CommonRequestAttrs, PackListCreateModel, PackSerialDropDownModel, PONoRequest } from "@xpparel/shared-models";
import { PackListViewServices, PreIntegrationServicePKMS } from "@xpparel/shared-services";
import { Card, Col, Form, Row, Select } from "antd";
import { useAppSelector } from "packages/ui/src/common";
import { useEffect, useState } from "react";
import { AlertMessages } from "../../../common";
import { ContainerGroupSuggestions } from "./container-group-suggestions";


export const ContainerPage = () => {
    const user = useAppSelector((state) => state.user.user.user);
    const { userName, orgData, userId } = user;
    const [phId, setPhId] = useState(undefined);
    const [poData, setPoData] = useState<PackSerialDropDownModel[]>([]);
    const [packListData, setPackListData] = useState<PackListCreateModel[]>([]);

    const preIntegrationService = new PreIntegrationServicePKMS();
    const service = new PackListViewServices();
    useEffect(() => {
        getAllPos()
    }, []);

    const getAllPos = () => {
        const reqObj = new CommonRequestAttrs(user?.userName, user?.orgData?.unitCode, user?.orgData?.companyCode, user?.userId);
        preIntegrationService.getAllPackSerialDropdownData(reqObj)
            .then((res) => {
                if (res.status) {
                    setPoData(res.data);
                } else {
                    AlertMessages.getErrorMessage(res.internalMessage);
                    setPoData([]);
                }
            })
            .catch((err) => {
                AlertMessages.getErrorMessage(err.message);
                setPoData([]);
            });
    };

    const getPackListsForPo = (poNumber:number) => {
        const req = new PONoRequest(userName, userId, orgData.unitCode, orgData.companyCode, poNumber, undefined, undefined);
        service.getPackListsForPo(req)
            .then((res) => {
                if (res.status) {
                    setPackListData(res.data);
                } else {
                    setPackListData([]);
                }
            })
            .catch((err) => {
                AlertMessages.getErrorMessage(err.message);
                setPackListData([]);
            });
    };






    return (<Card>
        <Form size="small" layout="horizontal">
            <Row gutter={16} justify="space-between">
                <Col xs={24} sm={12} md={6} lg={6} xl={6}>
                    <Form.Item
                        label={<span>PO</span>}
                        name="poId"
                        rules={[{ required: true }]}
                    >
                        <Select
                            placeholder="Select Po"
                            allowClear
                            showSearch
                            filterOption={(input, option) =>
                                (option.label as string)?.toLowerCase()?.indexOf(input?.toLowerCase()) >= 0
                            }
                            style={{ width: "100%" }}
                            onChange={(val) => {
                                getPackListsForPo(val)
                            }}
                        >
                            {poData.map((po) => (
                                <Select.Option key={po.packSerial} value={po.packSerial}>
                                    {po.packSerial}-{po.packOrderDescription}
                                </Select.Option>
                            ))}
                        </Select>
                    </Form.Item>
                </Col>
            </Row>
        </Form>

        {
            packListData.map(pkList=>{
                return <ContainerGroupSuggestions packListId={pkList.plConfigId}/>
            })
        }

    </Card>)
}
export default ContainerPage;