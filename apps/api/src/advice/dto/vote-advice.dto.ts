import { IsIn } from 'class-validator';

export class VoteAdviceDto {
  @IsIn(['useful', 'not_useful'])
  type!: 'useful' | 'not_useful';
}
