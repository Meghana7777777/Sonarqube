import { EditFilled, EditOutlined, HomeOutlined } from "@ant-design/icons";
import { CommonIdReqModal, CommonRequestAttrs, WareHouseModel, WareHouseResponseDto } from "@xpparel/shared-models";
import { WareHouseService } from "@xpparel/shared-services";
import { Button, Card, Divider, Form, Input, Modal, Switch, Table } from "antd";
import { ColumnsType } from "antd/es/table";
import { SequenceUtils, useAppSelector } from "packages/ui/src/common";
import { AlertMessages } from "packages/ui/src/components/common";
import { useEffect, useState } from "react";
import FGWareHouseForm from "./fg-warehouse-form";
//import MaterialTypeForm from "./material-type-form";

export const FGWareHouseGrid = () => {
  const [whModel, setWhModel] = useState<boolean>(false)
  const [initialValues, setIsInitialValues] = useState<WareHouseResponseDto>()
  const [whData, setIsWhData] = useState<WareHouseResponseDto[]>()
  const service = new WareHouseService()
  const [formRef] = Form.useForm();
  const user = useAppSelector((state) => state.user.user.user);
  const { userName, orgData, userId } = user
  const [searchedText, setSearchedText] = useState("");
  const [okText, setOkText] = useState<string>("Save");
  const [dummyRefreshKey, setDummyRefreshKey] = useState<number>(0)

  useEffect(() => {
    getAllWareHouse()
  }, []);


  const refreshKeyHandler = () => {
    setDummyRefreshKey(prev => prev + 1)
  }

  console.log(dummyRefreshKey, 'llllllllllllllllll')

  const wareHouseModelClose = () => {
    formRef.setFieldsValue({})
    refreshKeyHandler()
    setWhModel(false)
    getAllWareHouse();
  }

  const wareHouseModelOpen = () => {
    setIsInitialValues(undefined)
    formRef.resetFields();
    refreshKeyHandler()
    setWhModel(true)
    setOkText("Save");
  }

  const editWareHouseData = (record: any) => {
    refreshKeyHandler()
    if (!record.isActive) {
      AlertMessages.getErrorMessage('Please Activate the record before Edit')
      return
    }
    setIsInitialValues(record);
    setWhModel(true);
    setOkText("Update");
  }
  const toggleWareHouseData = (record: any) => {
    toggleWareHouse(record.id);
  }

  const getAllWareHouse = () => {
    const req = new CommonRequestAttrs(userName, orgData.unitCode, orgData.companyCode, userId)
    service.getAllWareHouse(req).then(res => {
      if (res.status) {
        setIsWhData(res.data)
      } else {
        setIsWhData([])
      }
    }).catch(err => console.log(err.message))
  }

  const toggleWareHouse = (id: number) => {
    const req = new CommonIdReqModal(id, userName, orgData.unitCode, orgData.companyCode, userId)
    service.toggleWareHouse(req)
      .then(res => {
        if (res.status) {
          AlertMessages.getSuccessMessage(res.internalMessage);
          getAllWareHouse();
        } else {
          AlertMessages.getErrorMessage(res.internalMessage);
        }
      })
      .catch(err => console.log(err.message))
  }

  const createWareHouse = () => {
    formRef.validateFields().then((formValues) => {
      const isEditMode = !!initialValues;
      const isDuplicateCheckNeeded = !isEditMode || (isEditMode && initialValues.wareHouseCode !== formValues.wareHouseCode);
      const req = new WareHouseModel(formValues.wareHouseCode, formValues.wareHouseDesc, formValues.wareHouseType, formValues.latitude, formValues.longitude, formValues.noOfFloors, formValues.managerName, formValues.managerContact, formValues.address, userName, orgData.unitCode, orgData.companyCode, userId, formValues.id);
      service.createWareHouse(req).then((res) => {
        if (res.status) {
          if (res.internalMessage === 'DUPLICATE_WAREHOUSE_CODE' && isDuplicateCheckNeeded) {
            AlertMessages.getErrorMessage('warehouse code already exists.');
          } else {
            const actionMessage = isEditMode ? 'updated' : 'created';
            AlertMessages.getSuccessMessage(`warehouse ${actionMessage} Successfully`);
            wareHouseModelClose();
          }
        } else {
          AlertMessages.getErrorMessage(res.internalMessage || 'An error occurred.');
        }
      }).catch((err) => console.log(err.message));
    }).catch((err) => console.log(err.message));
  };

  const columns: ColumnsType<any> = [
    {
      title: 'Code',
      dataIndex: 'wareHouseCode',
      fixed: 'left',
      sorter: (a, b) => { return a.wareHouseCode.localeCompare(b.wareHouseCode) },
      sortDirections: ['descend', 'ascend'],
      filteredValue: [String(searchedText).toLowerCase()],
      onFilter: (value, record) => {
        return SequenceUtils.globalFilter(value, record)
      },
    },
    {
      title: 'Description',
      dataIndex: 'wareHouseDesc',
      sorter: (a, b) => { return a.wareHouseDesc.localeCompare(b.wareHouseDesc) },
      sortDirections: ['descend', 'ascend'],
      fixed: 'left',
    },
    {
      title: 'Warehouse Type',
      dataIndex: 'wareHouseType',
      sorter: (a, b) => { return a.wareHouseType.localeCompare(b.wareHouseType) },
      sortDirections: ['descend', 'ascend'],
    },
    {
      title: "No of Floors",
      dataIndex: "noOfFloors",
      align: 'center',
      key: "noOfFloors",
      sorter: (a: WareHouseModel, b: WareHouseModel): number => {
        const columnA = a.noOfFloors ? String(a.noOfFloors) : '';
        const columnB = b.noOfFloors ? String(b.noOfFloors) : '';
        return columnA.localeCompare(columnB);
      }
    },
    {
      title: "Latitude",
      dataIndex: "latitude",
      align: 'center',
      key: "latitude",
      sorter: (a: WareHouseModel, b: WareHouseModel): number => {
        const columnA = a.latitude ? String(a.latitude) : '';
        const columnB = b.latitude ? String(b.latitude) : '';
        return columnA.localeCompare(columnB);
      },
      sortDirections: ['descend', 'ascend'],
    },
    {
      title: "Longitude",
      dataIndex: "longitude",
      align: 'center',
      key: "longitude",
      sorter: (a: WareHouseModel, b: WareHouseModel): number => {
        const columnA = a.longitude ? String(a.longitude) : '';
        const columnB = b.longitude ? String(b.longitude) : '';
        return columnA.localeCompare(columnB);
      },
      sortDirections: ['descend', 'ascend'],
    },
    {
      title: 'Manager Name',
      dataIndex: 'managerName',
      sorter: (a, b) => { return a.managerName.localeCompare(b.managerName) },
      sortDirections: ['descend', 'ascend'],
    },
    {
      title: 'Manager Contact',
      dataIndex: 'managerContact',
      sorter: (a, b) => { return a.managerContact.localeCompare(b.managerContact) },
      sortDirections: ['descend', 'ascend'],
    },
    {

      title: 'Address',
      dataIndex: 'address',
      sorter: (a, b) => { return a.address.localeCompare(b.address) },
      sortDirections: ['descend', 'ascend'],

    },

    {
      title: "Action",
      fixed: 'right',
      render: (_, record) => (
        <>
          <EditOutlined onClick={() => editWareHouseData(record)} style={{ fontSize: '20px', color: '#08c' }} />
          <Divider type='vertical' />
          <Switch className={record.isActive ? 'toggle-activated' : 'toggle-deactivated'}
            checked={record.isActive}
            onChange={() => toggleWareHouseData(record)}
            style={{ fontSize: '20px', color: '#08c' }} />
        </>
      )
    }

  ]


  return <>
    <Card
      title={<span>
        <HomeOutlined />
        <span> WareHouse</span>
      </span>
      } extra={
        <Button
          onClick={wareHouseModelOpen}
          type="primary"
        >Create</Button>}

    >
      <Input.Search
        placeholder="Search"
        allowClear
        onChange={(e) => { setSearchedText(e.target.value) }}
        onSearch={(value) => { setSearchedText(value) }}
        style={{ width: 200, float: "right" }}
      />
      <Table
        columns={columns}
        dataSource={whData}
        size="small"
        scroll={{ x: 'max-content' }}
        style={{ minWidth: '100%' }}
        bordered
      >
      </Table>
    </Card>

    <Modal
      width={600}
      title={
        <span
          style={{ textAlign: "center", display: "block", margin: "5px 0px" }}
        >
          {"WareHouse"}
        </span>
      }
      cancelButtonProps={{ style: { backgroundColor: 'red', color: 'white' } }}
      open={whModel}
      onCancel={wareHouseModelClose}
      onOk={createWareHouse}
      cancelText='Cancel'
      closable
      okText={okText}
    >
      <FGWareHouseForm
        formRef={formRef}
        initialValues={initialValues}
        key={dummyRefreshKey}
        dummyRefreshKey={dummyRefreshKey}
      />
    </Modal>
  </>

}
export default FGWareHouseGrid;