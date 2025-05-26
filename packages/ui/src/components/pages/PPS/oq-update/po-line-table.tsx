import { OqKeys, OqPercentageModel, OrderTypeEnum, PoLineOqUpdateModel, PoOqTypeQtysModel, PoOqUpdateRequest, PoSerialRequest, PoSizeQtysModel, PoSummaryModel } from '@xpparel/shared-models';
import { Button, Col, Input, InputNumber, Row, Space, Table } from 'antd';
import { useEffect, useState } from 'react';
import { useAppSelector } from '../../../../common';
import { AlertMessages } from '../../../common';
import { IOQUpdatePoLineColumns, OQUpdatePoLineColumns } from './oq-update-columns';
import { PoqService } from '@xpparel/shared-services';
import { ColumnsType } from 'antd/es/table';


interface IPoLinesTableProps {
    po: PoSummaryModel;
    cuttingWastage: number;
    sample: number;
    extraShipment: number;
    isSavedRecord: boolean;
    remarks: string;
    onStepChange: (step: number, selectedRecord: PoSummaryModel) => void
}
export const PoLinesTable = (props: IPoLinesTableProps) => {
    const { po, isSavedRecord, remarks, onStepChange } = props;
    const [selectedSizes, setSelectedSizes] = useState([...po.sizes]);
    const [pOLineOriginalQtyMap, setPOLineOriginalQtyMap] = useState<Map<number, { [key: string]: number; }>>(new Map())
    const [poLineSizeQtySummery, setPoLineSizeQtySummery] = useState<any[]>([]);
    const [updatedRemarks, setRemarks] = useState(remarks);
    const user = useAppSelector((state) => state.user.user.user);

    const poqService = new PoqService();

    useEffect(() => {
        setRemarks(remarks)
        if (!isSavedRecord)
            constructSoLineSizeTableData(null);
        else {
            setPoLinesQtyMap();
        }
    }, [isSavedRecord]);

    const setPoLinesQtyMap = () => {
        const pOLineOriginalQtyMapLocal = new Map(pOLineOriginalQtyMap);
        po.poLines.forEach(poLine => {
            const defaultOqPercentageObject = {};
            Object.values(OrderTypeEnum).filter(rec => rec !== OrderTypeEnum.EXCESS).forEach(rec => {
                defaultOqPercentageObject[rec] = 0;
            });
            //pOLineOriginalQtyMapLocal.set(record.poLineId, defaultOqPercentageObject);
            poLine.oqUpdateSelections.forEach(oq => {
                defaultOqPercentageObject[oq.oqType] = oq.perc;
            })
            pOLineOriginalQtyMapLocal.set(poLine.id, defaultOqPercentageObject);
        });
        setPOLineOriginalQtyMap(pOLineOriginalQtyMapLocal);
        constructSoLineSizeTableData(null, true, pOLineOriginalQtyMapLocal);
    }

    useEffect(() => {
        if (!isSavedRecord)
            constructSoLineSizeTableData(OrderTypeEnum.CUT_WASTAGE);
    }, [props.cuttingWastage]);

    useEffect(() => {
        if (!isSavedRecord)
            constructSoLineSizeTableData(OrderTypeEnum.SAMPLE);
    }, [props.sample]);

    useEffect(() => {
        if (!isSavedRecord)
            constructSoLineSizeTableData(OrderTypeEnum.EXTRA_SHIPMENT);
    }, [props.extraShipment]);





    const handlePercentageChange = (record: any, percentage: number, mainIndex: number) => {
        const pOLineOriginalQtyMapLocal = new Map(pOLineOriginalQtyMap);
        if (!pOLineOriginalQtyMapLocal.has(record.poLineId)) {
            const defaultOqPercentageObject = {};
            Object.values(OrderTypeEnum).filter(rec => rec !== OrderTypeEnum.EXCESS).forEach(rec => {
                defaultOqPercentageObject[rec] = 0;
            })
            defaultOqPercentageObject[record.orderQtyType] = percentage;
            pOLineOriginalQtyMapLocal.set(record.poLineId, defaultOqPercentageObject);
        } else {
            const existing = pOLineOriginalQtyMapLocal.get(record.poLineId);
            existing[record.orderQtyType] = percentage;
            pOLineOriginalQtyMapLocal.set(record.poLineId, existing);
        }
        setPOLineOriginalQtyMap(pOLineOriginalQtyMapLocal);
        const enumLength = Object.values(OrderTypeEnum).filter(rec => rec !== OrderTypeEnum.EXCESS).length;
        setPoLineSizeQtySummery(prev => {
            let minPossibleArrayIndex = mainIndex - enumLength;
            const needToSet = [...prev];
            const sizesDefaultObj = {};
            const originalSizeQty = {};
            const indexOfOriginalQtyElement = needToSet.findIndex((element, index) => index >= minPossibleArrayIndex && element.orderQtyType === OrderTypeEnum.ORIGINAL);
            selectedSizes.forEach(rec => {
                sizesDefaultObj[rec] = 0;
                originalSizeQty[rec] = prev[indexOfOriginalQtyElement][rec];
            });
            const oqTypeSizeQty = getSizeWiseData(needToSet[mainIndex]['orderQtyType'], JSON.parse(JSON.stringify(sizesDefaultObj)), originalSizeQty, pOLineOriginalQtyMapLocal.get(record.poLineId));

            needToSet[mainIndex] = { ...prev[mainIndex], ...oqTypeSizeQty, percentage };

            const indexOfElement = needToSet.findIndex((element, index) => index >= mainIndex && element.orderQtyType === 'Total');
            const totalSizeQty = {}
            selectedSizes.forEach(rec => {
                totalSizeQty[rec] = prev[indexOfElement][rec] - prev[mainIndex][rec] + oqTypeSizeQty[rec]
            });
            needToSet[indexOfElement] = { ...prev[indexOfElement], ...totalSizeQty };
            return needToSet;
        });
    }


    const sizesOnchangeHandler = (size: string, sizeQty: number, mainIndex: number) => {
        setPoLineSizeQtySummery(prev => {
            const needToSet = [...prev];
            needToSet[mainIndex] = { ...prev[mainIndex], [size]: sizeQty };
            const indexOfElement = needToSet.findIndex((element, index) => index >= mainIndex && element.orderQtyType === 'Total');
            needToSet[indexOfElement] = { ...prev[indexOfElement], [size]: prev[indexOfElement][size] - prev[mainIndex][size] + sizeQty };
            return needToSet;
        });
    }

    const getSizeWiseColumns = () => {
        return [...OQUpdatePoLineColumns,
        {
            title: 'Percentage', dataIndex: 'percentage', key: 'percentage', align: 'center', render: (text, record, index) => {
                return <div style={{ textAlign: 'end' }}>{(record.orderQtyType === 'Total') ? <></> : record.orderQtyType === OrderTypeEnum.ORIGINAL ? <>{text}</> : <InputNumber style={{ margin: '-5px' }} disabled={isSavedRecord} min={0} value={text} onChange={(value) => handlePercentageChange(record, value, index)}
                    formatter={(value) => (value !== undefined ? String(value).replace(/[^0-9]/g, '') : '')}
                    parser={(value) => value ? parseInt(value, 10) : 0}
                />}</div>
            }
        },
        ...selectedSizes.map(rec => {
            return {
                title: rec?.toLocaleUpperCase(), dataIndex: rec, key: rec, isDefaultSelect: true, align: 'center',
                render: (text, record, index) => {
                    return <div style={{ textAlign: 'end' }}>{(record.orderQtyType === 'Total') ? <b>{Number(text)}</b> : record.orderQtyType === OrderTypeEnum.ORIGINAL ? <>{text}</> : <><InputNumber style={{ margin: '-5px' }} disabled={isSavedRecord} min={0} value={text} onChange={(value) => sizesOnchangeHandler(rec, value, index)}
                        formatter={(value) => (value !== undefined ? String(value).replace(/[^0-9]/g, '') : '')}
                        parser={(value) => value ? parseInt(value, 10) : 0}
                    /></>}</div>
                }
            }
        })]
    };

    const getSizeWiseData = (oqType: OrderTypeEnum, sizesDefaultObj: any, originalSizeQty: any, existing: {
        [key: string]: number;
    }) => {
        if (oqType === OrderTypeEnum.ORIGINAL) {
            Object.keys(originalSizeQty).forEach(rec => {
                sizesDefaultObj[rec] = originalSizeQty[rec]
            })
        } else {
            const percentage = existing[oqType] ? existing[oqType] : 0;
            Object.keys(originalSizeQty).forEach(rec => {
                sizesDefaultObj[rec] = Math.ceil(originalSizeQty[rec] * percentage / 100);
            })
        }
        return sizesDefaultObj;
    }

    const constructSoLineSizeTableData = (oqType: OrderTypeEnum, isChildOnChange: boolean = false, pOLineOriginalQtyMapArgument?: Map<number, {
        [key: string]: number;
    }>) => {
        const sizesDefaultObj = {};
        selectedSizes.forEach(rec => {
            sizesDefaultObj[rec] = 0;
        });
        const pOLineOriginalQtyMapLocal = pOLineOriginalQtyMapArgument ? pOLineOriginalQtyMapArgument : new Map(pOLineOriginalQtyMap);
        const dataSource = po.poLines.reduce((acc, poLine, index) => {
            const lineObject = {
                key: index,
                poLineId: poLine.id,
                soLineId: poLine.orderLineId,
                orderLineNo: poLine.orderLineNo,
                productType: poLine.productType,
                productName: poLine.productName,
            }
            if (!pOLineOriginalQtyMapLocal.has(poLine.id)) {
                const defaultOqPercentageObject = {};
                Object.values(OrderTypeEnum).filter(rec => rec !== OrderTypeEnum.EXCESS).forEach(rec => {
                    defaultOqPercentageObject[rec] = 0;
                })
                pOLineOriginalQtyMapLocal.set(poLine.id, defaultOqPercentageObject);
            } else {
                if (!isChildOnChange) {
                    const existing = pOLineOriginalQtyMapLocal.get(poLine.id);
                    if (oqType === OrderTypeEnum.CUT_WASTAGE) {
                        existing[OrderTypeEnum.CUT_WASTAGE] = props.cuttingWastage;
                    } else if (oqType === OrderTypeEnum.EXTRA_SHIPMENT) {
                        existing[OrderTypeEnum.EXTRA_SHIPMENT] = props.extraShipment;
                    } else if (oqType === OrderTypeEnum.SAMPLE) {
                        existing[OrderTypeEnum.SAMPLE] = props.sample;
                    }
                    pOLineOriginalQtyMapLocal.set(poLine.id, existing);
                }
            }
            let enumLength = Object.values(OrderTypeEnum).filter(rec => rec !== OrderTypeEnum.EXCESS).length;
            const originalSizeQty = {};
            const sizeWiseTotal = { ...JSON.parse(JSON.stringify(sizesDefaultObj)) };
            poLine.subLines.forEach(rec => {
                if (rec.oqType === OrderTypeEnum.ORIGINAL) {
                    originalSizeQty[rec.size] = rec.quantity;
                    sizeWiseTotal[rec.size] = rec.quantity;
                }
            });
            const subRows: any = Object.values(OrderTypeEnum).filter(rec => rec !== OrderTypeEnum.EXCESS).map((rec, enumIndex) => {
                const oqTypeSizeQty = getSizeWiseData(rec, JSON.parse(JSON.stringify(sizesDefaultObj)), originalSizeQty, pOLineOriginalQtyMapLocal.get(poLine.id));
                if (rec !== OrderTypeEnum.ORIGINAL) {
                    Object.keys(oqTypeSizeQty).forEach(rec => {
                        sizeWiseTotal[rec] += Number(oqTypeSizeQty[rec]);
                    })
                }
                return {
                    ...lineObject,
                    key: index * (enumLength + 1) + enumIndex, orderQtyType: rec,
                    percentage: pOLineOriginalQtyMapLocal.get(poLine.id)[rec],
                    ...oqTypeSizeQty
                }
            });
            subRows.push(
                {
                    ...lineObject,
                    key: index * (enumLength + 1) + Object.values(OrderTypeEnum).filter(rec => rec !== OrderTypeEnum.EXCESS).length,
                    orderQtyType: 'Total',
                    ...sizeWiseTotal
                }
            )


            acc.push({
                ...lineObject,
                rowSpan: subRows.length,
                ...subRows[0],
                percentage: 100,
            });

            return acc.concat(subRows.slice(1));
        }, []);
        setPOLineOriginalQtyMap(pOLineOriginalQtyMapLocal);
        setPoLineSizeQtySummery(dataSource);
    }

    const handleSave = () => {
        const req = new PoOqUpdateRequest(user?.userName, user?.orgData?.unitCode, user?.orgData?.companyCode, user?.userId, po.poId, po.poSerial, updatedRemarks, [], []);
        req.oqLevelSelections.push(new OqPercentageModel(OrderTypeEnum.CUT_WASTAGE, props.cuttingWastage));
        req.oqLevelSelections.push(new OqPercentageModel(OrderTypeEnum.EXTRA_SHIPMENT, props.extraShipment));
        req.oqLevelSelections.push(new OqPercentageModel(OrderTypeEnum.SAMPLE, props.sample));

        const chunkSize = Object.values(OrderTypeEnum).filter(rec => rec !== OrderTypeEnum.EXCESS).length + 1;
        const groupedData = Array.from({ length: Math.ceil(poLineSizeQtySummery.length / chunkSize) }, (_, index) =>
            poLineSizeQtySummery.slice(index * chunkSize, (index + 1) * chunkSize)
        );

        groupedData.forEach(subArray => {
            const poLineOqUpdateModelRecord = new PoLineOqUpdateModel(OqKeys.SO_LINE, undefined, undefined, subArray[0].
                soLineId, undefined, undefined, []);
            let originalQtyModel = null;
            subArray.forEach(qtyLevelData => {
                if (qtyLevelData.orderQtyType === OrderTypeEnum.ORIGINAL) {
                    originalQtyModel = qtyLevelData;
                }
                if (!(qtyLevelData.orderQtyType === 'Total' || qtyLevelData.orderQtyType === OrderTypeEnum.ORIGINAL)) {
                    const poOqTypeQtysModelRecord = new PoOqTypeQtysModel(new OqPercentageModel(qtyLevelData.orderQtyType, qtyLevelData.percentage), []);
                    selectedSizes.forEach(rec => {
                        if (qtyLevelData[rec]) {
                            poOqTypeQtysModelRecord.sizeQtys.push(new PoSizeQtysModel(rec, originalQtyModel[rec], qtyLevelData[rec]));
                        }
                    });
                    poLineOqUpdateModelRecord.poLineQtys.push(poOqTypeQtysModelRecord);
                }
            });
            req.linesOqUpdate.push(poLineOqUpdateModelRecord);
        });
        poqService.poAdditionalQtyUpdate(req)
            .then((res) => {
                if (res.status) {
                    AlertMessages.getSuccessMessage(res.internalMessage);
                    onStepChange(2, po);
                } else {
                    AlertMessages.getErrorMessage(res.internalMessage);
                }
            })
            .catch((err) => {
                AlertMessages.getErrorMessage(err.message);
            });
    };

    const handleDelete = () => {
        const reqModel: PoSerialRequest = new PoSerialRequest(user?.userName, user?.orgData?.unitCode, user?.orgData?.companyCode, user?.userId, po.poSerial, po.poId, false, false);
        poqService.deleteAdditionalQtyUpdate(reqModel)
            .then((res) => {
                if (res.status) {
                    AlertMessages.getSuccessMessage(res.internalMessage);
                    onStepChange(0, po);
                } else {
                    AlertMessages.getErrorMessage(res.internalMessage);
                }
            })
            .catch((err) => {
                AlertMessages.getErrorMessage(err.message);
            });
    };
    return <>
        <Table size='small' columns={getSizeWiseColumns() as ColumnsType<IOQUpdatePoLineColumns>} dataSource={poLineSizeQtySummery} bordered pagination={false} scroll={{ x: 1500 }}  />
        <Row justify='space-around' style={{ marginTop: '15px' }}>
            <Col span={6}>
                <div style={{ display: 'flex', alignItems: 'center' }}>
                    <label style={{ marginRight: '8px', whiteSpace: 'nowrap' }}>Remarks:</label>
                    <Input.TextArea
                        value={updatedRemarks}
                        disabled={isSavedRecord}
                        onChange={(e) => setRemarks(e.target.value)}
                        placeholder="only 60 characters are accepted"
                        style={{ width: '100%' }}
                        maxLength={60}
                    />
                </div>
            </Col>
            <Col>
                <Space>
                    <Button type="primary" onClick={handleSave} disabled={isSavedRecord}>
                        Save
                    </Button>

                    {/* <Button type="primary" danger onClick={handleDelete} disabled={!isSavedRecord}>
                        Delete
                    </Button> */}
                </Space>
            </Col>
        </Row>
    </>;
};

export default PoLinesTable;
