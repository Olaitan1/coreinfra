import {
  IsEnum,
  IsNumber,
  IsString,
  IsNotEmpty,
  IsDate,
  IsOptional,
} from 'class-validator';
import { Type } from 'class-transformer';
import { CardStatus } from '../../schemas/card-request.schema';

export class CreateCardRequestDto {
  @IsString()
  @IsNotEmpty()
  cardName: string;

  @IsString()
  @IsNotEmpty()
  cardType: string;

  @IsString()
  @IsNotEmpty()
  binPrefix: string;

  @IsString()
  @IsNotEmpty()
  currency: string;

  @IsString()
  @IsNotEmpty()
  branch: string;

  @IsNumber()
  @IsNotEmpty()
  quantity: number;

  @IsNumber()
  @IsNotEmpty()
  expiration: number;

  @IsNotEmpty()
  description: string;
}

export class UpdateCardRequestDto {
  @IsEnum(CardStatus)
  @IsNotEmpty()
  status: CardStatus;
}

export class FilterCardsDto {
  @IsOptional()
  @IsEnum(CardStatus)
  status?: CardStatus;

  @IsOptional()
  @IsString()
  branch?: string;
  
  @IsOptional()
  @IsString()
  batch?: string;

  @IsOptional()
  @Type(() => Date)
  @IsDate()
  startDate?: Date;

  @IsOptional()
  @Type(() => Date)
  @IsDate()
  endDate?: Date;
}
