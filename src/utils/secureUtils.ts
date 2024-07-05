import crypto from "crypto";
import storeDataModel from "../model/storeDataModel";
import { Request } from "express";

class Secure {
  static _tokens: Map<string, storeDataModel> | undefined = undefined;
  static expire_time = 1000 * 60 * 5;

  static tokens(): Map<string, storeDataModel> {
    if (this._tokens === undefined) {
      this._tokens = new Map<string, storeDataModel>();
    }

    return this._tokens;
  }

  static hashPassword(password: string): string {
    const hash = crypto.createHash("sha256");
    hash.update(password);
    return hash.digest("hex");
  }

  static encrypt(text: string, key: string = process.env.SECURE_KEY!): string {
    const cipher = crypto.createCipheriv("aes-256-cbc", key, key);
    let encrypted = cipher.update(text, "utf8", "hex");
    encrypted += cipher.final("hex");
    return encrypted;
  }

  static decrypt(text: string, key: string = process.env.SECURE_KEY!): string {
    const decipher = crypto.createDecipheriv("aes-256-cbc", key, key);
    let decrypted = decipher.update(text, "hex", "utf8");
    decrypted += decipher.final("utf8");
    return decrypted;
  }

  static generateToken(user_id: number): string {
    this.cleanupTokens();
    const token = crypto.randomBytes(32).toString("hex");
    this.tokens().set(token, { create_at: new Date(), user_id });
    return token;
  }

  private static cleanupTokens() {
    for (const [key, value] of this.tokens()) {
      const now = new Date();
      const diff = now.getTime() - value.create_at.getTime();
      if (diff > Secure.expire_time) {
        this.tokens().delete(key);
      }
    }
  }

  static validateToken(token: string): boolean {
    if (this.tokens().has(token)) {
      const date = this.tokens().get(token);
      if (date) {
        const now = new Date();
        const diff = now.getTime() - date.create_at.getTime();
        if (diff < Secure.expire_time) {
          return true;
        } else {
          this.tokens().delete(token);
        }
      }
    }

    return false;
  }

  static extractToken(req: Request): string | null {
    const token = req.headers.authorization || req.cookies?.token || null;
    return token;
  }

  static getUserID(token: string): number | undefined {
    if (this.tokens().has(token)) {
      const date = this.tokens().get(token);
      if (date) {
        return date.user_id;
      }
    }

    return undefined;
  }
}

export default Secure;
