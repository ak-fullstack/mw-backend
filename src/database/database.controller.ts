import { Controller, Get, Res, UseGuards } from '@nestjs/common';
import { DatabaseService } from './database.service';
import { Response } from 'express';
import { JwtAuthGuard } from 'src/guards/jwt-auth.guard';
import { PermissionsGuard } from 'src/guards/permissions.guard';


@Controller('database')
export class DatabaseController {
  constructor(private readonly databaseService: DatabaseService) {}

    @Get('backup-stream')
    @UseGuards(JwtAuthGuard,PermissionsGuard)
  streamBackup(@Res() res: Response) {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const fileName = `db-backup-${timestamp}.sql.gz`;

    res.setHeader('Content-Disposition', `attachment; filename="${fileName}"`);
    res.setHeader('Content-Type', 'application/gzip');

    const stream = this.databaseService.streamBackupGz();

    stream.pipe(res).on('error', (err) => {
      console.error('Backup stream error:', err);
      if (!res.headersSent) {
        res.status(500).send('Backup failed');
      } else {
        res.end();
      }
    });
  }
}
