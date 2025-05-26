import { DocBundleGenerationStatusEnum, DocConfirmationStatusEnum, DocGenStatusEnum, DocketBasicInfoModel, DocketDetailedInfoModel, DocketGroupDetailedInfoModel, DocketsConfirmationListModel, OpCategoryEnum, OpFormEnum, PoDocketGroupRequest, PoDocketNumberRequest, PoProdTypeAndFabModel, PoProdutNameRequest, PoRatioIdRequest, PoRatioModel, PoSerialRequest, PoSummaryModel, SaleOrderItemRequest } from "@xpparel/shared-models";
import { DocketGenerationServices, OpVersionService, PackingListService, PoMaterialService, PoRatioService } from "@xpparel/shared-services";
import { useAppSelector } from "packages/ui/src/common";
import { useEffect, useState } from "react";
import { AlertMessages } from "../../../common";
import { Button, Card, Col, Form, Modal, Popconfirm, Row, Select, Space, Tag, Tooltip } from "antd";
import Table, { ColumnsType } from "antd/es/table";
import { EyeOutlined, QuestionCircleOutlined, RedoOutlined } from "@ant-design/icons";
import DocketView from "./docket-view";
import React from "react";
import { getCssFromComponent } from "../../WMS";
import FabricCodeQuantities from "../../OMS/order-manipulation/fabric-code-quantites";
interface IProps {
    poObj: PoSummaryModel;
    onStepChange: (step: number, po: PoSummaryModel) => void
}

interface IRowSpanIndex {
    start: number;
    end: number;
}

const DocketConfirmationPage = (props: IProps) => {
    useEffect(() => {
        if (props.poObj) {
            getPoProdTypeAndFabrics(props.poObj.poSerial);
            getPoOpVersions(props.poObj.poSerial);
        }
    }, [])
    const user = useAppSelector((state) => state.user.user.user);
    const [poProducts, setPoProducts] = useState<PoProdTypeAndFabModel[]>([]);
    const [selectedProductType, setSelectedProductType] = useState<string>(undefined);
    const [docketInfo, setDocketInfo] = useState<DocketBasicInfoModel[]>([]);
    const [docketConfirmationInfo, setDocketConfirmationInfo] = useState<DocketsConfirmationListModel>(undefined);
    const [stateKey, setStateKey] = useState<number>(0);
    const [embComps, setEmbComps] = useState<Map<string, Set<string>>>(new Map<string, Set<string>>());
    const poMaterialService = new PoMaterialService();
    const poOpVersionService = new OpVersionService();
    const docketGenerationServices = new DocketGenerationServices();
    const { Option } = Select;
    const [modalVisible, setModalVisible] = useState<boolean>(false);
    const [docketPrintData, setDocketPrintData] = useState<DocketGroupDetailedInfoModel>(undefined);
    const [columns, setColumns] = useState<ColumnsType<DocketBasicInfoModel>>();
    const packlistService = new PackingListService()
    const [fabricCodeData, setFabricCodedata] = useState([])

    useEffect(() => {
        if (selectedProductType && docketInfo.length > 0) {
            getSoItemQty();
        }
    }, [docketInfo]);

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
        setSelectedProductType(productTypeVal);
        getDocketInfo(productTypeVal);
        // getDocketsConfirmationListForPo(productTypeVal);
    }

    const getDocketInfo = (productTypeVal) => {
        const productType = productTypeVal === 'all' ? undefined : productTypeVal;
        const req = new PoProdutNameRequest(user?.userName, user?.orgData?.unitCode, user?.orgData?.companyCode, user?.userId, props.poObj.poSerial, productType, null);
        docketGenerationServices.getDocketsBasicInfoForPo(req).then((res => {
            if (res.status) {
                setDocketInfo(res.data);
                getDocketsConfirmationListForPo(productTypeVal, res.data);
            } else {
                AlertMessages.getErrorMessage(res.internalMessage);
                setDocketInfo([]);
            }
        })).catch(error => {
            AlertMessages.getErrorMessage(error.message);
            setDocketInfo([]);
        });
    }
    const getDocketsConfirmationListForPo = (productTypeVal, docData: DocketBasicInfoModel[]) => {
        const productType = productTypeVal === 'all' ? undefined : productTypeVal;
        const req = new PoProdutNameRequest(user?.userName, user?.orgData?.unitCode, user?.orgData?.companyCode, user?.userId, props.poObj.poSerial, productType, null);
        docketGenerationServices.getDocketsConfimrationListForPo(req).then((res => {
            let docConfirmData;
            if (res.status) {
                setDocketConfirmationInfo(res.data.length > 0 ? res.data[0] : undefined);
                docConfirmData = res.data.length > 0 ? res.data[0] : undefined;
            } else {
                AlertMessages.getErrorMessage(res.internalMessage);
                setDocketConfirmationInfo(undefined);
            }
            constructColumns(docData, docConfirmData);
        })).catch(error => {
            AlertMessages.getErrorMessage(error.message);
            setDocketConfirmationInfo(undefined);
        });
    }


    const constructColumns = (tblData: DocketBasicInfoModel[], docConfirmationData: DocketsConfirmationListModel) => {
        const colspanTypeMap = new Map<string, IRowSpanIndex>();
        // Calculate row spans for table columns
        tblData.forEach((eachRecord, index) => {
            const { docketGroup } = eachRecord;
            colspanTypeMap.set(docketGroup, colspanTypeMap.has(docketGroup) ? { start: colspanTypeMap.get(docketGroup)?.start, end: colspanTypeMap.get(docketGroup)?.end + 1 } : { start: index, end: 1 });
        });
        const columnsD: ColumnsType<DocketBasicInfoModel> = [
            {
                title: 'Product Name',
                dataIndex: 'productName',
                align: 'center'
            },
            {
                title: 'Cut No',
                dataIndex: 'cutSubNumber',
                align: 'center'
            },
            {
                title: 'Docket Number',
                dataIndex: 'docketGroup',
                align: 'center',
                onCell: (doc, index,) => {
                    if (index === colspanTypeMap.get(doc.docketGroup)?.start) {
                        return { rowSpan: colspanTypeMap.get(doc.docketGroup)?.end };
                    } else {
                        return { rowSpan: 0 };
                    }
                }
            },
            // {
            //     title: 'Sub Docket',
            //     dataIndex: 'docketNumber',
            //     align: 'center'
            // },
            {
                title: 'Fabric Code',
                dataIndex: 'itemCode', //TODO: No fabric
                align: 'center'
            },
            {
                title: 'Components',
                dataIndex: 'components', //TODO: No fabric
                align: 'left',
                render: (comps: string[], record: DocketBasicInfoModel, index: number) => {
                    return comps.map(c => {
                        return embComps?.get(record.productName)?.has(c) ? <Tag color="orange">{c}</Tag> : <Tag color="blue">{c}</Tag>
                    });
                }
            },
            {
                title: 'FG Color',
                dataIndex: 'fgColor', //TODO: No fg color
                align: 'center'
            },
            {
                title: 'Docket Plies',
                dataIndex: 'plies',
                align: 'center'
            },
            {
                title: 'Docket Qty',
                align: 'center',
                render: (_, record) => {
                    const totalRatio = record.sizeRatios.reduce((accumulator, curVal) => accumulator + curVal.ratio, 0);
                    return totalRatio * Number(record.plies);
                }
            },
            {
                title: 'View',
                align: 'center',
                render: (_, record) => {
                    return <Button onClick={() => viewDocket(record.docketGroup)} icon={<EyeOutlined />} />
                },
                onCell: (doc, index,) => {
                    if (index === colspanTypeMap.get(doc.docketGroup)?.start) {
                        return { rowSpan: colspanTypeMap.get(doc.docketGroup)?.end };
                    } else {
                        return { rowSpan: 0 };
                    }
                }
            },
            {
                title: 'Ratio Name',
                dataIndex: 'ratioName',
                align: 'center',
                onCell: (doc, index,) => {
                    if (index === colspanTypeMap.get(doc.docketGroup)?.start) {
                        return { rowSpan: colspanTypeMap.get(doc.docketGroup)?.end };
                    } else {
                        return { rowSpan: 0 };
                    }
                }
            },
            {
                title: 'Status',
                dataIndex: 'docConfirmationSatus',
                align: 'center',
                // render: (docGenStatus) => docGenStatus == DocConfirmationStatusEnum.OPEN ? 'Not Yet Confirmed' : 'Confirmed'
                render: (text, record, i) => {
                    let docGenStatus;
                    if (docConfirmationData?.confirmationInProgDockets.includes(record.docketNumber)) {
                        docGenStatus = <Tag key={i + 't'} color="orange">IN PROGRESS</Tag>
                    }
                    else if (docConfirmationData?.confirmedDockets.includes(record.docketNumber)) {
                        docGenStatus = <Tag key={i + 't'} color="green">CONFIRMED</Tag>
                    }
                    else if (docConfirmationData?.yetToBeConfirmedDockets.includes(record.docketNumber)) {
                        docGenStatus = <Tag key={i + 't'} color="cyan">OPEN</Tag>;
                    }
                    return docGenStatus;
                }
            },
        ];
        setColumns(columnsD);
    }

    const confirmDocket = () => {
        const productType = selectedProductType === 'all' ? undefined : selectedProductType;
        const req = new PoProdutNameRequest(user?.userName, user?.orgData?.unitCode, user?.orgData?.companyCode, user?.userId, props.poObj.poSerial, productType, null);
        docketGenerationServices.confirmDockets(req).then((res => {
            if (res.status) {
                AlertMessages.getSuccessMessage(res.internalMessage);
                changeProductType(selectedProductType);

            } else {
                AlertMessages.getErrorMessage(res.internalMessage);
            }
        })).catch(error => {
            AlertMessages.getErrorMessage(error.message)
        });
    }
    const unConfirmDocket = () => {
        const productType = selectedProductType === 'all' ? undefined : selectedProductType;
        const req = new PoProdutNameRequest(user?.userName, user?.orgData?.unitCode, user?.orgData?.companyCode, user?.userId, props.poObj.poSerial, productType, null);
        docketGenerationServices.unConfirmDockets(req).then((res => {
            if (res.status) {
                AlertMessages.getSuccessMessage(res.internalMessage);
                changeProductType(selectedProductType);

            } else {
                AlertMessages.getErrorMessage(res.internalMessage);
            }
        })).catch(error => {
            AlertMessages.getErrorMessage(error.message)
        });
    }

    const closeModel = () => {
        setModalVisible(false);
    };

    const viewDocket = (docGroup: string) => {
        // CORRECT
        const req = new PoDocketGroupRequest(user?.userName, user?.orgData?.unitCode, user?.orgData?.companyCode, user?.userId, props.poObj.poSerial, docGroup, true, true, undefined);
        docketGenerationServices.getDocketGroupDetailedInfo(req).then((res => {
            if (res.status) {
                setDocketPrintData(res.data[0]);
                setModalVisible(true);
            } else {
                AlertMessages.getErrorMessage(res.internalMessage);
            }
        })).catch(error => {
            AlertMessages.getErrorMessage(error.message)
        });
    }
    const printDocket = () => {
        const divContents = document.getElementById('printArea').innerHTML;
        const element = window.open('', '', 'height=700, width=1024');
        element.document.write(divContents);
        getCssFromComponent(document, element.document);
        element.document.close();
        // Loading image lazy
        setTimeout(() => {
            element.print();
            element.close();
        }, 1000);
        setModalVisible(false);
    }


    const renderConfirmButtons = (dockConfirmInfo: DocketsConfirmationListModel) => {
        return dockConfirmInfo.confirmationInProgDockets.length < 1 ? <Space>
            <Button size="middle" onClick={confirmDocket} type="primary" disabled={dockConfirmInfo.yetToBeConfirmedDockets.length < 1}>Confirm</Button>
            <Popconfirm
                title="Un Confirm Dockets"
                description="Are you sure to do this ?"
                onConfirm={unConfirmDocket}
                // onCancel={cancel}
                okText="Yes"
                cancelText="No"
                icon={<QuestionCircleOutlined style={{ color: 'red' }} />}
            >
                <Button size="middle" type="primary" danger disabled={dockConfirmInfo.confirmedDockets.length < 1}>Un Confirm</Button>
            </Popconfirm>
        </Space> : <Button loading size="small" type="primary">Inprogress</Button>
    }

    const getSoItemQty = () => {
        try {
            const soNumbers = docketInfo.map(docket => docket.mo);
            const distinctItemCodes = Array.from(new Set(docketInfo.map(docket => docket.itemCode)));
            const request = new SaleOrderItemRequest(user?.useName, user?.orgData?.unitCode, user?.orgData?.companyCode, user?.userId, soNumbers[0], distinctItemCodes);
            // TODO:CUT
            // packlistService.getSoItemQty(request).then(res => {
            //     if (res.status) {
            //         setFabricCodedata(res.data);
            //     }
            // });

        } catch (error) {
            console.error(error.message);
        }
    };

    const calculateFabricData = (fabricCodeData) => {
        return fabricCodeData.map((fabricItem) => {
            const { itemCode, itemPoQty, itemPackQty, itemGrnQty, itemAllocQty, itemIssueQty } = fabricItem;
            const totalGRNQuantity = parseFloat(itemGrnQty);
            const allocatedNotIssued = parseFloat(itemAllocQty) - parseFloat(itemIssueQty);
            const inWarehouse = parseFloat(itemGrnQty) - parseFloat(itemIssueQty);
            const pendingArrival = parseFloat(itemPoQty) - parseFloat(itemPackQty);
            return {
                itemCode,
                totalGRNQuantity: totalGRNQuantity.toFixed(2),
                allocatedNotIssued: allocatedNotIssued.toFixed(2),
                inWarehouse: inWarehouse.toFixed(2),
                pendingArrival: pendingArrival.toFixed(2),
            };
        });
    };
    const fabricDataResults = calculateFabricData(fabricCodeData);

    return <><Card size="small" title='Docket Confirmation'
        extra={
            <div>
                {docketConfirmationInfo && renderConfirmButtons(docketConfirmationInfo)}
                <Tooltip title="Reload">
                    <Button
                        disabled={!selectedProductType}
                        type='primary'
                        icon={<RedoOutlined style={{ fontSize: '20px' }} />}
                        onClick={() => changeProductType(selectedProductType)}
                        style={{marginLeft: '10px'}}
                    />
                </Tooltip>
            </div>
        }
    >
        <Form style={{ width: '600px' }}>
            <Form.Item
                name="productType"
                label="Product Name"
                rules={[{ required: true, message: 'Select Product Name' }]}
            >
                <Select placeholder="Please Select Product Name" onChange={changeProductType} style={{ width: '250px' }}>
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
        <Table size='small' scroll={{ x: true }} key={stateKey + 1 + 't'} rowKey={(record) => record.docketNumber + 'd'} pagination={false} bordered dataSource={docketInfo} columns={columns} />
    </Card>
        <Modal
            className='print-docket-modal'
            key={'modal' + Date.now()}
            width={'100%'}
            style={{ top: 0 }}
            open={modalVisible}
            title={<React.Fragment>
                <Row>
                    <Col span={12}>
                        Print Docket
                    </Col>
                    <Col span={10} style={{ textAlign: 'right' }}>
                        <Button type='primary' onClick={() => printDocket()}>Print</Button>
                    </Col>
                </Row>
            </React.Fragment>}
            onCancel={closeModel}
            footer={[
                <Button key='back' onClick={closeModel}>
                    Cancel
                </Button>,
            ]}
        >
            <DocketView docketData={docketPrintData} />
        </Modal>
        {docketInfo.length > 0 &&
            <FabricCodeQuantities fabricDataResults={fabricDataResults} />}
    </>
}
export default DocketConfirmationPage;