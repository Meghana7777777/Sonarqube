import { ADDVehicleReqModal, CheckListStatus, CommonRequestAttrs, GrnUnLoadingModel, LocationFromTypeEnum, LocationToTypeEnum, PackListLoadingStatus, PackListLoadingStatusDisplayValue, PackListVehicleIdModel, PackingListSummaryModel, ReqStatus, SecurityCheckRequest, VehicleModal, VehicleOTRDto } from "@xpparel/shared-models";
import { GatexService, GrnServices } from "@xpparel/shared-services";
import { Button, Form, Select, Table } from "antd";
import moment from "moment";
import { useEffect, useState } from "react";
import { useAppSelector } from '../../../../common';
import { AlertMessages } from "../../../common";
import { defaultDateTimeFormat } from "../../../common/data-picker/date-picker";

interface ISecurityDetailsUpdate {
  selectedRecord?: PackingListSummaryModel;
  commonReqAttributes: CommonRequestAttrs;
  closeModalAndRefreshTab: () => void
}

const { Option } = Select;
export const SecurityCheckVehicleOut = (props: ISecurityDetailsUpdate) => {
  const [form] = Form.useForm();

  const user = useAppSelector((state) => state.user.user.user);
  const { userName, orgData, userId } = user;
  const { selectedRecord, closeModalAndRefreshTab } = props;
  const [vehicleDetails, setVehicleDetails] = useState<VehicleModal[]>([]);
  const [grnDetailMap, setGrnDetailMap] = useState<Map<string, GrnUnLoadingModel>>(new Map());

  const gatexService = new GatexService();
  const grnServices = new GrnServices();
  useEffect(() => {
    getVehicleDetails();
    getGrnUnloadingDetails();
  }, []);


  const getGrnUnloadingDetails = () => {
    const getReqModel: PackListVehicleIdModel = new PackListVehicleIdModel(user?.userName, user?.orgData?.unitCode, user?.orgData?.companyCode, user?.userId, undefined, selectedRecord.id);
    grnServices.getGrnUnloadingDetails(getReqModel).then(res => {
      if (res.status) {
        const vMap = new Map();
        for (const v of res.data) {
          vMap.set(v.vehicleNumber, v);
        }
        setGrnDetailMap(vMap);
      } else {
        // updateUnLoadingStartOrResume()
      }
    }).catch(err => {
      AlertMessages.getErrorMessage(err.message)
    })
  }



  const getVehicleDetails = () => {
    const vehicleReq = new ADDVehicleReqModal(String(selectedRecord.id), undefined, LocationFromTypeEnum.SUPP, [], undefined, orgData.uniCode, orgData.companyCode, undefined);
    gatexService.getVehicleDetails(vehicleReq).then(res => {
      if (res.status) {
        setVehicleDetails(res.data.vehicleDetails)
      } else {
        setVehicleDetails([])
      }
    }).catch(err => {
      console.log(err)
    })

  }

  const saveSecurityCheckOut = (req: SecurityCheckRequest) => {
    grnServices.saveSecurityCheckOut(req).then(res => {
      if (res.status) {
        createVOTR([new VehicleOTRDto(undefined, selectedRecord.id.toString(), selectedRecord.packingListCode, undefined, LocationFromTypeEnum.WH, LocationToTypeEnum.SUPP, LocationFromTypeEnum.WH, LocationToTypeEnum.SUPP, 1, ReqStatus.DONE, 1, true, undefined, userName, undefined, undefined, undefined, [])])
      } else {
        AlertMessages.getErrorMessage(res.internalMessage)
      }
    }).catch(err => {
      AlertMessages.getErrorMessage(err.message)
    })
  }


  const createVOTR = (req: VehicleOTRDto[]) => {
    gatexService.createVOTR(req).then(res => {
      if (res.status) {
        closeModalAndRefreshTab()
      } else {
        AlertMessages.getErrorMessage(res.internalMessage)
      }
    }).catch(err => {
      AlertMessages.getErrorMessage(err.message)
    })
  }
  const columns = [
    { title: "Vehicle No", dataIndex: "vehicleNo", key: "vehicleNo" },
    { title: "Driver Name", dataIndex: "dName", key: "dName" },
    { title: "Contact", dataIndex: "dContact", key: "dContact" },
    { title: "Arrival", dataIndex: "arrivalDateTime", key: "arrivalDateTime", render: (val) => val ? moment(val).format(defaultDateTimeFormat) : '' },
    { title: "Departure", dataIndex: "departureDateTime", key: "departureDateTime", render: (val) => val ? moment(val).format(defaultDateTimeFormat) : '' },
    { title: "Vehicle Type", dataIndex: "vehicleType", key: "vehicleType" },
    { title: "In-House", dataIndex: "inHouseVehicle", key: "inHouseVehicle", render: (val) => (val ? "Yes" : "No") },
    {
      title: 'Status', dataIndex: 'status', key: 'status', render: (val, rec) => {
        const stat = grnDetailMap.get(rec.vehicleNo) ? PackListLoadingStatusDisplayValue[grnDetailMap.get(rec.vehicleNo).status] : ''
        return stat;
      }
    },
    {
      title: 'Action', dataIndex: 'action', render: (val, rec) => {
        return grnDetailMap.get(rec.vehicleNo)?.status == PackListLoadingStatus.UN_LOADING_COMPLETED ? <Button type="primary" onClick={() => saveSecurityCheckOut(new SecurityCheckRequest(userName, orgData.companyCode, orgData.unitCode, userId, grnDetailMap.get(rec.vehicleNo).id, grnDetailMap.get(rec.vehicleNo).vehicleNumber, grnDetailMap.get(rec.vehicleNo).driverName, userName, grnDetailMap.get(rec.vehicleNo).vehicleContact, grnDetailMap.get(rec.vehicleNo).inAt, undefined, selectedRecord.id, CheckListStatus.VERIFIED, undefined, undefined, undefined, undefined, undefined, undefined))}>Mark Vehicle Out</Button> : '';
      }
    },
  ];

  return (<>
    <Table columns={columns} dataSource={vehicleDetails} rowKey="id" size="small" scroll={{x: 'max-content'}} bordered />
  </>);
}

export default SecurityCheckVehicleOut;
