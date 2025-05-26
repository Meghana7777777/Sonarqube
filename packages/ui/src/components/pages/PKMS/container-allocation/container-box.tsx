import { PrinterOutlined, SaveOutlined } from '@ant-design/icons';
import { FgCurrentContainerLocationEnum, InspectionContainerCartonsModel, FgContainerLocationStatusEnum, ContainerDetailsModel, ContainerIdRequest, ContainerCartonsUIModel, CartonBasicInfoUIModel, WarehouseContainerCartonsModel } from '@xpparel/shared-models';
import { FGLocationAllocationService, LocationAllocationService } from '@xpparel/shared-services';
import { Button, Descriptions, Popover, Tooltip } from 'antd';
import { useAppSelector } from 'packages/ui/src/common';
import { useEffect, useState } from 'react';
import { AlertMessages } from '../../../common';
import './container.css';
interface Props {
  containerObj: ContainerDetailsModel;
  phId: number;
  selectContainer: (containerInfo: ContainerCartonsUIModel) => void;
  selectContainerToUpdate: (containerId: number) => void;
}
export const CGContainerBox = (props: Props) => {
  const containerObj = props.containerObj;
  const phId = props.phId;
  const user = useAppSelector((state) => state.user.user.user);
  useEffect(() => {
    if (props.containerObj) {
      if (props.containerObj.containerCurrentLoc == FgCurrentContainerLocationEnum.INSPECTION) {
        getInspectionContainerMappingInfoWithCartons(props.containerObj);
      }
      else {
        getWarehouseContainerMappingInfoWithCartons(props.containerObj)
      }
    }
  }, []);

  const [containerInfo, setContainerInfo] = useState<ContainerCartonsUIModel>();

  const locationService = new FGLocationAllocationService();

  const getInspectionContainerMappingInfoWithCartons = (containerObj: ContainerDetailsModel) => {
    const phIdReq = new ContainerIdRequest(user?.userName, user?.orgData?.unitCode, user?.orgData?.companyCode, user?.userId, containerObj.containerId, containerObj.containerCode);
    locationService.getInspectionContainerMappingInfoWithCartons(phIdReq).then((res => {
      if (res.status) {
        constructInspectionsCartons(res.data)
      } else {
        AlertMessages.getErrorMessage(res.internalMessage);

      }
    })).catch(error => {

      AlertMessages.getErrorMessage(error.message)
    })
  }
  const getWarehouseContainerMappingInfoWithCartons = (containerObj: ContainerDetailsModel) => {
    const phIdReq = new ContainerIdRequest(user?.userName, user?.orgData?.unitCode, user?.orgData?.companyCode, user?.userId, containerObj.containerId, containerObj.containerCode);
    locationService.getWarehouseContainerMappingInfoWithCartons(phIdReq).then((res => {
      if (res.status) {
        constructWarehouseCartons(res.data)
      } else {
        AlertMessages.getErrorMessage(res.internalMessage);

      }
    })).catch(error => {

      AlertMessages.getErrorMessage(error.message)
    })
  }
  /**
    * 
    * @param containerInfo 
    */
  const constructInspectionsCartons = (containerInfo: InspectionContainerCartonsModel[]) => {
    const containers: ContainerCartonsUIModel[] = [];

    containerInfo.forEach((eachContainer, index) => {
      const containerObj = new ContainerCartonsUIModel();
      containerObj.containerCode = eachContainer.containerCode;
      containerObj.containerId = eachContainer.containerId;
      containerObj.phId = eachContainer.phId;
      containerObj.containerCapacity = 0;
      let noOfCartons = 0;
      const cartonsInfo: CartonBasicInfoUIModel[] = [];
      eachContainer.groupedCartons.forEach(groupedCarton => {
        groupedCarton.cartonsInfo.forEach(cartonInfo => {
          noOfCartons++;
          const cartonObj = new CartonBasicInfoUIModel();
          cartonObj.cartonId = cartonInfo.cartonId;
          cartonObj.cartonNo = cartonInfo.cartonNo;
          cartonObj.inspectionPick = cartonInfo.inspectionPick;
          cartonObj.width = cartonInfo.width;
          cartonObj.length = cartonInfo.length;
          cartonObj.height = cartonInfo.height;
          cartonObj.netWeight = cartonInfo.netWeight;
          cartonObj.grossWeight = cartonInfo.grossWeight;
          cartonsInfo.push(cartonObj);
        });
      });
      containerObj.noOfCartons = noOfCartons;
      containerObj.cartonsInfo = cartonsInfo;
      containers.push(containerObj);
    });
    setContainerInfo(containers[0]);

  }
  const constructWarehouseCartons = (containerInfo: WarehouseContainerCartonsModel[]) => {
    const containers: ContainerCartonsUIModel[] = [];

    containerInfo.forEach((eachContainer, index) => {
      const containerObj = new ContainerCartonsUIModel();
      containerObj.containerCode = eachContainer.containerCode;
      containerObj.containerId = eachContainer.containerId;
      containerObj.phId = eachContainer.phId;
      containerObj.containerCapacity = eachContainer.containerCapacity;
      let noOfCartons = 0;
      const cartonsInfo: CartonBasicInfoUIModel[] = [];

      eachContainer.cartonsInfo.forEach(cartonInfo => {
        noOfCartons++;
        const cartonObj = new CartonBasicInfoUIModel();

        cartonObj.cartonId = cartonInfo.cartonId;
        cartonObj.cartonNo = cartonInfo.cartonNo;
        cartonObj.inspectionPick = cartonInfo.inspectionPick;
        cartonObj.barcode = cartonInfo.barcode;
        cartonObj.width = cartonInfo.width;
        cartonObj.length = cartonInfo.length;
        cartonObj.height = cartonInfo.height;
        cartonObj.netWeight = cartonInfo.netWeight;
        cartonObj.netWeight = cartonInfo.netWeight;
        cartonObj.grossWeight = cartonInfo.grossWeight;
        cartonsInfo.push(cartonObj);
      });

      containerObj.noOfCartons = noOfCartons;
      containerObj.cartonsInfo = cartonsInfo;
      containers.push(containerObj);
    });
    setContainerInfo(containers[0]);

  }
  const toolTip = (cartonInfo: CartonBasicInfoUIModel) => {
    return <div>
      <Descriptions
        // title={cartonInfo.cartonNumber}
        bordered
        size='small'
        column={{ xxl: 4, xl: 3, lg: 3, md: 3, sm: 2, xs: 1 }}
      >
        <Descriptions.Item label="Carton No">{cartonInfo.cartonNo}</Descriptions.Item>
        <Descriptions.Item label="Barcode No">{cartonInfo.barcode}</Descriptions.Item>
        <Descriptions.Item label="Net Weight">{cartonInfo.netWeight}</Descriptions.Item>
        <Descriptions.Item label="Gross Weight">{cartonInfo.grossWeight}</Descriptions.Item>
      </Descriptions>
    </div>
  }

  const getClassName = (cartonPhId: number, phId: number, cartonStatus: FgContainerLocationStatusEnum) => {
    if (cartonPhId == phId) {
      return cartonStatus == FgContainerLocationStatusEnum.OPEN ? 'red-b' : 'green-b';
    } else {
      return 'black-b'
    }
  }
  return (<>
    <div className='container-box'>
      <div className='container-container' >
        <div className='cartons-container'>
          {containerInfo && containerInfo.cartonsInfo.map(cartonObj => {
            return <Popover key={'p' + cartonObj.cartonNo} content={toolTip(cartonObj)}
              title={`Carton No: ${cartonObj.cartonNo}`}
            >
              <div key={cartonObj.cartonNo} className={`carton ${getClassName(cartonObj.packListId, phId, cartonObj.status)}`}></div>
            </Popover>

          })}
        </div>

      </div>
      <div className="container-bottam">
        <div className="plank"></div>
        <div className="plank"></div>
        <div className="plank"></div>
      </div>
      <p>
        {/* {containerObj.containerCode} <EyeOutlined style={{ fontSize: '20px', color: '#08c' }}/> */}
        <Tooltip title={<div> <Button type="primary" onClick={() => props.selectContainerToUpdate(containerObj.containerId)} icon={<SaveOutlined />} size={'small'}>
          Update
        </Button> <Button type="primary" onClick={() => props.selectContainer(containerInfo)} icon={<PrinterOutlined />} size={'small'}>
            Print
          </Button></div>} color={'white'} key={'cyan'}>
          <Button size='small'
            type="primary"
          // onClick={() => props.selectContainer(containerObj.containerId)}
          //  icon={<EyeOutlined />}
          >{containerObj.containerCode}</Button>
        </Tooltip>
        <Tooltip title={`No of Cartons : ${containerInfo && containerInfo.noOfCartons}`} color={'cyan'} key={'cyan'}>
          <Button
            size='small'
            type="dashed"
          >{containerInfo && containerInfo.noOfCartons}</Button>
        </Tooltip>
      </p>
    </div>

  </>)
}
export default CGContainerBox;