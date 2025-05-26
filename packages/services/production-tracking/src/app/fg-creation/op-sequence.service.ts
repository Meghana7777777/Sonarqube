import { GlobalResponseObject, ManufacturingOrderProductName, SI_MoNumberRequest } from "@xpparel/shared-models";
import { OpSequenceOpgRepository } from "../entity/repository/op-sequence-opg.repository";
import { Injectable } from "@nestjs/common";
import { FgCreationHelperService } from "./fg-creation-helper.service";
import { OpSequenceOpgEntity } from "../entity/op-sequence-opg.entity";
import { OpSequenceRefRepository } from "../entity/repository/op-sequence-ref.repository";
import { OpSequenceOpsRepository } from "../entity/repository/op-sequence-ops.repository";
import { OpSequenceRefEntity } from "../entity/op-sequence-ref.entity";
import { GenericTransactionManager } from "../../database/typeorm-transactions";
import { DataSource, In } from "typeorm";
import { OpSequenceOpsEntity } from "../entity/op-sequence-ops.entity";
import { ErrorResponse } from "@xpparel/backend-utils";

@Injectable()
export class OpSequenceService {
    constructor(
        private dataSource: DataSource,
        private opSeqOpgRepo: OpSequenceOpgRepository,
        private opSeqRefRepo: OpSequenceRefRepository,
        private opSeqOpsRepo: OpSequenceOpsRepository,
        private helperService: FgCreationHelperService
    ) {
        
    }

    // TESTED
    // ENDPOINT
    async createOpSequence(req: SI_MoNumberRequest): Promise<GlobalResponseObject> {
        const transManager = new GenericTransactionManager(this.dataSource);
        try {
            const { companyCode, unitCode, username, moNumber } = req;
            const opSeqInfos = await this.helperService.getOpSequenceForMo(moNumber, companyCode, unitCode);
            await transManager.startTransaction();
            for(const opSeqInfo of opSeqInfos) {
                const { style, pName, pCode, fgColor} = opSeqInfo;
                // check if the rec exists
                const refRec = await this.opSeqRefRepo.findOne({select: ['id'], where: {companyCode, unitCode, moNo: moNumber, style: style, fgColor: fgColor, prodCode: pCode, prodName: pName }});
                if(refRec) {
                    continue;
                }
                // save the op seq ref for th mo
                const opSeqRefEnt = new OpSequenceRefEntity();
                opSeqRefEnt.companyCode = companyCode;
                opSeqRefEnt.unitCode = unitCode;
                opSeqRefEnt.createdUser = username;
                opSeqRefEnt.style = opSeqInfo.style;
                opSeqRefEnt.prodCode = opSeqInfo.pCode;
                opSeqRefEnt.prodName = opSeqInfo.pName;
                opSeqRefEnt.fgColor = opSeqInfo.fgColor;
                opSeqRefEnt.moNo = opSeqInfo.moNo;
                const savedRef = await transManager.getRepository(OpSequenceRefEntity).save(opSeqRefEnt);
                
                // construct the next op groups for a given op group
                const nextOpgsForOpg = new Map<string, Set<string>>();
                opSeqInfo.operations.forEach(o => {
                    o.depOpGroup.forEach(d => {
                        if(!nextOpgsForOpg.has(d)) {
                            nextOpgsForOpg.set(d, new Set<string>());
                        }
                        nextOpgsForOpg.get(d).add(o.opGroup);
                    });
                });
                console.log(nextOpgsForOpg);
                const opSeqEnts: OpSequenceOpgEntity[] = [];
                const opsEnts: OpSequenceOpsEntity[] = [];
                opSeqInfo.operations.forEach(o => {
                    const opCodes = [];
                    let smv = 0;
                    o.operations.map(r => {
                        opCodes.push(r.opCode);
                        smv += Number(r.smv);

                        const opEnt = new OpSequenceOpsEntity();
                        opEnt.companyCode = companyCode;
                        opEnt.unitCode = unitCode;
                        opEnt.createdUser = username;
                        opEnt.opCode = r.opCode;
                        opEnt.opOrder = r.opOrder;
                        opEnt.opGroup = o.opGroup;
                        opEnt.smv = Number(r.smv);
                        opEnt.opSeqRefId = savedRef.id;
                        opEnt.moNo = opSeqInfo.moNo;
                        opsEnts.push(opEnt);
                    });

                    const nextOpGroups = nextOpgsForOpg.get(o.opGroup) ?? new Set('');
                    // construct the op seq entity
                    const opSeq = new OpSequenceOpgEntity();
                    opSeq.companyCode = companyCode;
                    opSeq.unitCode = unitCode;
                    opSeq.createdUser = username;
                    opSeq.opSeqRefId = savedRef.id;
                    opSeq.procType = o.procType;
                    opSeq.subProcName = o.subProcName;
                    opSeq.opGroup = o.opGroup;
                    opSeq.opCodes = opCodes.toString();
                    opSeq.opGroupOrder = o.opGroupOrder;
                    opSeq.smv = smv;
                    opSeq.routingGroup = o.routingGroup;
                    opSeq.qmsCheck = false;
                    opSeq.preOpGroups = o?.depOpGroup?.toString() ?? '';
                    opSeq.nextOpGroups = [...nextOpGroups]?.toString();
                    opSeq.pFgSku = o.procOutPutSku;
                    opSeq.spFgSku = o.subProcOutputSku;
                    opSeq.moNo = opSeqInfo.moNo;
                    opSeqEnts.push(opSeq);
                });
                await transManager.getRepository(OpSequenceOpgEntity).save(opSeqEnts, {reload: false});
                await transManager.getRepository(OpSequenceOpsEntity).save(opsEnts, {reload: false});
            }
            await transManager.completeTransaction();
            return new GlobalResponseObject(true, 0, 'Op sequence refs saved successfully');
        } catch (error) {
            await transManager.releaseTransaction();
            throw error;
        }
    }

    // TESTED
    // ENDPOINT
    async deleteOpSequence(req: SI_MoNumberRequest): Promise<GlobalResponseObject> {
        const transManager = new GenericTransactionManager(this.dataSource);
        try {
            const { companyCode, unitCode, username, moNumber } = req;
            const refRecs = await this.opSeqRefRepo.find({select: ['id'], where: {companyCode, unitCode, moNo: moNumber}});
            if(refRecs.length == 0) {
                throw new ErrorResponse(0, `No operation seq refs found for the MO : ${moNumber}`);
            }
            const refIds = refRecs.map(r => r.id);
            await transManager.startTransaction();
            await transManager.getRepository(OpSequenceRefEntity).delete({companyCode, unitCode, moNo: moNumber});
            await transManager.getRepository(OpSequenceOpgEntity).delete({opSeqRefId: In(refIds)});
            await transManager.getRepository(OpSequenceOpsEntity).delete({opSeqRefId: In(refIds)});
            await transManager.completeTransaction();
            return new GlobalResponseObject(true, 0, 'Op sequence refs deleted successfully');
        } catch (error) {
            await transManager.releaseTransaction();
            throw error;
        }
    }

}
