import { IsIn } from 'class-validator';

export class VotePostDto {
  @IsIn(['up', 'down'])
  type!: 'up' | 'down';
}
