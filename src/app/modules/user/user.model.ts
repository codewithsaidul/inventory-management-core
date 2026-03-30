import { Schema, model } from "mongoose";
import {
  IAuthProvider,
  IUser,
  UserModel,
  UserRole,
  UserStatus,
} from "./user.interface";

const authProviderSchema = new Schema<IAuthProvider>(
  {
    provider: { type: String, required: true },
    providerId: { type: String, required: true },
  },
  {
    versionKey: false,
    _id: false,
  },
);

const userSchema = new Schema<IUser, UserModel>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, select: 0 },

    providers: [authProviderSchema],

    role: {
      type: String,
      enum: [...Object.values(UserRole)],
      default: UserRole.USER,
    },
    status: {
      type: String,
      enum: [...Object.values(UserStatus)],
      default: UserStatus.PENDING,
    },

    isDeleted: { type: Boolean, default: false },
  },
  { timestamps: true, versionKey: false },
);

userSchema.statics.isUserExistsByEmail = async function (email: string) {
  return await User.findOne({ email }).select("+password");
};

export const User = model<IUser, UserModel>("User", userSchema);
