import Icon, { EditOutlined, GoldOutlined, PrinterTwoTone } from "@ant-design/icons";
import { CommonIdReqModal, CommonRequestAttrs, FgContainerBehaviorEnum, FgContainerCreateRequest, FgContainersActivateReq, FgCurrentContainerLocationEnum, FgCurrentContainerStateEnum, WareHouseModel, WeareHouseDropDownModel, WeareHouseDropDownResponse } from "@xpparel/shared-models";
import { FgContainerServices, WareHouseService } from "@xpparel/shared-services";
import { Button, Card, Col, Divider, Form, Input, Modal, Popconfirm, QRCode, Row, Select, Space, Switch, Table, Tooltip } from "antd";
import { ColumnsType } from "antd/es/table";
import { SequenceUtils, useAppSelector } from "packages/ui/src/common";
import { AlertMessages } from "packages/ui/src/components/common";
import { ScxButton } from "packages/ui/src/schemax-component-lib";
import printJS from "print-js";
import React, { useEffect, useState } from "react";
import Barcode from "react-barcode";
import { getCssFromComponent } from "../print-barcodes";
import { FgContainerCreateForm } from "./fg-container-create-form";

export interface IcreateContainersProps {
  barcodeWidth?: number;
  newWindow: boolean;
};
const { Option } = Select;
export const FgCreateContainers = (props: IcreateContainersProps) => {
  const [formRef] = Form.useForm();
  const user = useAppSelector((state) => state.user.user.user);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const service = new FgContainerServices();
  const [containerData, setContainersData] = useState<any[]>([]);
  const [selectedRecord, setSelectedRecord] = useState<any>();
  const [isTitle, setIsTitle] = useState('');
  const [okText, setOkText] = useState('');
  const { barcodeWidth, newWindow } = props;
  const [showBarcodePopUp, setShowBarcodePopUp] = useState<boolean>(true);
  const [searchedText, setSearchedText] = useState("");
  const [whCodes, setWhCodes] = useState<WeareHouseDropDownModel[]>([]);
  const [selectedWhId, setSelectedWhId] = useState<number>();
  const [form] = Form.useForm()
  const whService = new WareHouseService();
  const [whs, setWhs] = useState<WareHouseModel[]>([]);

  const containerService = new FgContainerServices();




  let externalWindow: any;
  let containerEl: any;
  // Open in new Window
  if (newWindow) {
    externalWindow = window.open('', '', 'width=600,height=700,left=200,top=50');
    containerEl = externalWindow.document.createElement('div');
    externalWindow.document.body.appendChild(containerEl);
    externalWindow.document.title = 'Barcodes';
    getCssFromComponent(document, externalWindow.document);
  };

  const handlePrint = () => {
    setShowBarcodePopUp(true)
  };

  const hideModal = () => {
    setShowBarcodePopUp(false);
  };

  const PrintAllBarCodes = () => {
    const pageContent = document.getElementById("printArea");
    if (pageContent) {
      printJS({
        printable: pageContent,
        type: "html",
        showModal: true,
        modalMessage: "Loading...",
        targetStyles: ['*'],
        style: '@page {size: 384px 192px  ; margin: 0mm; .label {page-break-after: always !important;}} body {margin: 0;} }'
      });
      setShowBarcodePopUp(false);
    } else {
      AlertMessages.getErrorMessage("Page content element not found.");
    }
  };

  useEffect(() => {
    getWareHouseToRacks()
  }, []);

  const getWareHouseToRacks = () => {
    const req = new CommonRequestAttrs(user.userName, user.unitCode, user.companyCode, user.userId)
    whService.getWareHouseDropDownToRacks(req)
      .then((res) => {
        if (res.status) {
          setWhs(res.data);
        } else {
          setWhs([]);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  useEffect(() => {
    getContainers()
  }, [selectedWhId])

  const onContainerChange = (whId: number) => {
    setSelectedWhId(whId);
  }


  const getContainers = () => {
    setShowBarcodePopUp(false);
    const obj = new CommonIdReqModal(selectedWhId, user?.userName, user?.orgData?.unitCode, user?.orgData?.companyCode, user?.userId);
    service.getAllContainersData(obj).then(res => {
      if (res.status) {
        setContainersData(res.data);
      } else {
        setContainersData([])
      }
    }).catch(err => {
      setContainersData([])
      AlertMessages.getErrorMessage(err.message);
      console.log(err.message)
    })
  }

  const showModal = (record) => {
    if (!record.isActive) {
      AlertMessages.getErrorMessage('Please Activate the record before Edit')
      return
    }
    setIsModalOpen(true);
    formRef.setFieldsValue(record)
    setSelectedRecord(record);
    setIsTitle('Update Containers');
    setOkText("Update");
  };

  const showModals = () => {
    setIsModalOpen(true);
    fieldsReset()
    setIsTitle('Create Containers');
    setOkText("Create");
  };

  const handleCancel = () => {
    formRef.resetFields();
    setSelectedRecord(undefined);
    fieldsReset();
    setIsModalOpen(false);
  };

  const fieldsReset = () => {
    formRef.resetFields();
    setSelectedRecord(undefined);
  };

  const handleOk = () => {
    formRef.validateFields().then(values => {
      const req = new FgContainerCreateRequest(user?.userName, user?.orgData?.unitCode, user?.orgData?.companyCode, user?.userId, values.id, values.name, values.code, values.weightCapacity, values.weightUom, values.currentLocationId ? values.currentLocationId : null, FgCurrentContainerStateEnum.FREE, FgCurrentContainerLocationEnum.NONE, FgContainerBehaviorEnum.GENERAL, '', values.isActive, values.maxItems, '', values.type, values.length, values.lengthUom, values.width, values.widthUom, values.height, values.heightUom, values.whId ? values.whId : null);
      service.createContainers(req).then(res => {
        if (res.status) {
          AlertMessages.getSuccessMessage(res.internalMessage);
          setIsModalOpen(false);
          fieldsReset();
          getContainers();
        } else {
          AlertMessages.getErrorMessage(res.internalMessage)
        }
      }).catch(err => {
        console.log(err);
        // fieldsReset();
      })
    }).catch((err) => {
      AlertMessages.getErrorMessage("Please fill required fields before creation.");
    })

  };

  const palletsColumns: ColumnsType<any> = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      fixed: 'left',
      sorter: (a, b) => { return a.name.localeCompare(b.name) },
      sortDirections: ['descend', 'ascend'],
      filteredValue: [String(searchedText).toLowerCase()],
      onFilter: (value, record) => {
        return SequenceUtils.globalFilter(value, record)
      }
    },
    {
      title: 'Code',
      dataIndex: 'code',
      key: 'code',
      sorter: (a, b) => { return a.code.localeCompare(b.code) },
      sortDirections: ['descend', 'ascend'],
      fixed: 'left',
    },
    {
      title: 'Container type',
      dataIndex: 'type',
      key: 'type',
      sorter: (a, b) => { return a.type.localeCompare(b.type) },
      sortDirections: ['descend', 'ascend'],
    },

    {
      title: 'Weight Capacity',
      dataIndex: 'weightCapacity',
      key: 'weightCapacity',
      sorter: (a, b) => { return a.weightCapacity.localeCompare(b.weightCapacity) },
      sortDirections: ['descend', 'ascend'],

    },
    {
      title: 'Weight UOM',
      dataIndex: 'weightUom',
      key: 'weightUom',
      sorter: (a, b) => { return a.weightUom.localeCompare(b.weightUom) },
      sortDirections: ['descend', 'ascend'],

    },
    {
      title: 'Current Container State',
      dataIndex: 'currentContainerState',
      key: 'currentContainerState',
      sorter: (a, b) => { return a.currentContainerState.localeCompare(b.currentContainerState) },
      sortDirections: ['descend', 'ascend'],

    },
    {
      title: 'Current Container Location',
      dataIndex: 'currentContainerLocation',
      key: 'currentContainerLocation',
      sorter: (a, b) => { return a.currentContainerLocation.localeCompare(b.currentContainerLocation) },
      sortDirections: ['descend', 'ascend'],

    },

    {
      title: 'Container Behavior',
      dataIndex: 'containerBehavior',
      key: 'containerBehavior',
      sorter: (a, b) => { return a.containerBehavior.localeCompare(b.containerBehavior) },
      sortDirections: ['descend', 'ascend'],

    },

    {
      title: 'Length',
      dataIndex: 'length',
      key: 'length',
      sorter: (a, b) => { return a.length ? String(a.length) : ''.localeCompare(b.length ? String(a.length) : '') },
      sortDirections: ['descend', 'ascend'],
    },
    {
      title: 'Length UOM',
      dataIndex: 'lengthUom',
      key: 'lengthUom',
      sorter: (a, b) => { return a.weightUom.localeCompare(b.weightUom) },
    },
    {
      title: 'Width',
      dataIndex: 'width',
      key: 'width',
      sorter: (a, b) => { return a.width ? String(a.width) : ''.localeCompare(b.width ? String(a.width) : '') },
      sortDirections: ['descend', 'ascend'],
    },
    {
      title: 'Width UOM',
      dataIndex: 'widthUom',
      key: 'widthUom',
      sorter: (a, b) => { return a.weightUom.localeCompare(b.weightUom) },
      sortDirections: ['descend', 'ascend'],
    },
    {
      title: 'Height',
      dataIndex: 'height',
      key: 'height',
      sorter: (a, b) => { return a.heigth ? String(a.heigth) : ''.localeCompare(b.heigth ? String(a.heigth) : '') },
      sortDirections: ['descend', 'ascend'],
    },
    {
      title: 'Height UOM',
      dataIndex: 'heightUom',
      key: 'heightUom',
      sorter: (a, b) => { return a.weightUom.localeCompare(b.weightUom) },
      sortDirections: ['descend', 'ascend'],

    },
    {
      title: 'Max Items',
      dataIndex: 'maxItems',
      key: 'maxItems',
      sorter: (a, b) => { return a.maxItems ? String(a.maxItems) : ''.localeCompare(b.maxItems ? String(a.maxItems) : '') },
      sortDirections: ['descend', 'ascend'],

    },
    {
      title: 'Barcode',
      dataIndex: 'barcodeId',
      key: 'barcodeId',
      sorter: (a, b) => { return a.barcodeId.localeCompare(b.barcodeId) },
      sortDirections: ['descend', 'ascend'],
    },

    {

      title: 'Action',
      dataIndex: 'action',
      key: 'action',
      fixed: 'right',
      render: (value, recod) => {

        return <>
          <Space>
            <EditOutlined onClick={() => showModal(recod)} style={{ fontSize: '20px', color: '#08c' }} /><Divider type="vertical" />

            <Popconfirm
              onConfirm={
                e => {
                  const req = new FgContainersActivateReq('', '', '', 5, recod.id);
                  service.ActivateDeactivateContainers(req).then(res => {

                    AlertMessages.getSuccessMessage(res.internalMessage);
                    getContainers();

                  }).catch(err => {
                    console.log(err);
                  })
                }}
              title={recod.isActive ? "Are you sure to Deactivate containers ?" : "Are you sure to Activate containers ?"}>
              <Switch size='default' defaultChecked
                className={recod.isActive ? 'toggle-activated' : 'toggle-deactivated'}
                checkedChildren={<Icon type="check" />}
                unCheckedChildren={<Icon type="close" />}
                checked={recod.isActive} />
            </Popconfirm>
          </Space>
        </>
      }
    },

  ];
  return <div>
    <Card title={<span><GoldOutlined style={{ marginRight: 4 }} />Containers</span>}
      extra={
        <>
          <Space>
            <Tooltip title='Print'>
              <ScxButton onClick={handlePrint} icon={<PrinterTwoTone />}>
                Print All Barcodes
              </ScxButton>
            </Tooltip>
            <Button onClick={() => { showModals(); setSelectedRecord('') }} type="primary">
              Create
            </Button>
          </Space>
        </>
      }>
      <Input.Search
        placeholder="Search"
        allowClear
        onChange={(e) => { setSearchedText(e.target.value) }}
        onSearch={(value) => { setSearchedText(value) }}
        style={{ width: 200, float: "right" }}
      />
      <Form form={form}>
        <Form.Item
          label='Warehouse Code'
          name='whId'
        >
          <Row>
            <Col xs={{ span: 4 }} lg={{ span: 4 }}>
              <Select
                placeholder={'WareHouse'}
                onChange={(value) => { onContainerChange(value) }}
                allowClear
                showSearch
                filterOption={(input, option) =>
                  (option!.children as unknown as string)
                    .toString()
                    .toLowerCase()
                    .includes(input.toLowerCase())
                }

              >
                {whs?.map((racks) => (
                  <Option key={racks.id} value={racks.id}>
                    {racks.wareHouseCode}
                  </Option>
                ))}
              </Select>
            </Col>
          </Row>
        </Form.Item>
      </Form>
      <Table
        dataSource={containerData}
        columns={palletsColumns}
        scroll={{ x: 'max-content' }}
        bordered
        size="small"
      />
      <Modal title={<span style={{ textAlign: 'center', display: 'block', margin: '5px 0px' }}>{isTitle}</span>} width={800} open={isModalOpen} onOk={handleOk} okText={okText} cancelText="Close" onCancel={handleCancel} >
        <Divider type="horizontal"></Divider>
        <FgContainerCreateForm formRef={formRef} initialValues={selectedRecord} />
      </Modal>
      <React.Fragment>
        <Modal
          key={Date.now()}
          style={{ top: 10 }}
          width={barcodeWidth ? barcodeWidth + 48 : 432}
          title={
            <React.Fragment>
              Print Barcodes{" "}
              <Button type='primary' onClick={PrintAllBarCodes}>
                Print
              </Button>{" "}
            </React.Fragment>
          }
          cancelButtonProps={{ style: { backgroundColor: 'red', color: 'white' } }}
          open={showBarcodePopUp}
          onCancel={hideModal}
          onOk={hideModal}
          footer={[]}
        >
          <div id="printArea" style={{ width: '384px' }}>
            {containerData.map((pallets, i) => (
              <div key={'p' + i} className="label" style={{ display: 'flex', alignItems: "center", justifyContent: 'space-between' }}>
                <QRCode
                  value={pallets?.barcodeId || ''}
                />
                <div>
                  <div style={{ padding: '5px', fontSize: '18px', fontWeight: 500, textAlign: 'center' }}>Container</div>
                  <div style={{ padding: '5px', fontSize: '15px', fontWeight: 500 }}>Name : {pallets?.code}</div>
                  <Barcode
                    value={pallets?.barcodeId || ''}
                    displayValue={true}
                    fontSize={14}
                    width={1}
                    height={30}
                    format="CODE128"
                  />
                </div>
              </div>
            ))}
          </div>
        </Modal>
      </React.Fragment>
    </Card>
  </div>

}
export default FgCreateContainers;