import { ApiProperty } from '@nestjs/swagger';
import { IsIn } from 'class-validator';

export class VoteAdviceDto {
  @ApiProperty({
    enum: ['useful', 'not_useful'],
    description: "Vote sur l'utilité du conseil",
  })
  @IsIn(['useful', 'not_useful'])
  type!: 'useful' | 'not_useful';
}
