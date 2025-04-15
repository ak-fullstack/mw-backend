export interface StorageService {
    upload(file: Express.Multer.File): Promise<string>; // returns public URL
    delete(fileName: string): Promise<void>;
  }