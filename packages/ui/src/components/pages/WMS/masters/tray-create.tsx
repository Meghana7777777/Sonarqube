import Icon, { EditOutlined, PrinterTwoTone } from "@ant-design/icons";
import { CommonRequestAttrs, TrayIdsRequest, TrayModel, TrayCreateRequest } from "@xpparel/shared-models";
import { TraysServices, TrolleysServices } from "@xpparel/shared-services";
import { Button, Card, Divider, Form, Modal, Popconfirm, QRCode, Space, Switch, Table, Tooltip, Tag } from "antd";
import { useAppSelector } from "packages/ui/src/common";
import { useEffect, useState } from "react";
import { AlertMessages } from "../../../common";
import TraysCreateForm from "./tray-create-form";
import { ColumnsType } from "antd/es/table";
import printJS from "print-js";
import React from "react";
import Barcode from "react-barcode";

interface IcreateBinProps {
  barcodeWidth?: number;
};
export const CreateTray = (props: IcreateBinProps) => {
  const { barcodeWidth } = props;
  const [formRef] = Form.useForm();
  const user = useAppSelector((state) => state.user.user.user);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const service = new TraysServices();
  const [traysdata, settrayssData] = useState<TrayModel[]>([]);
  const [selectedRecord, setSelectedRecord] = useState<any>();
  const [isTitle, setIsTitle] = useState('');
  const [oktext, setOkText] = useState('');
  const trollyCodeService = new TrolleysServices();
  const [trollyData, setTrollyData] = useState([]);
  const [trayId, setTrayID] = useState(false);
  const [showBarcodePopUp, setShowBarcodePopUp] = useState<boolean>(false);
  useEffect(() => {
    getTrays();
  }, []);


  const getTrays = () => {
    const obj = new TrayIdsRequest(user?.userName, user?.orgData?.unitCode, user?.orgData?.companyCode, user?.userId, [], false, true, false);
    service.getAllTrays(obj).then(res => {
      if (res.status) {
        settrayssData(res.data);
        // AlertMessages.getSuccessMessage(res.internalMessage);
      }
      else {
        // AlertMessages.getErrorMessage(res.internalMessage)
      }
    }).catch(err => {
      // AlertMessages.getErrorMessage(err.message)
    })
  }

  const showModal = (record) => {
    if (record.isActive) {
      setIsModalOpen(true);
      setTrayID(true);
      setSelectedRecord(record);
      setIsTitle('Update Trays');
      setOkText("Update");
      getAllTrollyCodeData();
    } else {
      AlertMessages.getErrorMessage("You Cannot Edit Deactivated Trays");
    }
  };

  const showModals = () => {
    setIsModalOpen(true);
    setTrayID(false);
    setSelectedRecord(null);
    setIsTitle('Create Trays');
    setOkText("Create");
    getAllTrollyCodeData();
    fieldsReset();
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
      const req = new TrayCreateRequest(user?.userName, user?.orgData?.unitCode, user?.orgData?.companyCode, user?.userId, values.id, values.name, values.code, values.capacity, 'NA', values.length, values.width, values.height);
      if (!values.id) {
        service.createTray(req).then(res => {
          if (res.status) {
            AlertMessages.getSuccessMessage(res.internalMessage);
            // console.log(res, '////');
            setIsModalOpen(false);
            fieldsReset();
            getTrays();
          } else {
            AlertMessages.getErrorMessage(res.internalMessage)
          }
        }).catch(err => {
          AlertMessages.getErrorMessage(err);
          fieldsReset();
        })
      } else {
        service.updateTray(req).then(res => {
          if (res.status) {
            AlertMessages.getSuccessMessage(res.internalMessage);
            // console.log(res, '////');
            setIsModalOpen(false);
            fieldsReset();
            getTrays();
          } else {
            AlertMessages.getErrorMessage(res.internalMessage)
          }
        }).catch(err => {
          AlertMessages.getErrorMessage(err);
          fieldsReset();
        })
      }
    }).catch((err) => {
      AlertMessages.getErrorMessage("Please fill required fields before creation.");
    })

  };
  const trayColumns: ColumnsType<any> = [
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
      title: 'Current Trolley',
      dataIndex: 'trollycode',
      align: 'center',
      key: 'trollycode',
      render: (value, recod: TrayModel) => {
        return <>
          {
            recod?.trolleyInfo?.code ? <Tag color="blue">{recod?.trolleyInfo?.code}</Tag> : <Tag color='red'>NA</Tag>
          }
        </>
      }
    },
    {
      title: 'Length',
      dataIndex: 'length',
      align: 'center',
      key: 'length',
    },
    {
      title: 'Width',
      dataIndex: 'width',
      align: 'center',
      key: 'width',
    },
    // {
    //   title: 'Height',
    //   dataIndex: 'height',
    //   align: 'center',
    //   key: 'height',
    // },
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
                const req = new TrayIdsRequest(user?.userName, user?.orgData?.unitCode, user?.orgData?.companyCode, user?.userId, [recod.id], false, false, false);
                service.activateDeactivateTray(req).then(res => {
                  if (!res.status) {
                    AlertMessages.getErrorMessage(res.internalMessage);
                    return;
                  }
                  AlertMessages.getSuccessMessage(res.internalMessage);
                  getTrays();
                }).catch(err => {
                  AlertMessages.getErrorMessage(err.message)
                })
              }}
            title={recod.isActive ? "Are you sure to Deactivate Trays ?" : "Are you sure to Activate Trays ?"}>
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

  const getAllTrollyCodeData = () => {
    const obj = new CommonRequestAttrs(user?.userName, user?.orgData?.unitCode, user?.orgData?.companyCode, user?.userId);
    trollyCodeService.getAllTrollys(obj).then(res => {
      if (res.status) {
        setTrollyData(res.data);
      }
    }).catch(err => {
      AlertMessages.getErrorMessage(err.message)
    })
  }
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
    <Card title='Tray' extra={<Space> <Tooltip title='Print Tray Barcodes'>
      <Button onClick={handlePrint} icon={<PrinterTwoTone style={{ fontSize: '15px' }} />}>
        Print All Barcodes
      </Button>
    </Tooltip><Button onClick={() => showModals()} type="primary"><b>{"Create"}</b></Button></Space>}>
      <Table
        dataSource={traysdata}
        columns={trayColumns}
        size="small"
        bordered
        scroll={{x: 'max-content'}}
      > </Table>
      <Modal title={<span style={{ textAlign: 'center', display: 'block', margin: '5px 0px' }}>{isTitle}</span>} width={800} open={isModalOpen} onOk={handleOk} okText={oktext} cancelText="Close" onCancel={handleCancel}>
        <TraysCreateForm formRef={formRef} initialvalues={selectedRecord} key={selectedRecord?.id} trollyData={trollyData} trayId={trayId} />
      </Modal>
      <Modal
        key={Date.now()}
        style={{ top: 10 }}
        width={barcodeWidth ? barcodeWidth + 48 : 432}
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
          {traysdata.map((trayObj, i) => (
            <div key={'t' + i} className="label" style={{ display: 'flex', alignItems: "center", justifyContent: 'space-between' }}>
              <QRCode value={trayObj?.barcode || ''} />
              <div>
                <div style={{ padding: '5px', fontSize: '18px', fontWeight: 500, textAlign: 'center' }}>Tray</div>
                <div style={{ padding: '5px', fontSize: '15px', fontWeight: 500 }}>Name : {trayObj?.code}</div>
                <Barcode
                  value={trayObj?.barcode || ''}
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
export default CreateTray;