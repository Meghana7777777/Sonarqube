import { KG_ItemWiseAllocationModel_C, KG_ItemWiseMaterialRequirementModel, KG_KnitGroupMaterialRequirementModel, KG_KnitJobMaterialAllocationModel_C, KG_KnitJobMaterialAllocationRequest, KG_ObjectWiseAllocationInfo_C, KG_ObjectWiseAllocationInfo_R, ProcessTypeEnum } from "@xpparel/shared-models";
import { Tag, Tabs, Table, Checkbox, Input, Button, TableColumnsType, InputNumber, DatePicker, Form } from "antd";
import { TableRowSelection } from "antd/es/table/interface";
import { useEffect, useState } from "react";
import { AlertMessages } from "../../../common";
import { KnittingJobMaterialAllocationService } from "@xpparel/shared-services";
import { disabledBackDates, useAppSelector } from "packages/ui/src/common";
import { IKnitJobSummary, knitMaterialJobsColumns } from "./knit-material-interface";
import moment from "moment";
import { defaultDateFormat } from "../../../common/data-picker/date-picker";
import { Dayjs } from "dayjs";
interface IObjectDetails extends KG_ObjectWiseAllocationInfo_R {
    currentlyAllocatedQty: number;
    isAllocated: boolean;
}
interface ISelectedItems {
    selectedRowKeys: string[];
    itemInfo: KG_ItemWiseMaterialRequirementModel;
    requiredQty: number; // How much quantity need to be fulfil
    currentlyAllocatedQty: number;
    knitGroup: string[];
    objectDetails: IObjectDetails[];
}
interface IProps {
    knitGroups: string[];
    style: string;
    productCode: string;
    poSerial: number;
    poName: string;
    materialsData: KG_KnitGroupMaterialRequirementModel[];
    selectedJobs: string[];
    knitTableData: IKnitJobSummary[]
    closeModal: (isReload: boolean) => void;

}
const MaterialSelectionTab = (props: IProps) => {

    const { knitGroups, materialsData, poName, poSerial, productCode, style, selectedJobs, closeModal, knitTableData } = props;
    const [selectedItemObjects, setSelectedItemObjects] = useState<{ [key: string]: ISelectedItems }>({});
    const [materialRequiredDate, setMaterialRequiredDate] = useState<any>(undefined);
    const [updateKey, setUpdateKey] = useState<number>(0);
    const [form] = Form.useForm();
    const user = useAppSelector((state) => state.user.user.user);
    useEffect(() => {
        constructItemsMaterialData(materialsData);
    }, [props.poSerial]);

    const constructItemsMaterialData = (materialsDataP: KG_KnitGroupMaterialRequirementModel[]) => {
        const itemKeyObj: { [key: string]: ISelectedItems } = {};

        materialsDataP.forEach(knitObj => {
            knitObj.itemWiseMaterialRequirement.forEach(itemObj => {

                if (!itemKeyObj.hasOwnProperty(itemObj.itemCode)) {
                    const itemRow: ISelectedItems = {
                        currentlyAllocatedQty: 0,
                        itemInfo: itemObj,
                        knitGroup: [knitObj.knitGroup],
                        requiredQty: 0,
                        selectedRowKeys: [],
                        objectDetails: []

                    }
                    itemKeyObj[itemObj.itemCode] = itemRow;
                }
                const requiredQty = Number(itemObj.totalRequiredQty) - Number(itemObj.totalAllocatedQty);
                const existingItem = itemKeyObj[itemObj.itemCode];
                existingItem.requiredQty += requiredQty;
                // Add Knit groups(If Multiple Knit groups have same Item code)
                if (!existingItem.knitGroup.includes(knitObj.knitGroup)) {
                    existingItem.knitGroup.push(knitObj.knitGroup);
                }
                // Add Object details 
                existingItem.objectDetails = itemObj.objectWiseDetail.map(e => ({ ...e, currentlyAllocatedQty: 0, isAllocated: false }))
            })
        });
        setSelectedItemObjects(itemKeyObj);
    }
    const knitMaterialService = new KnittingJobMaterialAllocationService();





    const handleSubmit = () => {

        let isObjectsSelected = false;
        const itemAllocatingData: KG_KnitJobMaterialAllocationModel_C[] = [];
        Object.values(selectedItemObjects).forEach(itemInfo => {
            const allocatedObjects: KG_ItemWiseAllocationModel_C[] = [];

            const objectWiseInfo: KG_ObjectWiseAllocationInfo_C[] = [];
            itemInfo.objectDetails.forEach(rmObj => {
                if (rmObj.isAllocated && rmObj.currentlyAllocatedQty > 0) {
                    isObjectsSelected = true;
                    objectWiseInfo.push(new KG_ObjectWiseAllocationInfo_C(rmObj.objectCode, rmObj.currentlyAllocatedQty));
                }
            })

            allocatedObjects.push(new KG_ItemWiseAllocationModel_C(itemInfo.itemInfo.itemCode, itemInfo.requiredQty, objectWiseInfo))
            const itemObj = new KG_KnitJobMaterialAllocationModel_C(undefined, undefined, itemInfo.knitGroup.toString(), selectedJobs, allocatedObjects);
            itemAllocatingData.push(itemObj);
        });
        if(!isObjectsSelected) {
            AlertMessages.getWarningMessage("Please select objects")
            return
        }

        const req = new KG_KnitJobMaterialAllocationRequest(user?.userName, user?.orgData?.unitCode, user?.orgData?.companyCode, user?.userId, poSerial, ProcessTypeEnum.KNIT, materialRequiredDate, 0, itemAllocatingData);
        knitMaterialService.allocateMaterialForKnitGroup(req).then(res => {
            if (res.status) {
                AlertMessages.getSuccessMessage(res.internalMessage);
                closeModal(true);
            } else {
                AlertMessages.getErrorMessage(res.internalMessage);
            }
        }).catch(err => {
            AlertMessages.getErrorMessage(err.message);
        })



    };
    const renderColumns = (item: KG_ItemWiseMaterialRequirementModel) => {
        const columns: TableColumnsType<IObjectDetails> = [
            { title: "Object Type", dataIndex: "objectType", key: "objectType" },
            { title: "Object Code", dataIndex: "objectCode", key: "objectCode" },
            { title: "Location Code", dataIndex: "locationCode", key: "locationCode" },
            { title: "Supplier Code", dataIndex: "supplierCode", key: "supplierCode" },
            { title: "VPO", dataIndex: "VPO", key: "VPO" },
            { title: "Issued Quantity", dataIndex: "issuedQuantity", key: "issuedQuantity" },
            { title: "Allocated Quantity", dataIndex: "alreadyAllocatedQuantity", key: "alreadyAllocatedQuantity" },
            { title: "Available Quantity", dataIndex: "availableQty", key: "availableQuantity" },
            {
                title: "Allocating Quantity",
                dataIndex: "allocatingQuantity",
                key: "allocatingQuantity",
                render: (_, record, index) => {
                    return (
                        <InputNumber
                            min={0}
                            disabled={!record.isAllocated}
                            value={record.isAllocated ? record.currentlyAllocatedQty : 0}
                            onChange={(e) =>
                                handleQtyChange(
                                    e,
                                    record,
                                    item.itemCode,
                                )
                            }
                        />
                    );
                }
            }
        ];
        return columns;
    }
    const handleQtyChange = (value: number, record: IObjectDetails, itemCode: string) => {
        if (value > record.availableQty) {
            AlertMessages.getErrorMessage('Allocating Quantity Should not be greater than the available Qty')
            return
        }
        const existingObj = selectedItemObjects[itemCode];
        const sumOfAllocatedQty = existingObj.objectDetails.reduce(
            (sum, obj) =>
                obj.objectCode === record.objectCode
                    ? sum // skip this one
                    : sum + obj.currentlyAllocatedQty,
            0
        );
        const pendingQty = existingObj.requiredQty - sumOfAllocatedQty;
        if (value > pendingQty) {
            AlertMessages.getErrorMessage('Allocating Quantity Should not be greater than Pending Qty')
            return
        }
        record.currentlyAllocatedQty = value;
        existingObj.currentlyAllocatedQty = sumOfAllocatedQty + value;
        setUpdateKey(pre => pre + 1);
    }
    const onSelectChange = (newSelectedRowKeys: string[], selectedRows: IObjectDetails[], itemCode: string) => {
        const itemData = { ...selectedItemObjects[itemCode] }
        const updatedQty = updateQuantities(itemData, newSelectedRowKeys, selectedRows);

        setSelectedItemObjects(pre => {
            return { ...pre, [itemCode]: updatedQty };
        });


    };
    const updateQuantities = (itemData: ISelectedItems, newSelectedRowKeys: string[], selectedRows: IObjectDetails[]) => {
        const { requiredQty, objectDetails } = itemData;
        let allocatingQty = 0;
        let pendingAllocateQty = Number(requiredQty);
        selectedRows.forEach(obj => {
            obj.isAllocated = true;
            // Previously checked and modified the Qty
            if (obj.currentlyAllocatedQty > 0) {
                allocatingQty += obj.currentlyAllocatedQty;
                pendingAllocateQty -= obj.currentlyAllocatedQty;
            } else {
                const minAllocatingQty = Math.min(pendingAllocateQty, Number(obj.availableQty));
                obj.currentlyAllocatedQty = minAllocatingQty;
                allocatingQty += minAllocatingQty;
                pendingAllocateQty -= minAllocatingQty;
            }
        });
        itemData.currentlyAllocatedQty = allocatingQty;
        itemData.selectedRowKeys = newSelectedRowKeys;
        objectDetails.forEach(obj => {
            if (!newSelectedRowKeys.includes(obj.objectCode)) {
                obj.isAllocated = false;
                obj.currentlyAllocatedQty = 0;
            }
        });
        return itemData;

    }

    const renderRowSelection = (itemCode: string) => {
        const rowSelection: TableRowSelection<IObjectDetails> = {
            selectedRowKeys: selectedItemObjects[itemCode].selectedRowKeys,
            onChange: (e: string[], selectedRows: IObjectDetails[]) => onSelectChange(e, selectedRows, itemCode),
            getCheckboxProps: (record: IObjectDetails) => ({
                disabled: record.availableQty <= 0 // Column configuration not to be checked
            }),
        };
        return rowSelection;
    }
    return <>
        <div style={{ display: "flex", justifyContent: "space-evenly", background: "#e1e1e1", borderRadius: "8px", marginBottom: "10px" }} >
            <p style={{ margin: "5px" }} > Knit Group : <Tag color='#0086ac'> {knitGroups.join(", ")} </Tag> </p>
            <p style={{ margin: "5px" }} > Style :  <Tag color='#0086ac'> {style} </Tag> </p>
            <p style={{ margin: "5px" }} > Product : <Tag color='#0086ac'> {productCode} </Tag> </p>
            <p style={{ margin: "5px" }} > Po : <Tag color='#0086ac'> {poName} </Tag> </p>
        </div>

        <Table size="small" columns={knitMaterialJobsColumns} dataSource={knitTableData} bordered rowKey={record => record.knitJobNumber} pagination={false} scroll={{ x: true, y: 300 }} />
        <br />
        {(Object.keys(selectedItemObjects).length < 1) ? (
            <p>No material requirements found for the selected Knit Groups.</p>
        ) : (
            <Tabs
                className="custom-tabs"
                type="card"
                tabPosition="top"
                items={Object.values(selectedItemObjects).map(itemObj => {
                    return {
                        key: itemObj.itemInfo.itemCode,
                        label: `Item: ${itemObj.itemInfo.itemCode}`,
                        children: (
                            <div style={{ background: "#f5f5f5", borderRadius: "8px" }}>
                                <div style={{ display: "flex", justifyContent: "space-evenly" }} >
                                    <p>Item Desc: <Tag color='#0086ac'>{itemObj.itemInfo.itemDescription}</Tag></p>
                                    <p>Item Color: <Tag color='#0086ac'>{itemObj.itemInfo.itemColor}</Tag></p>
                                    <p>Required Qty: <Tag color='green'>{itemObj.itemInfo.totalRequiredQty}</Tag></p>
                                    <p>Allocating Qty: <Tag color='blue'>{itemObj.currentlyAllocatedQty}</Tag></p>
                                    <p>Pending Qty: <Tag color='red'>{itemObj.itemInfo.totalRequiredQty - itemObj.itemInfo.totalAllocatedQty - itemObj.currentlyAllocatedQty}</Tag></p>
                                </div>
                                <Table
                                    size="small"
                                    columns={renderColumns(itemObj.itemInfo)}
                                    dataSource={itemObj.objectDetails}
                                    pagination={false}
                                    bordered rowKey={record => record.objectCode} rowSelection={renderRowSelection(itemObj.itemInfo.itemCode)}
                                />
                            </div>
                        )
                    }

                }
                )}
            />
        )}
        <div style={{ display: "flex", justifyContent: "center", marginTop: "8px", }} >
            <Form layout={'inline'} onFinish={handleSubmit} form={form} >


                <Form.Item label="Material Required Date" required name='plannedDate' rules={[{ required: true, message: 'Please select a dispatch date.' }]}>
                    <DatePicker showTime onChange={(date) => setMaterialRequiredDate(date)} disabledDate={(current: any) => disabledBackDates(current, moment().format(defaultDateFormat))} />
                </Form.Item>

                <Form.Item>
                    <Button type="primary" htmlType="submit" className="btn-green"  > Submit </Button>
                </Form.Item>
                <Form.Item>
                    <Button type="primary" onClick={() => closeModal(false)}>Close</Button>
                </Form.Item>

            </Form>
        </div>
    </>
}
export default MaterialSelectionTab;