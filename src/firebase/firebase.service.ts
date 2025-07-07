import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as admin from 'firebase-admin';


@Injectable()
export class FirebaseService {

    constructor(private configService:ConfigService){

    }
   onModuleInit() {
    try {
      if (!admin.apps.length) {
        admin.initializeApp({
          credential: admin.credential.cert({
            projectId: this.configService.get<string>('FIREBASE_PROJECT_ID'),
            clientEmail: this.configService.get<string>('FIREBASE_CLIENT_EMAIL'),
            privateKey: this.configService.get<string>('FIREBASE_PRIVATE_KEY')?.replace(/\\n/g, '\n'),
          }),
        });
        console.log('✅ Firebase Admin initialized successfully');
      } else {
        console.warn('⚠️ Firebase Admin was already initialized');
      }
    } catch (error) {
      console.error('❌ Firebase Admin initialization failed:', error.message);
    }
  }

    async verifyToken(idToken: string) {
    return await admin.auth().verifyIdToken(idToken);
  }

   getAuth() {
    return admin.auth();
  }

}
