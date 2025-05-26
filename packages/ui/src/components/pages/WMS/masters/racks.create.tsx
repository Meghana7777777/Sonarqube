import Icon, { EditOutlined, PrinterTwoTone } from "@ant-design/icons";
import {
  Alert,
  Button,
  Card,
  Divider,
  Form,
  Modal,
  Popconfirm,
  QRCode,
  Space,
  Switch,
  Table,
  Tooltip,
} from "antd";
import { useEffect, useState } from "react";
import RacksCreateForm from "./racks-create-form";
import {
  CommonRequestAttrs,
  RacksActivateRequest,
  RacksCreateRequest,
  RacksCreationModel,
} from "@xpparel/shared-models";
import { RacksServices } from "@xpparel/shared-services";
import { AlertMessages } from "../../../common";
import { useAppSelector } from "packages/ui/src/common";
import { ScxButton } from "packages/ui/src/schemax-component-lib";
import React from "react";
import Barcode from "react-barcode";
import { getCssFromComponent } from "../print-barcodes";
import printJS from "print-js";
import * as htmlToImage from "html-to-image";
import { ColumnType, ColumnsType } from "antd/es/table";


export interface IcreateRackProps {
  barcodeWidth?: number;
  newWindow?: boolean;
}
export const CreateRacks = (props: IcreateRackProps) => {
  const { newWindow, } = props;
  const service = new RacksServices();
  const user = useAppSelector((state) => state.user.user.user);

  const [racksdata, setRacksData] = useState<RacksCreationModel[]>([]);
  const [formRef] = Form.useForm();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState<any>();
  const [isTitle, setIsTitle] = useState("");
  const [oktext, setOkText] = useState("");
  const [showBarCodeModel, setShowBarCodeModel] = useState<boolean>(false);

  let externalWindow: any;
  let containerEl: any;
  // Open in new Window
  if (newWindow) {
    externalWindow = window.open('', '', 'width=600,height=700,left=200,top=50');
    containerEl = externalWindow.document.createElement('div');
    externalWindow.document.body.appendChild(containerEl);
    externalWindow.document.title = 'Barcodes';
    getCssFromComponent(document, externalWindow.document);
  }

  const printAllBarCodes = () => {
    const pageContent = document.getElementById("printArea");
    if (pageContent) {
      // htmlToImage.toPng(pageContent, { quality: 100 }).then(function (dataUrl) {
      printJS({
        printable: pageContent,
        type: "html",
        // base64: true,
        showModal: true,
        modalMessage: "Loading...",
        targetStyles: ['*'],
        style: '@page {size: 384px 192px  ; margin: 0mm; .label {page-break-after: always !important;}} body {margin: 0;} }'
      });
      setShowBarCodeModel(false);
      // });
    } else {
      AlertMessages.getErrorMessage("Page content element not found.");
    }
  };

  useEffect(() => {
    getRacks();
  }, []);

  const getRacks = () => {
    setShowBarCodeModel(false);
    const obj = new CommonRequestAttrs(
      user?.userName,
      user?.orgData?.unitCode,
      user?.orgData?.companyCode,
      user?.userId
    );
    service
      .getAllRacksData(obj)
      .then((res) => {
        if (res.status) {
          setRacksData(res.data);
          // AlertMessages.getSuccessMessage(res.internalMessage);
        } else {
          // AlertMessages.getErrorMessage(res.internalMessage);
        }
      })
      .catch((err) => {
        //AlertMessages.getErrorMessage(err.message);
      });
  };

  const EditShowModal = (record) => {
    if (record.isActive) {
    setSelectedRecord(record);
    setIsModalOpen(true);
    setIsTitle("Update Racks");
    setOkText("Update");
  } else {
      AlertMessages.getErrorMessage("You Cannot Edit Deactivated Racks");
    }
  };
  const createShowModals = () => {
    setIsModalOpen(true);
    setIsTitle("Create Racks");
    setOkText("Create");
    setSelectedRecord(undefined);
    formRef.resetFields();
  };
  const handleCancel = () => {
    setSelectedRecord(undefined);
    setIsModalOpen(false);
    formRef.resetFields();
  };
  const fieldsReset = () => {
    formRef.resetFields();
  };
  const createRack = () => {
    formRef.validateFields().then((values) => {
      const req = new RacksCreateRequest(
        user?.userName,
        user?.orgData?.unitCode,
        user?.orgData?.companyCode,
        user?.userId,
        values.id,
        values.name,
        values.code,
        values.levels,
        values.wcode,
        values.columns,
        values.preferredstoraageMateial,
        values.priority,
        values.isActive,
        values.barCodeId,
        values.capacityInMts,
      );
      service
        .createRacks(req)
        .then((res) => {
          if (res.status) {
            AlertMessages.getSuccessMessage(res.internalMessage);
            setIsModalOpen(false);
            fieldsReset();
            getRacks();
          } else {
            AlertMessages.getErrorMessage(res.internalMessage);
          }
        })
        .catch((err) => {
          //AlertMessages.getErrorMessage(err.message);
          fieldsReset();
        });
    }).catch((err) => {
      AlertMessages.getErrorMessage("Please fill required fileds before creation.");
    })
  };

  const deactivateRack = (id: number) => {
    const req = new RacksActivateRequest("", "", "", 5, id);
    service.activedeactiveRacks(req)
      .then((res) => {
        if (res.status) {
          AlertMessages.getSuccessMessage(res.internalMessage);
          getRacks();
        } else {
          AlertMessages.getErrorMessage(res.internalMessage);
        }
      })
      .catch((err) => {
        AlertMessages.getErrorMessage(err.message);
      });
  };

  const handlePrint = () => {
    setShowBarCodeModel(true);

  };
  const hideModal = () => {
    setShowBarCodeModel(false);
  };


  const rackColumns: ColumnsType<RacksCreateRequest> = [
    {
      title: "Rack Name",
      dataIndex: "name",
      align: 'center',
      key: "name",
    },
    {
      title: "Rack Code",
      dataIndex: "code",
      align: 'center',
      key: "code",
    },
    {
      title: "Barcode",
      dataIndex: "barcodeId",
      align: 'center',
      key: "barcodeId",
    },
    {
      title: "No Of levels",
      dataIndex: "levels",
      align: 'center',
      key: "levels",
    },
    {
      title: "Warehouse Code",
      dataIndex: "wcode",
      align: 'center',
      key: "wcode",
    },
    {
      title: "Columns",
      dataIndex: "columns",
      align: 'center',
      key: "columns",
    },
    {
      title: "Preferred Storage Material",
      dataIndex: "preferredstoraageMateial",
      align: 'center',
      key: "preferredstoraageMateial",
    },
    {
      title: "Priority",
      dataIndex: "priority",
      align: 'center',
      key: "priority",
    },
    {
      title: "Barcode",
      dataIndex: "barcodeId",
      align: 'center',
      key: "barcodeId",
    },
    {
      title: "Capacity in Mts",
      dataIndex: "capacityInMts",
      align: 'center',
      key: "capacityInMts",
    },

    {
      title: "Action",
      dataIndex: "action",
      align: 'center',
      key: "action",
      render: (value, recod) => {
        return (
          <>
            <Space>
              <EditOutlined onClick={() => EditShowModal(recod)} />
              <Divider type="vertical" />

              <Popconfirm
                onConfirm={(e) => {
                  deactivateRack(recod.id);
                }}
                title={
                  recod.isActive
                    ? "Are you sure to Deactivate Racks ?"
                    : "Are you sure to Activate Racks ?"
                }
              >
                <Switch
                  size="default"
                  defaultChecked
                  className={
                    recod.isActive ? "toggle-activated" : "toggle-deactivated"
                  }
                  checkedChildren={<Icon type="check" />}
                  unCheckedChildren={<Icon type="close" />}
                  checked={recod.isActive}
                />
              </Popconfirm>

            </Space>
          </>
        );
      },
    },
  ];

  return (
    <div >
      <Card
        title="Racks"
        extra={
          <>
            <Space>
              <Tooltip title='Print'>
                <ScxButton onClick={handlePrint} icon={<PrinterTwoTone style={{ fontSize: '15px' }} />}>
                  Print All Barcodes
                </ScxButton>
              </Tooltip>

              <Button
                type="primary"
                onClick={() => createShowModals()}>
                Create
              </Button>
            </Space>
          </>

        }
      >
        <Table dataSource={racksdata} size="small" columns={rackColumns} bordered scroll={{x: 'max-content'}}> 

        </Table>
      </Card>
      <Modal
        title={
          <span
            style={{ textAlign: "center", display: "block", margin: "5px 0px" }}
          >
            {isTitle}
          </span>
        }
        width={800}
        open={isModalOpen}
        onOk={createRack}
        okText={oktext}
        cancelText="Close"
        onCancel={handleCancel}
        cancelButtonProps={{ style: { backgroundColor: 'red', color: 'white' } }}
      >
        <Divider type="horizontal"></Divider>
        <RacksCreateForm formRef={formRef} initialvalues={selectedRecord} />
      </Modal>
      <>
        <Modal
          style={{ top: 10 }}
          width={432}
          title={
            <React.Fragment>
              Print Barcodes{' '}
              <Button type="primary" onClick={printAllBarCodes}>
                Print
              </Button>{' '}
            </React.Fragment>
          }
          open={showBarCodeModel}
          onCancel={hideModal}
          footer={null}
        >
          <div id="printArea" style={{ width: '384px' }}>
            {racksdata.map((racks, i) => (
              <div key={'r' + i} className="label" style={{ display: 'flex', alignItems: "center", justifyContent: 'space-between' }}>
                <QRCode
                  value={racks?.barcodeId || ''}
                />
                <div>
                  <div style={{ padding: '5px', fontSize: '18px', fontWeight: 500, textAlign: 'center' }}>Rack</div>
                  <div style={{ padding: '5px', fontSize: '15px', fontWeight: 500 }}>Name : {racks?.code}</div>
                  <Barcode
                    value={racks?.barcodeId || ''}
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
      </>
    </div>
  );
};
export default CreateRacks;


