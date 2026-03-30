import bcrypt from "bcryptjs";
import { StatusCodes } from "http-status-codes";
import { AppError } from "../../errorHelpers/AppError";
import {
  createAccessTokenWithRefreshToken,
  createUserToken,
} from "../../utils/userToken";
import { IUser, UserStatus } from "../user/user.interface";
import { User } from "../user/user.model";

export const AuthServices = {
  createUser: async (payload: Partial<IUser>) => {
    const isUserExist = await User.findOne({ email: payload.email });
    if (isUserExist) {
      throw new AppError(
        StatusCodes.CONFLICT,
        "User already exists with this email",
      );
    }

    const userData: Partial<IUser> = {
      ...payload,
      status: UserStatus.ACTIVE,
      providers: [
        {
          provider: "credentials",
          providerId: payload.email as string,
        },
      ],
    };

    const newUser = await User.create(userData);

    if (!newUser) {
      throw new AppError(StatusCodes.BAD_REQUEST, "Failed to create user");
    }

    const createdUser = newUser;

    const result = createdUser.toObject();
    delete result.password;

    return result;
  },

  credentialsLogin: async (payload: Partial<IUser>) => {
    const { email, password } = payload;

    const isUserExist = await User.findOne({ email });

    if (!isUserExist) {
      throw new AppError(StatusCodes.NOT_FOUND, "User not found");
    }

    const isPasswordMatch = await bcrypt.compare(
      password as string,
      isUserExist?.password as string,
    );

    if (!isPasswordMatch) {
      throw new AppError(StatusCodes.UNAUTHORIZED, "Incorrect password");
    }

    const { accessToken, refreshToken } = createUserToken(isUserExist);

    return {
      accessToken,
      refreshToken,
      user: {
        _id: isUserExist._id,
        name: isUserExist.name,
        email: isUserExist.email,
        role: isUserExist.role,
      },
    };
  },

  getMe: async (userId: string, role: string) => {
    // ১. ইউজারকে খুঁজে বের করা
    const user = await User.findById(userId);

    if (!user) {
      throw new AppError(StatusCodes.NOT_FOUND, "User not found!");
    }

    if (user.role !== role) {
      throw new AppError(StatusCodes.UNAUTHORIZED, "Role mismatch!");
    }

    return user;
  },

  getNewAccessToken: async (refreshToken: string) => {
    // Logic to verify the refresh token and generate a new access token
    if (!refreshToken) {
      throw new AppError(
        StatusCodes.BAD_REQUEST,
        "You haven't any refresh token",
      );
    }

    const newAccessToken =
      await createAccessTokenWithRefreshToken(refreshToken);
    return {
      accessToken: newAccessToken,
    };
  },
};
