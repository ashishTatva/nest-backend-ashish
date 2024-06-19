import {
  IsInt,
  IsOptional,
  IsArray,
  ValidateNested,
  IsString,
} from 'class-validator';
import { Type } from 'class-transformer';

class SortModelDto {
  @IsString()
  field: string;

  @IsString()
  sort: string;
}

export class PaginationDto {
  @IsInt()
  page: number;

  @IsInt()
  pageSize: number;

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => SortModelDto)
  sortModel?: SortModelDto[];
}
