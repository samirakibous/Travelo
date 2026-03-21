import { IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class ReportPostDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(300)
  reason!: string;
}
