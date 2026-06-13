declare module "multer" {
  import type { RequestHandler } from "express";

  export interface MulterFile {
    fieldname: string;
    originalname: string;
    encoding: string;
    mimetype: string;
    size: number;
    buffer: Buffer;
  }

  export interface MulterOptions {
    storage?: StorageEngine;
    limits?: {
      fileSize?: number;
    };
  }

  export interface StorageEngine {}

  export interface MulterInstance {
    single(fieldName: string): RequestHandler;
  }

  export function memoryStorage(): StorageEngine;

  export default function multer(options?: MulterOptions): MulterInstance;
}

declare global {
  namespace Express {
    namespace Multer {
      interface File {
        fieldname: string;
        originalname: string;
        encoding: string;
        mimetype: string;
        size: number;
        buffer: Buffer;
      }
    }

    interface Request {
      file?: Multer.File;
    }
  }
}

export {};
