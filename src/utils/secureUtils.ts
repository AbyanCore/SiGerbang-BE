import crypto from "crypto";

class Secure {
  static _tokens: Map<string, Date> | undefined = undefined;
  static expire_time = 1000 * 60;

  static tokens(): Map<string, Date> {
    if (this._tokens === undefined) {
      this._tokens = new Map<string, Date>();
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

  static generateToken(): string {
    this.cleanupTokens();
    const token = crypto.randomBytes(32).toString("hex");
    this.tokens().set(token, new Date());
    return token;
  }

  private static cleanupTokens() {
    for (const [key, value] of this.tokens()) {
      const now = new Date();
      const diff = now.getTime() - value.getTime();
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
        const diff = now.getTime() - date.getTime();
        if (diff < Secure.expire_time) {
          return true;
        } else {
          this.tokens().delete(token);
        }
      }
    }

    return false;
  }
}

export default Secure;
