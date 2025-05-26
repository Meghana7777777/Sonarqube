import { InsShrinkageRollInfo, InsShrinkageTypeEnum, InsShrinkageTypeInspectionRollDetails, ShrinkageLengthsEnum } from '@xpparel/shared-models';
import { Form, FormInstance, InputNumber, Table } from 'antd';
import { AlertMessages } from 'packages/ui/src/components/common';
import { useEffect } from 'react';
interface IShrinkageFormProps {
    add: (defaultValue?: any, insertIndex?: number) => void;
    fields: any[];
    form: FormInstance<any>;
    inspectionRollIndex: number;
    inspectionRollDetails: InsShrinkageRollInfo[];
}
export const measurementIndexes = [0, 3, 6];
export const measurementAfterInspIndexes = [1, 4, 7];
export const skPercentageIndexes = [2, 5, 8];

export const ShrinkageForm = (props: IShrinkageFormProps) => {
    const { add, fields, form, inspectionRollIndex, inspectionRollDetails } = props;

    useEffect(() => {
        const shrinkageTypes: InsShrinkageTypeInspectionRollDetails[] = form.getFieldValue(['inspectionRollDetails', inspectionRollIndex, 'shrinkageTypes']);
        const obj = {
            shrinkageType: InsShrinkageTypeEnum.DAY,
            measurementWidth: undefined,
            measurementLength: undefined,
            skWidthPercentage: undefined,
            skLengthPercentage: undefined,
        }
        if (shrinkageTypes.length === 0) {
            for (const index of [0, 1, 2, 3, 4, 5, 6, 7, 8]) {
                if (index < 3) {
                    add(obj, index);
                } else if (index >= 3 && index < 6) {
                    add({ ...obj, shrinkageType: InsShrinkageTypeEnum.STEAM }, index);
                } else if (index >= 6 && index <= 8) {
                    add({ ...obj, shrinkageType: InsShrinkageTypeEnum.AFTER_WASH }, index);
                }
            }
        } else {
            for (const index of [0, 1, 2, 3, 4, 5, 6, 7, 8]) {
                if (index < 3) {
                    const dayData = shrinkageTypes.filter(rec => rec.shrinkageType === InsShrinkageTypeEnum.DAY)[0];
                    if (dayData.measurementLength && dayData.lengthAfterSk) {
                        const length = (1 - dayData.lengthAfterSk / dayData.measurementLength) * 100;
                        dayData['skLengthPercentage'] = Number(length.toFixed(2));
                    }
                    if (dayData.measurementWidth && dayData.widthAfterSk) {
                        const length = (1 - dayData.widthAfterSk / dayData.measurementWidth) * 100;
                        dayData['skWidthPercentage'] = Number(length.toFixed(2));
                    }
                    add(dayData, index);
                } else if (index >= 3 && index < 6) {
                    const dayData = shrinkageTypes.filter(rec => rec.shrinkageType === InsShrinkageTypeEnum.STEAM)[0];
                    if (dayData.measurementLength && dayData.lengthAfterSk) {
                        const length = (1 - dayData.lengthAfterSk / dayData.measurementLength) * 100;
                        dayData['skLengthPercentage'] = Number(length.toFixed(2));
                    }
                    if (dayData.measurementWidth && dayData.widthAfterSk) {
                        const length = (1 - dayData.widthAfterSk / dayData.measurementWidth) * 100;
                        dayData['skWidthPercentage'] = Number(length.toFixed(2));
                    }
                    add(dayData, index);
                } else if (index >= 6 && index <= 8) {
                    const dayData = shrinkageTypes.filter(rec => rec.shrinkageType === InsShrinkageTypeEnum.AFTER_WASH)[0];
                    if (dayData.measurementLength && dayData.lengthAfterSk) {
                        const length = (1 - dayData.lengthAfterSk / dayData.measurementLength) * 100;
                        dayData['skLengthPercentage'] = Number(length.toFixed(2));
                    }
                    if (dayData.measurementWidth && dayData.widthAfterSk) {
                        const length = (1 - dayData.widthAfterSk / dayData.measurementWidth) * 100;
                        dayData['skWidthPercentage'] = Number(length.toFixed(2));
                    }
                    add({ ...dayData, shrinkageType: InsShrinkageTypeEnum.AFTER_WASH }, index);
                }
            }
        }
    }, []);

    const getTitle = (shrinkageType: InsShrinkageTypeEnum) => {
        switch (shrinkageType) {
            case InsShrinkageTypeEnum.DAY: return '24 Hours Shrinkage'
            case InsShrinkageTypeEnum.AFTER_WASH: return 'AFTER WASH'
            case InsShrinkageTypeEnum.STEAM: return 'STEAM Shrinkage'
            default: return <></>
        }
    }

    const getSecondColumn = (shrinkageType: InsShrinkageTypeEnum, index: number) => {
        if (measurementIndexes.includes(index)) {
            return 'Measurement'
        } else if (measurementAfterInspIndexes.includes(index)) {
            return shrinkageType === InsShrinkageTypeEnum.DAY ? 'Measurement After 24' : shrinkageType === InsShrinkageTypeEnum.STEAM ? 'Measurement After STEAM' : 'Measurement After WASH';
        } else if (skPercentageIndexes.includes(index)) {
            return 'shrinkage %'
        } else {
            return ''
        }
    }

    const onChangeHandler = (index: number, value: any, type: ShrinkageLengthsEnum) => {
       
        if (measurementIndexes.includes(index)) {
            const actualIndex = measurementAfterInspIndexes[measurementIndexes.indexOf(index)];
            const shrinkageIndex = skPercentageIndexes[measurementIndexes.indexOf(index)]
            const actualValue = form.getFieldValue(['inspectionRollDetails', inspectionRollIndex, 'shrinkageTypes', actualIndex, type === ShrinkageLengthsEnum.WARP ? 'lengthAfterSk' : 'widthAfterSk']);
            
            if (value && actualValue) {
                const shrinkageIndexPercentage = (1 - actualValue / value) * 100;
                form.setFieldValue(['inspectionRollDetails', inspectionRollIndex, 'shrinkageTypes', shrinkageIndex, type === ShrinkageLengthsEnum.WARP ? 'skLengthPercentage' : 'skWidthPercentage'], shrinkageIndexPercentage.toFixed(2));
            }
        } else {
            const measureIndex = measurementIndexes[measurementAfterInspIndexes.indexOf(index)];
            const shrinkageIndex = skPercentageIndexes[measurementAfterInspIndexes.indexOf(index)];
            const measurementVal = form.getFieldValue(['inspectionRollDetails', inspectionRollIndex, 'shrinkageTypes', measureIndex, type === ShrinkageLengthsEnum.WARP ? 'measurementLength' : 'measurementWidth']);
            
            if (value && measurementVal) {
                const shrinkageIndexPercentage = (1 - value / measurementVal) * 100;
                form.setFieldValue(['inspectionRollDetails', inspectionRollIndex, 'shrinkageTypes', shrinkageIndex, type === ShrinkageLengthsEnum.WARP ? 'skLengthPercentage' : 'skWidthPercentage'], shrinkageIndexPercentage.toFixed(2));
            }
        }
    } 

    const columns = [
        {
            title: <span>Shrinkage Type</span>,
            dataIndex: 'shrinkageType',
            key: 'shrinkageType',
            onCell: (record, rowIndex) => {
                if (rowIndex % 3 === 0) {
                    return { rowSpan: 3 };
                } else {
                    return { rowSpan: 0 };
                }
            },
            render: (text: string, record: any, index: number) => {
                return getTitle(form.getFieldValue(['inspectionRollDetails', inspectionRollIndex, 'shrinkageTypes', index, 'shrinkageType']))
            }
        },
        {
            title: <span></span>,
            dataIndex: 'shrinkageType',
            key: 'shrinkageType',
            render: (text: string, record: any, index: number) => {
                return getSecondColumn(form.getFieldValue(['inspectionRollDetails', inspectionRollIndex, 'shrinkageTypes', index, 'shrinkageType']), index)
            }
        },
        {
            title: <span>{ShrinkageLengthsEnum.WARP} (LENGTH)</span>,
            dataIndex: 'measurementLength',
            key: 'measurementLength',
            render: (text: string, record: any, index: number) => (
                <Form.Item noStyle name={[index, measurementIndexes.includes(index) ? 'measurementLength' : measurementAfterInspIndexes.includes(index) ? 'lengthAfterSk' : 'skLengthPercentage']} initialValue={text}>
                    <InputNumber style={{ width: '100%' }} disabled={skPercentageIndexes.includes(index)} size='small' onChange={(val) => {
                        if (val !== null && Number(val) < 0) {
                            AlertMessages.getErrorMessage('Negative values are not allowed');
                            return;
                        }
                        onChangeHandler(index, val, ShrinkageLengthsEnum.WARP);
                    }}
                        suffix={skPercentageIndexes.includes(index) ? "%" : ''} />
                </Form.Item>
            ),
        },
        {
            title: <span>{ShrinkageLengthsEnum.WEFT} (WIDTH)</span>,
            dataIndex: 'measurementWidth',
            key: 'measurementWidth',
            render: (text: string, record: any, index: number) => (
                <Form.Item noStyle name={[index, measurementIndexes.includes(index) ? 'measurementWidth' : measurementAfterInspIndexes.includes(index) ? 'widthAfterSk' : 'skWidthPercentage']} initialValue={text}>
                    <InputNumber style={{ width: '100%' }} disabled={skPercentageIndexes.includes(index)} size='small'
                    onChange={(val) => {
                        if (val !== null && Number(val) < 0) {
                            AlertMessages.getErrorMessage('Negative values are not allowed');
                            return;
                        }
                        onChangeHandler(index, val, ShrinkageLengthsEnum.WEFT);
                    }}  
                    suffix={skPercentageIndexes.includes(index) ? "%" : ''} />
                </Form.Item>
            ),
        },
    ]

    return (
        <Table
            size='small'
            dataSource={fields.slice(0, 9)}
            columns={columns}
            pagination={false}
            bordered={true}
            scroll={{ x: 'max-content' }}
        />)
}

export default ShrinkageForm