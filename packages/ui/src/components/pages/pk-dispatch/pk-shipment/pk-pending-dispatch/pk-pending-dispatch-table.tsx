import React, { useState } from "react";
import { Button, DatePicker, Form, Input, Modal, Select, Space, Table } from "antd";
import { title } from "process";
import { SequenceUtils, useAppSelector } from "packages/ui/src/common";
import { PackListCartoonIDs, PkShippingRequestFilterRequest, PkShippingRequestItemIdRequest, PkShippingRequestProceedingEnum, PkmsFgWhReqTypeEnum } from "@xpparel/shared-models";
import { PkShippingRequestService } from "@xpparel/shared-services";
import { AlertMessages } from "packages/ui/src/components/common";
import FgWarehouseForm from "../warehouse-out-form/fg-wh-out";
import PkPickListPrint from "./pk-pick-list.print";
import CheckListReport from "../../../PKMS/__masters__/prints/check-list-report-print";
import { pick } from "highcharts";
import { PkIPendingDInline } from "./pk-pending-dispatc-interface";

// Define the Pending_D_Inline interface
interface Pending_D_Inline {
  MO: string;           // manufacturing order number
  poNo: string;     // Po number
  styles: string;  // styles
  buyers: string;    // buyers
  destinations: string;      // destinations
  delDates: string;          // delivery dates
  drReqNo: string;
  packlistIds: string[];
  srId: number;
  packListCartoonIds: PackListCartoonIDs[];

}

interface PendingDispatchPageInlineProps {
  childData: PkIPendingDInline[]; // Prop to receive childData as an array of Pending_D_Inline
  getShippingRequestByFilterRequest: (manufacturingOrderPks: string[]) => Promise<void>;
  selectedManufacturingOrder: string[];
  approveStatus: PkShippingRequestProceedingEnum
}

const PkPendingDispatchTable = (props: PendingDispatchPageInlineProps) => {
  const [form] = Form.useForm();
  const { childData, getShippingRequestByFilterRequest, selectedManufacturingOrder, approveStatus } = props;
  const [isUpdateShippingModalVisible, setIsUpdateShippingModalVisible] = useState(false);
  const [pickListVisble, setPickListVisble] = useState(false);
  const shippingService = new PkShippingRequestService();
  const user = useAppSelector((state) => state.user.user.user);
  const [currentSelectedRec, setCurrentSelectedRec] = useState<PkIPendingDInline>(null);
  const packinglistIds: number[] = props.childData[0].packlistIds.map(Number);
  // Ensure that packListCartoonIds is an array of PackListCartoonIDs objects
  const packListCartoonIds: PackListCartoonIDs[] = props.childData[0].packListCartoonIds.map(
    (item: any) => new PackListCartoonIDs(item.packListId, item.cartonIds)
  );


  const getDispatchShippingPrintInfo = async (srItemId: number) => {
    try {
      const req = new PkShippingRequestItemIdRequest([srItemId], '', user?.userName, user?.orgData?.unitCode, user?.orgData?.companyCode, user?.userId);
      const shippingPrintRes = await shippingService.getShippingRequestItemAodAbrstactInfo(req);
      if (shippingPrintRes.status) {
        setPickListVisble(true);
        // construct the print format of the pick list
        // setShippingPrintInfo(shippingPrintRes.data);
      } else {
        AlertMessages.getErrorMessage(shippingPrintRes.internalMessage);
      }
    } catch (err) {
      AlertMessages.getErrorMessage(err.message);
    }
  }


  // Define table columns based on the Pending_D_Inline data
  const columns = [
    { title: "Dispatch Set", dataIndex: "drReqNo", key: "drReqNo", align: "center" as const },
    { title: "MO", dataIndex: "MO", key: "MO", align: "center" as const },
    { title: "VPO No", dataIndex: "poNo", key: "poNo", align: "center" as const },
    { title: "Style", dataIndex: "styles", key: "styles", align: "center" as const },
    { title: "Buyer", dataIndex: "buyers", key: "buyers", align: "center" as const },
    { title: "Destination", dataIndex: "destinations", key: "destinations", align: "center" as const },
    {
      title: "Delivery Dates", dataIndex: "delDates", key: "delDates", align: "center" as const,
      render: (v) => SequenceUtils.deliveryDatesMethod(v)
    },
    {
      title: 'Action', key: 'action',
      align: "center" as const,
      render: (text, record: PkIPendingDInline) => (
        <>
          {approveStatus === PkShippingRequestProceedingEnum.APPROVED &&
            <>
              <Button
                type="primary"
                danger
                disabled={record?.fgOutReqCreated}
                onClick={(e) => {
                  e.stopPropagation();
                  setCurrentSelectedRec(record);
                  setIsUpdateShippingModalVisible(true);
                  reSetForm();
                }}
              >
                Fg Wh Out Request
              </Button>
            </>
          }

          &nbsp;
          <Button type="primary" onClick={(e) => {
            e.stopPropagation();
            togglePickListPrint(true);
            reSetForm();
          }}>
            Pick List
          </Button>
        </>
      ),
    },
  ];

  const handleSubmit = async (values) => {
    setIsUpdateShippingModalVisible(false);
  };

  const reSetForm = () => {
    form.resetFields();
  }

  const toggleFgWhReqPopUp = (status: boolean) => {
    setIsUpdateShippingModalVisible(status);
  }

  const togglePickListPrint = (status: boolean) => {
    setPickListVisble(status);
  }

  return (
    <>
      <Table
        columns={columns}
        dataSource={childData}
        pagination={false}
        bordered
        scroll={{ x: 'max-content' }}
        size="small"
        rowKey="MO" // assuming 'MO' is unique for each row
      />

      <Modal
        title="Create FG Warehouse Request"
        open={isUpdateShippingModalVisible}
        width={900}
        // onOk={handleUpdateShippingInfo}
        onCancel={() => toggleFgWhReqPopUp(false)}
        footer={[]}
      >
        {isUpdateShippingModalVisible ?
          <FgWarehouseForm
            shippingOrderId={currentSelectedRec.srId}
            moNo={currentSelectedRec.MO}
            vpo={currentSelectedRec.poNo}
            fgOutReqCreated={currentSelectedRec?.fgOutReqCreated}
            packingListIds={currentSelectedRec?.packlistIds?.map(r => Number(r))}
            toggleFgWhReqPopUp={toggleFgWhReqPopUp}
            packListCartoonIds={currentSelectedRec?.packListCartoonIds?.map(
              item => new PackListCartoonIDs(item.packListId, item.cartonIds)
            ) ?? []}
            getShippingRequestByFilterRequest={getShippingRequestByFilterRequest}
            selectedManufacturingOrder={selectedManufacturingOrder}
          /> : <></>}
        {/* <Form labelCol={{ span: 5 }} wrapperCol={{ span: 14 }} onFinish={handleSubmit} form={form} name='vendorForm'>
          <Form.Item label="Remarks" name='remarks'>
            <Input.TextArea
              rows={4}
              onChange={(e) => setRemarks(e.target.value)}
              placeholder="Add remarks here..."
            />
          </Form.Item>
          <Form.Item wrapperCol={{ offset: 10, span: 16 }}>
            <Space>
              <Button type="primary" onClick={reSetForm} danger>
                Reset
              </Button>
              <Button type="primary" htmlType="submit" className='btn-green'>
                Submit
              </Button>
            </Space>
          </Form.Item>
        </Form> */}
      </Modal>

      {/* <Modal
        title="Pick List"
        open={pickListVisble}
        // onOk={handleUpdateShippingInfo} 
       {<PkPickListPrint shippingInfo={[]} printType={"Original"}/>}
        onCancel={() => setPickListVisble(false)}
        footer={[]}
      ></Modal>  */}

      {/* <Modal
        style={{ width: '100%' }}
        title="Pick List"
        open={pickListVisble}
        onCancel={() => togglePickListPrint(false)}
        footer={null}
      >
        {pickListVisble ? <CheckListReport plIds={packinglistIds} /> : <></>}
      </Modal> */}

      <Modal
        title="Pick List"
        open={pickListVisble}
        onCancel={() => togglePickListPrint(false)}
        footer={null}
        className="custom-modal"
      >
        {pickListVisble ? <CheckListReport
          plIds={packinglistIds}
          packListCartoonIds={packListCartoonIds}
          reqTyp={PkmsFgWhReqTypeEnum.IN}
        /> : <></>}
      </Modal>
      <style>
        {`
    .custom-modal .ant-modal-content {
      width: 200%; 
      margin: auto;
      right:50%;
    }
  `}
      </style>
    </>
  );
};

export default PkPendingDispatchTable;
