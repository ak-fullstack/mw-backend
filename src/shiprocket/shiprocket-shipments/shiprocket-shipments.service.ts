import { BadRequestException, Injectable, InternalServerErrorException, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import axios, { AxiosInstance } from 'axios';
import { log } from 'console';
import { firstValueFrom } from 'rxjs';
import { DateUtil } from 'src/common/utils/dates.util';
import { Order } from 'src/order/orders/entities/order.entity';
import { RedisService } from 'src/redis/redis.service';
import { ShiprocketShipment } from './entities/shiprocket-shipment.entity';
import { EntityManager, Repository } from 'typeorm';
import { ShiprocketStatusLogService } from '../shiprocket-status-log/shiprocket-status-log.service';

@Injectable()
export class ShiprocketShipmentsService {
  private readonly logger = new Logger(ShiprocketShipmentsService.name);
  private token: string | null;
  private axiosInstance: AxiosInstance;


  constructor(
    private readonly configService: ConfigService,
    private readonly redisService: RedisService,
    private readonly shiprocketStatusLogService: ShiprocketStatusLogService,

    @InjectRepository(ShiprocketShipment)
    private readonly shiprocketShipmentRepository: Repository<ShiprocketShipment>,
  ) {
    const baseUrl = this.configService.get<string>('SHIPROCKET_BASE_URL');
    this.axiosInstance = axios.create({
      baseURL: baseUrl,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    this.setupInterceptors();
    // this.getPickupAddress();
    // this.createAdhocOrder(this.orderData);

  }





  private setupInterceptors() {


    this.axiosInstance.interceptors.request.use(
      async (config) => {


        await this.getToken();

        if (!this.token) {
          await this.login(); // auto-login if token not found or expired
        }

        config.headers['Authorization'] = `Bearer ${this.token}`;
        return config;
      },
      (error) => Promise.reject(error),
    );

    this.axiosInstance.interceptors.response.use(
      (response) => response,
      async (error) => {
        if (error.response && error.response.status === 401) {
          this.logger.warn('⚠️ Token expired. Logging in again...');

          await this.login();

          error.config.headers['Authorization'] = `Bearer ${this.token}`;
          return this.axiosInstance.request(error.config); // retry request
        }

        return Promise.reject(error);
      },
    );
  }


  private async login() {
    const email = this.configService.get<string>('SHIPROCKET_API_EMAIL');
    const password = this.configService.get<string>('SHIPROCKET_PASSWORD');
    const baseUrl = this.configService.get<string>('SHIPROCKET_BASE_URL');


    try {

      const bareAxios = axios.create({
        baseURL: baseUrl, // ✅ set base URL
      });

      const response = await bareAxios.post('/auth/login', {
        email,
        password,
      });


      this.logger.log('✅ Shiprocket login successful');
      if (response.data.token) {
        this.redisService.setShiprocketToken(response.data.token);
      }
    } catch (error) {
      this.logger.error('❌ Shiprocket login failed', error.message);
      throw error;
    }
  }

  async getAllOrders() {

    try {
      const response = await this.axiosInstance.get('/orders', {
        headers: {
          Authorization: `Bearer ${this.token}`,
        },
      });
      return response.data;
    } catch (error) {
      this.logger.error('❌ Failed to fetch orders', error.message);
      throw error;
    }
  }

  async getToken() {
    const cachedToken = await this.redisService.getShiprocketToken();

    if (cachedToken) {
      this.logger.log('✅ Using cached Shiprocket token');
      this.token = cachedToken;
      return;
    }
    await this.login();
  }





  async createAdhocOrder(order: Order, manager): Promise<any> {

    const payload = {
      order_id: order.id,
      order_date: DateUtil.convertUTCToISTDateOnly(order.createdAt),
      pickup_location: "Home",
      billing_customer_name: order.billingFirstName,
      billing_last_name: order.billingLastName,
      billing_address: order.billingStreetAddress,
      billing_city: order.billingCity,
      billing_pincode: order.billingPincode,
      billing_state: order.billingState,
      billing_country: order.billingCountry,
      billing_email: order.billingEmailId,
      billing_phone: order.billingPhoneNumber,
      shipping_is_billing: true,
      shipping_customer_name: "",
      shipping_last_name: "",
      shipping_address: "",
      shipping_address_2: "",
      shipping_city: "",
      shipping_pincode: "",
      shipping_country: "",
      shipping_state: "",
      shipping_email: "",
      shipping_phone: "",
      order_items: order.items.map(item => ({
        name: item.productVariant.product.name,
        sku: item.productVariant.sku,
        units: item.quantity,
        selling_price: Number((item.sp + item.itemTaxAmount).toFixed(2)),

      })),
      payment_method: "Prepaid",
      sub_total: Number((order.subTotal + order.totalItemTax).toFixed(2)),
      length: order.packageLength,
      breadth: order.packageBreadth,
      height: order.packageHeight,
      weight: order.packageWeight
    }

    //     {
    //   order_id: 919674013,
    //   channel_order_id: '29',
    //   shipment_id: 915971245,
    //   status: 'NEW',
    //   status_code: 1,
    //   onboarding_completed_now: 0,
    //   awb_code: '',
    //   courier_company_id: '',
    //   courier_name: '',
    //   new_channel: false
    // }

    try {

      const response = await this.axiosInstance.post('/orders/create/adhoc', payload);
      const data = response.data;
      this.logger.log(`✅ Shiprocket order created: ${JSON.stringify(response.data)}`);


      const shipment=await manager.getRepository(ShiprocketShipment).save({
        shiprocketOrderId: data.order_id,
        shipRocketShipmentId: data.shipment_id,
        shipmentStatus: data.status,
        order: { id: data.channel_order_id },
        type: 'forward',
      });
      await this.shiprocketStatusLogService.createShipmentLog({ ...shipment, description: 'Order created in Shiprocket' },manager);


      return response.data;
    } catch (error) {
      this.logger.error('❌ Failed to create Shiprocket order', error.message);
      throw new InternalServerErrorException('Failed to create Shiprocket order', error);
    }
  }

  async getPickupAddress(): Promise<any> {

    try {
      const response = await this.axiosInstance.get('/settings/company/pickup');

      this.logger.log(`✅ Your address details: ${JSON.stringify(response.data)}`);
      return response.data;
    } catch (error) {
      this.logger.error('❌ Failed to create Shiprocket order', error.message);
      return 0;
    }
  }

  async checkServiceability(payload: any): Promise<any> {
    const params = {
      pickup_postcode: payload.pickup_postcode,
      delivery_postcode: payload.delivery_postcode,
      cod: 0,
      weight: payload.weight,
      qc_check: payload.qc_check || 0,
    };
    
    try {
      const response = await this.axiosInstance.get(`/courier/serviceability/`, {
        params,
      });
      return response.data;
    } catch (error) {
      this.logger.error('❌ Failed to check serviceability', error);
      throw new BadRequestException('Failed to check serviceability', error);
    }
  }


  async generateAwb(shipmentId: any, courierCompanyId: any,manager:EntityManager): Promise<any> {
    const payload = {
      shipment_id: shipmentId,
      courier_id: courierCompanyId,
    }

  
      try {
      const response = await this.axiosInstance.post(`/courier/assign/awb`, payload);
      
      // const shipment=await manager.getRepository(ShiprocketShipment).save({
      //   shiprocketOrderId: data.order_id,
      //   shipRocketShipmentId: data.shipment_id,
      //   shipmentStatus: data.status,
      //   order: { id: data.channel_order_id },
      //   type: 'forward',
      // });
      // await this.shiprocketStatusLogService.createShipmentLog({ ...shipment, description: 'Order created in Shiprocket' },manager);
      
      return response.data;
    } catch (error) {
      this.logger.error('❌ Failed to check serviceability', error);
      throw new BadRequestException('Failed to check serviceability', error);
    }
  }

}
