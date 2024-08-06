import crypto from "crypto";
import jwtDataModel from "../model/storeDataModel";
import { Request } from "express";

class Secure {
  static _tokens: Array<String> | undefined = undefined;
  static expire_time = 1000 * 60 * 5;

  static tokens(): Array<String> {
    if (this._tokens === undefined) {
      this._tokens = new Array<String>();
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
    const header = {
      alg: "HS256", // Algoritma yang digunakan
      typ: "JWT", // Tipe token
    };

    const payload = {
      user_id,
      iat: Math.floor(Date.now() / 1000), // Issued At (timestamp)
      exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24, // Expires in 24 hours
    } as jwtDataModel;

    // Encoding header dan payload menjadi base64url
    const encodedHeader = btoa(JSON.stringify(header))
      .replace(/\+/g, "-")
      .replace(/\//g, "_")
      .replace(/=+$/, ""); // Hapus padding '='

    const encodedPayload = btoa(JSON.stringify(payload))
      .replace(/\+/g, "-")
      .replace(/\//g, "_")
      .replace(/=+$/, "");

    // Membuat signature dengan SHA256
    const signature = crypto
      .createHmac("sha256", process.env.SECURE_KEY!)
      .update(encodedHeader + "." + encodedPayload)
      .digest("base64");

    // Menggabungkan header, payload, dan signature
    const token = `${encodedHeader}.${encodedPayload}.${signature}`;

    return token;
  }

  private static cleanupTokens() {
    const now = Math.floor(Date.now() / 1000);
    this.tokens().forEach((token, index) => {
      const payload = token.split(".")[1];
      const data: jwtDataModel = JSON.parse(atob(payload));
      if (data.exp < now) {
        this.tokens().splice(index, 1);
      }
    });
  }

  static validateToken(token: string): boolean {
    const parts = token.split(".");
    if (parts.length !== 3) {
      return false;
    }

    const header = parts[0];
    const payload = parts[1];
    const signature = parts[2];

    if (!header || !payload || !signature) {
      return false;
    }

    if (header.length === 0 || payload.length === 0 || signature.length === 0) {
      return false;
    }

    return false;
  }

  static verifyToken(token: string): boolean {
    if (!this.validateToken(token)) {
      return false;
    }

    const payload = token.split(".")[1];
    const data: jwtDataModel = JSON.parse(atob(payload));
    if (data.exp < Math.floor(Date.now() / 1000)) {
      return false;
    }

    const signature = crypto
      .createHmac("sha256", process.env.SECURE_KEY!)
      .update(token.split(".")[0] + "." + payload)
      .digest("base64");

    if (signature !== token.split(".")[2]) {
      return false;
    }

    return true;
  }

  static revalidateToken(token: string): string {
    if (!this.verifyToken(token)) {
      return token;
    }

    const payload = token.split(".")[1];
    const data: jwtDataModel = JSON.parse(atob(payload));
    data.exp = Math.floor(Date.now() / 1000) + 60 * 60 * 24;

    const encodedPayload = btoa(JSON.stringify(data))
      .replace(/\+/g, "-")
      .replace(/\//g, "_")
      .replace(/=+$/, "");

    const signature = crypto
      .createHmac("sha256", process.env.SECURE_KEY!)
      .update(token.split(".")[0] + "." + encodedPayload)
      .digest("base64");

    return `${token.split(".")[0]}.${encodedPayload}.${signature}`;
  }

  static extractToken(req: Request): string | null {
    const token = req.headers.authorization || req.cookies?.token || null;
    return token;
  }

  static getUserID(token: string): number | undefined {
    const payload = token.split(".")[1];
    const data: jwtDataModel = JSON.parse(atob(payload));
    return data.user_id;
  }
}

export default Secure;
