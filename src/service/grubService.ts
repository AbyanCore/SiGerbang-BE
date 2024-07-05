import { db } from "../database/db";
import { randomUUID } from "crypto";
import Secure from "../utils/secureUtils";

class grubService {
  static async isOwnerGrubByUserId(uuid: string, user_id: number) {
    const grub = await db.grub.findFirst({
      where: { uuid: uuid, author: user_id },
    });
    return grub != null;
  }

  static async isOwnerGrubByToken(uuid: string, token: string) {
    const user_id = parseInt(Secure.getUserID(token)?.toString()!);
    return await this.isOwnerGrubByUserId(uuid, user_id);
  }

  static async isGrubExist(uuid: string) {
    return (await this.getGrubByUuid(uuid)) != null;
  }

  static async getGrubByUuid(uuid: string) {
    return await db.grub.findFirst({ where: { uuid: uuid } });
  }

  static async getGrubs() {
    return await db.grub.findMany();
  }

  static async createGrub(data: any) {
    return await db.grub.create({
      data: {
        uuid: randomUUID(),
        ...data,
      },
    });
  }

  static async updateGrub(uuid: string, data: any) {
    return await db.grub.update({
      where: { uuid: uuid },
      data: data,
    });
  }

  static async deleteGrub(uuid: string) {
    return db.grub.delete({ where: { uuid: uuid } });
  }
}

export default grubService;
