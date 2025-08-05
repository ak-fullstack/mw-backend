import { Injectable, OnModuleInit } from '@nestjs/common';
import Redis from 'ioredis';
import { ConfigService } from '@nestjs/config';
import { Logger } from '@nestjs/common';


@Injectable()
export class RedisService implements OnModuleInit {
  private readonly redisClient: Redis;
  private readonly logger = new Logger(RedisService.name);


  constructor(private readonly configService: ConfigService) {
    this.redisClient = new Redis({
      host: this.configService.get<string>('REDIS_HOST'),
      port: Number(this.configService.get<string>('REDIS_PORT')),
      password: this.configService.get<string>('REDIS_PASSWORD'),
      tls: this.configService.get<string>('REDIS_TLS') === 'true' ? {} : undefined,
    });

    // Log successful connection
    this.redisClient.on('connect', () => {
      this.logger.log('✅ Redis is trying to connect...');
    });

    // Log once connection is ready
    this.redisClient.on('ready', () => {
      this.logger.log('✅ Redis connection established and ready to use');

    });

    // Log disconnections
    this.redisClient.on('end', () => {
      this.logger.log('🚪 Redis connection closed');
    });

    // Log any error
    this.redisClient.on('error', (err) => {
      this.logger.error('❌ Redis connection error:', err.message);
      this.logger.error('🔍 Full error:', err);
    });
  }

  async onModuleInit() {
    await this.setToken('1', 'testToken', 'admin');
  }


  async setToken(
    userId: string,
    token: string,
    type: 'customer' | 'admin' | 'refresh'
  ): Promise<void> {
    const ttl = this.configService.get<string>('REDIS_TOKEN_TTL');
    const ttlValue = ttl ? parseInt(ttl, 10) : 3600;

    const redisKey = `session:${type}:${userId}`;
    const result = await this.redisClient.setex(redisKey, ttlValue, token);

    if (result === 'OK') {
      this.logger.log(`✅ ${type} token set for user ${userId} (expires in ${ttlValue}s)`);
    } else {
      this.logger.error(`❌ Failed to set ${type} token for user ${userId}`);
    }
  }

  async setShiprocketToken(token: string): Promise<void> {
    const ttlValue = 86400; // 24 hours
    const redisKey = 'shiprocket:token';

    try {
      const result = await this.redisClient.setex(redisKey, ttlValue, token);

      if (result === 'OK') {
        this.logger.log(`✅ Shiprocket token set (expires in ${ttlValue}s)`);
      } else {
        this.logger.error(`❌ Failed to set Shiprocket token`);
      }
    } catch (error) {
      this.logger.error(`❌ Error setting Shiprocket token: ${error.message}`, error.stack);
    }
  }

  async getToken(userId: string, type: 'customer' | 'admin' | 'refresh' = 'customer'): Promise<string | null> {
    return await this.redisClient.get(`session:${type}:${userId}`);
  }

  async getShiprocketToken(): Promise<string | null> {
    return await this.redisClient.get('shiprocket:token');
  }

  async deleteToken(userId: string, type: 'customer' | 'admin' | 'refresh' = 'customer'): Promise<void> {
    await this.redisClient.del(`session:${type}:${userId}`);
  }
}

