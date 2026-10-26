import {
  IsEmail,
  IsNotEmpty,
  IsString,
  Length,
  MinLength,
} from 'class-validator';

export class CreateCustomerDto {
  @IsString()
  @MinLength(3, { message: 'Name must be at least 3 characters long' })
  name: string;

  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @Length(10, 12, {
    message: 'Contact must be between 10 and 12 characters long',
  })
  contact: string;
}
