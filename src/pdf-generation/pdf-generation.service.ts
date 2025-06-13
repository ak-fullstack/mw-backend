import { Injectable } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';
import * as Handlebars from 'handlebars';
import * as puppeteer from 'puppeteer';

@Injectable()
export class PdfGenerationService {

  async generatePdf(data: { name: string; link: string }): Promise<Buffer> {
  const templatePath = path.join(process.cwd(), 'src', 'pdf-generation', 'templates', 'sample.html');
  const templateHtml = fs.readFileSync(templatePath, 'utf8');
  const template = Handlebars.compile(templateHtml);
  const finalHtml = template(data);

  const browser = await puppeteer.launch({
    headless: true, // use 'true' instead of 'new' for simplicity
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });

  const page = await browser.newPage();
  await page.setContent(finalHtml, { waitUntil: 'networkidle0' });

  const pdfBuffer = await page.pdf({
    format: 'A4',
    printBackground: true,
  });

  await browser.close();
  return Buffer.from(pdfBuffer);
}
}
