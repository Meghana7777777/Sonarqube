import { Injectable } from "@nestjs/common";
import { DataSource, Repository } from "typeorm";
import { PhLinesEntity } from "../entities/ph-lines.entity";
import { dataSource } from "../../../database/type-orm-config/typeorm.config-migrations";

@Injectable()
export class PhLinesRepo extends Repository<PhLinesEntity> {
	constructor(dataSource: DataSource) {
		super(PhLinesEntity, dataSource.createEntityManager());
	}

	async getPhLinesByBatchAndLot(batches: string[], lotNos: string[], phId: number[], unitCode: string, companyCode: string, rollIds?: number[]): Promise<{
		id: number, batchNumber: string, lotNumber: string, deliveryDate: string, barcode: string, sWidth: string, sLength: string, mWidth: string, rollQty: string, rollId: number, packListId: number,itemCode:string,
	}[]> {
		const query = await this.createQueryBuilder('phl')
			.select([
				'phl.ph_id as packListId',
				'phl.batch_number AS batchNumber',
				'phl.lot_number AS lotNumber',
				'phl.delivery_date AS deliveryDate',
				'itemLines.barcode AS barcode',
				'itemLines.s_width AS sWidth',
				'itemLines.s_length AS sLength',
				'itemLines.measured_width AS mWidth',
				'itemLines.s_quantity AS rollQty',
				'itemLines.id AS rollId',
				'items.item_code AS itemCode',
			])
			.leftJoin('ph_items', 'items', 'items.ph_lines_id = phl.id')
			.leftJoin('ph_item_lines', 'itemLines', 'itemLines.ph_items_id = items.id')
			.where('phl.ph_id IN (:...phId)', { phId })
		if (batches.length > 0) {
			query.andWhere('phl.batch_number IN (:...batches)', { batches })
		}

		if (lotNos.length > 0) {
			query.andWhere('phl.lot_number IN (:...lotNos)', { lotNos })
		}

		if (rollIds && rollIds.length > 0) {
			query.andWhere('items.id IN (:...lotNos)', { rollIds })
		}

		return query.andWhere(`phl.unit_code = '${unitCode}' AND phl.company_code = '${companyCode}'`)
			.getRawMany();
	}


}

export class FabInsSelectedBatchModel {
	packListId: number;
	batchNo: string;
	attrs: FabInsSelectedBatchModelAttrs;
	lotInfo: FabInsSelectedLotModel[];
}

// ins request attrs
export class FabInsSelectedBatchModelAttrs {
	moNo: string[];
	delDate: string[];
	destination: string[];
	moLines: string[];
}

// ins request lines
export class FabInsSelectedLotModel {
	packListId: number;
	lotNo: string;
	rolls: FabInsSelectedRollModel[];
	attrs: FabInsSelectedLotModelAttrs;
}

export class FabInsSelectedLotModelAttrs {
	rollCount: number;
}

// ins request item
export class FabInsSelectedRollModel {
	packListId: number;
	rollId: number;
	rollBarocde: string;
	rollQty: number;
	attrs: FabInsSelectedRollModelAttrs;
}

export class FabInsSelectedRollModelAttrs {
	sWidth: number; // supplier width
	mWidth: number; // measured width
	sLength: number; // supplier length
}
