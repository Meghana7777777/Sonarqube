import { EditFilled, ReconciliationOutlined } from "@ant-design/icons";
import { BoxMapReqDto, CommonIdReqModal, CommonRequestAttrs, PackSerialNumberReqDto, PackingSpecReqModelDto, PackingSpecResponseDto } from "@xpparel/shared-models";
import { PackingSpecServices } from "@xpparel/shared-services";
import { Button, Card, Divider, Form, Input, Modal, Space, Switch, Table, Tag } from "antd";
import { SequenceUtils, useAppSelector } from "packages/ui/src/common";
import { AlertMessages } from "packages/ui/src/components/common";
import { useEffect, useState } from "react";
import PackingSpecForm from "./packing-spec-form";
import { ColumnsType } from "antd/es/table";

interface IProps {
  packSerial?: number;
}

export const PackingSpecGrid = (props?: IProps) => {
  const { packSerial } = props;
  const [psModel, setPsModel] = useState<boolean>(false);
  const [initialValues, setInitialValues] = useState<PackingSpecResponseDto>();
  const [tableData, setTableData] = useState<PackingSpecResponseDto[]>();
  const service = new PackingSpecServices();
  const [formRef] = Form.useForm();
  const user = useAppSelector((state) => state.user.user.user);
  const { userName, orgData, userId } = user;
  const [refreshKey, setRefreshKey] = useState(1);
  const [searchedText, setSearchedText] = useState("");
  const [okText, setOkText] = useState<string>("Save");
  const [dummyRefresh, setDummyRefresh] = useState<number>(0);


  useEffect(() => {
    getAllPackingSpecs();
  }, []);

  const packingSpecModelClose = () => {
    setInitialValues(undefined);
    formRef.resetFields();
    setRefreshKey((prev) => prev + 1);
    getAllPackingSpecs();
    setDummyRefresh(dummyRefresh + 1)
    setPsModel(false);
  };

  const packingSpecModelOpen = () => {
    setInitialValues(undefined);
    formRef.resetFields();
    setDummyRefresh(dummyRefresh + 1)
    setPsModel(true);
    setOkText("Save");
  };

  const editPackingSpecData = (record: any) => {
    if (record) {
      if (record.isActive === true) {
        setRefreshKey((prev) => prev + 1);
        const boxItems = [];
        if (record.boxMap && Array.isArray(record.boxMap)) {
          record.boxMap.forEach((rec) => {
            if (rec.levelNo === 1) {
              record.boxId = rec.id;
              record.itemId = rec.itemId;
              record.itemCode = rec.itemCode;
              record.noOfItems = rec.noOfItems;
            } else {
              boxItems.push(rec);
            }
          });
        }
        record.boxMap = boxItems;
        setInitialValues({ ...record });
        formRef.setFieldsValue({ ...record });
        setPsModel(true);
        setOkText("Update");
      } else {
        AlertMessages.getErrorMessage("Please Activate the record before Edit");
      }
    }
  };

  const togglePackingSpecData = (record: any) => {
    setInitialValues(record);
    togglePackingSpec(record.id);
  };

  const getAllPackingSpecs = () => {
    const req = new PackSerialNumberReqDto(userName, orgData.unitCode, orgData.companyCode, userId, packSerial);
    service
      .getAllPackingSpecs(req)
      .then((res) => {
        if (res.status) {
          setTableData(res.data);
        } else {
          setTableData([]);
        }
      })
      .catch((err) => {
        console.log(err.message);
        setTableData([]);
      });
  };

  const togglePackingSpec = (id: number) => {
    const req = new CommonIdReqModal(id, userName, orgData.unitCode, orgData.companyCode, userId);
    service
      .togglePackingSpec(req)
      .then((res) => {
        if (res.status) {
          AlertMessages.getSuccessMessage(res.internalMessage);
          getAllPackingSpecs();
        } else {
          AlertMessages.getErrorMessage(res.internalMessage);
        }
      })
      .catch((err) => console.log(err.message));
  };

  const createPackingSpec = () => {
    formRef
      .validateFields()
      .then((formValues) => {
        const isEditMode = !!initialValues;
        const isDuplicateCheckNeeded = !isEditMode || (isEditMode && initialValues.code !== formValues.code);
        const box = [];
        const boxMapping = new BoxMapReqDto(
          undefined,
          formValues.itemId,
          1,
          Number(formValues.noOfItems),
          formValues.boxId
        );
        box.push(boxMapping);
        formValues.boxMap.forEach((rec, index) => {
          const boxMapping = new BoxMapReqDto(undefined, rec.itemId, index + 2, 1, rec.id);
          box.push(boxMapping);
        });

        const req = new PackingSpecReqModelDto(
          formValues.id,
          formValues.code,
          formValues.desc,
          2,
          box,
          userName,
          orgData.unitCode,
          orgData.companyCode,
          userId
        );

        service
          .createPackingSpec(req)
          .then((res) => {
            if (res.status) {
              if (res.internalMessage === "DUPLICATE_PACKSPEC_CODE" && isDuplicateCheckNeeded) {
                AlertMessages.getErrorMessage("Pack Spec Code already exists.");
              } else {
                const actionMessage = isEditMode ? "updated" : "created";
                AlertMessages.getSuccessMessage(`Packspec ${actionMessage} Successfully`);
                packingSpecModelClose();
              }
            } else {
              AlertMessages.getErrorMessage(res.internalMessage || "An error occurred.");
            }
          })
          .catch((error) => {
            console.log(error);
            AlertMessages.getErrorMessage("An error occurred while saving the packspec.");
          });
      })
      .catch((validationError) => {
        console.log("Validation failed:", validationError);
        AlertMessages.getErrorMessage("Please Fill The Required Fields");
      });
  };

  const columns: ColumnsType<any> = [
    {
      title: 'Code',
      dataIndex: 'code',
      onCell: (record: any) => ({
        rowSpan: record.rowSpan
      }),
      sorter: (a, b) => { return a.code.localeCompare(b.code) },
      sortDirections: ['descend', 'ascend'],
      filteredValue: [String(searchedText).toLowerCase()],
      onFilter: (value, record) => {
        return SequenceUtils.globalFilter(value, record)
      }
    },
    {
      title: 'Description',
      dataIndex: 'desc',
      onCell: (record: any) => ({
        rowSpan: record.rowSpan
      }),

    },
    {
      title: 'Number of Levels',
      dataIndex: 'noOfLevels',
      onCell: (record: any) => ({
        rowSpan: record.rowSpan
      }),


    },
    {
      title: 'Item Code',
      dataIndex: 'itemCode',
      render: (__, record) => {
        return record?.boxMap?.map(rec => {
          return <Tag>{rec.itemCode}</Tag>
        })
      },

    },
    {
      title: "Action",
      fixed: 'right',
      onCell: (record: any) => ({
        rowSpan: record.rowSpan
      }),
      render: (_, record) => (
        <>
          <EditFilled onClick={() => editPackingSpecData(record)} style={{ fontSize: '20px', color: '#08c' }} />
          <Divider type='vertical' />
          <Switch
            className={record.isActive ? 'toggle-activated' : 'toggle-deactivated'}
            defaultChecked={record.isActive}
            onChange={() => togglePackingSpecData(record)}
            style={{ fontSize: '20px', color: '#08c' }}
          />
        </>
      )
    }
  ]

  return (
    <>
      <Card
        title={<span><ReconciliationOutlined style={{ marginRight: 4 }} />Packing Specification </span>}
        extra={
          <Button  onClick={packingSpecModelOpen} type="primary">
            Create
          </Button>
        }
      ><Input.Search
          placeholder="Search"
          allowClear
          onChange={(e) => { setSearchedText(e.target.value) }}
          onSearch={(value) => { setSearchedText(value) }}
          style={{ width: 200, float: "right" }}
        />
        <Table
          columns={columns}
          bordered
          dataSource={tableData}
          size="small"
          rowKey="id"
          pagination={false}
          scroll={{ x: 'max-content' }}
        />
      </Card>

      <Modal
        width={1000}
        title={
          <span style={{ textAlign: "center", display: "block", margin: "5px 0px" }}>
            Packing Specification
          </span>
        }
        cancelButtonProps={{ style: { backgroundColor: 'red', color: 'white' } }}
        open={psModel}
        onCancel={packingSpecModelClose}
        onOk={createPackingSpec}
        cancelText='Cancel'
        okText={okText}
        key={refreshKey}
        closable
      >
        <PackingSpecForm
          key={dummyRefresh}
          formRef={formRef}
          initialValues={initialValues}
        />
      </Modal>
    </>
  );
};

export default PackingSpecGrid;
