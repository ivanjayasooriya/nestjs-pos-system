import { IsNotEmpty, IsNumber, ValidateNested } from 'class-validator';
import { CreateOrderItemDto } from './create-order-item.dto';
import { Type } from 'class-transformer';

export class CreateOrderDto {
  @IsNotEmpty()
  @IsNumber()
  customerId: number;

  @IsNotEmpty()
  @ValidateNested({ each: true })
  @Type(() => CreateOrderItemDto)
  items: CreateOrderItemDto[];
}
