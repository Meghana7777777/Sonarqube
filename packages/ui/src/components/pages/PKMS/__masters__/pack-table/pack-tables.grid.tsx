import { DeleteOutlined, EditFilled, EditOutlined } from "@ant-design/icons"
import { Button, Card, Divider, Form, Input, Modal, Switch, Table } from "antd"
import { useEffect, useState } from "react"
import { SequenceUtils, useAppSelector } from "packages/ui/src/common";
import { PackTableService } from "@xpparel/shared-services";
import { CommonIdReqModal, CommonRequestAttrs, PackTableCreateRequest, PackTableIdRequest, PackTableModel } from "@xpparel/shared-models";
import { AlertMessages } from "packages/ui/src/components/common";
import { PackTablesForm } from "./pack-tables.form";
import { ColumnsType } from "antd/lib/table";

export const CreatePackTables = () => {
    const [formRef] = Form.useForm();
    const user = useAppSelector((state) => state.user.user.user);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [oktext, setOkText] = useState("Create");
    const [istitle, setIsTitle] = useState("Create Pack Tables");
    const [selectedRecord, setSelectedRecord] = useState<PackTableModel>();
    const service = new PackTableService();
    const [resData, setResData] = useState<PackTableModel[]>([]);
    const [packtableId, setpacktableId] = useState(false);
    const [searchedText, setSearchedText] = useState("");
    const [initialValues, setIsInitialValues] = useState(null);

    useEffect(() => {
        getAllPackTables();
    }, []);
    ;
    const fieldsReset = () => {
        formRef.resetFields();
    };
    const showModal = (record) => {
        if (!record.isActive) {
            AlertMessages.getErrorMessage('Please Activate the record before Edit')
            return
          }
        setpacktableId(true);
        setSelectedRecord(record);
        setIsModalOpen(true);
        setOkText("Update");
        setIsTitle("Update Pack Tables");
    };
    const showModals = () => {
        fieldsReset();
        setpacktableId(false);
        setOkText("Create");
        setIsTitle("Create Pack Tables");
        setSelectedRecord(null);
        setIsModalOpen(true);
    }
    const onClose = () => {
        fieldsReset();
        setIsModalOpen(false);

    }

    const getAllPackTables = () => {
        const obj = new CommonRequestAttrs(user?.userName, user?.orgData?.unitCode, user?.orgData?.companyCode, user?.userId);
        service.getAllPackTables(obj).then(res => {
            if (res.status) {
                setResData(res.data);
            }
        }).catch(err => {
            console.log(err.message)
        })
    }
    const handleOk = () => {
        formRef.validateFields().then(values => {
            const packTableModel: PackTableModel[] = [];
            const packblsModel = new PackTableModel(values.id, values.capacity, values.tableName, values.tableDesc, values.extRefCode, values.isActive);
            packTableModel.push(packblsModel);
            const req = new PackTableCreateRequest(user?.userName, user?.orgData?.unitCode, user?.orgData?.companyCode, user?.userId, packTableModel);
    
            service.createPackTable(req).then(res => {
                if (res.status) {
                    const successMessage = oktext === "Update" ? "Updated successfully" : "Pack Table Created successfully"; 
                    AlertMessages.getSuccessMessage(successMessage);
                    fieldsReset();
                    setIsModalOpen(false);
                    getAllPackTables();
                } else {
                    AlertMessages.getErrorMessage(res.internalMessage);
                }
            }).catch(err => {
                console.log(err);
                fieldsReset();
            });
        }).catch(() => {
            AlertMessages.getErrorMessage("Please fill all the required fields before creation.");
        });
    };
    
    const togglePackTypeTypeData = (record) => {
        // setIsInitialValues(record);
        togglePackType(record.id);
      };
     
         const togglePackType = (id) => {
            const req = new CommonIdReqModal(id,user?.userName, user?.orgData?.unitCode, user?.orgData?.companyCode, user?.userId,);
            service.togglePackType(req).then((res) => {
              if (res.status) {
                AlertMessages.getSuccessMessage(res.internalMessage);
                getAllPackTables();
              } else {
                AlertMessages.getErrorMessage(res.internalMessage);
              }
            })
              .catch(err => console.log(err.message));
          };
        

    const operationColumns: ColumnsType<any> = [
        {
            title: ' Pack Table Name',
            dataIndex: 'tableName',
            align: 'center',
            key: 'tableName',
            sorter: (a, b) => {
                return a.tableName.localeCompare(b.tableName);
            },
            sortDirections: ["descend", "ascend"],
            filteredValue: [String(searchedText).toLowerCase()],
            onFilter: (value, record) => {
                return SequenceUtils.globalFilter(value, record);
            },
        },
        {
            title: ' Pack Table Desc',
            dataIndex: 'tableDesc',
            align: 'center',
            key: 'tableDesc',
         
        },
        {
            title: 'Capacity',
            dataIndex: 'capacity',
            align: 'center',
            key: 'capacity'
       
        },
        {
            title: 'External Ref Code',
            dataIndex: 'extRefCode',
            align: 'center',
            key: 'extRefCode'
           
        },

        {
            title: 'Action',
            dataIndex: 'action',
            align: 'center',
            key: 'action',
            render: (value, record) => {
                return <>
                    <EditFilled style={{  color: "#08c", fontSize: "20px" }} onClick={() => showModal(record)} /><Divider type="vertical" />
                    <Switch
            className={record.isActive ? "toggle-activated" : "toggle-deactivated"}
            checked={record.isActive}
            onChange={() => togglePackTypeTypeData(record)}
            style={{ fontSize: "20px", color: "#08c" }}
          />
                </>
            }
        }
    ]

    return <>
        <Card title='Pack Tables' extra={<Button onClick={() => showModals()} type="primary">Create</Button>}>
            <Modal cancelButtonProps={{ style: { backgroundColor: 'red', color: 'white' } }} title={istitle} style={{ textAlign: "center" }} open={isModalOpen} okText={oktext} onCancel={onClose} onOk={handleOk} cancelText="cancel">
                <Divider type="horizontal"></Divider>
                <PackTablesForm formRef={formRef} initialvalues={selectedRecord} key={selectedRecord?.id} packtableId={packtableId} />

            </Modal>
            <Input.Search
                placeholder="Search"
                allowClear
                onChange={(e) => {
                    setSearchedText(e.target.value);
                }}
                onSearch={(value) => {
                    setSearchedText(value);
                }}
                style={{ width: 200, float: "right" }}
            />
            <Table dataSource={resData}size='small'columns={operationColumns}bordered></Table>
        </Card>

    </>

}

export default CreatePackTables;