import Icon, { EditOutlined, PrinterTwoTone } from "@ant-design/icons";
import { CommonRequestAttrs, TrollyCreateRequest, TrollyIdsRequest, TrollyModel } from "@xpparel/shared-models";
import { TrolleysServices } from "@xpparel/shared-services";
import { Button, Card, Divider, Form, Modal, Popconfirm, QRCode, Space, Switch, Table, Tooltip, Tag } from "antd";
import { useAppSelector } from "packages/ui/src/common";
import { useEffect, useState } from "react";
import { AlertMessages } from "../../../common";
import TrollyCreateForm from "./trolly-create-form";
import { ColumnsType } from "antd/lib/table";
import React from "react";
import Barcode from "react-barcode";
import printJS from "print-js";

export const CreateTrolly = () => {
  const [formRef] = Form.useForm();
  const user = useAppSelector((state) => state.user.user.user);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const service = new TrolleysServices();
  const [trollysdata, settrollyssData] = useState([]);
  const [selectedRecord, setSelectedRecord] = useState<any>();
  const [isTitle, setIsTitle] = useState('');
  const [oktext, setOkText] = useState('');
  const [trollyId, setTrollyId] = useState(false);
  const [showBarcodePopUp, setShowBarcodePopUp] = useState<boolean>(false);
  useEffect(() => {
    getTrollys();
  }, []);
  ;
  const getTrollys = () => {
    const obj = new CommonRequestAttrs(user?.userName, user?.orgData?.unitCode, user?.orgData?.companyCode, user?.userId);
    service.getAllTrollys(obj).then(res => {
      if (res.status) {
        settrollyssData(res.data);
        // AlertMessages.getSuccessMessage(res.internalMessage);
      } else {
        // AlertMessages.getErrorMessage(res.internalMessage)
      }
    }).catch(err => {
      AlertMessages.getErrorMessage(err.message)
    })
  }

  const showModal = (record) => {
    if (record.isActive) {
      setIsModalOpen(true);
      setSelectedRecord(record);
      setTrollyId(true);
      setIsTitle('Update Trollys');
      setOkText("Update");
    } else {
      AlertMessages.getErrorMessage("You Cannot Edit Deactivated Trolly");
    }

  };

  const showModals = () => {
    setIsModalOpen(true);
    setTrollyId(false);
    setSelectedRecord(null);
    setIsTitle('Create Trolley');
    setOkText("Create");
    formRef.resetFields();
  };
  const handleCancel = () => {
    setIsModalOpen(false);
    formRef.resetFields();
  };
  const fieldsReset = () => {
    formRef.resetFields();
  };
  const handleOk = () => {
    formRef.validateFields().then(values => {
      const req = new TrollyCreateRequest(user?.userName, user?.orgData?.unitCode, user?.orgData?.companyCode, user?.userId, values.id, values.name, values.code, values.capacity, 'NA');
      if (values.id) {
        service.updateTrolly(req).then(res => {
          if (res.status) {
            AlertMessages.getSuccessMessage(res.internalMessage);
            setIsModalOpen(false);
            fieldsReset();
            getTrollys();
          } else {
            AlertMessages.getErrorMessage(res.internalMessage)
          }
        }).catch(err => {
          AlertMessages.getErrorMessage(err.message)
          fieldsReset();
        })
      }
      else {
        service.createTrolly(req).then(res => {
          if (res.status) {
            AlertMessages.getSuccessMessage(res.internalMessage);
            setIsModalOpen(false);
            fieldsReset();
            getTrollys();
          } else {
            AlertMessages.getErrorMessage(res.internalMessage)
          }
        }).catch(err => {
          AlertMessages.getErrorMessage(err.message)
          fieldsReset();
        })
      }
    }).catch((err) => {
      AlertMessages.getErrorMessage("Please fill required fileds before creation.");
    })

  };

  const trollyColumns: ColumnsType<any> = [
    {
      title: 'Name',
      dataIndex: 'name',
      align: 'center',
      key: 'name',
    },
    {
      title: 'Code',
      dataIndex: 'code',
      align: 'center',
      key: 'code',
    },
    {
      title: 'Barcode',
      dataIndex: 'barcode',
      align: 'center',
      key: 'barcode',
    },
    {
      title: 'Capacity',
      dataIndex: 'capacity',
      align: 'center',
      key: 'capacity',
    },
    {
      title: 'Current Bin',
      dataIndex: 'binId',
      align: 'center',
      key: 'binId',
      render: (val: string, record: TrollyModel) => {
        return <>
          {
            record?.binInfo?.binCode ? <Tag color="blue">{record?.binInfo?.binCode}</Tag> : <Tag color='red'>NA</Tag>
          }
        </>
      }
    },
    {

      title: 'Action',
      dataIndex: 'action',
      align: 'center',
      key: 'action',
      render: (value, recod) => {

        return <>

          <EditOutlined onClick={() => showModal(recod)} /><Divider type="vertical" />

          <Popconfirm
            onConfirm={
              e => {
                const req = new TrollyIdsRequest(user?.userName, user?.orgData?.unitCode, user?.orgData?.companyCode, user?.userId, [recod.id], false, false, false);
                service.activateDeactivateTrolly(req).then(res => {
                  if (!res.status) {
                    AlertMessages.getErrorMessage(res.internalMessage);
                    return;
                  }
                  AlertMessages.getSuccessMessage(res.internalMessage);
                  getTrollys();
                }).catch(err => {
                  //AlertMessages.getErrorMessage(err.message);
                })
              }}
            title={recod.isActive ? "Are you sure to Deactivate Trollys ?" : "Are you sure to Activate Trollys ?"}>
            <Switch size='default' defaultChecked
              className={recod.isActive ? 'toggle-activated' : 'toggle-deactivated'}
              checkedChildren={<Icon type="check" />}
              unCheckedChildren={<Icon type="close" />}
              checked={recod.isActive} />
          </Popconfirm>
        </>
      }
    },
  ];

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
  return <>
    <Card title='Trolleys' extra={<Space>
      <Tooltip title='Print Trolley Barcodes'>
        <Button onClick={handlePrint} icon={<PrinterTwoTone style={{ fontSize: '15px' }} />}>
          Print All Barcodes
        </Button>
      </Tooltip>
      <Button onClick={() => showModals()} type="primary"><b>{"Create"}</b></Button></Space>}>
      <Table
        dataSource={trollysdata}
        columns={trollyColumns}
        size="small"
        bordered
        scroll={{x: 'max-content'}}
      >

      </Table>
      <Modal title={<span style={{ textAlign: 'center', display: 'block', margin: '5px 0px' }}>{isTitle}</span>} open={isModalOpen} onOk={handleOk} okText={oktext} cancelText="Close" onCancel={handleCancel}>
        <TrollyCreateForm formRef={formRef} initialvalues={selectedRecord} key={selectedRecord?.id} trollyId={trollyId} />
      </Modal>
      <Modal
        key={Date.now()}
        style={{ top: 10 }}
        width={432}
        title={
          <React.Fragment>
            Print Barcodes{" "}
            <Button type='primary' onClick={PrintAllBarCodes}>
              Print
            </Button>
          </React.Fragment>
        }
        open={showBarcodePopUp}
        onCancel={hideModal}
        onOk={hideModal}
        footer={[]}
      >
        <div id="printArea" style={{ width: '384px' }}>
          {trollysdata.map((trolleyObj, i) => (
            <div key={'t' + i} className="label" style={{ display: 'flex', alignItems: "center", justifyContent: 'space-between' }}>
              <QRCode value={trolleyObj?.barcode || ''} />
              <div style={{ paddingRight: '5px' }}>
                <div style={{ padding: '5px', fontSize: '18px', fontWeight: 500, textAlign: 'center' }}>Trolley</div>
                <div style={{ padding: '5px', fontSize: '15px', fontWeight: 500 }}>Name : {trolleyObj?.code}</div>
                <Barcode
                  value={trolleyObj?.barcode || ''}
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
    </Card>
  </>

}
export default CreateTrolly;