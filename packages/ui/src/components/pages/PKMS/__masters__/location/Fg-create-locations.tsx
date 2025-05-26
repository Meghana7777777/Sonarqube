import { Button, Card, Col, Divider, Form, Input, message, Modal, Popconfirm, QRCode, Row, Select, Space, Switch, Tooltip } from "antd";

import Icon, { EditOutlined, PicCenterOutlined, PrinterTwoTone } from "@ant-design/icons";
import { CommonRequestAttrs, FgLocationActiveReq, FgLocationCreateReq, FgLocationFilterReq, WareHouseModel } from "@xpparel/shared-models";
import Table, { ColumnsType } from "antd/es/table";
import { FgLocationService, WareHouseService } from "packages/libs/shared-services/src/pkms";
import { SequenceUtils, useAppSelector } from "packages/ui/src/common";
import { AlertMessages } from "packages/ui/src/components/common";
import { ScxButton } from "packages/ui/src/schemax-component-lib";
import printJS from "print-js";
import React, { useEffect, useState } from "react";
import Barcode from "react-barcode";
import { getCssFromComponent } from "../print-barcodes";
import LocationCreateForm from "./fg-location-create-form";

export interface IcreateLocationProps {
  barcodeWidth?: number;
  newWindow: boolean;
};
export const FgCreateLocations = (props: IcreateLocationProps) => {
  const { barcodeWidth, newWindow } = props;
  const [formRef] = Form.useForm();
  const user = useAppSelector((state) => state.user.user.user);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const service = new FgLocationService();
  const [locationsData, setLocationsData] = useState<FgLocationCreateReq[]>([]);
  const [selectedRecord, setSelectedRecord] = useState<any>();
  const [isTitle, setIsTitle] = useState('');
  const [oktext, setOkText] = useState('');
  const [showBarcodePopUp, setShowBarcodePopUp] = useState<boolean>(true);
  const [searchedText, setSearchedText] = useState("");
  const [whs, setWhs] = useState<WareHouseModel[]>([]);
  const { Option } = Select;
  const warehouseservice = new WareHouseService();
  const [selectedWhId, setSelectedWhId] = useState<number>();
  
    

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
    setShowBarcodePopUp(true);
  };
  const hideModal = () => {
    setShowBarcodePopUp(false);
  };

  const PrintAllBarCodes = () => {
    const pageContent = document.getElementById("printArea");
    if (pageContent) {
      // htmlToImage.toPng(pageContent, { quality: 100,width:384 }).then(function (dataUrl) {
      printJS({
        printable: pageContent,
        type: "html",
        // base64: true,
        showModal: true,
        modalMessage: "Loading...",
        targetStyles: ['*'],
        style: '@page {size: 384px 192px  ; margin: 0mm; .label {page-break-after: always !important;}} body {margin: 0;} }'
      });
      setShowBarcodePopUp(false);
      // });
    } else {
      AlertMessages.getErrorMessage("Page content element not found.");
    }
  };

  useEffect(()=>{
    getWareHouseToRacks()
  },[])

  useEffect(() => {
    getLocations();
  }, [selectedWhId]);

  const onLocationChange = (whId: number) => {
    console.log('whId',whId)
    setSelectedWhId(whId);
 
  }

  const getLocations = () => {
    setShowBarcodePopUp(false);
    const obj = new FgLocationFilterReq(user?.orgData?.companyCode, user?.orgData?.unitCode, user?.userName, user?.userId, selectedWhId);
    service.getAllLocationData(obj).then(res => {
      if (res.status) {
        setLocationsData(res.data);
      } else {
        setLocationsData([]);
      }
    }).catch(err => {
      setLocationsData([])
      AlertMessages.getErrorMessage(err.message);
    })
  }
  const showModal = (record) => {
    setSelectedRecord(record);
    setIsModalOpen(true);
    setIsTitle('Update Locations');
    setOkText("Update");
  };
  const createShowModals = () => {
    setIsModalOpen(true);
    setIsTitle('Create Locations');
    setOkText("Create");
    setSelectedRecord(undefined);
  };
  const handleCancel = () => {
    setIsModalOpen(false);
    formRef.resetFields();
  };
  const fieldsReset = () => {
    formRef.resetFields();
  };
  const createLocation = () => {
    formRef.validateFields().then(values => {
      const req = new FgLocationCreateReq(user?.userName, user?.orgData?.unitCode, user?.orgData?.companyCode, user?.userId, values.id, values.name, values.code, values.spcount, values.level,values.whId, values.rackId, values.priority, values.isActive, values.length, values.width, values.height, values.latitude, values.longitude,values.preferredStorageMaterial,undefined);
      service.createLocations(req).then(res => {
        if (res.status) {
          AlertMessages.getSuccessMessage(res.internalMessage);
          setIsModalOpen(false);
          fieldsReset();
          getLocations();
        } else {
          AlertMessages.getErrorMessage(res.internalMessage);
        }
      }).catch(err => {
        AlertMessages.getErrorMessage(err.message);

      })
    }).catch((err) => {
      AlertMessages.getErrorMessage("Please fill all the required fields before creation.");
    })
  };
  const deactivateLocation = (id: number) => {
    const req = new FgLocationActiveReq('', '', '', 5, id);
    service.ActivateDeactivateLocations(req).then(res => {
      if (res.status) {
        AlertMessages.getSuccessMessage(res.internalMessage);
        getLocations();
      } else {
        AlertMessages.getErrorMessage(res.internalMessage)
      }
    }).catch(err => {
      AlertMessages.getErrorMessage(err.message)
    })
  }

  const getWareHouseToRacks = () => {
    const req = new CommonRequestAttrs(user?.userName,
      user?.orgData?.unitCode,
      user?.orgData?.companyCode,
      user?.userId)
    warehouseservice.getWareHouseDropDownToRacks(req)
      .then((res) => {
        if (res.status) {
          setWhs(res.data);
        } else {
          setWhs([]);
          message.error(res.internalMessage, 4);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const locationColumns: ColumnsType<FgLocationCreateReq> = [
    {
      title: 'Location Name',
      dataIndex: 'name',
      align: 'center',
      key: 'name',
      sorter: (a, b) => { return a.name.localeCompare(b.name) },
      sortDirections: ['descend', 'ascend'],
      filteredValue: [String(searchedText).toLowerCase()],
      onFilter: (value, record) => {
        return SequenceUtils.globalFilter(value, record)
      }
    },
    {
      title: 'Location Code',
      dataIndex: 'code',
      align: 'center',
      key: 'code',
      sorter: (a, b) => { return a.code.localeCompare(b.code) },
      sortDirections: ['descend', 'ascend'],
      filteredValue: [String(searchedText).toLowerCase()],
      onFilter: (value, record) => {
        return SequenceUtils.globalFilter(value, record)
      }
    },
    {
      title: 'Barcode ',
      dataIndex: 'barcodeId',
      align: 'center',
      key: 'barcodeId',
      sorter: (a, b) => { return a.barcodeId.localeCompare(b.barcodeId) },
      sortDirections: ['descend', 'ascend'],
      filteredValue: [String(searchedText).toLowerCase()],
      onFilter: (value, record) => {
        return SequenceUtils.globalFilter(value, record)
      }
    },
    {
      title: 'Supported Containers Count',
      dataIndex: 'spcount',
      align: 'center',
      key: 'spcount',
      sorter: (a: FgLocationCreateReq, b: FgLocationCreateReq): number => {
        const columnA = a.spcount ? String(a.spcount) : '';
        const columnB = b.spcount ? String(b.spcount) : '';
        return columnA.localeCompare(columnB);
      },
      sortDirections: ['descend', 'ascend'],
      filteredValue: [String(searchedText).toLowerCase()],
      onFilter: (value, record) => {
        return SequenceUtils.globalFilter(value, record);
      }
    },
    {
      title: 'Rack Code',
      dataIndex: 'rackCode',
      align: 'center',
      key: 'rackCode',
      sorter: (a, b) => { return a.rackCode.localeCompare(b.rackCode) },
      sortDirections: ['descend', 'ascend'],
      filteredValue: [String(searchedText).toLowerCase()],
      onFilter: (value, record) => {
        return SequenceUtils.globalFilter(value, record)
      }
    },
    {
      title: 'Rack Level',
      dataIndex: 'level',
      align: 'center',
      key: 'level',
      sorter: (a: FgLocationCreateReq, b: FgLocationCreateReq): number => {
        const columnA = a.level ? String(a.level) : '';
        const columnB = b.level ? String(b.level) : '';
        return columnA.localeCompare(columnB);
      },
      sortDirections: ['descend', 'ascend'],
      filteredValue: [String(searchedText).toLowerCase()],
      onFilter: (value, record) => {
        return SequenceUtils.globalFilter(value, record);
      }
    },

    {
      title: 'Rack Level Column',
      dataIndex: 'column',
      align: 'center',
      key: 'column',
      sorter: (a: FgLocationCreateReq, b: FgLocationCreateReq): number => {
        const columnA = a.column ? String(a.column) : '';
        const columnB = b.column ? String(b.column) : '';
        return columnA.localeCompare(columnB);
      },
      sortDirections: ['descend', 'ascend'],
      filteredValue: [String(searchedText).toLowerCase()],
      onFilter: (value, record) => {
        return SequenceUtils.globalFilter(value, record);
      }
    },
    {
      title: 'Length',
      dataIndex: 'length',
      align: 'center',
      key: 'length',
      sorter: (a: FgLocationCreateReq, b: FgLocationCreateReq): number => {
        const columnA = a.length ? String(a.length) : '';
        const columnB = b.length ? String(b.length) : '';
        return columnA.localeCompare(columnB);
      },
      sortDirections: ['descend', 'ascend'],
      filteredValue: [String(searchedText).toLowerCase()],
      onFilter: (value, record) => {
        return SequenceUtils.globalFilter(value, record);
      }
    },
    {
      title: 'Width',
      dataIndex: 'width',
      align: 'center',
      key: 'width',
      sorter: (a: FgLocationCreateReq, b: FgLocationCreateReq): number => {
        const columnA = a.width ? String(a.width) : '';
        const columnB = b.width ? String(b.width) : '';
        return columnA.localeCompare(columnB);
      },
      sortDirections: ['descend', 'ascend'],
      filteredValue: [String(searchedText).toLowerCase()],
      onFilter: (value, record) => {
        return SequenceUtils.globalFilter(value, record);
      }
    },
    {
      title: 'Height',
      dataIndex: 'height',
      align: 'center',
      key: 'height',
      sorter: (a: FgLocationCreateReq, b: FgLocationCreateReq): number => {
        const columnA = a.height ? String(a.height) : '';
        const columnB = b.height ? String(b.height) : '';
        return columnA.localeCompare(columnB);
      },
      sortDirections: ['descend', 'ascend'],
      filteredValue: [String(searchedText).toLowerCase()],
      onFilter: (value, record) => {
        return SequenceUtils.globalFilter(value, record);
      }
    },

    {
      title: 'Latitude',
      dataIndex: 'latitude',
      align: 'center',
      key: 'latitude',
      sorter: (a: FgLocationCreateReq, b: FgLocationCreateReq): number => {
        const columnA = a.latitude ? String(a.latitude) : '';
        const columnB = b.latitude ? String(b.latitude) : '';
        return columnA.localeCompare(columnB);
      },
      sortDirections: ['descend', 'ascend'],
      filteredValue: [String(searchedText).toLowerCase()],
      onFilter: (value, record) => {
        return SequenceUtils.globalFilter(value, record);
      }
    },

    {
      title: 'Longitude',
      dataIndex: 'longitude',
      align: 'center',
      key: 'longitude',
      sorter: (a: FgLocationCreateReq, b: FgLocationCreateReq): number => {
        const columnA = a.longitude ? String(a.longitude) : '';
        const columnB = b.longitude ? String(b.longitude) : '';
        return columnA.localeCompare(columnB);
      },
      sortDirections: ['descend', 'ascend'],
      filteredValue: [String(searchedText).toLowerCase()],
      onFilter: (value, record) => {
        return SequenceUtils.globalFilter(value, record);
      }
    }
  ];
  return <div>
    <Card title={<span><PicCenterOutlined style={{ marginRight: 4 }} />Locations</span>}
      extra={
        <>
          <Space>
            <Tooltip title='Print'>
              <ScxButton onClick={handlePrint} icon={<PrinterTwoTone style={{ fontSize: '15px' }} />}>
                Print All Barcodes
              </ScxButton>
            </Tooltip>
            {/* <Button onClick={() => createShowModals()} type="primary">
              Create
            </Button> */}
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
          <Form>
      <Form.Item
      label='Warehouse Code'
      name='warehouseCode'>
        <Row gutter={[24, 24]}> 
        <Col xs={24} md={8}>
         <Select
              placeholder={'WareHouse'}
              // value={selectWh}
              onChange={(value) => { onLocationChange(value); }}
              allowClear
              showSearch
              style={{width: '80%'}}
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


      <Table dataSource={locationsData} size='small' columns={locationColumns} bordered scroll={{x: 'max-content'}} style={{minWidth: '100%'}}/>
      <Modal title={<span style={{ textAlign: 'center', display: 'block', margin: '5px 0px' }}>{isTitle}</span>} open={isModalOpen} onOk={createLocation} okText={oktext} cancelText="Close" onCancel={handleCancel} width={800} cancelButtonProps={{ style: { backgroundColor: 'red', color: 'white' } }}>
        <Divider type="horizontal"></Divider>
        <LocationCreateForm key={Date.now()} formRef={formRef} initialValues={selectedRecord} />
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
          open={showBarcodePopUp}
          onCancel={hideModal}
          onOk={hideModal}
          footer={[]}
        >
          <div id="printArea" style={{ width: '384px' }}>
            {locationsData.map((locations, i) => (
              <div key={'b' + i} className="label" style={{ display: 'flex', alignItems: "center", justifyContent: 'space-between' }}>
                <QRCode value={locations?.barcodeId || ''} />
                <div>
                  <div style={{ padding: '5px', fontSize: '18px', fontWeight: 500, textAlign: 'center' }}>Location</div>
                  <div style={{ padding: '5px', fontSize: '15px', fontWeight: 500 }}>Name : {locations?.code}</div>
                  <Barcode
                    value={locations?.barcodeId || ''}
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
  </div >

}
export default FgCreateLocations;