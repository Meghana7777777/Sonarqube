import { DocketLayModel, LayIdConfirmationRequest, LayItemAddRequest, LayItemIdRequest, LayingStatusEnum } from '@xpparel/shared-models';
import { Button, Card, Col, Empty, Input, InputNumber, message, Row, Select, Space, Table, Tag, Tooltip } from 'antd';
import React, { useEffect, useState } from 'react';
import { ILayIngTableDto, layIngTableDefaultData } from './laying-comp';
import { useAppSelector } from '../../../../common';
import { AlertMessages } from '../../../common';
import { LayReportingService } from '@xpparel/shared-services';
import { MinusCircleOutlined, PlusCircleOutlined } from '@ant-design/icons';
import DatePicker, { defaultDateFormat, defaultDateTimeFormat, defaultTimePicker } from '../../../common/data-picker/date-picker';
import { convertBackendDateToLocalTimeZone, disabledBackDates, disabledNextDates } from 'packages/ui/src/common/utils/utils';
import moment from 'moment';
import './lay-report.css';


interface ILayingTableProps {
  layInfo: DocketLayModel;
  allocatedRollsMap: Map<number, ILayIngTableDto>;
  alreadyLayedRolls: number[];
  getLayInfoForDocket: () => void;
  keyCount: number;
}

interface ILayTimings {
  layStartTime: string;
  layEndTime: string;
}
const { Option } = Select;
export const LayingTable = (props: ILayingTableProps) => {
  const { layInfo, allocatedRollsMap, alreadyLayedRolls, getLayInfoForDocket, keyCount } = props;
  const [tableData, setTableData] = useState<ILayIngTableDto[]>([]);
  const [editableIndex, setEditableIndex] = useState(null);
  const [dummyState, setDummyState] = useState<number>(0);
  const [layTimings, setLayTimings] = useState<ILayTimings>({ layStartTime: undefined, layEndTime: undefined });

  const [shadeTitles, setShadeTitles] = useState('');
  const [prices, setPrices] = useState('');


  const user = useAppSelector((state) => state.user.user.user);

  const layReportingService = new LayReportingService();



  useEffect(() => {
    const data: ILayIngTableDto[] = [];
    const layedRollsSet = new Set<number>();
    layInfo.layRollsInfo.forEach(roll => {
      layedRollsSet.add(roll.rollId)
    });

    let layTime = { startTime: undefined, endTime: undefined }

    allocatedRollsMap.forEach((e, k) => {
      const clonedObj = structuredClone(e);
      clonedObj.isEditable = !layedRollsSet.has(k);
      clonedObj.isError = false;

      if (layedRollsSet.size > 0) { // if lay reported
        if (layedRollsSet.has(k)) { // reported rolls only
          layTime.startTime = clonedObj.layStartTime;
          layTime.endTime = clonedObj.layEndTime;
          data.push(clonedObj);
        }
      } else { // lay not reported
        if (!alreadyLayedRolls.includes(clonedObj.itemId)) { // not used roll
          data.push(clonedObj);
        }

      }
    });
    setLayTimings({ layStartTime: layTime.startTime, layEndTime: layTime.endTime });
    if (layedRollsSet.size > 0) {
      data.sort((a, b) => {
        return a.sequence - b.sequence; // Both have valid values, sort numerically
      });
    }

    setTableData(data);
  }, [keyCount])


  const inputOnChange = (value: any, name: string, index: number, isDecimal: boolean = false, maxDecimal: number = 4) => {
    tableData[index][name] = isDecimal ? Number(parseFloat(value).toFixed(maxDecimal)) : value;
  }
  const calculateLayedYardage = (record: ILayIngTableDto, layedPliesPar: number, jointsOverlappingPar: number) => {
    const { markerLength = 0, layedPlies, jointsOverlapping } = record;
    if (!isNaN(layedPlies) && !isNaN(jointsOverlapping)) {
      // const layedYardage = (Number(record.markerLength ? record.markerLength : 0) * layedPliesPar) + jointsOverlappingPar;
      const layedYardage = Number(markerLength) * layedPlies + jointsOverlapping;
      record['layedYardage'] = Number(layedYardage.toFixed(2));
      setDummyState(pre => pre + 1);
    }
  }

  const calculateShortage = (record: ILayIngTableDto) => {
    const { markerLength = 0, layedPlies, jointsOverlapping = 0, reuseRemains = 0, usableRemains = 0, unUsableRemains = 0, allocatedQty, halfPlie = 0 } = record;
    if (!isNaN(layedPlies) && !isNaN(jointsOverlapping)) {
      const layedYardage = (Number(markerLength) * layedPlies) + jointsOverlapping;
      const totalRemains = reuseRemains + usableRemains + unUsableRemains - halfPlie;
      const shortage = (layedYardage + totalRemains - allocatedQty).toFixed(2);
      record.shortage = parseFloat(shortage);
      setDummyState(prev => prev + 1);
    }
  };




  const columns: any[] = [
    {
      title: 'Sequence',
      fixed: 'left',
      width: '80px',
      dataIndex: 'sequence',
      align: 'center',
      render: (text, record, index) => {
        if (record.isEditable) {
          return <InputNumber style={{ border: 0, borderRadius: 0 }}
            formatter={(value) => (value !== undefined ? String(value).replace(/[^0-9]/g, '') : '')}
            parser={(value) => value ? parseInt(value, 10) : undefined}
            onChange={(val) => inputOnChange(val, 'sequence', index)} placeholder='Please Enter' />
        } else {
          return text
        }
      }
    },
    {
      title: 'Location', // TODO
      dataIndex: 'rollLocation',
      fixed: 'left',
      align: 'center',
      width: '80px',
      render: (text, record, index) => {
        return <Space size={0}>
          <Tooltip title='Pallet Code' mouseEnterDelay={0} mouseLeaveDelay={0}> <Tag color='brown'>{record.pallet}</Tag></Tooltip>
          <Tooltip title='Tray Code' mouseEnterDelay={0} mouseLeaveDelay={0}> <Tag color='indigo'>{record.tray}</Tag></Tooltip>
          <Tooltip title='Trolley Code' mouseEnterDelay={0} mouseLeaveDelay={0}> <Tag color='cadetblue'>{record.trolly}</Tag></Tooltip>
        </Space>
      }
    },
    {
      title: 'Roll Barcode',
      dataIndex: 'barcode',
      key: 'barcode',
      align: 'center',
      fixed: 'left',
      width: '80px',
      onCell: (record) => ({
        className: record.isError ? 'error-class' : '' // Apply the class based on a condition
      })
    },
    {
      title: 'Roll No',
      dataIndex: 'rollNo',
      key: 'rollNo',
      align: 'center',
      fixed: 'left',
      width: '80px',
    },
    {
      title: 'Batch',
      dataIndex: 'batch',
      fixed: 'left',
      align: 'center',
      width: '80px',
      key: 'batch',
    },
    {
      title: 'Shade',
      dataIndex: 'shade',
      width: 60,
      align: 'center',
      key: 'shade',
    },
    {
      title: 'Ticket Length',
      dataIndex: 'rollQty',
      align: 'center',
      width: 60,
      render: (val) => <Tag color='green'>{val}</Tag>

    },
    {
      title: 'Allocated Qty',
      dataIndex: 'allocatedQty',
      align: 'center',
      width: 60,
      key: 'allocatedQty',
      render: (val: number) => {
        //TODO : calculation
        return <Tag color='black'>{val}</Tag>

      }
    },
    {
      title: 'PL Width',
      dataIndex: 'plWidth',
      align: 'center',
      width: 60,
      render: (val) => <Tag color='yellow'>{val}</Tag>
    },
    {
      title: 'Relax Width', //TODO
      dataIndex: 'relaxWidth',
      align: 'center',
      width: 60,
      render: (val) => val && <Tag color='blue'>{val}</Tag>

    },
    {
      title: 'Actual Width', //TODO
      dataIndex: 'aWidth',
      align: 'center',
      width: 60,
      render: (val) => <Tag color='orange'>{val}</Tag>

    },
    {
      title: 'Plies', //TODO
      width: 50,
      align: 'center',
      dataIndex: 'plies', //allocatedQty/Marker Length

    },
    {
      title: 'Actual Plies',
      dataIndex: 'layedPlies',
      align: 'center',
      key: 'layedPlies',
      render: (text, record, index) => {
        if (record.isEditable) {
          return <InputNumber style={{ border: 0, borderRadius: 0, padding: '2px 4px' }}
            formatter={(value) => (value !== undefined ? String(value).replace(/[^0-9]/g, '') : '')}
            parser={(value) => value ? parseFloat(value) : 0}
            onChange={(val) => {
              inputOnChange(val, 'layedPlies', index);
            }}
            onBlur={val => { calculateLayedYardage(record, Number(val), record.jointsOverlapping); calculateShortage(record) }}
            onPressEnter={val => { calculateLayedYardage(record, Number(val), record.jointsOverlapping); calculateShortage(record) }}
            placeholder='Please Enter' />
        } else {
          return <span style={{ minWidth: '50px', display: 'block' }}>{text}</span>
        }
      }
    },
    {
      title: 'Layed Yardage',
      dataIndex: 'layedYardage',
      align: 'center',
      width: 60,
    },
    {
      title: 'Joints Overlapping',
      dataIndex: 'jointsOverlapping',
      align: 'center',
      width: 80,
      render: (text, record, index) => {
        if (record.isEditable) {
          return <InputNumber style={{ border: 0, borderRadius: 0 }}
            formatter={(value) => (value !== undefined ? String(value).replace(/[^0-9.]/g, '') : '')}
            parser={(value) => value ? parseFloat(value) : 0}
            onChange={(val) => {
              inputOnChange(val, 'jointsOverlapping', index, true);
            }}
            onBlur={(val) => { calculateLayedYardage(record, record.layedPlies, Number(val)); calculateShortage(record) }}
            onPressEnter={(val) => { calculateLayedYardage(record, record.layedPlies, Number(val)); calculateShortage(record) }}
            placeholder='Please Enter' />
        } else {
          return text
        }
      }
    },
    {
      title: 'No Of Joints',
      align: 'center',
      dataIndex: 'noOfJoints',
      render: (text, record, index) => {
        if (record.isEditable) {
          return <InputNumber style={{ border: 0, borderRadius: 0 }}
            formatter={(value) => (value !== undefined ? String(value).replace(/[^0-9.]/g, '') : '')}
            parser={(value) => value ? parseFloat(value) : 0}
            onChange={(val) => inputOnChange(val, 'noOfJoints', index, true)} placeholder='Please Enter' />
        } else {
          return <span style={{ minWidth: '50px', display: 'block' }}>{text}</span>
        }
      }
    },
    {
      title: 'Role Half Pile For Next',
      dataIndex: 'reuseRemains',
      align: 'center',
      width: 80,
      render: (text, record, index) => {
        if (record.isEditable) {
          return <InputNumber style={{ border: 0, borderRadius: 0 }}
            precision={4}
            formatter={(value) => (value !== undefined ? String(value).replace(/[^0-9.]/g, '') : '')}
            parser={(value) => value ? parseFloat(value) : 0}
            onChange={(val) => inputOnChange(val, 'reuseRemains', index, true)}
            onBlur={() => calculateShortage(record)}
            onPressEnter={() => calculateShortage(record)}
            placeholder='Please Enter' />
        } else {
          return text
        }
      }
    },
    {
      title: 'Half Plie of Previous Roll',
      dataIndex: 'halfPlie',
      align: 'center',
      width: 80,
      render: (text, record, index) => {
        if (record.isEditable) {
          return <InputNumber style={{ border: 0, borderRadius: 0 }}
            precision={4}
            formatter={(value) => (value !== undefined ? String(value).replace(/[^0-9.]/g, '') : '')}
            parser={(value) => value ? parseFloat(value) : 0}
            onBlur={() => calculateShortage(record)}
            onPressEnter={() => calculateShortage(record)}
            onChange={(val) => inputOnChange(val, 'halfPlie', index, true)} placeholder='Please Enter' />
        } else {
          return text
        }
      }
    },
    {
      title: 'Fabric Defects',
      dataIndex: 'damages',
      align: 'center',
      key: 'damages',
      render: (text, record, index) => {
        if (record.isEditable) {
          return <InputNumber style={{ border: 0, borderRadius: 0 }}
            onChange={(val) => inputOnChange(val, 'damages', index)} placeholder='Please Enter' />
        } else {
          return <span style={{ minWidth: '50px', display: 'block' }}>{text}</span>
        }
      }
    },
    {
      title: 'Usable Remains',
      dataIndex: 'usableRemains',
      align: 'center',
      width: 80,
      render: (text, record, index) => {
        if (record.isEditable) {
          return <InputNumber style={{ border: 0, borderRadius: 0 }}
            precision={4}
            formatter={(value) => (value !== undefined ? String(value).replace(/[^0-9.]/g, '') : '')}
            parser={(value) => value ? parseFloat(value) : 0}
            onChange={(val) => inputOnChange(val, 'usableRemains', index, true)}
            onBlur={() => calculateShortage(record)}
            onPressEnter={() => calculateShortage(record)}
            placeholder='Please Enter' />
        } else {
          return text
        }
      }
    },
    {
      title: 'Unusable Remains',
      dataIndex: 'unUsableRemains',
      align: 'center',
      width: 80,
      render: (text, record, index) => {
        if (record.isEditable) {
          return <InputNumber style={{ border: 0, borderRadius: 0 }}
            precision={4}
            formatter={(value) => (value !== undefined ? String(value).replace(/[^0-9.]/g, '') : '')}
            parser={(value) => value ? parseFloat(value) : 0}
            onChange={(val) => inputOnChange(val, 'unUsableRemains', index, true)}
            onBlur={() => calculateShortage(record)}
            onPressEnter={() => calculateShortage(record)}
            placeholder='Please Enter' />
        } else {
          return text
        }
      }
    },
    {
      title: 'Shortages',
      dataIndex: 'shortage',
      width: 60,
      align: 'center',
      key: 'shortages',
    },
    {
      title: 'Shrinkage',
      width: 60,
      align: 'center',
      dataIndex: 'shrinkage',
      key: 'shrinkage',
    },
    {
      title: 'Supplier Width',
      dataIndex: 'iWidth',
      width: 60,
      align: 'center',
      key: 'iWidth',
    },
    // {
    //   title: 'Allocated Qty',
    //   dataIndex: 'fabricReceived',
    //   key: 'fabricReceived',
    //   render: () => {
    //     //TODO : calculation
    //     return <></>
    //   }
    // },

    // {
    //   title: 'Fabric Return',
    //   dataIndex: 'fabricReturn',
    //   key: 'fabricReturn',
    // },

    // {
    //   title: 'Barcode',
    //   dataIndex: 'barcode',
    //   key: 'barcode',
    // },

    {
      title: 'End Bits',
      align: 'center',
      dataIndex: 'endBits',
      key: 'endBits',
      render: (text, record, index) => {
        if (record.isEditable) {
          return <InputNumber style={{ border: 0, borderRadius: 0 }}
            onChange={(val) => inputOnChange(val, 'endBits', index)} placeholder='Please Enter' />
        } else {
          return text
        }
      }
    },
    // {
    //   title: 'Shortage',
    //   dataIndex: 'shortage',
    //   key: 'shortage',
    //   render: (text, record, index) => {
    //     if (record.isEditable) {
    //       return <InputNumber
    //         onChange={(val) => inputOnChange(val, 'shortage', index)} placeholder='Please Enter' />
    //     } else {
    //       return text
    //     }
    //   }
    // },
    // {
    //   title: 'Damages',
    //   dataIndex: 'damages',
    //   key: 'damages',
    //   render: (text, record, index) => {
    //     if (record.isEditable) {
    //       return <InputNumber
    //         onChange={(val) => inputOnChange(val, 'damages', index)} placeholder='Please Enter' />
    //     } else {
    //       return text
    //     }
    //   }
    // },
    {
      title: 'Remarks',
      dataIndex: 'remarks',
      align: 'center',
      key: 'remarks',
      render: (text, record, index) => {
        if (record.isEditable) {
          return <Input style={{ border: 0, borderRadius: 0 }}
            onChange={(e) => inputOnChange(e.target.value, 'remarks', index)} placeholder='only 30 caharcters allowed' maxLength={30} />
        } else {
          return <span style={{ minWidth: '50px', display: 'block' }}>{text}</span>
        }
      }
    },
    // {
    //   title: 'Lay Start Time',
    //   dataIndex: 'layStartTime',
    //   key: 'layStartTime',
    //   render: (text, record, index) => {
    //     if (record.isEditable) {
    //       return <DatePicker showTime={{ format: defaultTimePicker }} format={defaultDateTimeFormat} allowClear={false} disabledDate={(current) => disabledNextDates(current, moment().format(defaultDateFormat))} onChange={(date) => datePickerOnChange(date, 'layStartTime', index)}
    //         value={text ? moment(text) : null} />
    //     } else {
    //       return text ? convertBackendDateToLocalTimeZone(text) : '';
    //     }
    //   }
    // },
    // {
    //   title: 'Lay End Time',
    //   dataIndex: 'layEndTime',
    //   key: 'layEndTime',
    //   render: (text, record, index) => {
    //     if (record.isEditable) {
    //       return <DatePicker showTime={{ format: defaultTimePicker }} format={defaultDateTimeFormat} allowClear={false} disabledDate={(current) => disabledBackDates(current, moment().format(defaultDateFormat))} onChange={(date) => datePickerOnChange(date, 'layEndTime', index)} value={text ? moment(text) : null} />
    //     } else {
    //       return text ? convertBackendDateToLocalTimeZone(text) : '';
    //     }
    //   }
    // }
    // {
    //   title: 'Break Time',
    //   dataIndex: 'breakTime',
    //   key: 'breakTime',
    //   render: (text, record, index) => {
    //     if (editableIndex == index) {
    //       return <Input
    //         onChange={(val) => inputOnChange(val, 'remarks', index)} placeholder='Please Enter' />
    //     } else {
    //       return text
    //     }
    //   }
    // }
  ];


  const addLayedRollForLayId = (index: number) => {
    const record = tableData[index];
    if (!record.barcode) {
      AlertMessages.getErrorMessage('Please Select Roll Barcode');
      return;
    }
    if (!record.layedPlies) {
      AlertMessages.getErrorMessage('Please Enter Layed Plies');
      return;
    }
    // check if the end date and start dates are proper
    // if(!record.layStartTime || !record.layEndTime) {
    //   AlertMessages.getErrorMessage('Please Enter Lay Start And End Time');
    //   return;
    // }
    if (record.layStartTime > record.layEndTime) {
      AlertMessages.getErrorMessage('Lay Start Time Is Incorrect With Lay End Time');
      return;
    }
    // const req = new LayItemAddRequest(user?.userName, user?.orgData?.unitCode, user?.orgData?.companyCode, user?.userId, layInfo.layId, record.itemId, record.barcode, record.layedPlies, record.layedPlies, record.endBits, record.damages, record.remarks, record.layStartTime, record.layEndTime, null, record.shortage);
    // layReportingService.addLayedRollsForLayId(req).then((res => {
    //   if (res.status) {
    //     setEditableIndex(null);
    //     getLayInfoForDocket();
    //     AlertMessages.getSuccessMessage(res.internalMessage);
    //   } else {
    //     AlertMessages.getErrorMessage(res.internalMessage);
    //   }
    // })).catch(error => {
    //   AlertMessages.getErrorMessage(error.message);
    // });
  }

  const confirmLay = () => {
    const { layStartTime, layEndTime } = layTimings;

    if (!shadeTitles.trim()) {
      AlertMessages.getErrorMessage('Shade Titles are required!');
      return;
    }

    if (!prices.trim()) {
      AlertMessages.getErrorMessage('Plies are required!');
      return;
    }

    const shadeTitlesArray = shadeTitles.split(',').map(title => title.trim());
    const pliesArray = prices.split(',').map(price => price.trim());

    if (shadeTitlesArray.length !== pliesArray.length) {
      AlertMessages.getErrorMessage('Mismatch between Shade Titles and Plies!');
      return;
    }

    const shadePliesMap = shadeTitlesArray.reduce((acc, shadeTitle, index) => {
      const plies = !isNaN(parseFloat(pliesArray[index])) ? parseFloat(pliesArray[index]) : 0;
      acc[shadeTitle] = (acc[shadeTitle] || 0) + plies;
      return acc;
    }, {} as Record<string, number>);

    let hasError = false;
    let isFiledError = false;
    let errorRollCount = 0;
    const rollsReq: LayItemAddRequest[] = [];

    tableData.forEach(row => {
      if ((row.sequence && row.layedPlies) || row.damages) {
        row.isError = false;
        const totalLayPliesForShade = tableData.reduce((sum, item) => {
          if (item.shade === row.shade) {
            return sum + (item.layedPlies || 0);
          }
          return sum;
        }, 0);

        const inputPliesForShade = shadePliesMap[row.shade] || 0;
        if (totalLayPliesForShade !== inputPliesForShade) {
          hasError = true;
          // row.isError = true;
          // errorRollCount++;
        }

        rollsReq.push(
          new LayItemAddRequest(user?.userName, user?.orgData?.unitCode, user?.orgData?.companyCode, user?.userId, layInfo.layId, row.itemId, row.barcode, row.layedPlies,
            row.layedPlies, row.endBits, row.damages, row.remarks, layStartTime, layEndTime, null, row.shortage, row.sequence, row.jointsOverlapping, row.noOfJoints, row.reuseRemains,
            row.halfPlie, row.damages, row.usableRemains, row.unUsableRemains,
            Object.entries(shadePliesMap).map(([title, plies]) => ({
              shadeTitle: title,
              plies,
            }))
          )
        );
      } else {
        const sequence = row.sequence || 0;
        const layedPlies = row.layedPlies || 0;
        if ((sequence > 0 && layedPlies < 1) || (sequence < 1 && layedPlies > 0)) {
          isFiledError = true;
          row.isError = true;
          errorRollCount++;
        }
      }
    });

    if (isFiledError) {
      AlertMessages.getErrorMessage(`Please fill in the mandatory fields for ${errorRollCount} rolls`);
      setTableData(prev => [...prev]);
      return;
    }
    if (hasError) {
      AlertMessages.getErrorMessage(`Total Shade Wise Actual Plies should be Equal to Shade wise Plies `);
      setTableData(prev => [...prev]);
      return;
    }

    if (!layStartTime || !layEndTime) {
      AlertMessages.getErrorMessage('Please select lay timings');
      return;
    }

    const startTime = moment(layStartTime, defaultDateTimeFormat);
    const endTime = moment(layEndTime, defaultDateTimeFormat);

    if (startTime.isSameOrAfter(endTime)) {
      AlertMessages.getErrorMessage('Lay End time should be greater than Lay Start time');
      return;
    }

    if (rollsReq.length < 1) {
      AlertMessages.getErrorMessage('Please Enter at least one roll detail');
      return;
    }

    layReportingService
      .addLayedRollsForLayId(rollsReq)
      .then(res => {
        if (res.status) {
          setEditableIndex(null);
          getLayInfoForDocket();
          AlertMessages.getSuccessMessage(res.internalMessage);
        } else {
          AlertMessages.getErrorMessage(res.internalMessage);
        }
      })
      .catch(error => {
        AlertMessages.getErrorMessage(error.message);
      });
  };


  const getColumns = () => {
    return columns;
    if (layInfo.currentLayStatus == 1) {
      return [
        ...columns,
        {
          title: tableData.length == 0 ? 'Action'
            // <Space>Action <Button size='small' className='btn-orange' type="primary" onClick={handleAdd} icon={<PlusCircleOutlined />} /></Space> 
            : <>Action</>,
          key: 'actions',
          // fixed: 'right',
          align: 'center',
          width: 80,
          render: (text: string, record: any, index: number) => (
            <Space>
              {editableIndex === index ? <Button size='middle' type="primary" className='btn-green' onClick={() => addLayedRollForLayId(index)}>
                Save
              </Button> : <Button size='middle' type="primary" danger onClick={() => handleRemove(index)} icon={<MinusCircleOutlined />} />}
              {/* {index === tableData.length - 1 && (
                <Button type="primary" className='btn-orange' onClick={handleAdd} icon={<PlusCircleOutlined />} />
              )} */}
            </Space>
          ),
        },
      ]
    } else {
      return columns;
    }
  }
  const handleAdd = () => {
    if (editableIndex != null) {
      AlertMessages.getErrorMessage(`Please save roll Data before adding new roll`);
      return
    }
    setEditableIndex(tableData.length);
    setTableData(prev => {
      return [
        ...prev,
        { ...layIngTableDefaultData }
      ]
    })
  }

  const handleRemove = (index: number) => {
    const record = tableData[index];
    const req = new LayItemIdRequest(user?.userName, user?.orgData?.unitCode, user?.orgData?.companyCode, user?.userId, layInfo.layId, [record.itemId]);
    layReportingService.removeLayedRollForLayId(req).then((res => {
      if (res.status) {
        setEditableIndex(null);
        getLayInfoForDocket();
        AlertMessages.getSuccessMessage(res.internalMessage);
      } else {
        AlertMessages.getErrorMessage(res.internalMessage);
      }
    })).catch(error => {
      AlertMessages.getErrorMessage(error.message);
    });
  }



  const confirmLayingForLayId = () => {
    const req = new LayIdConfirmationRequest(user?.userName, user?.orgData?.unitCode, user?.orgData?.companyCode, user?.userId, layInfo.layId, undefined, undefined, undefined, undefined);
    layReportingService.confirmLayingForLayId(req).then((res => {
      if (res.status) {
        AlertMessages.getSuccessMessage(res.internalMessage);
        getLayInfoForDocket();
      } else {
        AlertMessages.getErrorMessage(res.internalMessage);
      }
    })).catch(error => {
      AlertMessages.getErrorMessage(error.message);
    });
  }

  const sortOrder = () => {
    const cloneRows = [...tableData];
    cloneRows.sort((a, b) => {
      if (a.sequence == null && b.sequence == null) return 0; // Both null/undefined, no change in order
      if (a.sequence == null) return 1; // a is null/undefined, move it to the end
      if (b.sequence == null) return -1; // b is null/undefined, move it to the end
      return a.sequence - b.sequence; // Both have valid values, sort numerically
    });

    setTableData(cloneRows);
  }

  return (
    <>
      <Table columns={getColumns()}
        className='lay-reporting-table'
        dataSource={tableData} scroll={{ x: 'max-content', y: 300 }} rowKey={r => r.barcode} size='small' pagination={false} bordered={true}
        locale={{
          emptyText: <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description={<Tag color="processing">To see the information, Click Below Button</Tag>} >
            <Button type="primary" className='btn-orange' onClick={handleAdd}>Create</Button>
          </Empty>,
        }}
      >
      </Table>
      <br />
      <Row justify='space-between'>
        <Col>
          <Space size={'large'}>

            {layInfo.currentLayStatus == LayingStatusEnum.INPROGRESS ? <>
              Lay Start Time :
              <DatePicker showTime={{ format: defaultTimePicker }} format={defaultDateTimeFormat} allowClear={false} disabledDate={(current) => disabledNextDates(current, moment().format(defaultDateFormat))}
                onChange={(date) => setLayTimings(pre => ({ ...pre, layStartTime: moment(date).format() }))} />
            </> : <> {layInfo.currentLayStatus == LayingStatusEnum.HOLD ?
              <>Last Paused at : <Tag style={{ fontSize: '14px' }} color="#972ec8">{moment(layInfo.layDownTimes?.[layInfo.layDownTimes.length - 1].downtimeStartedOn).format(defaultDateTimeFormat)}</Tag> </> :
              <>
                <Card title={<>Lay Started Time : {<Tag style={{ fontSize: '14px' }} color="#972ec8">{convertBackendDateToLocalTimeZone(layTimings.layStartTime)}</Tag>}</>} bordered={false}>
                  {/* {moment(layTimings.layStartTime).utc().format(defaultDateTimeFormat)} */}
                </Card>
                {/* Lay Start Time :<Tag style={{ fontSize: '14px' }} color="#972ec8">{moment(layTimings.layStartTime).utc().format(defaultDateTimeFormat)}</Tag> */}
              </>
            }</>
            }
            {/* </Col>
        <Col> */}

            {layInfo.currentLayStatus == LayingStatusEnum.INPROGRESS ?
              <>Lay End Time :
                <DatePicker
                  showTime={{ format: defaultTimePicker }}
                  format={defaultDateTimeFormat}
                  allowClear={false}
                  onChange={(date) => setLayTimings(pre => ({ ...pre, layEndTime: moment(date).format() }))}
                /></>

              : <> {layInfo.currentLayStatus == LayingStatusEnum.HOLD ?
                <>Last Paused Reason : <Tag style={{ fontSize: '14px' }} color="#972ec8">{layInfo.layDownTimes?.[layInfo.layDownTimes.length - 1].reason}</Tag> </> :
                <>
                  <Card title={<>Lay Ended Time : {<Tag style={{ fontSize: '14px' }} color="#972ec8"> {convertBackendDateToLocalTimeZone(layTimings.layEndTime)}</Tag>}</>} bordered={false}></Card>
                  {/* Lay End Time :<Tag style={{ fontSize: '14px' }} color="#972ec8">{moment(layTimings.layEndTime).utc().format(defaultDateTimeFormat)}</Tag> */}
                </>
              }</>}

            {(layInfo.currentLayStatus === LayingStatusEnum.INPROGRESS || layInfo.currentLayStatus === LayingStatusEnum.HOLD) && (
              <>Shade Titles:
                <Input placeholder="Enter Shade Titles (comma separated)" value={shadeTitles} onChange={(e) => setShadeTitles(e.target.value)} style={{ width: '100%' }} />
                <>Plies:
                  <Input placeholder="Enter Plies (comma separated)" value={prices} onChange={(e) => setPrices(e.target.value)} style={{ width: '100%' }} />
                </>
              </>)}
          </Space>
        </Col>
        <Col>
          {layInfo.currentLayStatus == LayingStatusEnum.INPROGRESS && <Button type='primary' className='btn-yellow' onClick={sortOrder}>Sort Sequence</Button>}
        </Col>
        <Col>
          {layInfo.currentLayStatus == LayingStatusEnum.INPROGRESS && <Button type='primary' className='btn-green' onClick={confirmLay}>Confirm Lay</Button>}
        </Col>

        <br /> <br />
      </Row>
    </>
  )
}

export default LayingTable;