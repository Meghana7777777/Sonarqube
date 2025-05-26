import Icon, { DeleteOutlined, EditOutlined } from "@ant-design/icons"
import { Button, Card, Divider, Form, Modal, Popconfirm, Switch, Table } from "antd"
import { useEffect, useState } from "react"
import { useAppSelector } from "packages/ui/src/common";
import { ReasonsService, VendorService } from "@xpparel/shared-services";
import { CommonRequestAttrs, ComponentModel, CutTableCreateRequest, CutTableIdRequest, CutTableModel, MarkerCreateRequest, MarkerTypeCreateRequest, MarkerTypeIdRequest, MarkerTypeModel, ProductTypeCompModel, ProductTypeIdRequest, ProductTypeModel, ProductTypeRequest, ReasonCreateRequest, ReasonIdRequest, ReasonModel, VendorCreateRequest, VendorModel } from "@xpparel/shared-models";
import { AlertMessages } from "packages/ui/src/components/common";
import { ColumnsType } from "antd/lib/table";
import VendorsForm from "./vendor.form";

export const CreateVendors = () => {
    const [formRef] = Form.useForm();
    const user = useAppSelector((state) => state.user.user.user);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [oktext, setOkText] = useState("Create");
    const [selectedRecord, setSelectedRecord] = useState<VendorModel>();
    const service = new VendorService();
    const [resData, setResData] = useState<VendorModel[]>([]);
    const [reasons, setReasons] = useState(false);
    const [title, setTitle] = useState("Create Vendor");
    useEffect(() => {
        getAllVendors();
    }, []);
    ;
    const fieldsReset = () => {
        formRef.resetFields();
    };
    const showModal = (record) => {
        setReasons(true);
        setSelectedRecord(record);
        setIsModalOpen(true);
        setOkText("Update");
        setTitle("Update Vendor");
    };
    const showModals = () => {
        fieldsReset();
        setReasons(false);
        setSelectedRecord(null);
        setOkText("Create");
        setTitle("Create Vendor");
        setIsModalOpen(true);
    }
    const onClose = () => {
        fieldsReset();
        setIsModalOpen(false);

    }

    const getAllVendors = () => {
        const obj = new CommonRequestAttrs(user?.userName, user?.orgData?.unitCode, user?.orgData?.companyCode, user?.userId);
        service.getAllVendors(obj).then(res => {
            if (res.status) {
                setResData(res.data);
                // AlertMessages.getSuccessMessage(res.internalMessage);
        } else {
            // AlertMessages.getErrorMessage(res.internalMessage)
        }
        }).catch(err => {
            // AlertMessages.getErrorMessage(err.message)
        })
    }
    const handleOk = () => {
        formRef.validateFields().then(values => {
            const req = new VendorCreateRequest(user?.userName, user?.orgData?.unitCode, user?.orgData?.companyCode, user?.userId, values.id, values.vName, values.vCode, values.vDesc, values.vCountry, values.vPlace, values.vAddress, values.vCategory, values.vContact);
            service.createVendor(req).then(res => {
                if (res.status) {
                    AlertMessages.getSuccessMessage(res.internalMessage);
                    fieldsReset();
                    setIsModalOpen(false);
                    getAllVendors();
                } else {
                    AlertMessages.getErrorMessage(res.internalMessage)
                }
            }).catch(err => {
                console.log(err);
                fieldsReset();
            })
        }).catch((err) => {
            AlertMessages.getErrorMessage("Please fill all the required fileds before creation.");
        })

    };

    const deleteVendor = (recod) => {
        const obj = new VendorCreateRequest(user?.userName, user?.orgData?.unitCode, user?.orgData?.companyCode, user?.userId, recod.id, recod.vName, recod.vCode, recod.vDesc, recod.vCountry, recod.vPlace, recod.vAddress, recod.vCategory, recod.vContact);
        service.deleteVendor(obj).then(res => {
            if (res.status) {
                AlertMessages.getSuccessMessage(res.internalMessage);
                getAllVendors();
            }
            else {
                AlertMessages.getErrorMessage(res.internalMessage)
            }
        }).catch(err => {

            console.log(err.message)
        })
    }

    const reasonsColumns: ColumnsType<any> = [
        {
            title: 'Vendor Code',
            dataIndex: 'vCode',
            align: 'center',
            key: 'vCode',
        },
        {
            title: 'Vendor Name',
            dataIndex: 'vName',
            align: 'center',
            key: 'vName',
        },
        {
            title: 'Vendor Description',
            dataIndex: 'vDesc',
            align: 'center',
            key: 'vDesc',
        },
        {
            title: 'Vendor Category',
            dataIndex: 'vCategory',
            align: 'center',
            key: 'vCategory',
        },
        {
            title: 'Vendor country',
            dataIndex: 'vCountry',
            align: 'center',
            key: 'vCountry',
        },
        {
            title: 'Vendor Place',
            dataIndex: 'vPlace',
            align: 'center',
            key: 'vPlace',
        },
        {
            title: 'Vendor Address',
            dataIndex: 'vAddress',
            align: 'center',
            key: 'vAddress',
        },
        {
            title: 'Vendor Contact',
            dataIndex: 'vContact',
            align: 'center',
            key: 'vContact',
        },

        {
            title: 'Action',
            dataIndex: 'action',
            align: 'center',
            key: 'action',
            render: (value, recod) => {
                return <>
                    <EditOutlined style={{ color: "blue", fontSize: "20px" }} onClick={() => showModal(recod)} /><Divider type="vertical" />
                    <DeleteOutlined style={{ color: "red", fontSize: "20px" }} onClick={() => deleteVendor(recod)} /><Divider type="vertical" />



                </>
            }
        }
    ]
    return <>
        <Card title='Vendors' extra={<Button onClick={() => showModals()} type="primary">Create</Button>}>
            <Modal cancelButtonProps={{ style: { backgroundColor: 'red', color: 'white' } }} title={title} style={{ textAlign: "center" }} open={isModalOpen} okText={oktext} onCancel={onClose} onOk={handleOk} cancelText="Close">
                <VendorsForm formRef={formRef} initialvalues={selectedRecord} key={selectedRecord?.id} reasonId={reasons} />
            </Modal>
            <Table dataSource={resData} columns={reasonsColumns} size="small" bordered scroll={{x: 'max-content'}} style={{minWidth: '100%'}}></Table>
        </Card>

    </>

}

export default CreateVendors;