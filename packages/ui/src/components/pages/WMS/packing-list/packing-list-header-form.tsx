import { Button, Col, DatePicker, Form, Input, Row, Collapse, FormInstance, InputNumber, Card } from 'antd';
import React, { Dispatch, SetStateAction, useState } from 'react';
import { MinusCircleOutlined, PlusCircleOutlined } from '@ant-design/icons';
import PackingListTableForm from './packing-list-table-form';
import { BatchInfoModel, ItemCodeInfoModel, ItemCodes, LotInfoModel, RollInfoModel } from '@xpparel/shared-models';
import moment from 'moment';
import PackListInfoForm from './pack-list-info-form';
import { AlertMessages } from '../../../common';
import { defaultDateTimeFormat } from '../../../common/data-picker/date-picker';

const { Panel } = Collapse;
interface IPackingListHeaderFormProps {
    formRef: FormInstance<any>;
    itemCodes: ItemCodes[];
    previewHandler: (batchInfo: BatchInfoModel[]) => void;
    itemCodeInfoMap: Map<string, ItemCodeInfoModel>;
    nlPoNumberInfoMap: Map<string, Set<string>>;
}
export const PackingListHeaderForm = (props: IPackingListHeaderFormProps) => {
    const { formRef, itemCodes, previewHandler, itemCodeInfoMap, nlPoNumberInfoMap } = props;
    const [initialValues, setInitialValues] = useState<any>({ batchInfo: [{ rollInfo: [''] }] });



    const handleAddFirstLevelField = () => {
        formRef.validateFields().then((values) => {
            const batchInfo = formRef.getFieldValue('batchInfo') || [];
            const newPackingListHeader = [...batchInfo, { rollInfo: [''] }];
            formRef.setFieldsValue({ batchInfo: newPackingListHeader });
        }).catch(err => {
            console.log(err.message)
        })
    };

    const handleRemoveFirstLevelField = (index: number) => {
        const batchInfo = formRef.getFieldValue('batchInfo') || [];
        const newPackingListHeader = batchInfo.filter((_, i) => i !== index);
        formRef.setFieldsValue({ batchInfo: newPackingListHeader });
    };


    const previewButtonHandler = () => {
        formRef.validateFields().then((values) => {
            previewHandler(processFormData(values.batchInfo));
        }).catch(err => {
            console.log(err)
        })

    }

    const processFormData = (batchInfo: any[]) => {
        const batchLotLevelMap: Map<string, Map<string, RollInfoModel[]>> = new Map();
        const batchInfoModalMap: Map<string, BatchInfoModel> = new Map();
        const lotInfoModelDatMap: Map<string, LotInfoModel> = new Map();
        batchInfo.forEach(batch => {
            let batchNo = batch.batchNumber || batch.lotNumber;
            if (!batchLotLevelMap.has(batchNo)) {
                lotInfoModelDatMap.set(batchNo, new LotInfoModel(undefined, batchNo, batch.remarks, [], []))
                batchInfoModalMap.set(batchNo, new BatchInfoModel(undefined, moment(batch.deliveryDate).format(defaultDateTimeFormat), batchNo, undefined, undefined, batch.remarks, []));
                const lotMap = new Map();
                lotMap.set(batch.lotNumber, [...batch.rollInfo]);
                batchLotLevelMap.set(batchNo, lotMap);
            } else {
                if (batchLotLevelMap.get(batchNo).has(batch.lotNumber)) {
                    batchLotLevelMap.get(batchNo).get(batch.lotNumber).push(...batch.rollInfo)
                } else {
                    batchLotLevelMap.get(batchNo).set(batch.lotNumber, [...batch.rollInfo]);
                }
            }
        })
        const batchInfoLocal: BatchInfoModel[] = [];
        for (const [batchNo, batchMap] of batchLotLevelMap.entries()) {
            const batchModel = batchInfoModalMap.get(batchNo);
            for (const [lotNo, rollInfo] of batchMap.entries()) {
                const lotInfo = lotInfoModelDatMap.get(lotNo);
                lotInfo.rollInfo = rollInfo;
                batchModel.lotInfo.push(lotInfo);
            }
            batchInfoLocal.push(batchModel);
        }
        return batchInfoLocal;
    }


    const lotOnChange = (index: number) => {
        const allBatches: { lotNumber: string, remarks: string }[] = formRef.getFieldValue('batchInfo');
        const allLots = new Set(allBatches.filter((rollInfo: { lotNumber: string, remarks: string }, indexLocal) => index != indexLocal).map(rec => rec.lotNumber));
        console.log(allLots);
        const lotNo = formRef.getFieldValue(['batchInfo', index, 'lotNumber']);
        console.log(lotNo)
        if (allLots.has(lotNo)) {
            formRef.setFields([
                {
                    name: ['batchInfo', index, 'lotNumber'],
                    value: '',
                },
            ]);[]
            AlertMessages.getErrorMessage(`Duplicate lot Number Found ${lotNo}`);
        }
    }

    return (
        <>
            {/* <Card title='Create PackList'> */}
            <Form initialValues={initialValues} form={formRef} autoComplete="off" layout="vertical">
                <PackListInfoForm formRef={formRef} />
                <Form.List name="batchInfo">
                    {(fields, { add, remove }) => (
                        <>
                            {fields.map((field, index) => (
                                <Collapse key={field.key} defaultActiveKey={['0']}>
                                    <Panel
                                        header={`Batch - ${index + 1}`}
                                        key={index}
                                        extra={
                                            <div>
                                                {index > 0 && (
                                                    <Button type="primary" danger onClick={() => handleRemoveFirstLevelField(index)} style={{ marginRight: '8px' }}>
                                                        <MinusCircleOutlined />
                                                    </Button>
                                                )}
                                                {index === fields.length - 1 && (
                                                    <Button type="primary" onClick={handleAddFirstLevelField}>
                                                        <PlusCircleOutlined />
                                                    </Button>
                                                )}
                                            </div>
                                        }
                                    >
                                        <Row gutter={[16, 16]} justify="space-between" align="middle">
                                            {/* <Col xs={24} sm={4} md={4} lg={4} xl={4}>
                                                <Form.Item {...field} name={[field.name, 'deliveryDate']} label="Delivery Time"
                                                    rules={[{ required: true, message: 'Select Delivery Time' }]}
                                                >
                                                    <DatePicker showTime={{ format: defaultTimePicker }} format={defaultDateTimeFormat} />
                                                </Form.Item>
                                            </Col> */}
                                            {/* <Col xs={24} sm={4} md={4} lg={4} xl={4}>
                                                <Form.Item {...field} name={[field.name, 'batchNumber']} label="Batch Number"
                                                    rules={[{ required: true, message: 'Enter Batch Number' }]}
                                                >
                                                    <Input placeholder="Batch Number" />
                                                </Form.Item>
                                            </Col> */}
                                            <Col xs={24} sm={24} md={12} lg={4} xl={4}>
                                                <Form.Item {...field} name={[field.name, 'lotNumber']} label="Lot Number"
                                                    rules={[{ required: true, message: 'Enter Lot Number' }]}
                                                >
                                                    <Input placeholder="Enter Lot Number" onBlur={() => lotOnChange(index)} />
                                                </Form.Item>
                                            </Col>
                                            {/* <Col xs={24} sm={4} md={4} lg={4} xl={4}>
                                                <Form.Item {...field} name={[field.name, 'lotQuantity']} label="Lot Quantity"
                                                    rules={[{ required: true, message: 'Enter Lot Quantity' }]}
                                                >
                                                    <InputNumber min={0} placeholder="LOT QUANTITY" />
                                                </Form.Item>
                                            </Col> */}
                                            <Col xs={24} sm={24} md={12} lg={4} xl={4}>
                                                <Form.Item {...field} name={[field.name, 'remarks']} label="Remarks"
                                                    rules={[{ required: false, message: 'Enter Remarks' }]}
                                                >
                                                    <Input.TextArea placeholder="Remarks" />
                                                </Form.Item>
                                            </Col>
                                        </Row>
                                        {/* dynamic table based on number of rows */}

                                        <Form.List name={[field.name, "rollInfo"]}>
                                            {(particulars, { add, remove }) => {
                                                return <PackingListTableForm dataSource={particulars} add={add} remove={remove} formRef={formRef} itemCodes={itemCodes} fieldName={field.name} itemCodeInfoMap={itemCodeInfoMap} nlPoNumberInfoMap={nlPoNumberInfoMap} />
                                            }}
                                        </Form.List>

                                    </Panel>
                                </Collapse>
                            ))}
                            <br />
                        </>
                    )}
                </Form.List>
            </Form>
            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                <Button type='primary' onClick={() => previewButtonHandler()}>
                    Preview
                </Button>
            </div>
            {/* </Card> */}
        </>
    );
};

export default PackingListHeaderForm;
