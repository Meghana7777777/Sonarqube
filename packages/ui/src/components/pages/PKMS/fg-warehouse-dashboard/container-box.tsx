
import { CartonBasicInfoUIModel, ContainerCartonsUIModel, ContainerIdRequest, FgContainerLocationStatusEnum, FgCurrentContainerLocationEnum, InspectionContainerCartonsModel, WarehouseContainerCartonsModel } from '@xpparel/shared-models';
import { FGLocationAllocationService } from '@xpparel/shared-services';
import { Button, Descriptions, Empty, message, Popover, Skeleton, Space, Tag, Tooltip } from 'antd';
import { useAppSelector } from 'packages/ui/src/common';
import { useEffect, useState } from 'react';

import { CopyOutlined } from '@ant-design/icons';
import { AlertMessages } from '../../../common';
import './container-box.css';
import { copyToCliBoard } from '../../../common/handle-to-cliboard-copy/handle-cliboard-write-text';
interface Props {
    containerObj: WarehouseContainerCartonsModel;
    selectContainer: (containerInfo: ContainerCartonsUIModel) => void;
    filterVal: string;
}
export const ContainerBox = (props: Props) => {
    const { containerObj, filterVal } = props;
    const [loading, setLoading] = useState(true);
    const [containerInfo, setContainerInfo] = useState<ContainerCartonsUIModel>();

    const user = useAppSelector((state) => state.user.user.user);
    const locationService = new FGLocationAllocationService();
    useEffect(() => {
        if (props.containerObj) {
            loadData(props.containerObj);
        }
    }, []);

    const loadData = (containerPar: WarehouseContainerCartonsModel) => {
        setLoading(true);
        // if (props.containerObj.containerCurrentLoc == FgCurrentContainerLocationEnum.INSPECTION) {
        //     getInspectionContainerMappingInfoWithCartons(props.containerObj);
        // }
        // else {
        getWarehouseContainerMappingInfoWithCartons(props.containerObj)
        // }
    }

 
    const getWarehouseContainerMappingInfoWithCartons = (containerObj: WarehouseContainerCartonsModel) => {
        const phIdReq = new ContainerIdRequest(user?.userName, user?.orgData?.unitCode, user?.orgData?.companyCode, user?.userId, containerObj.containerId, containerObj.containerCode);
        locationService.getWarehouseContainerMappingInfoWithCartons(phIdReq).then((res => {
            if (res.status) {
                constructWarehouseCartons(res.data)
            } else {
                // AlertMessages.getErrorMessage(res.internalMessage);
            }
            setLoading(false);
        })).catch(error => {
            setLoading(false);
            AlertMessages.getErrorMessage(error.message)
        })
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
                const rollObj = new CartonBasicInfoUIModel(); 
                rollObj.barcode = cartonInfo.barcode;
                rollObj.length = cartonInfo.length;
                rollObj.width = cartonInfo.width;
                rollObj.originalQty = cartonInfo.qty;
                rollObj.height = cartonInfo.height; 
                rollObj.packListCode = cartonInfo.packListNumber;
                rollObj.cartonId = cartonInfo.cartonId
                cartonsInfo.push(rollObj);
            });

            containerObj.noOfCartons = noOfCartons;
            containerObj.cartonsInfo = cartonsInfo;
            containers.push(containerObj);
        });
        setContainerInfo(containers[0]);

    }
    const handleCopyBarcode = (rollObj: CartonBasicInfoUIModel) => {
         copyToCliBoard(rollObj.barcode, 'Barcode copied to clipboard');
       
    };


    const toolTip = (cartonInfo: CartonBasicInfoUIModel) => {
        return <div>
            <Descriptions
                // title={cartonInfo.rollNumber}
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
    const getClassName = (rollPhId: number, phId: number, rollStatus: FgContainerLocationStatusEnum) => {
        if (rollPhId == phId) {
            return rollStatus == FgContainerLocationStatusEnum.OPEN ? 'red-b' : 'green-b';
        } else {
            return 'black-b'
        }
    }
    const blinkClassName = (rollObjP: CartonBasicInfoUIModel, filteringVal: string) => {
        const { packListCode, packListId, barcode } = rollObjP;
        const values = [packListCode, packListId, barcode];
        return values.includes(filteringVal) ? 'roll-blink' : '';
    }

    return (<>
        {loading ? <><Skeleton.Avatar active={loading} size='large' shape={'circle'} /> <Skeleton.Avatar active={loading} size='large' shape={'circle'} /></> :
            <div className='db'>
                <div className='container-box'>
                    <div className='container-container' >
                        <div className='cartons-container'>
                            {containerInfo ? containerInfo.cartonsInfo.map(rollObj => {
                                return <Popover key={'p' + rollObj.cartonNo} content={toolTip(rollObj)}
                                    title={<Space><>Carton Barcode:<Tag style={{ color: 'green' }}> {rollObj.barcode}</Tag></><>   <Tooltip title="Copy Barcode">
                                        <CopyOutlined
                                            onClick={() => handleCopyBarcode(rollObj)}
                                            style={{ fontSize: '16px', cursor: 'pointer', color: 'red' }}
                                        />
                                    </Tooltip></><>Status: <Tag style={{ color: 'green' }}>{rollObj.status == FgContainerLocationStatusEnum.OPEN ? 'Not Yet Scanned' : 'Scanned'}</Tag></> <> Carton No:<Tag style={{ color: 'green' }}>{rollObj.cartonNo}</Tag></> <>Packing List Number:{rollObj.packListCode}</></Space>}
                                >
                                    <div key={rollObj.cartonNo} id={rollObj.barcode} roll-barcode={rollObj.barcode} batch-no={rollObj.packListCode} pack-no={rollObj.packListCode} className={`carton ${getClassName(rollObj.packListId, 0, rollObj.status)} ${blinkClassName(rollObj, filterVal)}`}></div>
                                </Popover>

                            }) : <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />}
                        </div>

                    </div>
                    <div className="container-bottam">
                        <div className="plank"></div>
                        <div className="plank"></div>
                        <div className="plank"></div>
                    </div>

                    {/* {containerObj.containerCode} <EyeOutlined style={{ fontSize: '20px', color: '#08c' }}/> */}
                    <Tooltip title={`Container Name. Click to View & Print `} mouseEnterDelay={0} mouseLeaveDelay={0} color={'cyan'} key={`${containerObj?.containerCode}c`}>
                        <Button size='small'
                            type="primary"
                            style={{ padding: '2px', height: '19px', lineHeight: 0 }}
                            onClick={() => props.selectContainer(containerInfo)}
                        //  icon={<EyeOutlined />}
                        >{containerObj?.containerCode}</Button>
                    </Tooltip>
                    {/* <Tooltip title={`No of Cartons : ${containerInfo?.noOfCartons}`} mouseEnterDelay={0} mouseLeaveDelay={0} color={'cyan'} key={`${containerObj?.containerCode}d`}>
                <Button
                    size='small'
                    type="dashed"
                    style={{ padding: '2px', height: '19px', lineHeight: 0 }}
                >{containerInfo?.noOfCartons}</Button>
            </Tooltip> */}

                </div>

            </div>}
    </>
    )
}
export default ContainerBox;