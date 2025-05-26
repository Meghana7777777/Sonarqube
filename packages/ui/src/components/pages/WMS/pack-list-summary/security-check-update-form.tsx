import { ADDVehicleReqModal, CheckListStatus, CommonRequestAttrs, LocationFromTypeEnum, PackListIdRequest, PackingListSummaryModel, SecurityCheckModel, SecurityCheckRequest, VehicleTypeEnum } from "@xpparel/shared-models";
import { GatexService, GrnServices } from "@xpparel/shared-services";
import { Button, Checkbox, Col, Form, Input, InputNumber, Row, Select, Table } from "antd";
import moment from "moment";
import { disabledBackDates, disabledDateTime } from "packages/ui/src/common/utils/utils";
import { useEffect, useState } from "react";
import { useAppSelector } from '../../../../common';
import { AlertMessages } from "../../../common";
import DatePicker, { defaultDateFormat, defaultDateTimeFormat, defaultTimePicker } from "../../../common/data-picker/date-picker";

interface ISecurityDetailsUpdate {
  selectedRecord?: PackingListSummaryModel;
  commonReqAttributes: CommonRequestAttrs;
  closeModalAndRefreshTab: () => void
}

const { Option } = Select;
export const SecurityCheckUpdateForm = (props: ISecurityDetailsUpdate) => {
  const [form] = Form.useForm();
  const [vehicles, setVehicles] = useState([]);

  const handleAddVehicle = () => {
    form.validateFields().then((values) => {
      setVehicles([...vehicles, { ...values }]);
      form.resetFields();
      form.setFieldValue('arrivalDateTime', moment());
    }).catch(err => console.log(err.message));
  };
  const user = useAppSelector((state) => state.user.user.user);
  const { selectedRecord, commonReqAttributes } = props;
  const grnServices = new GrnServices();
  const gatexServices = new GatexService();
  const [disabled, setDisabled] = useState(selectedRecord.securityCheckIn);
  const [initialValues, setInitialValues] = useState<SecurityCheckModel>(null)
  const [formRef] = Form.useForm();

  useEffect(() => {
    formRef.setFieldValue('securityPerson', user?.userName);
    form.setFieldValue('arrivalDateTime', moment());
    return (() => {
      setInitialValues(null);
      formRef.resetFields();
    });
  }, []);

  const fieldsReset = () => {
    formRef.resetFields();
  };

  const handleSave = () => {
    const vehiclesNumbers = vehicles.map(v => v.vehicleNo = v.vehicleNo.toUpperCase());
    if (vehiclesNumbers.length != new Set(vehiclesNumbers).size) {
      AlertMessages.getErrorMessage('Vehicle numbers should be unique');
    }
    const req: ADDVehicleReqModal = new ADDVehicleReqModal(String(selectedRecord.id), selectedRecord.packingListCode, LocationFromTypeEnum.SUPP, vehicles, user?.userName, user?.orgData?.unitCode, user?.orgData?.companyCode, user?.userId);
    grnServices.saveSecurityCheckIn(req)
      .then(res => {
        if (res.status) {
          AlertMessages.getSuccessMessage(res.internalMessage);
          fieldsReset();
          props.closeModalAndRefreshTab();
          // onChangeTab(activeTab);
        } else {
          AlertMessages.getErrorMessage(res.internalMessage)
        }
      })
      .catch(err => {
        AlertMessages.getErrorMessage(err.message);
        fieldsReset();
      });
    console.log("Submitting Vehicles:", vehicles);
  };

  const columns = [
    { title: "Vehicle No", dataIndex: "vehicleNo", key: "vehicleNo" },
    { title: "Driver Name", dataIndex: "dName", key: "dName" },
    { title: "Contact", dataIndex: "dContact", key: "dContact" },
    { title: "Arrival", dataIndex: "arrivalDateTime", key: "arrivalDateTime", render: (val) => val ? moment(val).format(defaultDateTimeFormat) : '' },
    { title: "Departure", dataIndex: "departureDateTime", key: "departureDateTime", render: (val) => val ? moment(val).format(defaultDateTimeFormat) : '' },
    { title: "Vehicle Type", dataIndex: "vehicleType", key: "vehicleType" },
    { title: "In-House", dataIndex: "inHouseVehicle", key: "inHouseVehicle", render: (val) => (val ? "Yes" : "No") },
  ];

  return (
    <Row gutter={[16, 16]}>
      {/* Left Form */}
      <Col xs={24} lg={10}>
        <Form form={form} layout="vertical">
          <Row>
            <Col xs={24} sm={12} md={12} lg={12} xl={12}>
              <Form.Item
                name="vehicleNo"
                label="Vehicle No"
                rules={[{ required: true }]}
              >
                <Input
                  placeholder="Please Enter Vehicle Number"
                />
              </Form.Item>
            </Col>
            <Col xs={24} sm={12} md={12} lg={12} xl={12}>
              <Form.Item name="dName" label="Driver Name" rules={[{ required: true }]}>
                <Input placeholder="Please Enter Driver Name" />
              </Form.Item>
            </Col>
            <Col xs={24} sm={12} md={12} lg={12} xl={12}>
              <Form.Item
                name="dContact"
                label="Driver Contact"
                rules={[{ required: true, message: 'Please Enter Driver Contact Number' }]}

              >
                <InputNumber
                  placeholder="Please Enter Driver Contact Number"
                  style={{ width: '304px' }}
                  maxLength={15}
                  min={0}
                />
              </Form.Item>
            </Col>
            <Col xs={24} sm={12} md={12} lg={12} xl={12}>
              <Form.Item name="arrivalDateTime" label="Arrival Date & Time" rules={[{ required: false }]}>
                <DatePicker style={{ width: '100%' }} disabled={true} showTime={{ format: defaultTimePicker }} format={defaultDateTimeFormat}
                  disabledDate={(current) => disabledBackDates(current, moment().format(defaultDateFormat), false)} />
              </Form.Item>
            </Col>
            <Col xs={24} sm={12} md={12} lg={12} xl={12}>
              <Form.Item name="departureDateTime" label="Departure Date & Time" rules={[{ required: false }]}>
                <DatePicker style={{ width: '100%' }} disabled={true}
                  disabledDate={(current) => disabledBackDates(current, selectedRecord.securityCheckInAt ? moment(selectedRecord.securityCheckInAt).format(defaultDateFormat) : moment(formRef.getFieldValue('arrivalDateTime')).format(defaultDateFormat), false)}
                  disabledTime={(current) => disabledDateTime(moment(formRef.getFieldValue('arrivalDateTime')), current)}
                  showTime={{
                    hideDisabledOptions: true
                  }} />
              </Form.Item></Col>
            <Col xs={24} sm={12} md={12} lg={12} xl={12}>
              <Form.Item name="vehicleType" label="Vehicle Type" rules={[{ required: true, message: 'Please Select Vehicle Type' }]}>
                <Select
                  placeholder='Please Select Vehicle Type'
                  allowClear
                  showSearch
                >
                  {
                    Object.keys(VehicleTypeEnum).map((key) => {
                      return <Option value={VehicleTypeEnum[key]}>{VehicleTypeEnum[key]}</Option>
                    })
                  }
                </Select>
              </Form.Item></Col>
            <Col xs={24} sm={12} md={12} lg={12} xl={12}>
              <Form.Item name="inHouseVehicle" valuePropName="checked">
                <Checkbox>In-House Vehicle</Checkbox>
              </Form.Item></Col>
          </Row>
          <Button type="primary" onClick={handleAddVehicle}>Add Vehicle</Button>
        </Form>
      </Col>

      {/* Right Table */}
      <Col xs={24} lg={{ span: 10, offset: 2 }}>
        <Table columns={columns} dataSource={vehicles} rowKey="id" bordered size="small" />
        <Button type="primary" style={{ float: 'right' }} onClick={handleSave}>Save</Button>
      </Col>
    </Row>
  );
}

export default SecurityCheckUpdateForm;
