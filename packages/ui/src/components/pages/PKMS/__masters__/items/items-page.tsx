import { AppstoreAddOutlined, ContainerOutlined, InboxOutlined, ShoppingOutlined, TagsOutlined } from "@ant-design/icons";
import { CommonIdReqModal, ItemsModelDto, ItemsTypeModel, MaterialReqModel, MaterialTypeEnum } from "@xpparel/shared-models";
import { ItemsServices } from "@xpparel/shared-services";
import { Button, Card, Form, Modal, Tabs } from "antd";
import TabPane from 'antd/es/tabs/TabPane';
import { useAppSelector } from "packages/ui/src/common";
import { AlertMessages } from "packages/ui/src/components/common";
import { useEffect, useState } from "react";
import ItemsForm from "./items-form";
import { ItemsGrid } from "./items-grid";

export const ItemsPage = () => {
    const [itemsGridData, setItemsGridData] = useState<ItemsModelDto[]>();
    const [category, setCategory] = useState<MaterialTypeEnum>(MaterialTypeEnum.CARTON);
    const [openItemsModal, setItemsModal] = useState<boolean>(false);
    const [initialValues, setInitialValues] = useState<ItemsModelDto | null>(null);
    const [formRef] = Form.useForm();
    const user = useAppSelector((state) => state.user.user.user);
    const { userName, orgData, userId } = user;
    const service = new ItemsServices();
    const [okText, setOkText] = useState<string>("Save");

    useEffect(() => {
        getAllItems();
    }, [category]);

    const itemsModalClose = () => {
        setItemsModal(false);
        formRef.resetFields();
        setInitialValues(null);
        getAllItems();
    };

    const itemsModalOpen = () => {
        formRef.resetFields();
        setItemsModal(true);
        setOkText("Save");
    };

    const editItemsData = (record: any) => {
        if (!record.isActive) {
            AlertMessages.getErrorMessage('Please Activate the record before Edit')
            return
        }
        setInitialValues(record);
        setItemsModal(true);
        setOkText("Update")
    };

    const toggleItemsData = (record: any) => {
        setInitialValues(record);
        toggleItems(record.id);
    };

    const getAllItems = () => {
        const req = new MaterialReqModel(category, userName, userId, orgData.unitCode, orgData.companyCode);
        service.getAllItems(req).then(res => {
            if (res.status) {
                setItemsGridData(res.data);
            } else {
                setItemsGridData([]);
            }
        }).catch(error => console.log(error.message));
    };

    const toggleItems = (id: number) => {
        const req = new CommonIdReqModal(id, userName, orgData.unitCode, orgData.companyCode, userId);
        service.toggleItems(req)
            .then(res => {
                if (res.status) {
                    AlertMessages.getSuccessMessage(res.internalMessage);
                    getAllItems();
                } else {
                    AlertMessages.getErrorMessage(res.internalMessage);
                }
            })
            .catch(error => console.log(error.message));
    };

    const creatItem = () => {
        formRef.validateFields().then((formValues) => {
            const isEditMode = !!initialValues;
            const isDuplicateCheckNeeded = !isEditMode || (isEditMode && initialValues.code !== formValues.code);
            const req = new ItemsTypeModel(formValues.id, formValues.code, formValues.desc, formValues.category, formValues.materialType, formValues.dimensionId, userName, orgData.unitCode, orgData.companyCode, userId, formValues.length, formValues.width, formValues.height);
            service.createItems([req]).then((res) => {
                if (res.status) {
                    if (res.internalMessage === 'DUPLICATE_ITEMS_CODE' && isDuplicateCheckNeeded) {
                        AlertMessages.getErrorMessage('Items already exist.');
                    } else {
                        const actionMessage = isEditMode ? 'Updated' : 'Created';
                        AlertMessages.getSuccessMessage(`Items ${actionMessage} Successfully`);
                        itemsModalClose();
                    }
                } else {
                    AlertMessages.getErrorMessage(res.internalMessage || 'An error occurred.');
                }
            }).catch((error) => {
                console.log(error);
                AlertMessages.getErrorMessage('An error occurred while saving the items.');
            });
        }).catch((error) => {
            console.log(error);
            AlertMessages.getErrorMessage('Please fill in the required fields.');
        });
    };

    const tabsOnchange = (key) => {
        setCategory(key);
        localStorage.setItem('activeTabName', key);
    };

    return (
        <div>
            <Card
                title={
                    <span>
                        <AppstoreAddOutlined style={{ marginRight: '8px' }} />
                        Items
                    </span>
                }
                extra={
                    <Button size="small" onClick={itemsModalOpen} type="primary">
                        Create
                    </Button>
                }
            >
                <Tabs centered onChange={tabsOnchange} activeKey={category} key={category} size="small">
                    <TabPane tab={<><InboxOutlined />{MaterialTypeEnum.CARTON}</>} key={MaterialTypeEnum.CARTON}>
                        <ItemsGrid category={category} itemsGridData={itemsGridData} toggleItemsData={toggleItemsData} editItemsData={editItemsData} />
                    </TabPane>
                    <TabPane tab={<><ShoppingOutlined />{MaterialTypeEnum.POLY_BAG}</>} key={MaterialTypeEnum.POLY_BAG}>
                        <ItemsGrid category={category} itemsGridData={itemsGridData} toggleItemsData={toggleItemsData} editItemsData={editItemsData} />
                    </TabPane>
                    <TabPane tab={<><TagsOutlined />{MaterialTypeEnum.TRIM}</>} key={MaterialTypeEnum.TRIM}>
                        <ItemsGrid category={category} itemsGridData={itemsGridData} toggleItemsData={toggleItemsData} editItemsData={editItemsData} />
                    </TabPane>
                </Tabs>
            </Card>
            <Modal
                width={800}
                title={<span style={{ textAlign: "center", display: "block", margin: "5px 0px" }}>Items</span>}
                cancelButtonProps={{ style: { backgroundColor: 'red', color: 'white' } }}
                open={openItemsModal}
                onCancel={itemsModalClose}
                onOk={creatItem}
                cancelText='Cancel'
                closable
                okText={okText}
            >
                <ItemsForm formRef={formRef} initialValues={initialValues} category={category} />
            </Modal>
        </div>
    );
};

export default ItemsPage;
