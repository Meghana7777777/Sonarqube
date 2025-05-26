import { DownCircleFilled, UpCircleFilled } from '@ant-design/icons';
import { InsCommonInspRollInfo, InsInspectionFinalInSpectionStatusEnum, InsShrinkageRollInfo } from '@xpparel/shared-models';
import { Card, Col, Form, FormInstance, Row, Select, Table } from 'antd';
import { useEffect, useState } from 'react';
import { CustomColumn } from '../../../../../../schemax-component-lib';
import ShrinkageForm from './shrinkage-form';


interface IRollLevelShrinkageFormProps {
    inspectionRollDetails: InsShrinkageRollInfo[];
    form: FormInstance<any>
}

const { Option } = Select;
export const RollLevelShrinkageForm = (props: IRollLevelShrinkageFormProps) => {
    const { inspectionRollDetails, form } = props;
    const [insRollsData, setInsRollsData] = useState<RollInfoModelExtends[]>([])
    const [expandedIndex, setExpandedIndex] = useState([]);

    type RollInfoModelExtends = InsCommonInspRollInfo;

    useEffect(() => {
        const dataSource: RollInfoModelExtends[] = [];
        const rollIds = new Set();
        inspectionRollDetails.forEach(rec => {
            dataSource.push(rec.rollInfo);
            rollIds.add(rec.rollInfo.rollId)
        })
        setExpandedIndex(Array.from(rollIds));
        setInsRollsData(dataSource);
    }, []);

    const expandedRowRender = (record: any, index: number) => {
        return <Card>
            <Row>
                <Col span={4}>
                    <Form.Item label='Inspection Result' name={[index, 'rollInfo', 'rollInsResult']} >
                        <Select
                            size='small'
                            placeholder="Select inspection status"
                            style={{ width: '100%' }}                        >
                            {Object.values(InsInspectionFinalInSpectionStatusEnum).map((status) => (
                                <Option key={status} value={status} >
                                    {status}
                                </Option>
                            ))}
                        </Select>
                    </Form.Item>
                </Col>
                <Col span={4} offset={2}>
                    <Form.Item label='Final Inspection Result' name={[index, 'rollInfo', 'rollFinalInsResult']} >
                        <Select size='small'
                            placeholder="Select inspection status"
                            style={{ width: '100%' }}                        >
                            {Object.values(InsInspectionFinalInSpectionStatusEnum).map((status) => (
                                <Option key={status} value={status} >
                                    {status}
                                </Option>
                            ))}
                        </Select>
                    </Form.Item>
                </Col>
                <Col span={14}></Col>
            </Row>
            <Form.List name={[index, "shrinkageTypes"]}>
                {(fields, { add, remove }) => (
                    <>
                        <ShrinkageForm add={add} fields={fields} form={form} inspectionRollIndex={index} inspectionRollDetails={inspectionRollDetails} />
                    </>
                )}
            </Form.List>
        </Card>
    };

    const setIndex = (expanded, record) => {
        const rollIds = new Set(expandedIndex);
        if (expanded) {
            rollIds.add(record?.rollId);
            setExpandedIndex(Array.from(rollIds));
        } else {
            rollIds.delete(record?.rollId);
            setExpandedIndex(Array.from(rollIds));
        }
    }

    const columns: CustomColumn<RollInfoModelExtends>[] = [
        {
            title: <span>Object No</span>,
            dataIndex: 'externalRollNo',
            key: 'externalRollNo',
        },
        {
            title: <span>Object Barcode</span>,
            dataIndex: 'barcode',
            key: 'barcode',
        },
        {
            title: <span>Lot Number</span>,
            dataIndex: 'lotNumber',
            key: 'lotNumber',
        },
        {
            title: <span>Object Qty</span>,
            dataIndex: 'rollQty',
            key: 'rollQty',
        }
    ];



    return <>
        <Table
            expandIconColumnIndex={0}
            rowKey={(row) => row.rollId}
            size='small'
            dataSource={insRollsData}
            columns={columns}
            pagination={false}
            bordered={true}
            expandable={{
                expandedRowRender: expandedRowRender,
                expandedRowKeys: expandedIndex,
                onExpand: setIndex,
            }}
            expandIcon={({ expanded, onExpand, record }) =>
                expanded ? (
                    <UpCircleFilled
                        onClick={(e) => onExpand(record, e)}
                    >
                        Collapse
                    </UpCircleFilled>
                ) : (
                    <DownCircleFilled onClick={(e) => onExpand(record, e)}>Expand</DownCircleFilled>
                )
            }
            scroll={{ x: 'max-content' }}
        /></>
}

export default RollLevelShrinkageForm