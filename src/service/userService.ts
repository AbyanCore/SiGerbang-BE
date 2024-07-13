import { db } from "../database/db";
import Secure from "../utils/secureUtils";

class userService {
  static async isUserExist(id: number) {
    return (await this.getUserById(id)) != null;
  }

  static async isUserExistByEmail(email: string) {
    return (await db.user.findFirst({ where: { email } })) != null;
  }

  static async getUsers() {
    return await db.user.findMany();
  }

  static async getUserById(id: number) {
    return await db.user.findFirst({ where: { id } });
  }

  static async getUserByToken(token: string) {
    return await this.getUserById(Secure.getUserID(token)!);
  }

  static async createUser(data: any) {
    return await db.user.create({
      data: {
        password: Secure.hashPassword(data.password),
        ...data,
      },
    });
  }

  static async updateUser(id: number, data: any) {
    return await db.user.update({
      where: { id },
      data: {
        password: Secure.hashPassword(data.password),
        ...data,
      },
    });
  }

  static async deleteUser(id: number) {
    return db.user.delete({ where: { id } });
  }
}

export default userService;
