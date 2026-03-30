/* eslint-disable no-console */
import { envVars } from "../config/env";
import {
  IAuthProvider,
  IUser,
  UserRole,
  UserStatus,
} from "../modules/user/user.interface";
import { User } from "../modules/user/user.model";

export const seedSuperAdmin = async () => {
  try {
    const isSuperAdminExist = await User.findOne({ role: UserRole.SUPERADMIN });

    if (isSuperAdminExist) {
      console.log("Super Admin already exists.");
      return null;
    }

    const authProvider: IAuthProvider = {
      provider: "credentials",
      providerId: envVars.SUPER_ADMIN_EMAIL,
    };

    const superAdminInfo: IUser = {
      name: "Inventory Management - Super Admin",
      email: envVars.SUPER_ADMIN_EMAIL,
      password: process.env.SUPER_ADMIN_PASSWORD as string,
      role: UserRole.SUPERADMIN,
      status: UserStatus.ACTIVE,
      providers: [authProvider],
      isDeleted: false,
    };

    await User.create(superAdminInfo);

    console.log("Super Admin seeded successfully.");
  } catch (error) {
    console.log(error);
  }
};
