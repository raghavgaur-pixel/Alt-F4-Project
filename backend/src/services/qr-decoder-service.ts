import jsQRModule from "jsqr";
import sharp from "sharp";
import type { DecodedQrPayload, QrType } from "../types/scan.js";
import { AppError } from "../utils/app-error.js";

const jsQR = jsQRModule as unknown as (
  data: Uint8ClampedArray,
  width: number,
  height: number
) => { data: string } | null;

function detectQrType(content: string): QrType {
  const trimmed = content.trim();

  if (/^https?:\/\//i.test(trimmed)) return "URL";
  if (/^upi:\/\//i.test(trimmed)) return "UPI";
  if (/^WIFI:/i.test(trimmed)) return "WIFI";
  if (/^SMSTO:/i.test(trimmed)) return "SMS";
  if (/^(tel:|\+?[0-9][0-9\s-]{6,})/i.test(trimmed)) return "PHONE";
  if (/^mailto:/i.test(trimmed)) return "EMAIL";
  if (/^BEGIN:VCARD/i.test(trimmed)) return "VCARD";
  if (/^(bitcoin:|ethereum:|solana:|tron:|litecoin:)/i.test(trimmed)) return "CRYPTO_WALLET";
  if (trimmed.length > 0) return "TEXT";

  return "UNKNOWN";
}

export const qrDecoderService = {
  async decode(buffer: Buffer): Promise<DecodedQrPayload> {
    const image = sharp(buffer, { failOn: "none" });
    const { data, info } = await image.ensureAlpha().raw().toBuffer({ resolveWithObject: true });
    const code = jsQR(new Uint8ClampedArray(data), info.width, info.height);

    if (!code?.data) {
      throw new AppError("Unable to decode QR code from the uploaded image", 422);
    }

    return {
      content: code.data,
      qrType: detectQrType(code.data)
    };
  }
};
