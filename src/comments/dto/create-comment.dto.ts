import { IsNotEmpty, IsNumber } from 'class-validator';

export class CreateCommentDto {
  @IsNumber()
  newsId: number;

  @IsNotEmpty()
  content: string;
}
