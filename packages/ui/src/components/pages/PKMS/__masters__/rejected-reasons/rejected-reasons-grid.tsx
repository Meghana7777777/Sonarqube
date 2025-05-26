import { EditFilled } from '@ant-design/icons';
import { Button, Card, Divider, Form, Input, Modal, Switch, Table } from 'antd';
import React, { useEffect, useState } from 'react';
import RejectedReasonsForm from './rejected-reasons-form';
import { RejectedReasonsServices } from '@xpparel/shared-services';
import { CommonIdReqModal, CommonRequestAttrs, RejectedReasonsResponseDto } from '@xpparel/shared-models';
import { SequenceUtils, useAppSelector } from 'packages/ui/src/common';
import { AlertMessages } from 'packages/ui/src/components/common';
import { ColumnsType } from 'antd/es/table';

export const RejectedReasonsGrid = () => {
    const [model, openModel] = useState<boolean>(false);
    const [initialValues, setIsInitialValues] = useState<RejectedReasonsResponseDto>();
    const service = new RejectedReasonsServices();
    const [data, setData] = useState<RejectedReasonsResponseDto[]>();
    const [formRef] = Form.useForm();
    const user = useAppSelector((state) => state.user.user.user);
    const { userName, orgData, userId } = user;
    const [searchedText, setSearchedText] = useState("");

    useEffect(() => {
        getRejectedReasons();
    }, []);

    const edit = (record: any) => {
        if (!record.isActive) {
            AlertMessages.getErrorMessage('Please Activate the record before Edit')
            return
        }
        setIsInitialValues(record);
        openModel(true);
    };

    const closeModel = () => {
        openModel(false);
        formRef.resetFields();
        getRejectedReasons();
    };

    const modelOpen = () => {
        setIsInitialValues(null);
        openModel(true);
    };

    const saveReasons = () => {
        formRef.validateFields().then((values) => {
            const isEditMode = !!initialValues;
            const isDuplicateCheckNeeded = !isEditMode || (isEditMode && initialValues.reasonCode !== values.reasonCode);

            const reqModel = new RejectedReasonsResponseDto(
                userName,
                orgData.unitCode,
                orgData.companyCode,
                userId,
                values.id,
                values.reasonCode,
                values.reasonName,
                values.reasonDesc
            );

            service.saveReasons(reqModel).then((res) => {
                if (res.status) {
                    if (res.internalMessage === 'DUPLICATE_REASON_CODE' && isDuplicateCheckNeeded) {
                        AlertMessages.getErrorMessage('Reason code already exists.');
                    } else {
                        const actionMessage = isEditMode ? 'updated' : 'created';
                        AlertMessages.getSuccessMessage(`Rejected Reason ${actionMessage} Successfully`);
                        closeModel();
                    }
                } else {
                    AlertMessages.getErrorMessage(res.internalMessage || 'An error occurred.');
                }
            }).catch((error) => {
                console.log(error);
                AlertMessages.getErrorMessage('An error occurred while saving the reason.');
            });
        }).catch((err) => {
            AlertMessages.getErrorMessage("Please fill required fields before creation.");
        });
    };

    const toggleRejectedReasonsData = (record: any) => {
        setIsInitialValues(record);
        toggleRejectedReasons(record.id);
    };

    const getRejectedReasons = () => {
        const req = new CommonRequestAttrs(userName, orgData.unitCode, orgData.companyCode, userId);
        service.getRejectedReasons(req)
            .then((res) => {
                if (res.status) {
                    setData(res.data);
                } else {
                    setData([]);
                }
            })
            .catch((error) => console.error(error));
    };

    const toggleRejectedReasons = (id: number) => {
        const req = new CommonIdReqModal(id, userName, orgData.unitCode, orgData.companyCode, userId);
        service.toggleRejectedReasons(req).then((res) => {
            if (res.status) {
                AlertMessages.getSuccessMessage(res.internalMessage);
                getRejectedReasons();
            } else {
                AlertMessages.getErrorMessage(res.internalMessage);
            }
        }).catch((err) => console.log(err.message));
    };

    const columns: ColumnsType<any> = [
        {
            title: 'ReasonCode',
            dataIndex: 'reasonCode',
            sorter: (a, b) => a.reasonCode.localeCompare(b.reasonCode),
            sortDirections: ['descend', 'ascend'],
            filteredValue: [String(searchedText).toLowerCase()],
            onFilter: (value, record) => SequenceUtils.globalFilter(value, record),
        },
        {
            title: 'Reason Name',
            dataIndex: 'reasonName',
    
        },
        {
            title: 'Reason Desc',
            dataIndex: 'reasonDesc',
            
        },
        {
            title: 'Action',
            render: (_, record) => (
                <>
                    <EditFilled onClick={() => edit(record)} style={{ fontSize: '20px', color: '#08c' }} />
                    <Divider type='vertical' />
                    <Switch
    className={record.isActive ? 'toggle-activated' : 'toggle-deactivated'}
    checked={record.isActive} 
    onChange={() => toggleRejectedReasonsData(record)}
    style={{ fontSize: '20px', color: '#08c' }}
/>
                </>
            ),
        },
    ];

    return (
        <div>
            <Card
                title={'Rejected Reasons'}
                extra={<Button onClick={modelOpen} type='primary'>Create</Button>}
            >
                <Input.Search
                    placeholder="Search"
                    allowClear
                    onChange={(e) => { setSearchedText(e.target.value); }}
                    onSearch={(value) => { setSearchedText(value); }}
                    style={{ width: 200, float: 'right' }}
                />
                <Table
                    columns={columns}
                    bordered
                    dataSource={data}
                    size="small"

                />
                <Modal
                    width={600}
                    title={'Rejected Reasons'}
                    cancelButtonProps={{ style: { backgroundColor: 'red', color: 'white' } }}
                    open={model}
                    cancelText='Cancel'
                    onOk={saveReasons}
                    onCancel={closeModel}
                    closable
                    okText={initialValues ? 'Update' : 'Save'}
                >
                    <RejectedReasonsForm formRef={formRef} initialValues={initialValues} />
                </Modal>
            </Card>
        </div>
    );
};

export default RejectedReasonsGrid;
