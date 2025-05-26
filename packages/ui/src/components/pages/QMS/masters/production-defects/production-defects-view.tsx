import { SewingDefectFilterReq } from "@xpparel/shared-models";
import { ProductionDefectService } from "@xpparel/shared-services";
import { Button, Card, Form, Modal, Select, Table, Tag } from "antd";
import { useAppSelector } from "packages/ui/src/common";
import React, { useEffect, useState } from "react";
import Barcode from "react-barcode";
import ProductionDefectsForm from "./production-defects-form";
const { Option } = Select

export const ProductionDefectsView = () => {
    const [pageSize, setPageSize] = useState<number>(1);
    const [page, setPage] = useState<number>(1)
    const sewDefService = new ProductionDefectService()
    const [data, setData] = useState<any[]>([])
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [modalBarcode, setModalBarcode] = useState('');
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(Boolean)
    const user = useAppSelector((state) => state.user.user.user);
    const [oktext, setOkText] = useState("Create");
    const [title, setTitle] = useState("Create Production Defects");
    const [form] = Form.useForm()

    useEffect(() => {
        getData()
    }, [])


    const handleIconClick = (barcode) => {
        setModalBarcode(barcode);
        setIsModalVisible(true);
    };

    const getData = () => {
        try {
            const req = new SewingDefectFilterReq()
            sewDefService.getSewingDefectInfo(req).then(res => {
                if (res.status) {
                    setData(res.data)
                } else {
                    setData([])
                }
            })
        } catch (err) {
            console.log(err);
        }
    }


    const columns: any = [
        {
            title: 'S.No',
            dataIndex: 'sno',
            render: (text, object, index) => (page - 1) * pageSize + (index + 1),
            align: "center",
        },
        {
            title: 'MO Number',
            dataIndex: 'poNumber',
            render: (text) => <span style={{ textTransform: 'uppercase' }}>{text ? text : '-'}</span>,
        },
        {
            title: 'Order Quantity',
            dataIndex: 'orderQty',
            align: 'right',
            render: (text) => <span style={{ textTransform: 'uppercase' }}>{text ? text : '-'}</span>,

        },
        {
            title: 'Sample Quantity',
            dataIndex: 'sewingSampleQty',
            align: 'right',
            render: (text) => <span style={{ textTransform: 'uppercase' }}>{text ? text : '-'}</span>,
        },
        {
            title: 'Inspected Quantity',
            dataIndex: 'inspectedCount',
            align: 'right',
            render: (text) => <span style={{ textTransform: 'uppercase' }}>{text ? text : '-'}</span>,
        },
        {
            title: 'Operator',
            dataIndex: 'operationInfo',
            key: 'operationInfo',
            render: (text) => {
                const employee = text.map((item, index) => (
                    <div key={index} style={{ padding: '5px', borderBottom: index !== text.length - 1 ? '1px solid #e8e8e8' : 'none' }}>
                        {item.employee || '-'}
                    </div>
                ))
                return <div style={{ display: 'flex', flexDirection: 'column' }}>{employee}</div>
            },

        },
        {
            title: 'Operation',
            dataIndex: 'operationInfo',
            key: 'operationInfo',
            render: (text) => {
                const operation = text.map((item, index) => (
                    <div key={index} style={{ padding: '5px', borderBottom: index !== text.length - 1 ? '1px solid #e8e8e8' : 'none' }}>
                        {item.operation || '-'}
                    </div>
                ))
                return <div style={{ display: 'flex', flexDirection: 'column' }}>{operation}</div>;
            }

        },
        {
            title: 'Quality Type',
            dataIndex: 'operationInfo',
            key: 'operationInfo',
            render: (text) => {
                const qualityType = text.map((item, index) => (
                    <div key={index} style={{ padding: '5px', borderBottom: index !== text.length - 1 ? '1px solid #e8e8e8' : 'none' }}>
                        {item.qualityType || '-'}
                    </div>
                ))
                return <div style={{ display: 'flex', flexDirection: 'column' }}>{qualityType}</div>;
            }
        },
        {
            title: 'Test Result',
            dataIndex: 'operationInfo',
            key: 'operationInfo',
            render: (text) => {
                const testResult = text.map((item, index) => {
                    let color = '';
                    if (item.testResult === 'Pass') {
                        color = 'green';
                    } else if (item.testResult === 'Fail') {
                        color = 'red';
                    }
                    return (
                        <React.Fragment key={index}>
                            <Tag
                                color={color}
                                style={{
                                    textAlign: "center",
                                    marginBottom: "1px",
                                    color: "black"
                                }}
                            >
                                {item.testResult || '-'}
                            </Tag>
                            {index !== text.length - 1 && (
                                <hr
                                    style={{
                                        border: "0",
                                        borderTop: "1px solid #e8e8e8",
                                        margin: "5px 0",
                                        height: "1px",
                                    }}
                                />
                            )}
                        </React.Fragment>
                    );
                });

                return <div style={{ display: 'flex', flexDirection: 'column' }}>{testResult}</div>;
            },
        },
        {
            title: 'Defect',
            dataIndex: 'operationInfo',
            key: 'operationInfo',
            render: (text) => {
                const defect = text.map((item, index) => (
                    <div key={index} style={{ padding: '5px', borderBottom: index !== text.length - 1 ? '1px solid #e8e8e8' : 'none' }}>
                        {item.defect || '-'}
                    </div>
                ))
                return <div style={{ display: 'flex', flexDirection: 'column' }}>{defect}</div>;
            }

        },
        {
            title: 'Bar Code',
            dataIndex: 'operationInfo',
            key: 'operationInfo',
            fixed: "right",
            render: (text) => {
                return (
                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                        {text.map((item, index) => (
                            <div
                                key={index}
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    padding: '5px',
                                    borderBottom: index !== text.length - 1 ? '1px solid #e8e8e8' : 'none',
                                }}
                            >
                                <div style={{ flex: 1 }}>{item.barcode || '-'}</div>
                                {/* {item.barcode && (
                                    <Button
                                        type="link"
                                        icon={<EyeOutlined />}
                                        onClick={() => handleIconClick(item.barcode)}
                                        style={{ marginLeft: '10px' }}
                                    />
                                )}  */}
                            </div>
                        ))}
                    </div>
                );
            },
        },
    ]

    const showModals = () => {
        setIsCreateModalOpen(true)
        setOkText("Submit")
        setTitle("Production Defects");
    }

    const onCancel = () => {
        setIsCreateModalOpen(false)
        getData()
    }

    return (
        <Card title='Production Defects' extra={<Button onClick={() => showModals()} type="primary">Create</Button>}>
            <Table columns={columns} dataSource={data} style={{ borderRadius: "9px" }} className="custom-table" scroll={{ x: 'max-content' }} size='small'
                bordered
                pagination={{
                    pageSize: 20,
                    onChange(current, pageSize) {
                        setPage(current);
                        setPageSize(pageSize);
                    }
                }}
            />

            <Modal
                width="80%"
                title={title}
                style={{ textAlign: "center", left: "3%", top: "5%" }}
                open={isCreateModalOpen}
                footer={[]}
                okText={oktext}
                cancelText="Close"
                onCancel={onCancel}
            >
                <ProductionDefectsForm form={form} onCancel={onCancel} />
            </Modal>

            <Modal
                title="Barcode"
                open={isModalVisible}
                onCancel={() => setIsModalVisible(false)}
                footer={null}
                centered
            >
                <div style={{ textAlign: 'center' }}>
                    <Barcode value={modalBarcode} />
                </div>
            </Modal>

        </Card>
    )

}

export default ProductionDefectsView