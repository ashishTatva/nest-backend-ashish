import { IsString, IsBoolean, IsOptional } from 'class-validator';

export class CreateRentalDto {
  @IsString()
  bookId: string;

  @IsOptional()
  @IsBoolean()
  isSubmit?: boolean;
}
