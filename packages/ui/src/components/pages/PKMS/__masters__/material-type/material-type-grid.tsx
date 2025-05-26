import { EditFilled, SkinOutlined } from "@ant-design/icons";

import { CommonIdReqModal, CommonRequestAttrs, MaterialTypeRequestModel, MaterialTypeResponseDto, WareHouseModel, } from "@xpparel/shared-models";
import { MaterialTypeService, WareHouseService } from "@xpparel/shared-services";
import { Button, Card, Divider, Form, Input, Modal, Switch, Table } from "antd";
import { ColumnsType } from "antd/es/table";
import { SequenceUtils, useAppSelector } from "packages/ui/src/common";
import { AlertMessages } from "packages/ui/src/components/common";
import { useEffect, useState } from "react";
import MaterialTypeForm from "./material-type-form";

export const MaterialTypeGrid = () => {
  const [mtModel, setMtModel] = useState(false);
  const [initialValues, setIsInitialValues] = useState(null);
  const [mtData, setIsMtData] = useState([]);
  const service = new MaterialTypeService();
  const [formRef] = Form.useForm();
  const user = useAppSelector((state) => state.user.user.user);
  const { userName, orgData, userId } = user;
  const [searchedText, setSearchedText] = useState("");

  useEffect(() => {
    getAllMaterialTypes();
  }, []);

  const materialTypeModelClose = () => {
    setIsInitialValues(null);
    formRef.resetFields();
    getAllMaterialTypes();
    setMtModel(false);
  };

  const materialTypeModelOpen = () => {
    formRef.resetFields();
    setMtModel(true);
  };

  const editMaterialTypeData = (record) => {
    if (!record.isActive) {
      AlertMessages.getErrorMessage('Please Activate the record before Edit')
      return
    }
    setIsInitialValues(record);
    setMtModel(true);
  };

  const toggleMaterialTypeData = (record) => {
    setIsInitialValues(record);
    toggleMaterialType(record.id);
  };
  const createMaterialType = () => {
    formRef.validateFields().then((values) => {
      const isDuplicate = mtData.some(
        (item) =>
          item.materialTypeCode === values.materialTypeCode &&
          (!initialValues || item.id !== initialValues.id)
      );

      if (isDuplicate) {
        AlertMessages.getErrorMessage("Material type code already exists.");
        return;
      }
      const reqModel = new MaterialTypeRequestModel(values.materialTypeCode, values.materialTypeDesc, userName, orgData.unitCode, orgData.companyCode, userId, values.id);

      service.createMaterialType(reqModel).then((res) => {
        if (res.status) {
          const actionMessage = initialValues ? "Updated" : "Created";
          AlertMessages.getSuccessMessage(`Material type ${actionMessage} Successfully.`);
          materialTypeModelClose();
          getAllMaterialTypes();
        } else {
          AlertMessages.getErrorMessage(res.internalMessage);
        }
      })
        .catch((error) => {
          console.error(error);
          AlertMessages.getErrorMessage("An error occurred while saving the material type.");
        });
    })
      .catch((error) => {
        console.error(error);
        AlertMessages.getErrorMessage("Please fill in the required fields.");
      });
  };


  const getAllMaterialTypes = () => {
    const req = new CommonRequestAttrs(userName, orgData.unitCode, orgData.companyCode, userId);
    service.getAllMaterialTypes(req).then((res) => {
      if (res.status) {
        setIsMtData(res.data);
      } else {
        setIsMtData([]);
      }
    })
      .catch((err) => console.error(err.message));
  };

  const toggleMaterialType = (id) => {
    const req = new CommonIdReqModal(id, userName, orgData.unitCode, orgData.companyCode, userId);
    service.toggleMaterialType(req).then((res) => {
      if (res.status) {
        AlertMessages.getSuccessMessage(res.internalMessage);
        getAllMaterialTypes();
      } else {
        AlertMessages.getErrorMessage(res.internalMessage);
      }
    })
      .catch(err => console.log(err.message));
  };



  const columns: ColumnsType<any> = [
    {
      title: "Code",
      dataIndex: "materialTypeCode",
      sorter: (a, b) => a.materialTypeCode.localeCompare(b.materialTypeCode),
      sortDirections: ["descend", "ascend"],
      filteredValue: [String(searchedText).toLowerCase()],
      onFilter: (value, record) => {
        return SequenceUtils.globalFilter(value, record);
      },
    },
    {
      title: "Description",
      dataIndex: "materialTypeDesc",
    },
    {
      title: "Action",
      render: (_, record) => (
        <>
          <EditFilled
            onClick={() => editMaterialTypeData(record)}
            style={{ fontSize: "20px", color: "#08c" }}
          />
          <Divider type="vertical" />
          <Switch
            disabled={record?.isExist}
            className={record.isActive ? "toggle-activated" : "toggle-deactivated"}
           checked={record.isActive}
            onChange={() => toggleMaterialTypeData(record)}
            style={{ fontSize: "20px", color: "#08c" }}
          />
        </>
      ),
    },
  ];

  return (
    <>
      <Card
        title={
          <span>
            <SkinOutlined />
            <span> Material Type</span>
          </span>
        }
        extra={
          <Button onClick={materialTypeModelOpen} type="primary">
            Create
          </Button>
        }
      >
        <Input.Search
          placeholder="Search"
          allowClear
          onChange={(e) => {
            setSearchedText(e.target.value);
          }}
          onSearch={(value) => {
            setSearchedText(value);
          }}
          style={{ width: 200, float: "right" }}
        />
        <Table columns={columns}
          bordered
          dataSource={mtData} 
           size="small" />

        <Modal
          width={600}
          title={
            <span
              style={{
                textAlign: "center",
                display: "block",
                margin: "5px 0px",
              }}
            >
              {"Material Type"}
            </span>
          }
          cancelButtonProps={{ style: { backgroundColor: "red", color: "white" } }}
          open={mtModel}
          onCancel={materialTypeModelClose}
          onOk={createMaterialType}
          cancelText="Cancel"
          closable
          okText={initialValues ? "Update" : "Save"}
        >
          <MaterialTypeForm formRef={formRef} initialValues={initialValues} />
        </Modal>
      </Card>
    </>
  );
};

export default MaterialTypeGrid;
