import { db } from "../database/db";
import Secure from "../utils/secureUtils";
import userService from "./userService";

class usergrubService {
  static async isUserInGrubByUserId(uuid: string, user_id: number) {
    return (
      (await db.grub_user.findFirst({
        where: {
          user_id: user_id,
          grub_id: uuid,
        },
      })) != null
    );
  }

  static async isUserInGrubByUserToken(uuid: string, token: string) {
    const user_id = parseInt(Secure.getUserID(token)?.toString()!);
    return this.isUserInGrubByUserId(uuid, user_id);
  }

  static async getUsersInGrub(uuid: string) {
    return await db.grub_user.findMany({
      where: {
        grub_id: uuid,
      },
      include: { user: true },
    });
  }

  static async getUserInGrub(uuid: string, user_id: number) {
    return await userService.getUserById(
      (
        await db.grub_user.findFirst({
          where: {
            grub_id: uuid,
            user_id: user_id,
          },
        })
      )?.user_id!
    );
  }

  static async addUserToGrub(uuid: string, user_id: number) {
    return await db.grub_user.create({
      data: {
        grub_id: uuid,
        user_id: user_id,
        user_role: "member",
      },
    });
  }

  static async updateUserRoleInGrub(
    uuid: string,
    user_id: number,
    role: "member" | "admin"
  ) {
    return await db.grub_user.update({
      where: {
        id: (await this.getUserInGrub(uuid, user_id))?.id,
      },
      data: {
        user_role: role,
      },
    });
  }

  static async removeUserFromGrub(uuid: string, user_id: number) {
    return await db.grub_user.delete({
      where: {
        id: (await this.getUserInGrub(uuid, user_id))?.id,
      },
    });
  }
}

export default usergrubService;
