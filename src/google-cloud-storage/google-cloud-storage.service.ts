import { Injectable } from '@nestjs/common';
import { CreateGoogleCloudStorageDto } from './dto/create-google-cloud-storage.dto';
import { UpdateGoogleCloudStorageDto } from './dto/update-google-cloud-storage.dto';
import { Storage } from '@google-cloud/storage';
import { StorageService } from '../interface/storage.interface';



@Injectable()
export class GoogleCloudStorageService {

  constructor(){
    console.log('GoogleCloudStorageService initialized');
  }

  
  private storage = new Storage({ keyFilename: 'cloud-bucket-access.json' });
  private bucket = this.storage.bucket('mw-dev-bucket');

  async upload(file: Express.Multer.File,folderName:string): Promise<string> {
    // Generate a unique file name based on the timestamp or use a UUID
    const timestamp = Date.now();
    const uniqueFileName = `${folderName}/${timestamp}_${file.originalname}`;

    // Create a reference to the file in the bucket
    const blob = this.bucket.file(uniqueFileName);

    // Create a write stream to upload the file to Cloud Storage
    const stream = blob.createWriteStream({
      resumable: false,
      contentType: file.mimetype,  // Setting the correct content type based on the file
    });

    return new Promise((resolve, reject) => {
      // Handling errors during the upload process
      stream.on('error', reject);

      // When the file upload finishes, generate a public URL
      stream.on('finish', () => {
        const publicUrl = `https://storage.googleapis.com/${this.bucket.name}/${uniqueFileName}`;
        resolve(publicUrl);  // Return the URL of the uploaded file
      });

      // Write the file data to Cloud Storage
      stream.end(file.buffer);  // Multer stores the file in memory as a buffer
    });
  }

  async delete(fileName: string): Promise<void> {
    await this.bucket.file(fileName).delete();
  }
}
