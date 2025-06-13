import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { createCanvas } from 'canvas';
import * as QRCode from 'qrcode'; // Correct import for 'qrcode' library




@Injectable()
export class QrCodeService {

  async generateQrWithText(text: string): Promise<Buffer> {
    const qrCanvas = createCanvas(300, 300);
    await QRCode.toCanvas(qrCanvas, text, {
      errorCorrectionLevel: 'H',
      margin: 1,
      width: 300,
    });

    const canvasWithText = createCanvas(300, 340); // Extra height for text
    const ctx = canvasWithText.getContext('2d');

    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(0, 0, canvasWithText.width, canvasWithText.height);

    // Draw QR code
    ctx.drawImage(qrCanvas, 0, 0);

    // Draw text
    ctx.font = 'bold 25px Arial'; // 👈 bold + larger size
    ctx.fillStyle = '#000000';
    ctx.textAlign = 'center';
    ctx.fillText('# ' + text, 150, 325); // Centered under QR

    return canvasWithText.toBuffer('image/png');
  }

}
