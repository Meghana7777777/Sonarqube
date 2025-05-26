import { CloseCircleOutlined, ScanOutlined } from "@ant-design/icons";
import { Alert, Button, Card, Col, Descriptions, Form, Input, Row, Select, Space, Table, Tabs, Tooltip } from "antd";
import { Dispatch, SetStateAction, useEffect, useRef, useState } from "react";
import { useAppSelector } from "../../../../common";
import CartonPacks from "./carton-packs";
import { CartonFillingModel, ExtFgBarCodeReqDto, FgsInfoDto, PkmsReportingConfigurationResponseDto, PolyBagPrototypeModel, UpcBarCodeReqDto } from "@xpparel/shared-models";
import { PackListViewServices } from "@xpparel/shared-services";
import { AlertMessages } from "../../../common";

const { Search } = Input;
interface ScanAndPackIProps {
  activeCartonData: CartonFillingModel;
  resetCarton: () => void;
  getFgCartonFillingData: (cartonNo: string) => void;
  setActiveCartonData: Dispatch<SetStateAction<CartonFillingModel>>
  activePoyBagTab: string
  setActivePoyBagTab: Dispatch<SetStateAction<string>>
  configuration: PkmsReportingConfigurationResponseDto
}
interface DisplayMsg {
  isSuccess: boolean;
  msg: string;
}
export const ScanAndPack = (props: ScanAndPackIProps) => {
  const user = useAppSelector((state) => state.user.user.user);
  const { activeCartonData, getFgCartonFillingData, setActiveCartonData, activePoyBagTab, setActivePoyBagTab, configuration } = props
  const fgInputRef = useRef(null);
  const packListViewServices = new PackListViewServices();
  const [formRef] = Form.useForm();
  const [plannedCartons, setPlannedCartons] = useState<PolyBagPrototypeModel[]>(activeCartonData.plannedPolyBagDetails);
  const [scannedCartons, setScannedCartons] = useState<PolyBagPrototypeModel[]>(activeCartonData.scannedPolyBagDetails);
  const [displayMsg, setDisplayMsg] = useState<DisplayMsg>(undefined);


  useEffect(() => {
    fgInputFocus();
  }, [activeCartonData]);



  const fgInputFocus = () => {
    if (fgInputRef.current) {
      fgInputRef.current.focus();
    }
  };

  let timeOutId;
  const scanBarCode = async (value: string) => {
    clearTimeout(timeOutId);
    if (value) {
      timeOutId = setTimeout(() => {
        if (configuration.isExternal) {
          scanExtGarmentBarcode(value.trim());
        } else {
          scanGarmentBarcode(value.trim());
        }
      }, 500)
    }

  };

  const addDisplayMsg = (msg: string, isSuccess: boolean = false,) => {
    const displayObj: DisplayMsg = { isSuccess, msg }
    setDisplayMsg(displayObj);
  }

  const scanGarmentBarcode = async (value: string) => {
    const req = new UpcBarCodeReqDto(value, activeCartonData.cartonId, activeCartonData.cartonProtoId, Number(activePoyBagTab), user?.userName, user?.orgData?.unitCode, user?.orgData?.companyCode, user?.userId)
    packListViewServices.scanGarmentBarcode(req).then(res => {
      if (res.status) {
        scanSuccessHandler(value, res.internalMessage)
      } else {
        scanFailHandler(res.internalMessage)
      }
    }).catch(err => {
      scanFailHandler(err.message)
    });
  }

  const scanSuccessHandler = (upcBarCode: string, message: string) => {
    addDisplayMsg(message, true);
    setActiveCartonData((prev) => {
      let scannedUpc;
      return {
        ...prev,
        plannedPolyBagDetails: prev.plannedPolyBagDetails.map((polyBags) => {
          return {
            ...polyBags,
            sizeRatios: polyBags.sizeRatios.map((sizes) => {
              if (sizes.upcBarCode === upcBarCode) {
                scannedUpc = { ...sizes, ratio: 1 }
                return {
                  ...sizes,
                };
              }
              return sizes;
            }),
          }
        }),
        scannedPolyBagDetails: prev.scannedPolyBagDetails.map((polyBags) => {
          if (polyBags.id == Number(activePoyBagTab)) {
            const findExistUpc = polyBags.sizeRatios.find((rec) => rec.upcBarCode === upcBarCode)
            let sizeRatios;
            if (findExistUpc) {
              sizeRatios = polyBags.sizeRatios.map((sizes) => {
                if (sizes.upcBarCode === upcBarCode) {
                  return {
                    ...sizes,
                    ratio: sizes.ratio + 1,
                  };
                }
                return sizes;
              })
            } else {
              polyBags.sizeRatios.push(scannedUpc);
              sizeRatios = polyBags.sizeRatios
            }
            return {
              ...polyBags,
              sizeRatios,
            }
          } else {
            return polyBags
          }
        }),
        scannedQy: prev.scannedQy + 1
      }
    })
    formRef.resetFields();
    setTimeout(() => {
      fgInputFocus();
    }, 1)
  }

  const scanFailHandler = (message: string) => {
    formRef.resetFields();
    addDisplayMsg(message);
    setTimeout(() => {
      fgInputFocus();
    }, 1)
  }

  const scanExtGarmentBarcode = async (externalFg: string) => {
    const req = new ExtFgBarCodeReqDto(externalFg, activeCartonData.cartonId, activeCartonData.cartonProtoId, Number(activePoyBagTab), user?.userName, user?.orgData?.unitCode, user?.orgData?.companyCode, user?.userId)
    packListViewServices.scanExtGarmentBarcode(req).then(res => {
      if (res.status) {
        scanSuccessHandler(res.data.upcBarCode, res.internalMessage)
      } else {
        scanFailHandler(res.internalMessage)
      }
    }).catch(err => {
      scanFailHandler(err.message)
    });
  };

  const sizeDetailsColumns = [
    {
      title: "UPC",
      dataIndex: "upcBarCode",
      key: "upcBarCode",
    },
    {
      title: "Size",
      dataIndex: "size",
      key: "size",
    },
    {
      title: "Quantity",
      dataIndex: "qty",
      key: "qty",
    },
    {
      title: "Ratio",
      dataIndex: "ratio",
      key: "ratio",
    }

  ];



  const getSizeWiseDetails = () => {
    const data = new Map<string, any>();
    activeCartonData.plannedPolyBagDetails.forEach(poly => {
      poly.sizeRatios.forEach(size => {
        if (!data.has(size.size + '$@$' + poly.id)) {
          data.set(size.size + '$@$' + poly.id, {
            upcBarCode: size.upcBarCode,
            size: size.size,
            ratio: size.ratio,
            qty: size.ratio * poly.count,
          })
        } else {
          data.get(size.size + '$@$' + poly.id).qty += size.ratio * poly.count;
        }
      })
    })
    return Array.from(data.values())
  }

  const getPolyBagLevelSizeWiseDetails = (poly: PolyBagPrototypeModel) => {
    const data = new Map<string, any>();
    poly.sizeRatios.forEach(size => {
      if (!data.has(size.poSubLId + '$@$' + poly.id)) {
        data.set(size.poSubLId + '$@$' + poly.id, {
          upcBarCode: size.upcBarCode,
          size: size.size,
          ratio: size.ratio,
          qty: size.ratio * poly.count,
        })
      } else {
        data.get(size.poSubLId + '$@$' + poly.id).qty += size.ratio * poly.count;
      }
    })
    return Array.from(data.values())
  }
  const closeMsg = () => {
    fgInputFocus();
    removeDIsplayMsg();
  }
  const removeDIsplayMsg = () => {
    setDisplayMsg(undefined);
  }
  return (
    <Card title="Carton Filling" extra={
      <Space size={'large'}>
        {displayMsg && <Alert
          message={displayMsg.msg}
          type={displayMsg.isSuccess ? "success" : 'error'}
          style={{ padding: '8px 12px' }}
          banner
          showIcon
          closable
          afterClose={closeMsg}
        />}

      </Space>
    }>
      <Descriptions
        bordered
        size="small"
        column={{ xxl: 3, xl: 3, lg: 3, md: 3, sm: 3, xs: 1 }}
      >
        <Descriptions.Item label={'Pack Order No'}>
          <b>{activeCartonData?.poNumber}</b>
        </Descriptions.Item>
        <Descriptions.Item label={'Ex Factory Date'}>
          <b>{activeCartonData?.exFactory}</b>
        </Descriptions.Item>
        <Descriptions.Item label={'Pieces Per Carton'}>
          <b>{activeCartonData?.qty}</b>
        </Descriptions.Item>
      </Descriptions>
      <Row gutter={16}>
        <Col span={12}>
          <Card title="Scan Garment Barcode">
            <Form autoComplete="off" form={formRef}>
              <Form.Item label="Scan Garment Barcode">
                <Space>
                  <Form.Item name="garmentBarcode" noStyle>
                    <Input
                      placeholder="Scan Garment Barcode"
                      ref={fgInputRef}
                      prefix={<ScanOutlined />}
                      onChange={(v) => scanBarCode(v.target.value)}
                    />
                  </Form.Item>
                  <Form.Item name="manualBarcode" noStyle>
                    <Search
                      placeholder="Type Garment Barcode"
                      enterButton
                      onSearch={(v) => scanBarCode(v)}
                      onChange={(v) => scanBarCode(v.target.value)}
                    />
                  </Form.Item>
                </Space>
              </Form.Item>
            </Form>
          </Card>
          <Card title="Size Wise Details" style={{ marginTop: "20px" }}>
            <Tabs defaultActiveKey={activePoyBagTab} onChange={(tab) => { setActivePoyBagTab(tab) }} items={activeCartonData.plannedPolyBagDetails.map(poly => ({
              key: `${poly.id}`,
              label: poly.itemCode, children: <Table
                rowKey="key"
                columns={sizeDetailsColumns}
                dataSource={getPolyBagLevelSizeWiseDetails(poly)}
                pagination={false}
                size="small"
              />
            }))} />

          </Card>
        </Col>
        <Col span={12}>
          {activeCartonData && (
            <Card
              extra={
                (activeCartonData && (activeCartonData.count == 0)) &&
                <Button
                  danger
                  icon={<Tooltip title='Reset Size Selection'><CloseCircleOutlined />
                  </Tooltip>}
                />}>
              <CartonPacks activeCartonData={activeCartonData}
                activePoyBagTab={activePoyBagTab}
              />
            </Card>
          )}
        </Col>
      </Row>

    </Card>
  );
};

export default ScanAndPack;
