import { MinusCircleOutlined, PlusCircleOutlined } from '@ant-design/icons';
import { FabricUOM, ItemCodeInfoModel, ItemCodes, PhItemCategoryEnum, PhItemLinesObjectTypeEnum, RollInfoModel, UOMEnum, containerConversionToPound, conversionToCentimeter, conversionToMeter } from '@xpparel/shared-models';
import { Button, Col, Form, FormInstance, Input, InputNumber, Row, Select, Table } from 'antd';
import { useState } from 'react';
import { AlertMessages } from '../../../common';

const { Option } = Select;
interface IPackingListTableFormProps {
    dataSource: any[]
    formRef: FormInstance<any>;
    itemCodes: ItemCodes[];
    fieldName: number;
    add: (defaultValue?: any, insertIndex?: number) => void;
    remove: (index: number | number[]) => void;
    itemCodeInfoMap: Map<string, ItemCodeInfoModel>;
    nlPoNumberInfoMap: Map<string, Set<string>>;
}
export const PackingListTableForm = (props: IPackingListTableFormProps) => {
    const { formRef, itemCodes, fieldName, dataSource, add, remove, itemCodeInfoMap, nlPoNumberInfoMap } = props;
    const [dummyRefresh, setDummyRefresh] = useState(0)

    const handleNumOfRowsChange = (value: number | null) => {
        const currentRows = dataSource.length;
        const newRows = value ? (value > currentRows ? value : value <= 0 ? 0 : value) : 0;
        if (newRows > currentRows) {
            for (let i = currentRows; i < newRows; i++) {
                add({}, i);
            }
        } else if (newRows < currentRows) {
            for (let i = newRows; i < currentRows; i++) {
                remove(i);
            }
        }
        formRef.setFields([
            {
                name: ['batchInfo', fieldName, 'rollInfo', fieldName, 'numOfRolls'],
                value: value,
            },
        ]);
    };

    const handleRemovePackingListTable = (index: number) => {
        if (dataSource.length == 1 && index === 0) {
            AlertMessages.getErrorMessage(`There should be minimum of one roll in a lot`)
            return;
        }
        formRef.setFields([
            {
                name: ['batchInfo', fieldName, 'rollInfo', fieldName, 'numOfRolls'],
                value: dataSource.length - 1,
            },
        ]);
        setDummyRefresh(rec => rec + 1)
        remove(index);
    };

    const handleAddPackingListTable = () => {
        formRef.setFields([
            {
                name: ['batchInfo', fieldName, 'rollInfo', fieldName, 'numOfRolls'],
                value: dataSource.length + 1,
            },
        ]);
        setDummyRefresh(rec => rec + 1)
        add();
    };


    const onQtyOrUomChange = (index: number, dataIndex: string) => {
        const activeFormData = formRef.getFieldValue(['batchInfo', fieldName, 'rollInfo', index]);
        if (activeFormData['itemCategory'] == PhItemCategoryEnum.FABRIC) {
            if (dataIndex === 'length' && activeFormData['inputQuantityUom'] && activeFormData['inputQuantity']) {
                const conversion: any = conversionToMeter.get(activeFormData['inputQuantityUom']) ? conversionToMeter.get(activeFormData['inputQuantityUom']) : 1
                const lengthInMeter = activeFormData['inputQuantity'] * conversion;
                formRef.setFields([
                    {
                        name: ['batchInfo', fieldName, 'rollInfo', index, 'supplierQuantity'],
                        value: lengthInMeter.toFixed(2),
                    },
                    {
                        name: ['batchInfo', fieldName, 'rollInfo', index, 'supplierLength'],
                        value: lengthInMeter.toFixed(2),
                    },
                    {
                        name: ['batchInfo', fieldName, 'rollInfo', index, 'inputLength'],
                        value: activeFormData['inputQuantity'],
                    },
                    {
                        name: ['batchInfo', fieldName, 'rollInfo', index, 'inputLengthUom'],
                        value: activeFormData['inputQuantityUom'],
                    },
                ]);
            } else if (dataIndex === 'width' && activeFormData['inputWidthUom'] && activeFormData['inputWidth']) {
                const conversion: any = conversionToCentimeter.get(activeFormData['inputWidthUom']) ? conversionToCentimeter.get(activeFormData['inputWidthUom']) : 1
                const lengthInMeter = activeFormData['inputWidth'] * conversion;
                formRef.setFields([
                    {
                        name: ['batchInfo', fieldName, 'rollInfo', index, 'supplierWidth'],
                        value: lengthInMeter.toFixed(2),
                    },
                ]);
            }
        }

        if (activeFormData['itemCategory'] == PhItemCategoryEnum.YARN) {
            if (dataIndex === 'length' && activeFormData['inputQuantityUom'] && activeFormData['inputQuantity']) {
                const conversion: any = containerConversionToPound.get(activeFormData['inputQuantityUom']) ? containerConversionToPound.get(activeFormData['inputQuantityUom']) : 1
                const lengthInMeter = activeFormData['inputQuantity'] * conversion;
                formRef.setFields([
                    {
                        name: ['batchInfo', fieldName, 'rollInfo', index, 'supplierQuantity'],
                        value: lengthInMeter.toFixed(2),
                    },
                    {
                        name: ['batchInfo', fieldName, 'rollInfo', index, 'supplierLength'],
                        value: lengthInMeter.toFixed(2),
                    },
                    {
                        name: ['batchInfo', fieldName, 'rollInfo', index, 'inputLength'],
                        value: activeFormData['inputQuantity'],
                    },
                    {
                        name: ['batchInfo', fieldName, 'rollInfo', index, 'inputLengthUom'],
                        value: activeFormData['inputQuantityUom'],
                    },
                ]);
            } else if (dataIndex === 'width' && activeFormData['inputWidthUom'] && activeFormData['inputWidth']) {
                const conversion: any = conversionToCentimeter.get(activeFormData['inputWidthUom']) ? conversionToCentimeter.get(activeFormData['inputWidthUom']) : 1
                const lengthInMeter = activeFormData['inputWidth'] * conversion;
                formRef.setFields([
                    {
                        name: ['batchInfo', fieldName, 'rollInfo', index, 'supplierWidth'],
                        value: lengthInMeter.toFixed(2),
                    },
                ]);
            }
        }
    }

    const itemCodeOnChange = (itemCode: string, index: number) => {
        const resData: ItemCodeInfoModel = itemCodeInfoMap.get(itemCode);
        if (resData) {
            formRef.resetFields([
                ['batchInfo', fieldName, 'rollInfo', index, 'materialItemName'],
                ['batchInfo', fieldName, 'rollInfo', index, 'quantity'],
                ['batchInfo', fieldName, 'rollInfo', index, 'itemColor'],
                ['batchInfo', fieldName, 'rollInfo', index, 'uom'],
                ['batchInfo', fieldName, 'rollInfo', index, 'materialItemDesc'],
            ])
            formRef.setFields([
                {
                    name: ['batchInfo', fieldName, 'rollInfo', index, 'materialItemName'],
                    value: resData.materialItemName,
                },
                {
                    name: ['batchInfo', fieldName, 'rollInfo', index, 'materialItemDesc'],
                    value: resData.materialItemDesc,
                },
                {
                    name: ['batchInfo', fieldName, 'rollInfo', index, 'quantity'],
                    value: resData.quantity,
                },
                {
                    name: ['batchInfo', fieldName, 'rollInfo', index, 'itemColor'],
                    value: resData.itemColor,
                },
                {
                    name: ['batchInfo', fieldName, 'rollInfo', index, 'uom'],
                    value: resData.uom,
                }
            ]);

        }

    }

    const poNumberOnChange = (index: number) => {
        setDummyRefresh(rec => rec + 1);
        formRef.setFields([
            {
                name: ['batchInfo', fieldName, 'rollInfo', index, 'materialItemCode'],
                value: undefined
            },
            {
                name: ['batchInfo', fieldName, 'rollInfo', index, 'materialItemName'],
                value: undefined
            },
            {
                name: ['batchInfo', fieldName, 'rollInfo', index, 'materialItemDesc'],
                value: undefined
            },
            {
                name: ['batchInfo', fieldName, 'rollInfo', index, 'quantity'],
                value: undefined
            },
            {
                name: ['batchInfo', fieldName, 'rollInfo', index, 'itemColor'],
                value: undefined
            },
            {
                name: ['batchInfo', fieldName, 'rollInfo', index, 'uom'],
                value: undefined
            }
        ]);
    }

    const rollOnChange = (index: number) => {
        const activeFormData = formRef.getFieldValue(['batchInfo', fieldName]);
        const lotNo = activeFormData['lotNumber'];
        if (!lotNo) {
            formRef.setFields([
                {
                    name: ['batchInfo', fieldName, 'rollInfo', index, 'externalRollNumber'],
                    value: '',
                },
            ]);
            setDummyRefresh(rec => rec + 1);
            AlertMessages.getErrorMessage('Please Enter lotNumber');
        } else {
            const allRolls: RollInfoModel[] = activeFormData['rollInfo'];
            const externalRolls = new Set(allRolls.filter((rollInfo: RollInfoModel, indexLocal) => index != indexLocal).map(rec => rec.externalRollNumber));
            console.log(externalRolls);
            const externalRollNo = formRef.getFieldValue(['batchInfo', fieldName, 'rollInfo', index, 'externalRollNumber']);
            console.log(externalRollNo)
            if (externalRolls.has(externalRollNo)) {
                formRef.setFields([
                    {
                        name: ['batchInfo', fieldName, 'rollInfo', index, 'externalRollNumber'],
                        value: '',
                    },
                ]);
                AlertMessages.getErrorMessage('Duplicate Roll Number');
            }
        }
    }


    const columns: any[] = [{
        title: <span>PO Number<span className='required-field'></span></span>,
        dataIndex: 'poNumber',
        key: 'poNumber',
        render: (text: string, record: { [key: string]: any }, index: number) => (
            <Form.Item name={[index, 'poNumber']} initialValue={text} rules={[{ required: true, message: 'Select PO Number' }]}>
                {/* <Select
                    onChange={() => poNumberOnChange(index)}
                    filterOption={(input, option) => (option!.children as unknown as string).toLocaleLowerCase().includes(input.toLocaleLowerCase())} allowClear showSearch style={{ width: '120px' }} placeholder='Please Select'>
                    {Array.from(nlPoNumberInfoMap.keys()).map(poNumbers => {
                        return <Option value={poNumbers}>{poNumbers}</Option>
                    })}
                </Select> */}
                <Input placeholder="PO Number" />
            </Form.Item>
        ),
    }, {
        title: 'PO Line Item Number',
        dataIndex: 'poLineItemNo',
        key: 'poLineItemNo',
        render: (text: string, record: { [key: string]: any }, index: number) => (
            <Form.Item name={[index, 'poLineItemNo']} initialValue={text} rules={[{ required: false, message: 'Enter PO Line Item Number' }]}>
                <Input placeholder="PO Line Item Number" />
            </Form.Item>
        ),
    },
    {
        title: <span>Number<span className='required-field'></span></span>,
        dataIndex: 'externalRollNumber',
        key: 'externalRollNumber',
        render: (text: string, record: { [key: string]: any }, index: number) => (
            <Form.Item name={[index, 'externalRollNumber']} initialValue={text} rules={[{ required: true, message: 'Enter Roll Number' }]}>
                <Input placeholder="Object Number" onBlur={() => rollOnChange(index)} />
            </Form.Item>
        ),
    },
    {
        title: <span>Object Type<span className='required-field'></span></span>,
        dataIndex: 'objectType',
        key: 'objectType',
        render: (text: string, record: { [key: string]: any }, index: number) => (
            <Form.Item name={[index, 'objectType']} initialValue={text ? text : PhItemLinesObjectTypeEnum.CONE} rules={[{ required: true, message: 'Select Object Type' }]}>
                <Select filterOption={(input, option) => (option!.children as unknown as string).toLocaleLowerCase().includes(input.toLocaleLowerCase())} allowClear showSearch style={{ width: '120px' }} placeholder='Please Select'>
                    {Object.keys(PhItemLinesObjectTypeEnum).map(uom => {
                        return <Option value={PhItemLinesObjectTypeEnum[uom]}>{PhItemLinesObjectTypeEnum[uom]}</Option>
                    })}
                </Select>
            </Form.Item>
        ),
    },
    // {
    //     title: <span>Item Type<span className='required-field'></span></span>,
    //     dataIndex: 'itemType',
    //     key: 'itemType',
    //     render: (text: string, record: { [key: string]: any }, index: number) => (
    //         <Form.Item name={[index, 'itemType']} initialValue={text ? text : SpoItemTypeEnum.YARN} rules={[{ required: true, message: 'Select Item Type' }]}>
    //             <Select filterOption={(input, option) => (option!.children as unknown as string).toLocaleLowerCase().includes(input.toLocaleLowerCase())} allowClear showSearch style={{ width: '120px' }} placeholder='Please Select'>
    //                 {Object.keys(SpoItemTypeEnum).map(uom => {
    //                     return <Option value={SpoItemTypeEnum[uom]}>{SpoItemTypeEnum[uom]}</Option>
    //                 })}
    //             </Select>
    //         </Form.Item>
    //     ),
    // },
    {
        title: <span>Item Category<span className='required-field'></span></span>,
        dataIndex: 'itemCategory',
        key: 'itemCategory',
        render: (text: string, record: { [key: string]: any }, index: number) => (
            <Form.Item name={[index, 'itemCategory']} initialValue={text ? text : PhItemCategoryEnum.THREAD} rules={[{ required: true, message: 'Select Item Category' }]}>
                <Select filterOption={(input, option) => (option!.children as unknown as string).toLocaleLowerCase().includes(input.toLocaleLowerCase())} allowClear showSearch style={{ width: '120px' }} placeholder='Please Select' >
                    {Object.keys(PhItemCategoryEnum).map(uom => {
                        return <Option value={PhItemCategoryEnum[uom]}>{PhItemCategoryEnum[uom]}</Option>
                    })}
                </Select>
            </Form.Item>
        ),
    },
    {
        title: <span>Item Code<span className='required-field'></span></span>,
        dataIndex: 'materialItemCode',
        key: 'materialItemCode',
        render: (text: string, record: { [key: string]: any; }, index: number) => {
            const activeFormData = formRef.getFieldValue(['batchInfo', fieldName, 'rollInfo', index]);
            return <Form.Item name={[index, 'materialItemCode']} initialValue={text} rules={[{ required: true, message: 'Select Item Code' }]}>
                <Select
                    filterOption={(input, option) => (option!.children as unknown as string).toLocaleLowerCase().includes(input.toLocaleLowerCase())} showSearch style={{ width: '120px' }} placeholder='Please Select'
                    onChange={(value) => itemCodeOnChange(value, index)}>
                    {itemCodes.map(uom => {
                        return <Option value={uom.itemCode}>{uom.itemCode}</Option>;
                    })}
                </Select>
            </Form.Item>;
        },
    },
    {
        title: <span>Item Name<span className='required-field'></span></span>,
        dataIndex: 'materialItemName',
        key: 'materialItemName',
        render: (text: string, record: { [key: string]: any }, index: number) => (
            <Form.Item name={[index, 'materialItemName']} initialValue={text} rules={[{ required: true, message: 'Enter Item Name' }]}>
                <Input placeholder="Item Name" />
            </Form.Item>
        ),
    },
    {
        title: <span>Item Color<span></span></span>,
        dataIndex: 'itemColor',
        key: 'itemColor',
        render: (text: string, record: { [key: string]: any }, index: number) => (
            <>
                <Form.Item name={[index, 'materialItemDesc']} initialValue={text} hidden>
                    <Input placeholder="Item Description" />
                </Form.Item>
                <Form.Item name={[index, 'itemColor']} initialValue={record['itemColor']} rules={[{ required: true, message: 'Enter Item Color' }]}>
                    <Input placeholder="Item Color" />
                </Form.Item>
            </>
        ),
    },
    {
        title: <span>Item Style<span></span></span>,
        dataIndex: 'itemStyle',
        key: 'itemStyle',
        render: (text: string, record: { [key: string]: any }, index: number) => (
            <>
                <Form.Item name={[index, 'itemStyle']} initialValue={record['itemStyle']} rules={[{ required: true, message: 'Enter Item Style' }]}>
                    <Input placeholder="Item Style" />
                </Form.Item>
            </>
        ),
    },
    {
        title: <span>QTY<span className='required-field'></span></span>,
        dataIndex: 'inputQuantity',
        key: 'inputQuantity',
        render: (text: string, record: { [key: string]: any }, index: number) => (
            <>
                <Form.Item name={[index, 'inputLength']} initialValue={text} hidden>
                    <InputNumber min={0} placeholder="QTY" onChange={() => onQtyOrUomChange(index, 'length')} />
                </Form.Item>
                <Form.Item name={[index, 'inputQuantity']} initialValue={text} rules={[{ required: true, message: 'Enter QTY' }]}>
                    <InputNumber min={0} placeholder="QTY" onChange={() => onQtyOrUomChange(index, 'length')} />
                </Form.Item>
            </>
        ),
    },
    {
        title: <span>UOM<span className='required-field'></span></span>,
        dataIndex: 'inputQuantityUom',
        key: 'inputQuantityUom',
        render: (text: string, record: { [key: string]: any }, index: number) => (
            <>
                <Form.Item name={[index, 'inputLengthUom']} initialValue={text} hidden>
                    <Input onChange={() => onQtyOrUomChange(index, 'length')} />
                </Form.Item>
                <Form.Item name={[index, 'inputQuantityUom']} initialValue={text} rules={[{ required: true, message: 'Select UOM' }]}>
                    <Select filterOption={(input, option) => (option!.children as unknown as string).toLocaleLowerCase().includes(input.toLocaleLowerCase())} allowClear showSearch style={{ width: '120px' }} placeholder='Please Select'
                        onChange={() => onQtyOrUomChange(index, 'length')}>
                        {Object.keys(UOMEnum).map(uom => {
                            return <Option value={UOMEnum[uom]}>{UOMEnum[uom]}</Option>
                        })}
                    </Select>
                </Form.Item>

            </>
        ),
    },
    {
        title: <span>Converted UOM Qty<span className='required-field'></span></span>,
        dataIndex: 'supplierQuantity',
        key: 'supplierQuantity',
        render: (text: string, record: { [key: string]: any }, index: number) => (
            <>
                <Form.Item name={[index, 'supplierLength']} initialValue={text} hidden>
                    <Input onChange={() => onQtyOrUomChange(index, 'length')} />
                </Form.Item>
                <Form.Item rules={[{ required: false }]} name={[index, 'supplierQuantity']} initialValue={text}>
                    <InputNumber min={0} placeholder="Converted UOM Qty" disabled style={{ width: '100%' }} />
                </Form.Item>
            </>
        ),
    },
    {
        title: <span>Width<span className='required-field'></span></span>,
        dataIndex: 'inputWidth',
        key: 'inputWidth',
        render: (text: string, record: { [key: string]: any }, index: number) => (
            <Form.Item name={[index, 'inputWidth']} initialValue={text} rules={[{ required: true, message: 'Enter Width' }]}>
                <InputNumber min={0} placeholder="QTY" onChange={() => onQtyOrUomChange(index, 'width')} />
            </Form.Item>
        ),
    },
    {
        title: <span>Width UOM<span className='required-field'></span></span>,
        dataIndex: 'inputWidthUom',
        key: 'inputWidthUom',
        render: (text: string, record: { [key: string]: any }, index: number) => (
            <Form.Item name={[index, 'inputWidthUom']} initialValue={text} rules={[{ required: true, message: 'Select UOM' }]}>
                <Select filterOption={(input, option) => (option!.children as unknown as string).toLocaleLowerCase().includes(input.toLocaleLowerCase())} allowClear showSearch style={{ width: '120px' }} placeholder='Please Select'
                    onChange={() => onQtyOrUomChange(index, 'width')}>
                    {Object.keys(FabricUOM).map(uom => {
                        return <Option value={FabricUOM[uom]}>{FabricUOM[uom]}</Option>
                    })}
                </Select>
            </Form.Item>
        ),
    },
    {
        title: <span>Converted Width UOM Qty<span className='required-field'></span></span>,
        dataIndex: 'supplierWidth',
        key: 'supplierWidth',
        render: (text: string, record: { [key: string]: any }, index: number) => (
            <Form.Item rules={[{ required: false }]} name={[index, 'supplierWidth']} initialValue={text}>
                <InputNumber min={0} placeholder="Converted Width UOM Qty" disabled style={{ width: '100%' }} />
            </Form.Item>
        ),
    },
    {
        title: <span>Shade<span className='required-field'></span></span>,
        dataIndex: 'shade',
        key: 'shade',
        render: (text: string, record: { [key: string]: any }, index: number) => (
            <>
                <Form.Item name={[index, 'shade']} initialValue={text} rules={[{ required: true, message: 'Enter Shade' }]}>
                    <Input placeholder="Mill Shade" />
                </Form.Item>
            </>
        ),
    },
    {
        title: <span>GSM<span className='required-field'></span></span>,
        dataIndex: 'gsm',
        key: 'gsm',
        render: (text: string, record: { [key: string]: any }, index: number) => (
            <Form.Item name={[index, 'gsm']} initialValue={text} rules={[{ required: true, message: 'Enter GSM' }]}>
                <InputNumber min={0} placeholder="GSM" />
            </Form.Item>
        ),
    },
    {
        title: <span>Net Weight<span className='required-field'></span></span>,
        dataIndex: 'netWeight',
        key: 'netWeight',
        render: (text: string, record: { [key: string]: any }, index: number) => (
            <Form.Item name={[index, 'netWeight']} initialValue={text} rules={[{ required: true, message: 'Enter Net Weight' }]}>
                <InputNumber min={0} placeholder="netWeight" />
            </Form.Item>
        ),
    },
    {
        title: <span>Gross Weight<span className='required-field'></span></span>,
        dataIndex: 'grossWeight',
        key: 'grossWeight',
        render: (text: string, record: { [key: string]: any }, index: number) => (
            <Form.Item name={[index, 'grossWeight']} initialValue={text} rules={[{ required: true, message: 'Enter Gross Weight' }]}>
                <InputNumber min={0} placeholder="Gross Weight" />
            </Form.Item>
        ),
    },
    {
        title: '',
        key: 'actions',
        fixed: 'right',
        width: 80,
        render: (text: string, record: { [key: string]: any }, index: number) => (
            <>
                <Button size='small' type="primary" danger onClick={() => handleRemovePackingListTable(index)}>
                    <MinusCircleOutlined />
                </Button>
                {index === dataSource.length - 1 && (
                    <Button size='small' type="primary" style={{ marginLeft: 8 }} onClick={handleAddPackingListTable}>
                        <PlusCircleOutlined />
                    </Button>
                )}
            </>
        ),
    },
    ];

    return (
        <div>
            <Row gutter={[16, 16]}>
                <Col xs={24} sm={12} md={8} lg={6} xl={4} xxl={2}>
                    <Form.Item name={[fieldName, 'numOfRolls']} label="Num Of Rolls" rules={[{ required: false, message: 'Enter Number' }]} hidden>
                        <InputNumber min={0} placeholder="Num Of Rolls" onChange={handleNumOfRowsChange} />
                    </Form.Item>
                </Col>
            </Row>
            <Row>
                <Col xs={24} sm={24} md={24} lg={24} xl={24} xxl={24}>
                    <Table
                        dataSource={dataSource}
                        columns={columns}
                        pagination={false}
                        bordered={true}
                        scroll={{ x: 'max-content' }}
                    />
                </Col>
            </Row>
        </div>
    );
};

export default PackingListTableForm;
