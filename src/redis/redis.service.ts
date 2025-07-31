import { Injectable, OnModuleInit } from '@nestjs/common';
import Redis from 'ioredis';
import { ConfigService } from '@nestjs/config';


@Injectable()
export class RedisService implements OnModuleInit{
  private readonly redisClient: Redis;
  

constructor(private readonly configService: ConfigService) {
  this.redisClient = new Redis({
    host: this.configService.get<string>('REDIS_HOST'),
    port: Number(this.configService.get<string>('REDIS_PORT')),
    password: this.configService.get<string>('REDIS_PASSWORD'),
    tls: this.configService.get<string>('REDIS_TLS') === 'true' ? {} : undefined,
  });

  // Log successful connection
  this.redisClient.on('connect', () => {
    console.log('✅ Redis is trying to connect...');
  });

  // Log once connection is ready
  this.redisClient.on('ready', () => {
    console.log('✅ Redis connection established and ready to use');
    console.log(new Date());
    
  });

  // Log disconnections
  this.redisClient.on('end', () => {
    console.log('🚪 Redis connection closed');
  });

  // Log any error
  this.redisClient.on('error', (err) => {
    console.error('❌ Redis connection error:', err.message);
    console.error('🔍 Full error:', err);
  });
}

   async onModuleInit() {
    // await this.setToken('1', 'testToken','admin');
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
    console.log(`✅ ${type} token set for user ${userId} (expires in ${ttlValue}s)`);
  } else {
    console.error(`❌ Failed to set ${type} token for user ${userId}`);
  }
}

 async getToken(userId: string, type: 'customer' | 'admin' | 'refresh' = 'customer'): Promise<string | null> {
  return await this.redisClient.get(`session:${type}:${userId}`);
}

  async deleteToken(userId: string, type: 'customer' | 'admin' | 'refresh' = 'customer'): Promise<void> {
  await this.redisClient.del(`session:${type}:${userId}`);
}
}

