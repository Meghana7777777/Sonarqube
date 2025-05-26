import { EditOutlined, EyeOutlined, SearchOutlined, SettingOutlined } from '@ant-design/icons';
import { processTypeEnumDisplayValues, QualityConfigurationInfoRequest } from '@xpparel/shared-models';
import { QualityConfigurationService } from '@xpparel/shared-services';
import { Button, Card, Divider, Form, Input, Modal, Row, Select, Table } from 'antd';
import { useAppSelector } from 'packages/ui/src/common';
import { AlertMessages } from 'packages/ui/src/components/common';
import { useEffect, useRef, useState } from 'react';
import QualityConfigurationDetailedView from './quality-configuration-detailed-view';
import QualityConfigurationForm from './quality-configuration-form';
import { ProCard } from '@ant-design/pro-components';
import { filter } from 'rxjs';
const { Option } = Select;

const QualityConfigurationView = () => {
    const user = useAppSelector((state) => state.user.user.user);
    const qualityConfigurationService = new QualityConfigurationService();

    const [data, setData] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedRecord, setSelectedRecord] = useState(null);
    const [formRef] = Form.useForm();
    const [modalTitle, setModalTitle] = useState("Create");
    const [okText, setOkText] = useState("Create");
    const searchInput = useRef(null);


    useEffect(() => {
        getQualityConfigurationInfo();
    }, []);

    const handleSearch = (selectedKeys, confirm, dataIndex) => {
        confirm();

    };

    const handleReset = (clearFilters) => {
        clearFilters();
    };

    const getColumnSearchProps = (dataIndex: string) => ({
        filterDropdown: ({
            setSelectedKeys,
            selectedKeys,
            confirm,
            clearFilters,
        }) => (
            <div style={{ padding: 8 }}>
                <Input
                    ref={searchInput}
                    placeholder={`Search ${dataIndex}`}
                    value={selectedKeys[0]}
                    onChange={(e) =>
                        setSelectedKeys(e.target.value ? [e.target.value] : [])
                    }
                    onPressEnter={() => handleSearch(selectedKeys, confirm, dataIndex)}
                    style={{ width: 188, marginBottom: 8, display: 'block' }}
                />
                <Button
                    type="primary"
                    onClick={() => handleSearch(selectedKeys, confirm, dataIndex)}
                    icon={<SearchOutlined />}
                    size="small"
                    style={{ width: 90, marginRight: 8 }}
                >
                    Search
                </Button>
                <Button
                    size="small"
                    style={{ width: 90 }}
                    onClick={() => {
                        handleReset(clearFilters);
                        confirm({ closeDropdown: true });
                    }}
                >
                    Reset
                </Button>
            </div>
        ),
        filterIcon: (filtered) => (
            <SearchOutlined
                type="search"
                style={{ color: filtered ? 'black' : 'white' }}
            />
        ),
        onFilter: (value, record) =>
            record[dataIndex]
                ? record[dataIndex]
                    .toString()
                    .toLowerCase()
                    .includes(value.toLowerCase())
                : false,
        onFilterDropdownOpenChange: (visible) => {
            if (visible) {
                setTimeout(() => searchInput.current.select());
            }
        },
        // render: (text) =>
        //   text ? (
        //     searchedColumn === dataIndex ? (
        //       <Highlighter
        //         highlightStyle={{ backgroundColor: '#ffc069', padding: 0 }}
        //         searchWords={[searchText]}
        //         autoEscape
        //         textToHighlight={text.toString()}
        //       />
        //     ) : (
        //       text
        //     )
        //   ) : null,
    });

    const getQualityConfigurationInfo = () => {
        const req = new QualityConfigurationInfoRequest(
            user?.userName,
            user?.orgData?.unitCode,
            user?.orgData?.companyCode,
            user?.userId,
            true,
            false,
            null
        );
        qualityConfigurationService.getQualityConfigurationInfo(req)
            .then((res) => {
                if (res.status) {
                    setData(res.data);
                } else {
                    setData([]);
                    AlertMessages.getErrorMessage(res.internalMessage);
                }
            })
            .catch((err) => {
                AlertMessages.getErrorMessage(err.message);
            });
    };

    const openCreateModal = () => {
        setSelectedRecord(null);
        setModalTitle("Create");
        setOkText("Create");
        setIsModalOpen(true);
    };

    const openEditModal = (record) => {
        setSelectedRecord(record);
        setModalTitle("Update");
        setOkText("Update");
        setIsModalOpen(true);
        formRef.setFieldsValue(record);
    };

    const [detailedView, setDetailedView] = useState<any>('');
    const [isViewModal, setIsViewModal] = useState<boolean>(false);

    const handleView = (rec) => {
        setDetailedView(rec);
        setIsViewModal(true)
    }

    const handleModalClose = () => {
        setIsModalOpen(false);
        setSelectedRecord(null);
        formRef.resetFields();
        getQualityConfigurationInfo();
    };

    // const handleToggleActivation = (rowData) => {
    //     const updatedRow = { ...rowData, isActive: !rowData.isActive };
    //     qualityConfigurationService.createQualityConfiguration(updatedRow)
    //         .then((res) => {
    //             if (res.status) {
    //                 AlertMessages.getSuccessMessage(res.internalMessage);
    //                 getQualityConfigurationInfo();
    //             } else {
    //                 AlertMessages.getErrorMessage(res.internalMessage);
    //             }
    //         })
    //         .catch((err) => {
    //             AlertMessages.getErrorMessage(err.message);
    //         });
    // };



    const columns: any = [
        {
            title: 'Sno',
            dataIndex: 'sno',
            key: 'sno',
            align: 'center',
            render: (text, record, index) => index + 1
        },
        {
            title: 'Style Code',
            dataIndex: 'styleCode',
            key: 'styleCode',
            align: 'center',
            ...getColumnSearchProps('styleCode')
        },
        {
            title: 'Process Type',
            dataIndex: 'processType',
            key: 'processType',
            align: 'center',
            render: (val) => processTypeEnumDisplayValues[val],
            filter: (value, record) => processTypeEnumDisplayValues[record.processType].includes(value),
            filters: Object.entries(processTypeEnumDisplayValues).map(([key, label]) => ({
                text: label,
                value: key,
            })),
            
        },
        {
            title: 'Quality Type',
            dataIndex: 'qualityType',
            key: 'qualityType',
            align: 'center',
            ...getColumnSearchProps('qualityType')
        },
        {
            title: 'Quality %',
            dataIndex: 'qualityPercentage',
            key: 'qualityPercentage',
            align: 'center',
        },
        {
            title: 'Is Mandatory',
            dataIndex: 'isMandatory',
            key: 'isMandatory',
            align: 'center',
            render: (val) => (val ? 'Yes' : 'No'),
        },
        {
            title: 'Actions',
            dataIndex: 'action',
            align: 'center',
            render: (_, rowData) => (
                <>
                    <EyeOutlined onClick={() => handleView(rowData)} />
                    <Divider type="vertical" />
                    <EditOutlined onClick={() => openEditModal(rowData)} />
                    {/* 
                    <Popconfirm
                        title={rowData.isActive ? 'Are you sure to deactivate this configuration?' : 'Are you sure to activate this configuration?'}
                        onConfirm={() => handleToggleActivation(rowData)}
                    >
                        <Switch
                            checked={rowData.isActive}
                            checkedChildren={<CheckOutlined />}
                            unCheckedChildren={<CloseOutlined />}
                        />
                    </Popconfirm> 
                    */}
                </>
            ),
        },
    ];

    const handleFormSubmit = () => {
        // Handle form submission logic here
        // After successful submission, refresh the data and close the modal
        getQualityConfigurationInfo();
        handleModalClose();
    };

    const styleCodes = [
        { code: 'ST001', name: 'Casual Shirt' },
        { code: 'ST002', name: 'Denim Jacket' },
        { code: 'ST003', name: 'Formal Pants' },
    ];

    function showModals(): void {
        throw new Error('Function not implemented.');
    }

    const handleViewModalClose = () => {
        setIsViewModal(false)
        getQualityConfigurationInfo()
    }

    return (
        <ProCard title={<span><SettingOutlined /> Quality Configuration</span>} extra={<Button onClick={() => openCreateModal()} type="primary">Create</Button>}>

            {/* <div style={{ display: 'flex', float: 'left', alignItems: 'center', gap: 8, marginBottom: 16 }}>
                <label style={{ marginLeft: 5 }}>Style Code:</label>
                <Select
                    style={{ width: 200 }}
                    placeholder="Select Style"
                    onChange={handleChange}
                    allowClear
                    showSearch
                    optionFilterProp="children"
                >
                    {styleCodes.map((item) => (
                        <Option key={item.code} value={item.code}>
                            {item.code}
                        </Option>
                    ))}
                </Select>
            </div> */}

            <Table
                columns={columns}
                dataSource={data}
                rowKey="id"
                size="small"
                bordered
                scroll={{x: 'max-content'}}
                style={{minWidth: '100%'}}
            />

            <Modal
                title={modalTitle}
                open={isModalOpen}
                onCancel={handleModalClose}
                footer={null}
                width="80%"
                destroyOnClose
            >
                <QualityConfigurationForm
                    formRef={formRef}
                    initialValues={selectedRecord}
                    onFinish={handleFormSubmit}
                />
            </Modal>

            <Modal open={isViewModal} onCancel={handleViewModalClose} width={'80%'} footer={
                    <Button onClick={handleViewModalClose} type='dashed' danger >Close</Button>
                }>
                <QualityConfigurationDetailedView rec={detailedView} />
                
            </Modal>
        </ProCard>
    );
};

export default QualityConfigurationView;
