import { IsString, IsNotEmpty, IsInt, Min, Max, IsOptional } from 'class-validator';

export default class CreateReviewDto {
  @IsOptional()
  @IsNotEmpty()
  @IsString()
  feedback: string;

  @IsNotEmpty()
  @IsInt()
  @Min(1)
  @Max(5)
  rating: number;
}
