import { BadRequestException, Injectable } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';
import * as Handlebars from 'handlebars';
import * as puppeteer from 'puppeteer';
import { OrdersService } from 'src/order/orders/orders.service';
import { PaymentStatus } from 'src/enum/payment-status.enum';
import { EodClosure } from 'src/eod-closure/entities/eod-closure.entity';
import { EodClosureService } from 'src/eod-closure/eod-closure.service';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class PdfGenerationService {

  constructor(private readonly orderService: OrdersService, private readonly eodClosureService: EodClosureService,
    @InjectRepository(EodClosure) private readonly eodClosureRepo: Repository<EodClosure>
  ) {

  }
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

  async generateOrderReportPDF(payload: any): Promise<Buffer> {

    const { startDate, endDate, selectedOrderItemKeys, selectedOrderKeys, selectedReturnKeys, selectedReturnItemKeys } = payload;
    const { orders, returns, ...rest } = await this.orderService.orderReport({ paymentStatus: PaymentStatus.PAID, startDate, endDate })
    const templatePath = path.join(process.cwd(), 'src', 'pdf-generation', 'templates', 'order-report.hbs');
    const html = fs.readFileSync(templatePath, 'utf8');
    const template = Handlebars.compile(html);

    const firstItem = orders[0]?.items?.[0];

    // const itemKeys = firstItem ? Object.keys(firstItem) : [];
    const selectedOrderKeyList: Array<string> = selectedOrderKeys;
    const selectedOrderItemKeyList: Array<string> = selectedOrderItemKeys;
    const selectedReturnKeyList: Array<string> = selectedReturnKeys;
    const selectedReturnItemKeyList: Array<string> = selectedReturnItemKeys;

    // Utility to chunk array
    function chunkArray<T>(arr: T[], size: number): T[][] {
      const result: T[][] = [];
      for (let i = 0; i < arr.length; i += size) {
        result.push(arr.slice(i, i + size));
      }
      return result;
    }

    const chunkSize = 7; // Number of columns per table

    const data = {
      ...rest,
      orders: orders.map((order) => ({
        keyValues: selectedOrderKeyList.map((key) => [transformKey(key), order[key]]),
        itemChunks: chunkArray(selectedOrderItemKeyList, chunkSize).map((keys) => ({
          keys: keys.map((key) => ({
            key,
            label: transformKey(key)
          })),
          items: (order.items || []).map((item) =>
            keys.reduce((obj, key) => {
              obj[key] = item[key];
              return obj;
            }, {})
          ),
        })),
      })),
      returns: returns.map((ret) => ({
        keyValues: selectedReturnKeyList.map((key) => [transformKey(key), ret[key]]),
        itemChunks: chunkArray(selectedReturnItemKeyList, chunkSize).map((keys) => ({
          keys: keys.map((key) => ({
            key,
            label: transformKey(key)
          })),
          items: (ret.items || []).map((item) =>
            keys.reduce((obj, key) => {
              obj[key] = item[key];
              return obj;
            }, {})
          ),
        })),
      })),
    };

    console.log(data);


    function transformKey(key: string): string {
      return key
        .replace(/([A-Z])/g, ' $1') // insert space before capital letters
        .replace(/^./, (str) => str.toUpperCase()); // capitalize first letter
    }


    // throw new BadRequestException(data)

    const compiledHtml = template(data);

    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();

    await page.setContent(compiledHtml, { waitUntil: 'networkidle0' });

    const pdfBuffer = await page.pdf({
      format: 'A4',
      printBackground: true,
    });

    await browser.close();
    return Buffer.from(pdfBuffer);
  }



  async generateEodReportPdf(date: string) {

    const reportDate = new Date(date);
    const templatePath = path.join(process.cwd(), 'src', 'pdf-generation', 'templates', 'eod-report.hbs');
    const html = fs.readFileSync(templatePath, 'utf8');
    const template = Handlebars.compile(html);

    const closure = await this.eodClosureRepo.findOne({
      where: {
        closureDate: reportDate,
      }
    });

    if (!closure) {
      throw new BadRequestException('Cannot download report for the date without closure');
    }

    const data = await this.eodClosureService.generateEodReport(date);
    const compiledHtml = template(data);

    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();

    await page.setContent(compiledHtml, { waitUntil: 'networkidle0' });

    const pdfBuffer = await page.pdf({
      format: 'A4',
      printBackground: true,
    });

    await browser.close();
    return Buffer.from(pdfBuffer);
  }


  async generateInvoice(orderId: number): Promise<Buffer> {

    const templatePath = path.join(process.cwd(), 'src', 'pdf-generation', 'templates', 'order-invoice.hbs');
    const html = fs.readFileSync(templatePath, 'utf8');
    const template = Handlebars.compile(html);

    const order = await this.orderService.findById(orderId);

    if (!order) {
      throw new BadRequestException('No order Found');
    }
    const data = {
      orderId: order.id,
      billingName: order.billingFirstName + ' ' + order.billingLastName,
      billingAddress: order.fullBillingAddress,
      billingEmail: order.billingEmailId,
      billingPhone: order.billingPhoneNumber,
      shippingName: order.shippingFirstName + ' ' + order.shippingLastName,
      shippingAddress: order.fullShippingAddress,
      shippingEmail: order.shippingEmailId,
      shippingPhone: order.shippingPhoneNumber,

      items: order.items.map(item => ({
        name: item.productVariant.product.name,               // or item.productName / item.title
        quantity: item.quantity,
        price: item.subTotal,         // per item price
        tax: item.totalTaxAmount,
        total: item.totalAmount
      })),
      subTotal: order.subTotal,
      deliveryCharge: order.deliveryCharge,
      totalTax: order.totalTax,
      totalAmount: order.totalAmount,
    }

    const compiledHtml = template(data);

    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();

    await page.setContent(compiledHtml, { waitUntil: 'networkidle0' });

    const pdfBuffer = await page.pdf({
      format: 'A4',
      printBackground: true,
    });

    await browser.close();
    return Buffer.from(pdfBuffer);
  }

}
