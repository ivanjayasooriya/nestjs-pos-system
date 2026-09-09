import { IsNotEmpty, IsNumber, Min } from 'class-validator';

export class CreateOrderItemDto {
  @IsNotEmpty()
  @IsNumber()
  itemId: number;

  @IsNotEmpty()
  @IsNumber()
  @Min(1, { message: 'Quantity must be greater than or equal to 1' })
  quantity: number;
}
