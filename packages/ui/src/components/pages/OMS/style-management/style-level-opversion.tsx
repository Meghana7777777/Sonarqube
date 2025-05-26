import { EyeOutlined, PlusOutlined, SkinOutlined } from "@ant-design/icons";
import { OpVersionAbstractModel, OpVersionReq, ProcessTypeEnum, StyleModel, StyleProductOpVersionAbstract } from "@xpparel/shared-models";
import { StyleProductOpService, StyleSharedService } from "@xpparel/shared-services";
import { Button, Card, Modal, Select, Space, Spin, Tag, Tooltip } from "antd";
import { useAppSelector } from "packages/ui/src/common";
import { useEffect, useRef, useState } from "react";
import { AlertMessages } from "../../../common";
import OperationRouting from "../operation-rounting";
import './style-level-opversion.css';
import OpVersionPage from "../op-version-view-page";
import OperationRoutingForCut from "../cut-op-version/operation-rounting-for-cut";

interface ISelectedStyle {
  styleCode: string;
  productType: string;
  type: string;
  opVersionInfo: OpVersionAbstractModel[],
  processType: string;
}
const { Option } = Select;
const StyleLevelOpVersion = () => {
  const styleService = new StyleProductOpService();
  const stylesService = new StyleSharedService();
  const user = useAppSelector((state) => state.user.user.user);
  const [opVersionData, setOpVersionData] = useState<StyleProductOpVersionAbstract[]>([]);
  const [selectedOpVersionData, setSelectedOpVersionData] = useState<StyleProductOpVersionAbstract[]>([]);
  const [filter, setFilter] = useState("all");
  const [selectedStyle, setSelectedStyle] = useState(undefined);
  const [selectedProduct, setSelectedProduct] = useState("all");

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [styleData, setStyleData] = useState<StyleModel[]>([]);
  const [updateKey, setUpdateKey] = useState<number>(0);
  const [hasMoreData, setHasMoreData] = useState(true);
  const [modalContent, setModalContent] = useState<ISelectedStyle>({
    styleCode: "",
    productType: "",
    type: "",
    opVersionInfo: [],
    processType: ""
  });




  const scrollContainerRef = useRef(null);
  const handleScroll = () => {
    const container = scrollContainerRef.current;
    if (!container || loading || !hasMoreData) return;
    const { scrollTop, scrollHeight, clientHeight } = container;
    const nearBottom = scrollTop + clientHeight >= scrollHeight - 10;

    if (nearBottom) {
      setPage(prev => prev + 1);
    }
  };

  useEffect(() => {
    getStyleProductTypeOpVersionAbstract(page, 30, selectedStyle)
  }, [page]);

  useEffect(() => {
    getAllStyles();
  }, []);

  const getStyleProductTypeOpVersionAbstract = (page, limit, selectedStyle, isSelectedStyle: boolean = false) => {
    setLoading(true);
    const reqModel = new OpVersionReq(user?.userName, user?.orgData?.unitCode, user?.orgData?.companyCode, user?.userId, undefined, page, limit, selectedStyle);
    styleService.getStyleProductTypeOpVersionAbstract(reqModel).then(res => {
      if (res.status) {
        if (isSelectedStyle) {
          setSelectedOpVersionData(res.data);
        } else {
          setOpVersionData(prevData => page === 1 ? res.data : [...prevData, ...res.data]);
          setHasMoreData(res.data.length === limit);
        }
      } else {
        setHasMoreData(false);
      }
      setLoading(false);
    }).catch(err => {
      AlertMessages.getErrorMessage(err.message);
      setLoading(false);
    });
  };

  const getAllStyles = () => {
    stylesService.getAllStyles().then(res => {
      if (res.status) {
        setStyleData(res.data);
      } else {
        setStyleData([]);
      }
    }).catch(err => {
      AlertMessages.getErrorMessage(err.message);
    });
  }


  const handleCancel = (isReload: boolean = false, versionCode: string = '', versionDescription: string = '') => {
    const newVersion = {
      versionId: 0,
      versionDescription: versionCode,
      versionName: versionDescription,
    };

    const updateVersionData = (data: StyleProductOpVersionAbstract[], setter: React.Dispatch<React.SetStateAction<StyleProductOpVersionAbstract[]>>) => {
      const index = data.findIndex(e => e.styleCode === modalContent.styleCode && e.productType === modalContent.productType);
      if (index === -1) return;

      setter(prev =>
        prev.map((item, i) => i === index ? { ...item, opVersionAbstract: [...item.opVersionAbstract, newVersion] } : item
        )
      );
    };

    if (isReload) {
      updateVersionData(opVersionData, setOpVersionData);
      if (selectedStyle) {
        updateVersionData(selectedOpVersionData, setSelectedOpVersionData);
      }
    }

    setIsModalOpen(false);
  };


  const showModal = (item: StyleProductOpVersionAbstract, type) => {
    const styleProcessType = styleData.find(e => e.styleCode == item.styleCode);
    if(!styleProcessType.processType) {
      AlertMessages.getErrorMessage('Please Map Process Type to Style in Style Master')
      return;
    }
    setModalContent({ opVersionInfo: item.opVersionAbstract, productType: item.productType, styleCode: item.styleCode, type, processType: styleProcessType ? styleProcessType.processType || ProcessTypeEnum.CUT : ProcessTypeEnum.CUT });

    setIsModalOpen(true);
    setUpdateKey(pre => pre + 1);
  };

  console.log(modalContent)

  const handleStyleChange = (value) => {
    setSelectedStyle(value);
    if (value) {
      getStyleProductTypeOpVersionAbstract(undefined, undefined, value, true);
    }
  };

  const filteredData = selectedStyle ? selectedOpVersionData : opVersionData
    ?.filter((item) => {
      if (filter === "withCode") return item.opVersionAbstract.length > 0;
      if (filter === "withoutCode") return item.opVersionAbstract.length < 1;
      return true;
    })
    // ?.filter((item) => selectedStyle === "all" || item.styleCode === selectedStyle)
    ?.filter((item) => selectedProduct === "all" || item.productType === selectedProduct);

  const totalStyles = opVersionData?.length;
  const withCodeCount = opVersionData?.filter((item) => item.opVersionAbstract.length > 0).length;
  const withoutCodeCount = opVersionData?.filter((item) => item.opVersionAbstract.length < 1).length;

  return (
    <Card size="small"
      title={
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <span>Operation Routing for Styling</span>
          <div style={{ display: "flex", gap: "10px" }}>
            <Tag color="blue">Total Styles: {totalStyles}</Tag>
            <Tag color="green">With Code: {withCodeCount}</Tag>
            <Tag color="red">Without Code: {withoutCodeCount}</Tag>
            {/* <Button type="primary" onClick={() => showModal({}, "edit")} size="small">
              Add Operation Version
            </Button> */}
          </div>
        </div>
      }
    >
      <div  className="filter-bar">
        <Button type={filter === "all" ? "primary" : "default"} onClick={() => setFilter("all")}>
          Show All
        </Button>
        <Button type={filter === "withCode" ? "primary" : "default"} onClick={() => setFilter("withCode")}>
          With OpVersionCode
        </Button>
        <Button type={filter === "withoutCode" ? "primary" : "default"} onClick={() => setFilter("withoutCode")}>
          Without OpVersionCode
        </Button>

        <Select
          value={selectedStyle}
          onChange={handleStyleChange}
          style={{ width: 150 }}
          allowClear
          placeholder="Select Style"
        >
          {/* <Option value="all">All Styles</Option> */}
          {styleData?.map((style) => (
            <Option key={style.id} value={style.styleCode}>
              {style.styleCode}
            </Option>
          ))}
        </Select>
        <Select
          value={selectedProduct}
          onChange={(value) => setSelectedProduct(value || "all")}
          style={{ width: 150 }}
          allowClear
          placeholder="Select Product"
        >
          <Option value="all">All Products</Option>
          {Array.from(new Set(opVersionData?.map((item) => item.productType))).map((product) => (
            <Option key={product} value={product}>
              {product}
            </Option>
          ))}
        </Select>
      </div>

      <div
        ref={scrollContainerRef}
        onScroll={handleScroll}
        style={{
          height: "60vh", overflowY: "scroll",
        }}
      >
        <div style={{ display: "flex", flexWrap: "wrap", rowGap: "10px", columnGap: "10px", minHeight: "150px", }}>
          {(filteredData).map((item) => (
            <Card
              key={item.styleCode}
              size="small"
              title={<>{item.styleCode}</>}
              className="opversion-card"
              style={{
                backgroundColor: item.opVersionAbstract && item.opVersionAbstract.length > 0
                  ? "#60d394"
                  : "#ee6055",
                border: "none",
                boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)",
                marginBottom: "10px",
              }}
            >
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                <Tooltip title={'Product Type'} placement={'right'}>
                  <p className="opversion-p">
                    <SkinOutlined style={{ fontSize: '16px', paddingRight: '5px' }} />
                    <strong>{item.productType}</strong>
                  </p>
                </Tooltip>
                <Tooltip title={'No of Operation Version'} placement={'right'}>
                  <p className="opversion-p" style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: '25px', lineHeight: 1 }}>{item?.opVersionAbstract?.length}</div>
                  </p>
                </Tooltip>
                <Space>
                  <Button type="default" size="small" onClick={() => showModal(item, "view")}>
                    <EyeOutlined />
                  </Button>
                  <Button type="primary" size="small" onClick={() => showModal(item, "edit")}>
                    <PlusOutlined />
                  </Button>
                </Space>
              </div>
            </Card>
          ))}
          <div ref={scrollContainerRef} style={{ width: '100%', height: '20px', background: 'transparent' }} />

          {loading && hasMoreData && (
            <div style={{ width: "100%", textAlign: "center", margin: "20px 0" }}>
              <Spin size="large" />
            </div>
          )}

        </div>
      </div>
      <Modal
        className="opversion-modal"
        title={modalContent.type === "view" ? "View Details" : "Add Operation Version"}
        open={isModalOpen}
        width={'100%'}
        style={{ top: '0' }}
        onCancel={() => handleCancel()}
        footer={[]}
      >
        {modalContent.type === "view" && (
          <OpVersionPage style={modalContent.styleCode} productType={modalContent.productType} />
        )}

        {modalContent.type === "edit" && (
          modalContent.processType == ProcessTypeEnum.CUT ? <OperationRoutingForCut style={modalContent.styleCode} productType={modalContent.productType} uniqueKey={updateKey + 1} closeModal={handleCancel} />
            : <OperationRouting style={modalContent.styleCode} productType={modalContent.productType} uniqueKey={updateKey + 1} closeModal={handleCancel} />

        )}

      </Modal>
    </Card>
  );
};

export default StyleLevelOpVersion;

