import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export enum UserRole {
  Buyer = 'buyer',
  Admin = 'admin',
  RootUser = 'root-user'
}
@Schema()
export class User extends Document {
  @Prop({
    required: false,
    unique: true,
    sparse: true,
  })
  googleId: string;

  @Prop({ required: true, unique: true, index: true })
  email: string;

  @Prop({ required: false })
  userName: string;

  @Prop({ required: false })
  photoUrl: string;

  @Prop()
  title: string;

  @Prop()
  firstName: string;

  @Prop()
  lastName: string;

  @Prop()
  middleName: string;

  @Prop()
  phoneNumber: string;

  @Prop()
  password: string;

  @Prop()
  otp: string;

  @Prop()
  otpExpires: string;

  @Prop()
  emailVerified: boolean;

  @Prop({
    type: String,
    enum: UserRole,
    required: true,
  })
  role: UserRole;
}

export const UserSchema = SchemaFactory.createForClass(User);
UserSchema.post('init', async function () {
  const indexes = await this.collection.indexes();
  const indexExists = indexes.some((index) => index.name === 'googleId');
  if (!indexExists) {
    await this.collection.createIndex(
      { googleId: 1 },
      {
        unique: true,
        partialFilterExpression: { googleId: { $exists: true } },
        name: 'googleId',
      },
    );
  }
});
