import { ContainerOutlined, EditFilled } from "@ant-design/icons";
import { CommonIdReqModal, CommonRequestAttrs, PackTypeModelDto, PackTypeReqModel } from "@xpparel/shared-models";

import { PackTypeService } from "@xpparel/shared-services";
import { Button, Card, Divider, Form, Input, Modal, Switch, Table } from "antd";
import { ColumnsType } from "antd/es/table";
import { SequenceUtils, useAppSelector } from "packages/ui/src/common";
import { AlertMessages } from "packages/ui/src/components/common";
import { useEffect, useState } from "react";
import { PackTypeForm } from "./pack-type.form";

export const PackTypeGrid = () => {
  const [mtModel, setMtModel] = useState<boolean>(false);
  const [initialValues, setIsInitialValues] = useState<PackTypeModelDto>();
  const [mtData, setIsMtData] = useState<PackTypeModelDto[]>();
  const service = new PackTypeService();
  const [formRef] = Form.useForm();
  const user = useAppSelector((state) => state.user.user.user);
  const { userName, orgData, userId } = user;
  const [searchedText, setSearchedText] = useState("");
  const [okText, setOkText] = useState<string>("Save");

  useEffect(() => {
    getAllPackTypes();
  }, []);

  const packTypeModelClose = () => {
    setMtModel(false);
    formRef.resetFields();
    setIsInitialValues(undefined); 
    getAllPackTypes();
  };

  const packTypeModelOpen = () => {
    setIsInitialValues(undefined); 
    setMtModel(true);
    setOkText("Save");
  };

  const editPackTypeData = (record: any) => {
    if (!record.isActive) {
      AlertMessages.getErrorMessage("Please Activate the record before Edit");
      return;
    }
    setIsInitialValues(record);
    setMtModel(true);
    setOkText("Update");
  };

  const togglePackTypeData = (record: any) => {
    setIsInitialValues(record);
    togglePackType(record.id);
  };

  const getAllPackTypes = () => {
    const req = new CommonRequestAttrs(userName, orgData.unitCode, orgData.companyCode, userId);
    service
      .getAllPackTypes(req)
      .then((res) => {
        if (res.status) {
          setIsMtData(res.data);
        } else {
          setIsMtData([]);
        }
      })
      .catch((err) => console.log(err.message));
  };

  const togglePackType = (id: number) => {
    const req = new CommonIdReqModal(id, userName, orgData.unitCode, orgData.companyCode, userId);
    service
      .togglePackType(req)
      .then((res) => {
        if (res.status) {
          AlertMessages.getSuccessMessage(res.internalMessage);
          getAllPackTypes();
        } else {
          AlertMessages.getErrorMessage(res.internalMessage);
        }
      })
      .catch((err) => console.log(err.message));
  };

  const createPackType = () => {
    formRef
      .validateFields()
      .then((formValues) => {
        const isEditMode = !!initialValues;
        const isDuplicateCheckNeeded =
          !isEditMode || (isEditMode && initialValues.packTypeCode !== formValues.packTypeCode);

        const req = new PackTypeReqModel(
          formValues.packTypeCode,
          formValues.packTypeDesc,
          formValues.packMethod,
          userName,
          orgData.unitCode,
          orgData.companyCode,
          userId,
          formValues.id
        );

        service
          .createPackType(req)
          .then((response) => {
            if (response.status) {
              if (response.internalMessage === "DUPLICATE_PACKTYPE_CODE" && isDuplicateCheckNeeded) {
                AlertMessages.getErrorMessage("Pack type code already exists.");
              } else {
                const actionMessage = isEditMode ? "updated" : "created";
                AlertMessages.getSuccessMessage(`Pack Type ${actionMessage} Successfully.`);
                packTypeModelClose();
              }
            } else {
              AlertMessages.getErrorMessage(response.internalMessage || "An error occurred.");
            }
          })
          .catch((error) => {
            console.log(error);
            AlertMessages.getErrorMessage("An error occurred while saving the pack type.");
          });
      })
      .catch((error) => {
        console.log(error);
        AlertMessages.getErrorMessage("Please fill in the required fields.");
      });
  };

  const columns: ColumnsType<any> = [
    {
      title: "Code",
      dataIndex: "packTypeCode",
      sorter: (a, b) => {
        return a.packTypeCode.localeCompare(b.packTypeCode);
      },
      sortDirections: ["descend", "ascend"],
      filteredValue: [String(searchedText).toLowerCase()],
      onFilter: (value, record) => {
        return SequenceUtils.globalFilter(value, record);
      },
    },
    {
      title: "Description",
      dataIndex: "packTypeDesc"
      
    },
    {
      title: "Pack Method",
      dataIndex: "packMethod"
    
    },
    {
      title: "Action",
      render: (_, record) => (
        <>
          <EditFilled onClick={() => editPackTypeData(record)} style={{ fontSize: "20px", color: "#08c" }} />
          <Divider type="vertical" />
          <Switch
            className={record.isActive ? "toggle-activated" : "toggle-deactivated"}
            checked={record.isActive}
            onChange={() => togglePackTypeData(record)}
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
            <ContainerOutlined style={{ marginRight: "8px" }} />
            Pack Type
          </span>
        }
        extra={
          <Button onClick={packTypeModelOpen} type="primary">
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
        <Table columns={columns} bordered dataSource={mtData} size="small"></Table>
      </Card>

      <Modal
        width={600}
        title={<span style={{ textAlign: "center", display: "block", margin: "5px 0px" }}>Pack Type</span>}
        cancelButtonProps={{ style: { backgroundColor: "red", color: "white" } }}
        open={mtModel}
        onCancel={packTypeModelClose}
        onOk={createPackType}
        cancelText="Cancel"
        closable
        okText={okText}
      >
        <PackTypeForm formRef={formRef} initialValues={initialValues} />
      </Modal>
    </>
  );
};
export default PackTypeGrid;
