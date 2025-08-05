import { Injectable } from '@nestjs/common';
import { spawn } from 'child_process';
import * as zlib from 'zlib';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class DatabaseService {

  constructor(private readonly configService: ConfigService) { }

  streamBackupGz(): NodeJS.ReadableStream {
    const host = this.configService.get<string>('DB_HOST') || 'localhost';
    const user = this.configService.get<string>('DB_USER') || 'root';
    const password = this.configService.get<string>('DB_PASSWORD') || '';
    const database = this.configService.get<string>('DB_NAME') || '';

    // Spawn mysqldump
    const dumpProcess = spawn('mysqldump', [
      '-h', host,
      '-u', user,
      `-p${password}`,
      '--routines',
      '--events',
      '--triggers',
      database,
    ]);

    // Pipe through gzip (Node API)
    const gzip = zlib.createGzip();

    // Final stream: mysqldump → gzip
    return dumpProcess.stdout.pipe(gzip);
  }
}
