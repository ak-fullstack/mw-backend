import { Injectable } from '@nestjs/common';
import Redis from 'ioredis';
import { ConfigModule, ConfigService } from '@nestjs/config';


@Injectable()
export class RedisService {
  private readonly redisClient: Redis;
  

  constructor(private readonly configService: ConfigService) {
    // Initialize the Redis client
    this.redisClient = new Redis({
      host: 'localhost',  // Redis host
      port: 6379,         // Redis port (default is 6379)
    });
  }

  // Set token with expiration time (in seconds)
  async setToken(userId: string, token: string): Promise<void> {
    const ttl = this.configService.get<string>('REDIS_TOKEN_TTL');
    const ttlValue = ttl ? parseInt(ttl, 10) : 3600; 
    await this.redisClient.setex(`session:${userId}`, ttlValue, token);
  }

  // Get token for a specific user
  async getToken(userId: string): Promise<string | null> {
    return await this.redisClient.get(`session:${userId}`);
  }

  // Delete token for a specific user
  async deleteToken(userId: string): Promise<void> {
    await this.redisClient.del(`session:${userId}`);
  }
}

