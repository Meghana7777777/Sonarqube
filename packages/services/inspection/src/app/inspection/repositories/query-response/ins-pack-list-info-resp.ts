import { InsInspectionFinalInSpectionStatusEnum, InsFabricInspectionRequestCategoryEnum, InsInspectionActivityStatusEnum, } from "@xpparel/shared-models";

export class InsPackListInfoResponse {
	id: number;
	request_category: InsFabricInspectionRequestCategoryEnum;
	pack_list_code: string;
	pack_list_id: number;
	completed_rolls: string | null; // Comma-separated roll IDs if completed
	started_rolls: string | null; // Comma-separated roll IDs if started
	open_rolls: string | null; // Comma-separated roll IDs if open
	todo:InsInspectionActivityStatusEnum
	final_inspection_status: InsInspectionFinalInSpectionStatusEnum;
	item_code: string;
	ins_creation_time: string;
	lot_number: string;
	ins_activity_status: InsInspectionActivityStatusEnum;
}
