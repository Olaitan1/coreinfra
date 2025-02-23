import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { IsString, IsDate, IsNotEmpty } from 'class-validator';
import { Type } from 'class-transformer';


export enum CardStatus {
  PENDING = 'pending',
  READY = 'ready',
  REJECTED = 'rejected',
  IN_PROGRESS = 'in-progress',
  ACKNOWLEDGED = 'acknowledged',
}

@Schema({ timestamps: true, toJSON: { virtuals: true } })
export class CardRequest {
  @Prop({ required: true })
  cardType: string;
  
  @Prop({ required: true })
  cardName: string;
  
  @Prop({ required: false })
  description: string;

  @Prop({ required: true })
  expiration: Date;

  @Prop({ required: true })
  binPrefix: string;

  @Prop({ required: true })
  currency: string;
  
  @Prop({ required: true })
  quantity: string;

  @Prop({ required: true })
  branch: string;

  @Prop({ required: true })
  initiator: string;

  @Prop({ required: true, default: CardStatus.PENDING })
  status: CardStatus;

  @Prop({ required: true, unique: true })
  batchNumber: string;
}

export type CardRequestDocument = Document & CardRequest;
export const CardRequestSchema = SchemaFactory.createForClass(CardRequest);
