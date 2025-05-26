import { DocGenStatusEnum, MarkerProdNameItemCodeModel, OpCategoryEnum, OpFormEnum, PoProdTypeAndFabModel, PoProdutNameRequest, PoRatioIdMarkerIdRequest, PoRatioIdRequest, PoRatioModel, PoSerialRequest, PoSummaryModel, SaleOrderItemRequest } from "@xpparel/shared-models";
import { DocketGenerationServices, OpVersionService, PackingListService, PoMaterialService, PoRatioService } from "@xpparel/shared-services";
import { useAppSelector } from "packages/ui/src/common";
import { useEffect, useState } from "react";
import { AlertMessages } from "../../../common";
import { Button, Card, Col, Drawer, Form, Input, Modal, Popconfirm, Row, Select, Tag, Tooltip } from "antd";
import Table, { ColumnsType } from "antd/es/table";
import { QuestionCircleOutlined, RedoOutlined } from "@ant-design/icons";
import EditRatioMarker from "./edit-ratio.marker";
import FabricCodeQuantities from "../../OMS/order-manipulation/fabric-code-quantites";
interface IProps {
    poObj: PoSummaryModel;
    onStepChange: (step: number, po: PoSummaryModel) => void
}
interface ITblData {
    rName: string;
    rDesc: string;
    productName: string;
    fgColor: string;
    fabric: string;
    plies: number;
    maxPlies: number;
    expectedDocs: number;
    docGenStatus: DocGenStatusEnum;
    remarks: string;
    totalQty: number;
    marker: string;
    markerVersion: string;
    markerId: number;
    docGenOrder: number;
    ratioId: number;
    [key: string]: any;
    components: string;
}
interface IRowSpanIndex {
    start: number;
    end: number;
}

interface IRatio {
    ratioId: number;
    ratioCode: string;
    ratioDesc: string;
    iCodes: MarkerProdNameItemCodeModel[],
    markerId: number
}
// console.log(mockData);

const DocketGenerationPage = (props: IProps) => {
    useEffect(() => {
        if (props.poObj) {
            getPoProdTypeAndFabrics(props.poObj.poSerial);
            getPoOpVersions(props.poObj.poSerial);
        }
    }, [])
    const user = useAppSelector((state) => state.user.user.user);
    const [poProducts, setPoProducts] = useState<PoProdTypeAndFabModel[]>([]);
    const [selectedProductType, setSelectedProductType] = useState<string>(undefined);
    const [poRatios, setPoRatios] = useState<PoRatioModel[]>([]);
    const [ratioTblData, setRatioTblData] = useState<ITblData[]>([]);
    const [ratioColumns, setRatioColumns] = useState<ColumnsType<ITblData>>([]);
    const [stateKey, setStateKey] = useState<number>(0);
    const [selectedRatios, setSelectedRatios] = useState<IRatio>(undefined);
    const [openForm, setOpenForm] = useState<boolean>(false);
    const [selectedMarker, setSelectedMarker] = useState<number>(undefined);
    const [embComps, setEmbComps] = useState<Map<string, Set<string>>>(new Map<string, Set<string>>());
    const [loading, setLoading] = useState<boolean>(false);
    const poRatioService = new PoRatioService();
    const poMaterialService = new PoMaterialService();
    const poOpVersionService = new OpVersionService();
    const docketGenerationServices = new DocketGenerationServices();
    const { Option } = Select;
    const packlistService = new PackingListService()
    const [fabricCodeData, setFabricCodedata] = useState([])
    const [isEditModalVisible, setIsEditModalVisible] = useState(false);
    const [sizeRatios, setSizeRatios] = useState<Record<string, number>>({});
    const [sizesSet, setSizesSet] = useState<Set<string>>(new Set()); // State for sizesSet
    const [currentEditRecord, setCurrentEditRecord] = useState<ITblData | null>(null);
    useEffect(() => {
        if (selectedProductType && poRatios.length > 0) {
            getSoItemQty();
        }
    }, [poRatios]);

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
        setSelectedProductType(preState => productTypeVal);
        getAllRatios(productTypeVal);
    }
    const getAllRatios = (productTypeVal?: string) => {
        setLoading(true);
        const cmgProductType = productTypeVal ? productTypeVal : selectedProductType;
        const productType = cmgProductType === 'all' ? undefined : productTypeVal;
        const req = new PoProdutNameRequest(user?.userName, user?.orgData?.unitCode, user?.orgData?.companyCode, user?.userId, props.poObj.poSerial, productType, null);
        poRatioService.getAllRatiosForPo(req).then((res => {
            if (res.status) {
                setPoRatios(res.data);
                constructTblData(res.data, cmgProductType);
            } else {
                setPoRatios([]);
                constructTblData([], undefined);
                AlertMessages.getErrorMessage(res.internalMessage);
            }
            setLoading(false);
        })).catch(error => {
            setLoading(false);
            setPoRatios([]);
            constructTblData([], undefined);
            AlertMessages.getErrorMessage(error.message)
        });
    }
    const constructTblData = (ratioDataPar: PoRatioModel[], productType: string) => {
        const sizeSet = new Set<string>();
        const tblDataArray: ITblData[] = [];
        ratioDataPar.forEach(ratioHeaderObj => { // Main Object
            ratioHeaderObj.rLines.forEach(rObj => { // Ratio Lines
                const sizeRatioObj = new Object();
                let totalQty = 0;
                rObj.sizeRatios.forEach(sizeRatio => { // Sizes
                    sizeSet.add(sizeRatio.size);
                    const qty = Number(ratioHeaderObj.plies) * Number(sizeRatio.ratio);
                    sizeRatioObj[sizeRatio.size + 'QUANTITY'] = qty;// DOubt ratioObj.plies or rObj.ratio plies
                    sizeRatioObj[sizeRatio.size + 'RATIO'] = Number(sizeRatio.ratio);
                    totalQty += qty;
                });
                const markerLength = Number(ratioHeaderObj?.markerInfo?.mLength || 0);
                let yy = totalQty > 0 ? (ratioHeaderObj.plies * markerLength) / totalQty : 0;

                rObj.ratioFabric.forEach(fabObj => {
                    const wastage = Number(fabObj.wastage || 0);
                    const actualYy = yy * wastage;
                    const tblRow: ITblData = {
                        ratioId: ratioHeaderObj.id,
                        rDesc: ratioHeaderObj.rDesc,
                        docGenOrder: ratioHeaderObj.docGenOrder,
                        docGenStatus: ratioHeaderObj.docGenStatus,
                        expectedDocs: Math.ceil(Number(ratioHeaderObj.plies) / Number(fabObj.maxPlies)),
                        fabric: fabObj.iCode,
                        marker: ratioHeaderObj?.markerInfo?.mName,
                        markerVersion: ratioHeaderObj?.markerInfo?.mVersion,
                        markerId: ratioHeaderObj?.markerInfo?.id,
                        maxPlies: fabObj.maxPlies,
                        plies: ratioHeaderObj.plies,
                        productName: rObj.productName,
                        fgColor: rObj.color,
                        remarks: '',
                        rName: ratioHeaderObj.rName,
                        totalQty: totalQty,
                        components: rObj.components?.toString(),
                        yy: actualYy.toFixed(2),
                        ...sizeRatioObj
                    }
                    tblDataArray.push(tblRow)
                    // tblDataArray.push({ ...tblRow, ...sizeRatioObj })
                })
            })
        }); // end main obj

        // tblDataArray.sort((a, b) => (a.rName + a.productName + a.fabric > b.rName + b.productName + b.fabric) ? 1 : ((b.rName + b.productName + b.fabric > a.rName + a.productName + a.fabric) ? -1 : 0));
        setSizesSet(sizeSet);
        setRatioTblData(tblDataArray);
        constructColumns(tblDataArray, sizeSet, productType);

    }
    const handleEditClick = (record) => {
        const newSizeRatios: { [key: string]: number } = {};
        sizesSet.forEach(size => {
            newSizeRatios[size] = record[`${size}RATIO`] || 0;
        });
        setSizeRatios(newSizeRatios);
        setCurrentEditRecord(record);
        setIsEditModalVisible(true);
    };

    const handleSave = () => {
        const poRatio = poRatios.find(ratio => ratio.id === currentEditRecord.ratioId);
        if (!poRatio) {
            console.error("PoRatio with specified ratioId not found");
            return;
        }
        const poRatioLine = poRatio.rLines[0];
        if (!poRatioLine) {
            console.error("No rLines found in the specified PoRatioModel");
            return;
        }
        const request = Object.entries(sizeRatios).map(([poRatioSize, poRatioValue]) => ({
            poRatioId: poRatio.id, poRatioLinesId: poRatioLine.id, poRatioSize, poRatio: poRatioValue, username: user?.userName, unitCode: user?.orgData?.unitCode, companyCode: user?.orgData?.companyCode, userId: user?.userId
        }));
        poRatioService.updateRatioSizes(request).then(res => {
            if (res.status) {
                setIsEditModalVisible(false);
                changeProductType(selectedProductType);
            } else {
                console.error("Failed to update ratios");
            }
        })
            .catch(error => {
                console.error("Error updating ratios:", error);
            });
    };



    const constructColumns = (tblDataArray: ITblData[], sizesSet: Set<string>, productType: string) => {
        const rowSpanMap: Map<string, IRowSpanIndex> = new Map<string, IRowSpanIndex>();
        tblDataArray.forEach((rowObj, index) => {
            const rName = rowObj.rName;
            rowSpanMap.set(rName, rowSpanMap.has(rName) ? { start: rowSpanMap.get(rName).start, end: rowSpanMap.get(rName).end + 1 } : { start: index, end: 1 });
        })
        const mainColumns: ColumnsType<ITblData> = [
            {
                title: 'Ratio Code',
                dataIndex: 'rName',
                align: 'center',
                width: 100,
                fixed: 'left',
                onCell: (record, index) => {
                    if (index === rowSpanMap.get(record.rName).start) {
                        return { rowSpan: rowSpanMap.get(record.rName).end };
                    } else {
                        return { rowSpan: 0 };
                    }
                }
            },
            {
                title: 'Ratio Description',
                dataIndex: 'rDesc',
                align: 'center',
                width: 100,
                fixed: 'left',
                onCell: (record, index) => {
                    if (index === rowSpanMap.get(record.rName).start) {
                        return { rowSpan: rowSpanMap.get(record.rName).end };
                    } else {
                        return { rowSpan: 0 };
                    }
                }
            },
            {
                title: 'Product Name',
                dataIndex: 'productName',
                align: 'center',
                width: 150,
                fixed: 'left',
                // render: (productTypes) => productTypes,
            },
            {
                title: 'FG Color',
                dataIndex: 'fgColor',
                align: 'center',
                width: 150,
                fixed: 'left',
                // render: (productTypes) => productTypes,
            },
            {
                title: 'Components',
                dataIndex: 'components',
                align: 'left',
                fixed: 'left',
                render: (comps: string, record: ITblData) => {
                    const compsArr = comps?.split(',');
                    return compsArr?.map(c => {
                        // return <Tag color="blue">{c}</Tag>
                        return embComps?.get(record.productName)?.has(c) ? <Tag color="orange">{c}</Tag> : <Tag color="blue">{c}</Tag>
                    });
                },
            },
            {
                title: 'Fabric Code',
                dataIndex: 'fabric',
                align: 'center',
                fixed: 'left',
                render: (fabric, record) => {
                    return (
                        <div>
                            <div>{fabric}</div>
                            <hr />
                            <div>{record['yy'] ? record['yy'] : '-'}</div>
                        </div>
                    );
                },
            },
            {
                title: 'Ratio Plies',
                dataIndex: 'plies',
                align: 'center',
            },
            {
                title: 'Max Plies',
                dataIndex: 'maxPlies',
                align: 'center',
            },
            {
                title: 'Expected dockets',
                dataIndex: 'expectedDocs',
                align: 'center',
            }
        ];
        sizesSet.forEach(size => (mainColumns.push({
            title: size,
            dataIndex: size + 'RATIO',
            key: size,
            align: 'center',
            render: (sizeRatio: number, record: ITblData) => {
                return <><span style={{ color: 'red' }}><b>{sizeRatio}</b></span><hr />{Number(record.plies) * Number(sizeRatio)}</>;
            },
        })
        ));

        const extraColumns: ColumnsType<ITblData> = [
            {
                title: 'Total Qty',
                dataIndex: 'totalQty',
                align: 'center'
            },
            {
                title: 'Delete Or Edit Ratio',
                dataIndex: 'ratioId',
                align: 'center',
                onCell: (record, index) => {
                    if (index === rowSpanMap.get(record.rName).start) {
                        return { rowSpan: rowSpanMap.get(record.rName).end };
                    } else {
                        return { rowSpan: 0 };
                    }
                },
                render: (ratioId: number, record) => {
                    return <><Popconfirm
                        title="Delete Ratio"
                        description="Are you sure to delete this ?"
                        onConfirm={() => deleteRatio(record.ratioId, productType)}
                        // onCancel={cancel}
                        okText="Yes"
                        cancelText="No"
                        icon={<QuestionCircleOutlined style={{ color: 'red' }} />}
                    >
                        <Button type="primary" danger disabled={record.docGenStatus != DocGenStatusEnum.OPEN} >Delete Ratio</Button>
                    </Popconfirm>
                        <Button
                            type="primary"
                            style={{ marginTop: '3px' }}
                            disabled={record.docGenStatus !== DocGenStatusEnum.OPEN}
                            onClick={() => handleEditClick(record)}
                        >
                            Edit Ratio
                        </Button></>
                }
            },
            {
                title: 'Marker Version',
                align: 'center',
                dataIndex: 'markerVersion',
                onCell: (record, index) => {
                    if (index === rowSpanMap.get(record.rName).start) {
                        return { rowSpan: rowSpanMap.get(record.rName).end };
                    } else {
                        return { rowSpan: 0 };
                    }
                },
            },
            {
                title: 'Edit Marker',
                dataIndex: 'ratioId',
                align: 'center',
                render: (ratioId: number, record: ITblData) => {
                    const markerDisabled = record.docGenStatus == DocGenStatusEnum.COMPLETED;
                    return <Button disabled={markerDisabled} type="primary" onClick={() => openMarkerForm(ratioId, tblDataArray)} >Edit Marker</Button>
                },
                onCell: (record, index) => {
                    if (index === rowSpanMap.get(record.rName).start) {
                        return { rowSpan: rowSpanMap.get(record.rName).end };
                    } else {
                        return { rowSpan: 0 };
                    }
                }
            },
            {
                title: 'Action',
                dataIndex: 'docGenStatus',
                align: 'center',
                render: (docGenStatus: DocGenStatusEnum, record: ITblData) => {
                    switch (docGenStatus) {
                        case DocGenStatusEnum.OPEN: return <Popconfirm
                            title="Generate Dockets"
                            description="Are you sure to do this ?"
                            onConfirm={() => generateDoc(record.ratioId, productType)}
                            // onCancel={cancel}
                            okText="Yes"
                            cancelText="No"
                            icon={<QuestionCircleOutlined style={{ color: 'orange' }} />}
                        ><Button type="primary" ghost>Generate Docket</Button>
                        </Popconfirm>
                        case DocGenStatusEnum.INPROGRESS: return <Button type="primary" loading>Inprogress</Button>
                        case DocGenStatusEnum.COMPLETED: return <Popconfirm
                            title="Delete Dockets"
                            description="Are you sure to delete this ?"
                            onConfirm={() => deleteDoc(record.ratioId, productType)}
                            // onCancel={cancel}
                            okText="Yes"
                            cancelText="No"
                            icon={<QuestionCircleOutlined style={{ color: 'red' }} />}
                        ><Button type="primary" danger>Delete</Button>
                        </Popconfirm>
                        default: return <></>
                    }


                },
                onCell: (record, index) => {
                    if (index === rowSpanMap.get(record.rName).start) {
                        return { rowSpan: rowSpanMap.get(record.rName).end };
                    } else {
                        return { rowSpan: 0 };
                    }
                }
            },
            {
                title: 'Doc Gen Order',
                align: 'center',
                dataIndex: 'docGenOrder'
            },
        ]

        setRatioColumns([...mainColumns, ...extraColumns]);
    }
    const openMarkerForm = (ratioId: number, tblDataArray: ITblData[]) => {
        const selectedRatiosData = tblDataArray.filter(e => e.ratioId == ratioId);
        const iCodes: MarkerProdNameItemCodeModel[] = selectedRatiosData.map(rO => {
            return { itemCode: rO.fabric, productName: rO.productName, fgColor: rO.fgColor } as MarkerProdNameItemCodeModel;
        });
        const ratioObj: IRatio = {
            iCodes: iCodes,
            ratioId: ratioId,
            ratioCode: tblDataArray[0].rName,
            ratioDesc: tblDataArray[0].rDesc,
            markerId: selectedRatiosData[0].markerId
        }
        setSelectedRatios(ratioObj);
        setOpenForm(true);
    }
    const onClose = () => {
        setOpenForm(false);
    }

    // can't access state inside this function
    const deleteRatio = (ratioId: number, productType: string) => {
        const req = new PoRatioIdRequest(user?.userName, user?.orgData?.unitCode, user?.orgData?.companyCode, user?.userId, props.poObj.poSerial, ratioId);
        req.poSerial = props.poObj.poSerial;
        req.poRatioId = ratioId;
        poRatioService.deletePoRatio(req).then((res => {
            if (res.status) {
                AlertMessages.getSuccessMessage(res.internalMessage);
                getAllRatios(productType);
            } else {
                AlertMessages.getErrorMessage(res.internalMessage);
            }
        })).catch(error => {
            AlertMessages.getErrorMessage(error.message)
        });
    }

    const generateDoc = (ratioId: number, productType: string) => {
        const req = new PoRatioIdRequest(user?.userName, user?.orgData?.unitCode, user?.orgData?.companyCode, user?.userId, props.poObj.poSerial, ratioId);
        req.poSerial = props.poObj.poSerial;
        req.poRatioId = ratioId;
        docketGenerationServices.generateDockets(req).then((res => {
            if (res.status) {
                AlertMessages.getSuccessMessage(res.internalMessage);
                getAllRatios(productType)

            } else {
                AlertMessages.getErrorMessage(res.internalMessage);
            }
        })).catch(error => {
            AlertMessages.getErrorMessage(error.message)
        });
    }
    const deleteDoc = (ratioId: number, productType: string) => {
        const req = new PoRatioIdRequest(user?.userName, user?.orgData?.unitCode, user?.orgData?.companyCode, user?.userId, props.poObj.poSerial, ratioId);
        req.poSerial = props.poObj.poSerial;
        req.poRatioId = ratioId;
        docketGenerationServices.deleteDockets(req).then((res => {
            if (res.status) {
                AlertMessages.getSuccessMessage(res.internalMessage);
                getAllRatios(productType);
            } else {
                AlertMessages.getErrorMessage(res.internalMessage);
            }
        })).catch(error => {
            AlertMessages.getErrorMessage(error.message)
        });
    }
    const changeSelectedMarker = (markerId: number) => {
        setSelectedMarker(markerId)
    }
    const updateMarker = () => {
        const { ratioId } = selectedRatios;

        const req = new PoRatioIdMarkerIdRequest(user?.userName, user?.orgData?.unitCode, user?.orgData?.companyCode, user?.userId, props.poObj.poSerial, ratioId, selectedMarker);
        poRatioService.setMarkerVersionForRatio(req).then((res => {
            if (res.status) {
                getAllRatios(selectedProductType);
                onClose();
                AlertMessages.getSuccessMessage(res.internalMessage);

            } else {
                AlertMessages.getErrorMessage(res.internalMessage);
            }
        })).catch(error => {
            AlertMessages.getErrorMessage(error.message)
        });
    }

    const getSoItemQty = () => {
        try {
            const distinctICodes = Array.from(new Set(
                poRatios.flatMap(poRatio =>
                    poRatio.rLines.flatMap(rLine =>
                        rLine.ratioFabric.map(fabric => fabric.iCode)
                    )
                )
            ));
            const request = new SaleOrderItemRequest(user?.useName, user?.orgData?.unitCode, user?.orgData?.companyCode, user?.userId, props.poObj.orderRefNo, distinctICodes);
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

    const ratioSizeColumns = Array.from(sizesSet).map(size => ({
        title: size,
        dataIndex: size,
        key: size,
        render: (value) => (
            <Input
                type="number"
                value={sizeRatios[size]}
                onChange={(e) =>
                    setSizeRatios({ ...sizeRatios, [size]: Number(e.target.value) })
                }
            />
        )
    }));

    const ratioDataSource = [
        {
            key: '1',
            ...sizeRatios,
        },
    ];
    return <Card size="small" title='Ratio Docket Generation' extra={<Tooltip title="Reload"><Button disabled={!selectedProductType} type='primary' icon={<RedoOutlined style={{ fontSize: '20px' }} />} onClick={() => changeProductType(selectedProductType)} /></Tooltip>}>
        <Form style={{ width: '600px' }}        >
            <Form.Item
                name="productType"
                label="Product Name"
                rules={[{ required: true, message: 'Please Product Name' }]}
            >
                <Select placeholder="Please Product Name" onChange={changeProductType} style={{ width: '250px' }}>
                    <Option value="all">Select All</Option>
                    {[...new Set(poProducts.map(bO => bO.productName))].map(productName => (
                        <Option key={productName} value={productName}>{productName}</Option>
                    ))}
                    {/* {
                        poProducts.map(productObj => <Option key={productObj.productName} value={productObj.productName}>{productObj.productName}</Option>)
                    } */}
                </Select>
            </Form.Item>
        </Form>
        {poRatios.length > 0 &&
            <Table size='small' loading={loading} scroll={{ x: true }} key={stateKey + 1 + 't'} rowKey={(record: ITblData) => record.rName + record.productName + record.fabric + 'k'} pagination={false} bordered dataSource={ratioTblData} columns={ratioColumns} />
        }

        <Modal
            title={`Ratio Name : ${selectedRatios ? selectedRatios.ratioCode : ''}`}
            style={{ top: 10, width: '100%' }}
            open={openForm}
            onOk={onClose}
            width={'100%'}
            onCancel={onClose}
            footer={[
                <Button key="cancle" onClick={onClose}>
                    Cancel
                </Button>,
                <Button key="submit" type="primary" onClick={updateMarker}>
                    Update
                </Button>,
            ]}
        >

            <EditRatioMarker key={selectedRatios ? selectedRatios.ratioId : 0 + 'r'} selectMarker={changeSelectedMarker} poSerialNo={props.poObj.poSerial} ratio={selectedRatios} />
        </Modal>
        <Modal
            title={<span style={{ display: 'flex', justifyContent: 'center' }}>Edit Size Ratios</span>}
            visible={isEditModalVisible}
            width={800}
            onCancel={() => setIsEditModalVisible(false)}
            footer={[
                <Button key="cancel" onClick={() => setIsEditModalVisible(false)}>
                    Cancel
                </Button>,
                <Button key="submit" type="primary" onClick={handleSave}>
                    Save
                </Button>
            ]}
        >
            <Table
                dataSource={ratioDataSource}
                columns={ratioSizeColumns}
                pagination={false}
                bordered
                rowClassName={(record) => (record.key === 'previousRow' ? 'previous-row' : 'input-row')}
            />
        </Modal>
        {poRatios.length > 0 &&
            <FabricCodeQuantities fabricDataResults={fabricDataResults} />}
    </Card>;
}
export default DocketGenerationPage;