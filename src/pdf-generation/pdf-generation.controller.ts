import { Controller, Get, Post, Body, Patch, Param, Delete, Res } from '@nestjs/common';
import { PdfGenerationService } from './pdf-generation.service';
import { Response } from 'express';
import { OrderReportDto } from './dto/order-report.dto';

@Controller('pdf-generation')
export class PdfGenerationController {
  constructor(private readonly pdfGenerationService: PdfGenerationService) { }

  // @Post()
  // async generatePdf(
  //   @Body() body: { name: string; link: string },
  //   @Res() res: Response,
  // ) {
  //   const buffer = await this.pdfGenerationService.generatePdf(body);
  //   res.set({
  //     'Content-Type': 'application/pdf',
  //     // 'Content-Disposition': 'inline; filename=document.pdf',
  //     'Content-Disposition': 'attachment; filename="document.pdf"',
  //     'Content-Length': buffer.length,
  //   });
  //   res.send(buffer);
  // }

  @Post('order-report')
  async generateOrderReport(
    @Body() body: OrderReportDto,
    @Res() res: Response,
  ) {
    const buffer = await this.pdfGenerationService.generateOrderReportPDF(body);
    res.set({
      'Content-Type': 'application/pdf',
      // 'Content-Disposition': 'inline; filename=document.pdf',
      'Content-Disposition': 'attachment; filename="report.pdf"',
      'Content-Length': buffer.length,
    });
    res.send(buffer);
  }

  @Post('eod-report')
  async generateEodReport(
    @Res() res: Response,
  ) {
    const buffer = await this.pdfGenerationService.generateEodReportPdf();
    res.set({
      'Content-Type': 'application/pdf',
      // 'Content-Disposition': 'inline; filename=document.pdf',
      'Content-Disposition': 'attachment; filename="report.pdf"',
      'Content-Length': buffer.length,
    });
    res.send(buffer);
  }
}
