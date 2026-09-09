import { IsNotEmpty, IsNumber, IsString, Min } from 'class-validator';

export class CreateItemDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsNumber({ maxDecimalPlaces: 2 })
  @IsNotEmpty()
  @Min(0, { message: 'Price must be greater than or equal to 0' })
  price: number;

  @IsNumber()
  @IsNotEmpty()
  @Min(0, { message: 'Quantity must be greater than or equal to 0' })
  quantity: number;
}
