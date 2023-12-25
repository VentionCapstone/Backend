import { IsString, IsInt, Min, Max, IsOptional } from 'class-validator';

export default class UpdateReviewDto {
  @IsOptional()
  @IsString()
  feedback: string;

  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(5)
  rating: number;
}
