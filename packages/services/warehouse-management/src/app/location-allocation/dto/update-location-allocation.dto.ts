import { PartialType } from '@nestjs/mapped-types';
import { CreateLocationAllocationDto } from './create-location-allocation.dto';

export class UpdateLocationAllocationDto extends PartialType(CreateLocationAllocationDto) {}
