import { CartonDataForEachPl, CartonDataModel, InspectionTypeEnum, SystematicPreferenceReqModel } from "@xpparel/shared-models";
import { Collapse, CollapseProps, Table, Tag } from "antd";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { SequenceUtils } from "../../../../common";
import { AlertMessages } from "../../../common";

interface IProps {
	preferenceReqModel: SystematicPreferenceReqModel
	packListCrtnData: CartonDataForEachPl[]
	selectedInsCartonsCount: Map<number, number>;
	packListCarton: Map<number, CartonDataModel[]>;
	selectedInsCartonsKeys: Map<number, string[]>;
	setSelectedInsCartonsKeys: Dispatch<SetStateAction<Map<number, string[]>>>;
	disableSelectedCarton?: boolean;
	cartonData: CartonDataForEachPl[];
}


const InspectionCartonDetails = (props: IProps) => {
	const { preferenceReqModel, cartonData, packListCrtnData, selectedInsCartonsCount, disableSelectedCarton, selectedInsCartonsKeys, setSelectedInsCartonsKeys, packListCarton } = props

	const [activeKeys, setActiveKeys] = useState<string[]>([]);


	useEffect(() => {
		setActiveKeys(packListCrtnData.map((rec) => rec.packListNo.toString()))
	}, [packListCrtnData])


	const columns = [
		{
			title: "PackJobNumber",
			dataIndex: "packJobNo",
		},
		{
			title: 'Carton No',
			dataIndex: 'barCode'
		},
		{
			title: "Carton Type",
			dataIndex: "itemCode",
		},
		{
			title: 'Carton Description',
			dataIndex: 'itemDesc'
		},
		{
			title: "Quantity",
			dataIndex: "requiredQty",
		},
		{
			title: 'Length',
			dataIndex: 'length'
		},
		{
			title: 'Width',
			dataIndex: 'width'
		},
		{
			title: 'Height',
			dataIndex: 'height'
		},
		// {
		// 	title: 'Buyer Address',
		// 	dataIndex: 'buyerAddress'
		// },
		{
			title: 'Delivery Date',
			dataIndex: 'deliverDate'
		},
		{
			title: 'Ex Factory',
			dataIndex: 'exFactory'
		},
		// {
		// title: "In Coterm",
		// dataIndex: "inCoterm",
		// },
		{
			title: "Style",
			dataIndex: "style",
		},

	];

	const getRowSelection = (packListId: number) => {
		const obj = {
			selectedRowKeys: selectedInsCartonsKeys?.get(packListId)
		};
		if (disableSelectedCarton) {
			obj['getCheckboxProps'] = (record: CartonDataForEachPl) => ({
				// disabled:,
				selected: true,
			});
		}
		if (preferenceReqModel?.insSelectionType === InspectionTypeEnum.SYSTEMATIC) {
			obj['getCheckboxProps'] = () => ({
				disabled: true,

			})
		} else {
			obj['onChange'] = (selectedRowKeys: string[], selectedRow: CartonDataModel[]) => {
				const sum = selectedRowKeys.length;
				console.log(sum, 'sum', selectedInsCartonsCount)
				if (sum == 0 || sum <= selectedInsCartonsCount.get(packListId)) {
					if (sum) {
						const selected = new Map(selectedInsCartonsKeys)
						selected.set(packListId, selectedRowKeys)
						setSelectedInsCartonsKeys(selected);
					} else {
						const selected = new Map(selectedInsCartonsKeys)
						selected.set(packListId, selectedRowKeys)
						setSelectedInsCartonsKeys(selected);
					}
				} else if (disableSelectedCarton) {

				}
				else {
					AlertMessages.getErrorMessage(`You can select only up to ${selectedInsCartonsCount.get(packListId)} from this packList`)
				}
			}
		}
		return obj
	}

	const getCartonData = (packList: CartonDataForEachPl[]) => {
		const crtns: CollapseProps['items'] = packList.map(pl => {
			return {
				key: pl.packListId.toString(),
				label: `Pack List NO :${pl.packListNo}`,
				children: <Table
					columns={columns}
					size='small'
					rowKey={rec => rec?.barCode}
					dataSource={pl.packLists}
					rowSelection={{
						type: 'checkbox',
						...getRowSelection(pl.packListId)
					}}
					pagination={false}
				/>,
				extra: <>
					<Tag color="magenta">
						Total Cartons : <b>{SequenceUtils.formatNumberToSpecificLength(`${packListCarton.get(pl.packListId)?.length ? packListCarton.get(pl.packListId)?.length : 0}`, 3)}</b>
					</Tag>
					<Tag color="#e27525">
						Ins Cartons : <b>{SequenceUtils.formatNumberToSpecificLength(`${selectedInsCartonsKeys.get(pl.packListId)?.length ? selectedInsCartonsKeys.get(pl.packListId)?.length : 0}`, 3)}</b>
					</Tag>
					<Tag color="#7cb675">
						Left Over Cartons : <b>{getPendingRolls(packListCarton.get(pl.packListId)?.length, selectedInsCartonsKeys.get(pl.packListId)?.length)}</b>
					</Tag>
				</>
			}
		})
		return crtns
	}

	const getPendingRolls = (totalRolls: number, selectedForInsRolls: number) => {
		if (totalRolls && selectedForInsRolls) {
			const diff = Number(totalRolls) - Number(selectedForInsRolls);
			return SequenceUtils.formatNumberToSpecificLength(diff.toString(), 3);
		}
		return '000';
	}

	return (
		<div>
			{packListCrtnData?.length !== 0 && <Collapse bordered={true} defaultActiveKey={activeKeys} items={getCartonData(cartonData.length ? cartonData : [])}></Collapse>}
		</div>
	)

}

export default InspectionCartonDetails;
