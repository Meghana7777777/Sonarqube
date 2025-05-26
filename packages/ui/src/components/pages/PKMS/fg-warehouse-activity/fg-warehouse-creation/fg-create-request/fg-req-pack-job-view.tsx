import { DownCircleFilled, UpCircleFilled } from "@ant-design/icons";
import { PKMSPackJobsInfoModel } from "@xpparel/shared-models";
import { Button, Table, TableColumnsType } from "antd";
import { Dispatch, SetStateAction, useEffect } from "react";
import FgReqCartonsView from "./fg-req-cartons-view";

interface IProps {
    packListId: number;
    packJobData: PKMSPackJobsInfoModel[];
    getPackListInfoByPackListId: (packListId: number[]) => void;
    selectedPackJobs: Map<number, number[]>;
    setPackListLevelCartonsSelection: Dispatch<SetStateAction<Map<number, Map<number, number[]>>>>
}

const FgReqPackJobView = (props: IProps) => {
    const { packListId, packJobData, getPackListInfoByPackListId, selectedPackJobs, setPackListLevelCartonsSelection } = props;


    useEffect(() => {
        if (!packJobData)
            getPackListInfoByPackListId([packListId])
    }, [packListId])


    const columns: TableColumnsType<PKMSPackJobsInfoModel> = [
        {
            title: 'Pack Job No',
            dataIndex: 'packJobNo',
        },
        {
            title: 'Pack List No',
            dataIndex: 'packLIstNo'
        },
        {
            title: 'Pack Job Id',
            dataIndex: 'packJobId'
        },
        {
            title: 'Product Names',
            dataIndex: "attrs",
            render: (v, r) => {
                return <>
                    {v?.prodNames}
                </>
            }
        }
    ]


    return <>

        <Table
            columns={columns}
            dataSource={packJobData}
            size="small"
            bordered
            pagination={false}
            style={{ width: '100%', overflowX: 'auto' }}
            rowKey={(record) => record.packJobId}
            rowSelection={{
                type: 'checkbox',
                columnTitle: 'Pack Job Level Selection',
                columnWidth: '200px',
                getCheckboxProps: (record: PKMSPackJobsInfoModel) => {
                    const selectedCartons = selectedPackJobs?.get(record.packJobId) || [];
                    const totalCartons = record.cartonsList?.filter(rec => !rec.isFgWhCartonId).map(rec => rec.cartonId) || [];
                    const disabled = record.cartonsList?.filter(rec => !rec.isFgWhCartonId).length === 0;
                    const isIndeterminate = selectedCartons.length > 0 && selectedCartons.length < totalCartons.length;
                    return {
                        indeterminate: isIndeterminate,
                        disabled: disabled
                    }
                },
                selectedRowKeys: selectedPackJobs?.keys() ? Array.from(selectedPackJobs?.keys()) : [],
                onSelect: (record: PKMSPackJobsInfoModel, selected: boolean, selectedRows: PKMSPackJobsInfoModel[]) => {
                    setPackListLevelCartonsSelection(prev => {
                        const previous = new Map(prev);
                        const packJobsMap = new Map<number, number[]>();
                        const cartonsIds = record.cartonsList.filter(rec => !rec.isFgWhCartonId).map(rec => rec.cartonId)
                        packJobsMap.set(record.packJobId, cartonsIds)
                        if (selected) {
                            if (!previous.get(packListId)) {
                                previous.set(packListId, packJobsMap);
                            } else {
                                previous.get(packListId).set(record.packJobId, cartonsIds)
                            }
                        } else {
                            previous.get(packListId).delete(record.packJobId)
                        }
                        return previous
                    })
                    if (!selectedRows.length) {
                        setPackListLevelCartonsSelection(prev => {
                            const previous = new Map();
                            previous.delete(packListId);
                            return previous
                        })
                    }
                },

            }}
            expandable={{
                expandIcon: ({ expanded, onExpand, record }) => {
                    return <>  {
                        expanded ?
                            <Button
                                onClick={e => onExpand(record, e)}
                                type="primary"
                                icon={<UpCircleFilled />}
                            />
                            :
                            <Button
                                type="primary"
                                onClick={e => onExpand(record, e)}
                                icon={<DownCircleFilled />}
                            />
                    }
                    </>
                },
                expandedRowRender: (record: PKMSPackJobsInfoModel, index: number, indent: number, expanded: boolean) => {
                    return <>
                        <FgReqCartonsView
                            selectedCartons={selectedPackJobs?.get(record?.packJobId)}
                            cartons={record.cartonsList}
                            setPackListLevelCartonsSelection={setPackListLevelCartonsSelection}
                            packListId={packListId}
                            packJobId={record?.packJobId}
                        />
                    </>
                }
            }}
        >
        </Table>

    </>
}


export default FgReqPackJobView