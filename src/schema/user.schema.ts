import { Prop, SchemaFactory, Schema } from '@nestjs/mongoose';
import { Address } from 'cluster';
import { HydratedDocument, Types } from 'mongoose';
import { Role } from 'src/common/enums/role.enum';
import * as bcrypt from 'bcryptjs';

export type UserDocument = HydratedDocument<User>;

@Schema({ timestamps: true })
export class User {
  @Prop({ type: String, trim: true, required: true })
  fname: string;

  @Prop({ type: String, trim: true, required: true })
  lname: string;

  @Prop({ required: true, unique: true, lowercase: true })
  email: string;

  @Prop({ unique: true, required: true })
  phone: string;

  @Prop()
  image: string;

  @Prop({ type: String, minlength: 6 })
  password: string;

  @Prop()
  passwordChangedAt: Date;

  @Prop()
  passwordResetCode: string;

  @Prop()
  passwordResetExpires: Date;

  @Prop()
  passwordResetVerified: boolean;

  @Prop({ default: 'user' })
  role: Role;

  @Prop({ type: Boolean, default: true })
  active: boolean;

  @Prop({ type: [{ type: Types.ObjectId, ref: 'Product' }], default: [] })
  wishlist: Types.ObjectId[];

  @Prop({
    type: {
      id: { type: Types.ObjectId },
      alias: String,
      details: String,
      phone: String,
      city: String,
      postalCode: String,
    },
    default: [],
  })
  addresses: Address[];

  @Prop({ type: Date, default: Date.now() })
  createdAt: Date;
}

export const UserSchema = SchemaFactory.createForClass(User);

UserSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});
