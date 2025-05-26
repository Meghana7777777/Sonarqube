import { CopyOutlined, PrinterOutlined } from '@ant-design/icons';
import { CartonBasicInfoUIModel, ContainerCartonsUIModel, FGContainerGroupTypeEnum, FgContainerLocationStatusEnum, PgCartonsModel, PgIdRequest } from '@xpparel/shared-models';
import { FGLocationAllocationService } from '@xpparel/shared-services';
import { Button, Descriptions, message, Popover, Space, Tooltip } from 'antd';
import { useAppSelector } from 'packages/ui/src/common';
import { useEffect, useState } from 'react';
import { AlertMessages } from '../../../common';
import './container.css';
import { copyToCliBoard } from '../../../common/handle-to-cliboard-copy/handle-cliboard-write-text';
interface Props {
    pgObj: PgCartonsModel;
    phId: number;
    selectContainer: (containerInfo: ContainerCartonsUIModel) => void;
    selectContainerToUpdate: (containerId: number) => void;
}
export const ContainerCartonNameBox = (props: Props) => {
    const containerObj = props.pgObj;
    const phId = props.phId;
    const user = useAppSelector((state) => state.user.user.user);
    useEffect(() => {
        if (props.pgObj) {
            if (props.pgObj.pgType == FGContainerGroupTypeEnum.INSPECTION) {
                getInspectionCartonsForPgId(props.pgObj);
            }
            else {
                getWarehouseCartonsForForPgId(props.pgObj)
            }
        }
    }, []);


    const [containerInfo, setContainerInfo] = useState<ContainerCartonsUIModel>();

    const locationService = new FGLocationAllocationService();

    const getInspectionCartonsForPgId = (pgObj: PgCartonsModel) => {
        const phIdReq = new PgIdRequest(user?.userName, user?.orgData?.unitCode, user?.orgData?.companyCode, user?.userId, undefined, undefined, pgObj.pgId);
        locationService.getInspectionCartonsForPgId(phIdReq).then((res => {
            if (res.status) {
                constructInspectionsCartons(res.data)
            } else {
                AlertMessages.getErrorMessage(res.internalMessage);

            }
        })).catch(error => {

            AlertMessages.getErrorMessage(error.message)
        })
    }
    const getWarehouseCartonsForForPgId = (pgObj: PgCartonsModel) => {
        const phIdReq = new PgIdRequest(user?.userName, user?.orgData?.unitCode, user?.orgData?.companyCode, user?.userId, undefined, undefined, pgObj.pgId);
        locationService.getWarehouseCartonsForForPgId(phIdReq).then((res => {
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
      * @param pgCartonInfo 
      */
    const constructInspectionsCartons = (pgCartonInfo: PgCartonsModel[]) => {
        const containers: ContainerCartonsUIModel[] = [];

        pgCartonInfo.forEach((eachPgContainer, index) => {
            const containerObj = new ContainerCartonsUIModel();
            containerObj.containerCode = '';
            // containerObj.containerId = eachPgContainer.containerId;
            // containerObj.phId = eachPgContainer.phId;
            containerObj.containerCapacity = 0;
            containerObj.pgName = eachPgContainer.pgName;
            let noOfCartons = 0;
            const cartonsInfo: CartonBasicInfoUIModel[] = [];
            // eachPgContainer.groupedCartons.forEach(groupedCarton => {
            eachPgContainer.cartonsInfo.forEach(cartonInfo => {
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
                cartonObj.grossWeight = cartonInfo.grossWeight;
                cartonsInfo.push(cartonObj);
            });
            // });
            containerObj.noOfCartons = noOfCartons;
            containerObj.cartonsInfo = cartonsInfo;
            containers.push(containerObj);
        });
        setContainerInfo(containers[0]);

    }
    const constructWarehouseCartons = (containerInfo: PgCartonsModel[]) => {
        const containers: ContainerCartonsUIModel[] = [];

        containerInfo.forEach((eachContainer, index) => {
            const containerObj = new ContainerCartonsUIModel();
            containerObj.containerCode = 'eachContainer.containerCode';
            // containerObj.containerId = eachContainer.containerId;
            // containerObj.phId = eachContainer.phId;
            // containerObj.containerCapacity = eachContainer.containerCapacity;
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

    const getColor = (cartonPhId: number, phId: number, cartonStatus: FgContainerLocationStatusEnum) => {
        if (cartonPhId == phId) {
            return cartonStatus == FgContainerLocationStatusEnum.OPEN ? '#f50' : '#87d068';
        } else {
            return '#000'
        }
    }

    const handleCopyBarcode = (cartonObj: CartonBasicInfoUIModel) => {
        copyToCliBoard(cartonObj.barcode, 'Barcode copied to clipboard');
    };
    const splitCartonInfoIntoGroups = (cartonInfoArray: CartonBasicInfoUIModel[]) => {
        const groupSize = 12;
        const result = [];

        for (let i = 0; i < cartonInfoArray.length; i += groupSize) {
            const group = cartonInfoArray.slice(i, i + groupSize);
            result.push(<Space.Compact direction="vertical" size={'middle'}>
                {group.map(cartonObj => {
                    return <Popover key={'p' + cartonObj.cartonNo} trigger="click" mouseEnterDelay={0} mouseLeaveDelay={0} content={toolTip(cartonObj)}
                        title={<Space>
                            <span>Carton Barcode: {cartonObj.barcode}</span>
                            <Tooltip title="Copy Barcode">
                                <CopyOutlined
                                    onClick={() => handleCopyBarcode(cartonObj)}
                                    style={{ fontSize: '16px', cursor: 'pointer', color: 'red' }}
                                />
                            </Tooltip>
                            <span>Status: {cartonObj.status === FgContainerLocationStatusEnum.OPEN ? 'Not Yet Scanned' : 'Scanned'}</span>
                        </Space>
                        }
                    >
                        <Space.Compact block>
                            {/* <div style={{background:getColor(cartonObj.phId, phId, cartonObj.status), marginBottom:'1px'}}> */}
                            <Button type="primary" className={`${cartonObj.status == FgContainerLocationStatusEnum.OPEN ? '' : 'btn-green'}`} style={{ textAlign: 'left', minWidth: '70px', marginBottom: '1px' }} size='small'>{cartonObj.barcode}</Button>
                            <Button type='dashed' className="btn-orange" style={{ width: '58px', textAlign: 'right', marginBottom: '1px' }} size='small'>{`${cartonObj.length}*${cartonObj.width}*${cartonObj.height}`}</Button>
                            {/* </div> */}
                        </Space.Compact>
                    </Popover>
                })}
            </Space.Compact>
            )
            // result.push(group);
        }

        return result;
    }
    return (<>
        <div className='container-box-name'>
            <p style={{ margin: 0 }}>
                {/* {containerObj.containerCode} <EyeOutlined style={{ fontSize: '20px', color: '#08c' }}/> */}
                <Tooltip title={<div>
                    {/* <Button type="primary" onClick={() => props.selectContainerToUpdate(containerObj.pgId)} icon={<SaveOutlined />} size={'small'}>
                    Update
                </Button>  */}
                    <Button type="primary" danger onClick={() => props.selectContainer(containerInfo)} icon={<PrinterOutlined />} size={'small'}>
                        Print
                    </Button></div>} color={'white'} key={'cyan'}>
                    <Button size='small'
                        type="primary"
                        danger
                    // onClick={() => props.selectContainer(containerObj.containerId)}
                    //  icon={<EyeOutlined />}
                    >{containerObj.pgName}</Button>
                </Tooltip>
                <Tooltip title={`No of Cartons : ${containerInfo && containerInfo.noOfCartons}`} color={'cyan'} key={'cyan'}>
                    <Button
                        size='small'
                        type="dashed"
                    >{containerInfo && containerInfo.cartonsInfo.length}</Button>
                </Tooltip>
            </p>
            <div className='container-container-name' >
                <div className='cartons-name-container'>

                    {/* <Col span={6}> */}
                    {/* <Card size='small' title={containerObj.containerCode}> */}
                    <Space align='end' >
                        <div style={{ minHeight: '150px' }}></div> {/*Dummy for carton should be bottom */}
                        {containerInfo && splitCartonInfoIntoGroups(containerInfo.cartonsInfo)}
                    </Space>
                </div>

            </div>
        </div>

    </>)
}
export default ContainerCartonNameBox;