import Icon, { EditOutlined, PrinterTwoTone } from "@ant-design/icons";
import { BinsActivateRequest, BinsCreateRequest, CommonRequestAttrs } from "@xpparel/shared-models";
import { BinsServices } from "@xpparel/shared-services";
import { Button, Card, Divider, Form, Modal, Popconfirm, QRCode, Space, Switch, Table, Tooltip } from "antd";
import * as htmlToImage from "html-to-image";
import { useAppSelector } from "packages/ui/src/common";
import { ScxButton } from "packages/ui/src/schemax-component-lib";
import printJS from "print-js";
import React, { useEffect, useState } from "react";
import Barcode from "react-barcode";
import { AlertMessages } from "../../../common";
import { getCssFromComponent } from "../print-barcodes";
import BinsCreateForm from "./bin-create-form";
import { ColumnsType } from "antd/es/table";

export interface IcreateBinProps {
  barcodeWidth?: number;
  newWindow?: boolean;
};
export const CreateBins = (props: IcreateBinProps) => {
  const { barcodeWidth, newWindow } = props;
  const [formRef] = Form.useForm();
  const user = useAppSelector((state) => state.user.user.user);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const service = new BinsServices();
  const [binsData, setBinsData] = useState<BinsCreateRequest[]>([]);
  const [selectedRecord, setSelectedRecord] = useState<any>();
  const [isTitle, setIsTitle] = useState('');
  const [oktext, setOkText] = useState('');
  const [showBarcodePopUp, setShowBarcodePopUp] = useState<boolean>(true);


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

  useEffect(() => {
    getBins();
  }, []);

  const getBins = () => {
    setShowBarcodePopUp(false);
    const obj = new CommonRequestAttrs(user?.userName, user?.orgData?.unitCode, user?.orgData?.companyCode, user?.userId);
    service.getAllBinData(obj).then(res => {
      if (res.status) {
        setBinsData(res.data);
        // AlertMessages.getSuccessMessage(res.internalMessage);
      } else {
        // AlertMessages.getErrorMessage(res.internalMessage);
      }
    }).catch(err => {
      //AlertMessages.getErrorMessage(err.message);
    })
  }
  const showModal = (record) => {
    if (record.isActive) {
    setSelectedRecord(record);
    setIsModalOpen(true);
    setIsTitle('Update Bins');
    setOkText("Update");
    } else {
    AlertMessages.getErrorMessage("You Cannot Edit Deactivated Bins");
  }
  };
  const createShowModals = () => {
    setIsModalOpen(true);
    setIsTitle('Create Bins');
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
  const createBin = () => {
    formRef.validateFields().then(values => {
      const req = new BinsCreateRequest(user?.userName, user?.orgData?.unitCode, user?.orgData?.companyCode, user?.userId, values.id, values.name, values.code, values.spcount, values.level, values.rackId, values.column, values.preferredstoraageMateial, values.isActive, '');
      service.createBins(req).then(res => {
        if (res.status) {
          AlertMessages.getSuccessMessage(res.internalMessage);
          setIsModalOpen(false);
          fieldsReset();
          getBins();
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
  const deactivateBin = (id: number) => {
    const req = new BinsActivateRequest('', '', '', 5, id);
    service.ActivateDeactivateBins(req).then(res => {
      if (res.status) {
        AlertMessages.getSuccessMessage(res.internalMessage);
        getBins();
      } else {
        AlertMessages.getErrorMessage(res.internalMessage)
      }
    }).catch(err => {
      AlertMessages.getErrorMessage(err.message)
    })
  }

  const binColumns: ColumnsType<BinsCreateRequest> = [
    {
      title: 'Bin Name',
      dataIndex: 'name',
      align: 'center',
      key: 'name',
    },
    {
      title: 'Bin Code',
      dataIndex: 'code',
      align: 'center',
      key: 'code',
    },
    {
      title: 'Barcode ',
      dataIndex: 'barcodeId',
      align: 'center',
      key: 'barcodeId',
    },
    {
      title: 'Supported Pallets Count',
      dataIndex: 'spcount',
      align: 'center',
      key: 'spcount',
    },
    {
      title: 'Rack Code',
      dataIndex: 'rackCode',
      align: 'center',
      key: 'rackCode',
    },
    {
      title: 'Rack Level',
      dataIndex: 'level',
      align: 'center',
      key: 'level',
    },

    {
      title: 'Rack Level Column',
      dataIndex: 'column',
      align: 'center',
      key: 'column',
    },
    {
      title: 'Barcode',
      dataIndex: 'barcodeId',
      align: 'center',
      key: 'barcodeId',
    },

    {

      title: 'Action',
      dataIndex: 'action',
      align: 'center',
      key: 'action',
      render: (value, recod) => {

        return <>
          <Space>
            <EditOutlined onClick={() => showModal(recod)} /><Divider type="vertical" />

            <Popconfirm
              onConfirm={
                e => {
                  deactivateBin(recod.id)
                }}
              title={recod.isActive ? "Are you sure to Deactivate Bins ?" : "Are you sure to Activate Bins ?"}>
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
    <Card title="Bins"
      extra={
        <>
          <Space>
            <Tooltip title='Print'>
              <ScxButton onClick={handlePrint} icon={<PrinterTwoTone style={{ fontSize: '15px' }} />}>
                Print All Barcodes
              </ScxButton>
            </Tooltip>
            <Button onClick={() => createShowModals()} type="primary">
              Create
            </Button>
          </Space>
        </>
      }>
      <Table dataSource={binsData} size='small' columns={binColumns} scroll={{x: 'max-content'}} bordered/>
      <Modal title={<span style={{ textAlign: 'center', display: 'block', margin: '5px 0px' }}>{isTitle}</span>} open={isModalOpen} onOk={createBin} okText={oktext} cancelText="Close" onCancel={handleCancel} width={800} cancelButtonProps={{ style: { backgroundColor: 'red', color: 'white' } }}>
        <Divider type="horizontal"></Divider>
        <BinsCreateForm key={Date.now()} formRef={formRef} initialvalues={selectedRecord} />
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
            {binsData.map((bins, i) => (
              <div key={'b' + i} className="label" style={{ display: 'flex', alignItems: "center", justifyContent: 'space-between' }}>
                <QRCode value={bins?.barcodeId || ''} />
                <div>
                  <div style={{ padding: '5px', fontSize: '18px', fontWeight: 500, textAlign: 'center' }}>Bin</div>
                  <div style={{ padding: '5px', fontSize: '15px', fontWeight: 500 }}>Name : {bins?.code}</div>
                  <Barcode
                    value={bins?.barcodeId || ''}
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
export default CreateBins;