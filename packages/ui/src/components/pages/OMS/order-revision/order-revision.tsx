import { OrderQtyUpdateModel, RawOrderLineInfoModel, RawOrderNoRequest, MoListModel, MoListRequest, MoStatusEnum } from "@xpparel/shared-models";
import { OrderManipulationServices } from "@xpparel/shared-services";
import { Button, Card, Col, Form, Input, InputNumber, Row, Select, Table } from "antd";
import { useEffect, useState } from "react";
import { useAppSelector } from '../../../../common';
import { CustomColumn } from "../../../../schemax-component-lib";
import { AlertMessages } from '../../../common';
import { useForm } from "antd/es/form/Form";


const { Option } = Select;
type RevisedQtyModel = RawOrderLineInfoModel & {
  checkbox: boolean;
  revisedQuantity: number;
};
const OrderLineColumns: CustomColumn<RevisedQtyModel>[] = [
  { title: 'Mo Line No', dataIndex: 'salOrdLineNo', key: 'salOrdLineNo', isDefaultSelect: true, align: 'center' },
  { title: 'Buyer Po', dataIndex: 'buyerPo', key: 'buyerPo', isDefaultSelect: true, align: 'center' },
  { title: 'Destination', dataIndex: 'dest', key: 'dest', isDefaultSelect: true, align: 'center' },
  { title: 'Prod Type', dataIndex: 'prodType', key: 'prodType', isDefaultSelect: true, align: 'center' },
  { title: 'Ex-Factory', dataIndex: 'exFactory', key: 'packMethod', isDefaultSelect: true, align: 'center' },
  { title: 'Total Order Qty', dataIndex: 'quantity', key: 'quantity', isDefaultSelect: true, align: 'center' },
  {
    title: <span>QTY<span className='required-field'></span></span>,
    dataIndex: 'revisedQuantity',
    key: 'revisedQuantity',
    render: (text: string, record: { [key: string]: any }, index: number) => (
      <>
        <Form.Item name={[index, 'salOrdLineNo']} initialValue={text} hidden>
          <Input />
        </Form.Item>
        <Form.Item name={[index, 'revisedQuantity']} initialValue={text}>
          <InputNumber min={0} placeholder="QTY" />
        </Form.Item>
      </>
    ),
  },
]
export const OrderQtyRevision = () => {
  const [formRef] = useForm()
  const [manufacturingOrders, setManufacturingOrders] = useState<MoListModel[]>([]);
  const [selectedMoId, setSelectedMoId] = useState<number>();
  const [selectedMo, setSelectedMo] = useState<string>();
  const [orderLineInfo, setOrderLineInfo] = useState([]);
  const user = useAppSelector((state) => state.user.user.user);

  const omsManipulationService = new OrderManipulationServices();
  useEffect(() => {
    getMoList(new MoListRequest(user?.userName, user?.orgData?.unitCode, user?.orgData?.companyCode, user?.userId, MoStatusEnum.IN_PROGRESS));
  }, []);

  const getMoList = (req: MoListRequest) => {
    omsManipulationService.getListOfMoForOrderQtyRevision(req)
      .then((res) => {
        if (res.status) {
          setManufacturingOrders(res.data);
        } else {
          setManufacturingOrders([]);
          AlertMessages.getErrorMessage(res.internalMessage);
        }
      })
      .catch((err) => {
        AlertMessages.getErrorMessage(err.message);
      });
  }

  const getOrderSummery = (req: RawOrderNoRequest) => {
    // omsManipulationService.getRawOrderInfo(req)
    //   .then((res) => {
    //     if (res.status) {
    //       const data = res.data[0];
    //       setOrderLineInfo(data.orderLines);
    //       formRef.setFieldsValue(data)
    //     } else {
    //       setOrderLineInfo([]);
    //       formRef.resetFields()
    //       formRef.setFieldsValue({ orderLines: [] })
    //     }
    //   })
    //   .catch((err) => {
    //     AlertMessages.getErrorMessage(err.message);
    //   });
  }


  const moOnchangeHandler = (mo: number, option) => {
    setSelectedMoId(mo)
    setSelectedMo(option.orderNo)
    getOrderSummery(new RawOrderNoRequest(user?.userName, user?.orgData?.unitCode, user?.orgData?.companyCode, user?.userId, option.orderNo, mo, undefined, undefined, undefined, true, undefined, undefined, undefined, undefined, true));
  }

  const submitHandler = () => {
    formRef.validateFields().then(values => {
      const req = new OrderQtyUpdateModel(user?.userName, user?.orgData?.unitCode, user?.orgData?.companyCode, user?.userId, undefined, undefined, undefined, undefined, []);
      omsManipulationService.updateOrderQtyRevision({ ...req, ...values }).then(res => {
        if (res.status) {
          AlertMessages.getSuccessMessage(res.internalMessage);
          setTimeout(() => {
            window.location.reload();
          }, 10);
        } else {
          AlertMessages.getErrorMessage(res.internalMessage)
        }
      }).catch(err => {
        AlertMessages.getErrorMessage(err.message)
        console.log(err)
      })
    }).catch(err => {
      console.log(err)
    })
  }

  return <Card title='Quantity Revision' size="small">
    <Form
      form={formRef}
      autoComplete="off"
    >
      <Row justify='space-between'>
        <Col>
          MO/Plant Style Ref : <Select size="small"
            showSearch={true} style={{ width: '200px' }} placeholder='Select Manufacturing Order' optionFilterProp="label"
            allowClear={true}
            filterOption={(input, option) => (option!.children as unknown as string).toLocaleLowerCase().includes(input.toLocaleLowerCase())}
            onChange={(value, option) => moOnchangeHandler(value, option)}
          >
            {manufacturingOrders.map(moList => {
              return <Option
                value={moList.orderId}
                key={`${moList.orderId}`}
                label={moList.plantStyle ? moList.orderNo + ' - ' + moList.plantStyle : moList.orderNo}
                orderNo={moList.orderNo}
                name={moList.plantStyle ? moList.orderNo + ' - ' + moList.plantStyle : moList.orderNo}
              >
                {moList.plantStyle ? moList.orderNo + ' - ' + moList.plantStyle : moList.orderNo}
              </Option>
            })}
          </Select>
        </Col>
        <Col><Button type='primary' onClick={submitHandler} size="small">Submit</Button></Col></Row>
      <Form.Item name={'extSysRefNo'} hidden>
        <Input />
      </Form.Item>
      <Form.Item name={'orderNo'} hidden>
        <Input />
      </Form.Item>
      <Form.Item name={'orderIdPk'} hidden>
        <Input />
      </Form.Item>
      <Form.List name={["orderLines"]}>
        {(particulars, { add, remove }) => {
          return <Table dataSource={orderLineInfo} size='small' columns={OrderLineColumns} bordered scroll={{ x: '100%' }} pagination={false} />
        }}
      </Form.List>
    </Form>
  </Card>
};

export default OrderQtyRevision;
