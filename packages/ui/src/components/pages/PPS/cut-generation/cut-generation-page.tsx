
import { DocketNumberModel, OpCategoryEnum, OpFormEnum, PoCutModel, PoProdTypeAndFabModel, PoProdutNameRequest, PoSerialRequest, PoSerialWithCutPrefRequest, PoSummaryModel } from "@xpparel/shared-models";
import { Button, Card, Descriptions, Form, Popconfirm, Select, Space, Tag, Tooltip } from "antd";
import { convertBackendDateToLocalTimeZone, useAppSelector } from "packages/ui/src/common";
import React, { useEffect, useState } from "react";
import { AlertMessages } from "../../../common";
import { CutGenerationServices, DocketGenerationServices, OpVersionService, PoMaterialService } from "@xpparel/shared-services";
import Table, { ColumnsType } from "antd/es/table";
import { QuestionCircleOutlined, RedoOutlined } from "@ant-design/icons";
import moment from "moment";
import { wordBreak } from "html2canvas/dist/types/css/property-descriptors/word-break";
interface IProps {
    poObj: PoSummaryModel;
    onStepChange: (step: number, po: PoSummaryModel) => void
}
interface ITblHeaderData {
    itemCode: string;
    itemDesc: string;
    components: string[];
    totalDockets: number;
    cutNotMappedDockets: number;
    productName: string;
    fgColor: string;
}
interface IDocket {
    docketNumber: string;
    itemCode: string;
    itemDesc: string;
}
interface ITblData {
    cutNumber: string;
    mainDocket: IDocket;
    childDockets: IDocket[];
    totalCutQty: number;
    totalDocBundles: number;
    generatedOn: string;
    productName: string;
    cutSubNumber: string;
    fgColor: string;
}
const CutGenerationPage = (props: IProps) => {
    useEffect(() => {
        if (props.poObj) {
            getPoOpVersions(props.poObj.poSerial);
            getPoProdTypeAndFabrics(props.poObj.poSerial);
            getCutNumberInfo(props.poObj.poSerial);
        }
    }, [])
    const user = useAppSelector((state) => state.user.user.user);
    const [poProducts, setPoProducts] = useState<PoProdTypeAndFabModel[]>([]);
    const [tblHeaderData, setTableHeaderData] = useState<ITblHeaderData[]>([]);
    const [cutDocTblData, setCutDocTblData] = useState<ITblData[]>([]);
    const [embComps, setEmbComps] = useState<Map<string, Set<string>>>(new Map<string, Set<string>>());
    const [productName, setProductName] = useState<string>(undefined);
    const poMaterialService = new PoMaterialService();
    const docketGenerationServices = new DocketGenerationServices();
    const cutGenerationServices = new CutGenerationServices();
    const poOpVersionService = new OpVersionService();

    const [form] = Form.useForm();
    const { Option } = Select;

    const getPoOpVersions = (poSerial: number) => {
        // const req = new PoProdutNameRequest(user?.userName, user?.orgData?.unitCode, user?.orgData?.companyCode, user?.userId, poSerial, null);
        const req = new PoSerialRequest(user?.userName, user?.orgData?.unitCode, user?.orgData?.companyCode, user?.userId, poSerial, undefined, false, false);
        poOpVersionService.getOpVersionsForPo(req).then(res => {
            if (res.status) {
                const opVersions = res.data;
                opVersions.forEach(v => {
                    v.operations.forEach(o => {
                        // TODO:CUT
                        // if (o.opCategory == OpCategoryEnum.EMB && o.opForm == OpFormEnum.PF) {
                        //     // get the op group info for the operation
                        //     const opGroupInfo = v.opGroups.find(g => g.operations.includes(o.opCode));
                        //     if (!embComps.has(v.productName)) {
                        //         embComps.set(v.productName, new Set<string>());
                        //     }
                        //     opGroupInfo.components.forEach(comp => {
                        //         embComps.get(v.productName).add(comp);
                        //     });
                        // }
                    });
                });
                console.log(embComps);
            } else {
                AlertMessages.getErrorMessage(res.internalMessage);
            }
        });
    }

    const getPoProdTypeAndFabrics = (poSerialNo: number) => {
        const req = new PoSerialRequest(user?.userName, user?.orgData?.unitCode, user?.orgData?.companyCode, user?.userId, poSerialNo, undefined, false, false);
        poMaterialService.getPoProdTypeAndFabrics(req).then((res => {
            if (res.status) {
                setPoProducts(res.data);
            } else {
                AlertMessages.getErrorMessage(res.internalMessage);
            }
        })).catch(error => {
            AlertMessages.getErrorMessage(error.message)
        });
    }

    const changeProductType = (productTypeVal) => {
        setProductName(productTypeVal);
        const productType = productTypeVal === 'all' ? undefined : productTypeVal;
        const req = new PoSerialRequest(user?.userName, user?.orgData?.unitCode, user?.orgData?.companyCode, user?.userId, props.poObj.poSerial, productType, false, false);
        docketGenerationServices.getDocketNumbersForPo(req).then((res => {
            if (res.status) {
                constructTblHeaderData(res.data);
                getCutNumberInfo(props.poObj.poSerial, productType);
            } else {
                constructTblHeaderData([]);
                AlertMessages.getErrorMessage(res.internalMessage);
            }
        })).catch(error => {
            constructTblHeaderData([]);
            AlertMessages.getErrorMessage(error.message)
        });
    }
    const getCutNumberInfo = (poSerial: number, productName?: string) => {
        const req = new PoSerialWithCutPrefRequest(user?.userName, user?.orgData?.unitCode, user?.orgData?.companyCode, user?.userId, poSerial, true, false, false, false, false, false, productName);
        cutGenerationServices.getCutInfoForPo(req).then((res => {
            if (res.status) {
                constructTblData(res.data);
            } else {
                constructTblData([]);
                AlertMessages.getErrorMessage(res.internalMessage);
            }
        })).catch(error => {
            constructTblData([]);
            AlertMessages.getErrorMessage(error.message)
        });
    }
    const generateCuts = (poSerial: number, currentProdName: string) => {
        const incomignProdName = currentProdName === 'all' ? undefined : currentProdName;
        const req = new PoProdutNameRequest(user?.userName, user?.orgData?.unitCode, user?.orgData?.companyCode, user?.userId, poSerial, incomignProdName, null);
        cutGenerationServices.generateCuts(req).then((res => {
            if (res.status) {
                AlertMessages.getSuccessMessage(res.internalMessage);
                changeProductType(productName);
                getCutNumberInfo(poSerial, productName);
            } else {
                AlertMessages.getErrorMessage(res.internalMessage);
            }
        })).catch(error => {
            AlertMessages.getErrorMessage(error.message)
        });
    }
    const deleteCuts = (poSerial: number, currentProdName: string) => {
        const incomignProdName = currentProdName === 'all' ? undefined : currentProdName;
        const req = new PoProdutNameRequest(user?.userName, user?.orgData?.unitCode, user?.orgData?.companyCode, user?.userId, poSerial, incomignProdName, null);
        cutGenerationServices.deleteCuts(req).then((res => {
            if (res.status) {
                AlertMessages.getSuccessMessage(res.internalMessage);
                changeProductType(productName);
                getCutNumberInfo(poSerial, productName);
            } else {
                AlertMessages.getErrorMessage(res.internalMessage);
            }
        })).catch(error => {
            AlertMessages.getErrorMessage(error.message)
        });
    }
    const constructTblHeaderData = (docNumbersData: DocketNumberModel[]) => {
        const productItemDocMap = new Map<string, ITblHeaderData>();
        docNumbersData.forEach(d => {
            const key = d.productName + '@' + d.fgColor + '@' + d.itemCode;
            if (!productItemDocMap.has(key)) {
                const tblHeadObj: ITblHeaderData = {
                    components: d.components,
                    cutNotMappedDockets: d.cutNumbers ? d.cutNumbers.length > 0 ? 0 : 1 : 1,
                    itemCode: d.itemCode,
                    itemDesc: d.itemDesc,
                    totalDockets: 1,
                    productName: d.productName,
                    fgColor: d.fgColor
                }
                productItemDocMap.set(key, tblHeadObj);
            } else {
                const exitTblHeadObj = productItemDocMap.get(key);
                exitTblHeadObj.components = [...exitTblHeadObj.components, ...d.components];
                exitTblHeadObj.cutNotMappedDockets = exitTblHeadObj.cutNotMappedDockets + (d.cutNumbers ? d.cutNumbers.length > 0 ? 0 : 1 : 1);
                exitTblHeadObj.totalDockets = exitTblHeadObj.totalDockets + 1;
            }
        });
        setTableHeaderData(Array.from(productItemDocMap.values()));
    }

    const constructTblData = (cutDocData: PoCutModel[]) => {
        const data = cutDocData.map(c => {
            const docObj: ITblData = {
                childDockets: [],
                cutNumber: c.cutNumber,
                generatedOn: c.generateOn,
                mainDocket: undefined,
                totalCutQty: c.planQuantity,
                totalDocBundles: c.plannedBundles,
                productName: c.productName,
                cutSubNumber: c.cutSubNumber,
                fgColor: c.fgColor
            }
            c.dockets.forEach(d => {
                if (d.isMainDoc) {
                    docObj.mainDocket = { docketNumber: d.docketGroup, itemCode: d.itemCode, itemDesc: d.itemDesc };
                } else {
                    docObj.childDockets.push({ docketNumber: d.docketGroup, itemCode: d.itemCode, itemDesc: d.itemDesc });
                }
            });
            return docObj;
        });
        setCutDocTblData(data);
    }
    const columns: ColumnsType<ITblData> = [
        {
            title: 'Product Name',
            dataIndex: 'productName',
            align: 'center'
        },
        {
            title: 'FG Color',
            dataIndex: 'fgColor',
            align: 'center'
        },
        {
            title: 'Cut No',
            dataIndex: 'cutSubNumber',
            align: 'center'
        },
        {
            title: 'Main Docket',
            dataIndex: 'mainDocket',
            align: 'center',
            render: (d: IDocket) => <>{d.docketNumber} - <Tag color="cyan">{d.itemCode}</Tag></>
        },
        {
            title: 'Related Dockets',
            dataIndex: 'childDockets',
            align: 'center',
            render: (v: IDocket[]) => <Space direction="vertical"><Space.Compact direction="vertical"> {v.map(d => <Space>{d.docketNumber}-<Tag color="cyan">{d.itemCode}</Tag></Space>)} </Space.Compact></Space>
        },
        {
            title: 'Total Cut Quantity',
            dataIndex: 'totalCutQty',
            align: 'center'
        },
        {
            title: 'Total Docket Bundles',
            dataIndex: 'totalDocBundles',
            align: 'center'
        },
        {
            title: 'Generated On',
            dataIndex: 'generatedOn',
            align: 'center',
            render: (v) => {
                return convertBackendDateToLocalTimeZone(v);
            }
        }
    ];
    const renderItems = (docHeaderInfo: ITblHeaderData[], currentProdName: string) => {
        const incomignProdName = currentProdName === 'all' ? undefined : currentProdName;
        console.log(docHeaderInfo)
        let items = docHeaderInfo.map((d, i) => {
            const lineItem = [
                {
                    key: i,
                    label: 'Product Name',
                    children: d.productName
                },
                {
                    key: i,
                    label: 'FG Color',
                    children: [...new Set(d.fgColor)].map(r => r)
                },
                {
                    key: i,
                    label: 'Fabric Code',
                    children: d.itemCode
                },
                {
                    key: i,
                    label: 'Components',
                    children: [...new Set(d.components)].map(r =>
                        embComps?.get(d.productName)?.has(r) ? <Tag color="orange">{r}</Tag> : <Tag color="blue">{r}</Tag>
                    )
                },
                {
                    key: i,
                    label: 'Total Dockets',
                    children: <div style={{ wordBreak: 'keep-all' }}>{d.totalDockets}</div>
                },
                {
                    key: i,
                    label: 'Cut not Gen',
                    children: <div style={{ wordBreak: 'keep-all' }}>{d.cutNotMappedDockets}</div>

                }
            ];
            // if there is incoming prod name, then send the matching one. if incoming prod name is empty then sent all the lines
            return !incomignProdName ? lineItem : d.productName == incomignProdName ? lineItem : [];
        }).flat();
        return items;
    }
    return <>
        <Card title='Cut Generation' size="small" extra={productName ? <Space>
            <Button type="primary" onClick={() => generateCuts(props.poObj.poSerial, productName)}>Generate Cut Numbers</Button>
            <Popconfirm
                title="Delete Cut Numbers"
                description="Are you sure to delete this ?"
                onConfirm={() => deleteCuts(props.poObj.poSerial, productName)}
                // onCancel={cancel}
                okText="Yes"
                cancelText="No"
                icon={<QuestionCircleOutlined style={{ color: 'red' }} />}
            ><Button type="primary" danger >Delete Cut Numbers</Button>
            </Popconfirm>
            <Tooltip title="Reload">
                <Button
                    disabled={!productName}
                    type='primary'
                    icon={<RedoOutlined style={{ fontSize: '20px' }} />}
                    onClick={() => changeProductType(productName)}
                />
            </Tooltip>
        </Space> : ''}>
            <Form style={{ width: '600px' }}>
                <Form.Item
                    name="productType"
                    label="Product Name"
                    rules={[{ required: true, message: 'Please Product Name' }]}
                >
                    <Select placeholder="Please Product Name" onChange={changeProductType} style={{ width: '250px' }}>
                        <Option value="all">Select All</Option>
                        {/* {
                            poProducts.map(productObj => <Option key={productObj.productName} value={productObj.productName}>{productObj.productName}</Option>)
                        } */}
                        {[...new Set(poProducts.map(bO => bO.productName))].map(productName => (
                            <Option key={productName} value={productName}>{productName}</Option>
                        ))}
                    </Select>
                </Form.Item>
            </Form>
            {/* <br /> */}
            <Descriptions title="" bordered size="small"
                column={{ xs: 1, sm: 2, md: 3, lg: 4, xl: 5, xxl: 5 }} items={renderItems(tblHeaderData, productName)} />
            <br />
            <Table size="small" columns={columns} pagination={false} bordered dataSource={cutDocTblData} scroll={{x: 'max-content'}}/>
        </Card>

    </>
}

export default CutGenerationPage;