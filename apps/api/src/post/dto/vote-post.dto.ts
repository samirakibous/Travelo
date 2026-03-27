import { ApiProperty } from '@nestjs/swagger';
import { IsIn } from 'class-validator';

export class VotePostDto {
  @ApiProperty({ enum: ['up', 'down'], description: 'Type de vote' })
  @IsIn(['up', 'down'])
  type!: 'up' | 'down';
}
