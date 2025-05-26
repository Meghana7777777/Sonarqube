import { FgContainerLocationStatusEnum } from "@xpparel/shared-models";


export class ContainerPackListCartonsQueryResponse {
    pack_list_id: number;
    item_lines_id: number;
    status: FgContainerLocationStatusEnum;
}