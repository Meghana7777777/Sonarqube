import { PartialType } from '@nestjs/mapped-types';
import { CreatePackingListDto } from './create-packing-list.dto';

export class UpdatePackingListDto extends PartialType(CreatePackingListDto) {}
