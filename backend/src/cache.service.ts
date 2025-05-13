import {
  Injectable,
  OnModuleInit,
  OnModuleDestroy,
  Logger,
} from "@nestjs/common";
import { createClient, RedisClientType } from "redis";
import { ConfigService } from "@nestjs/config";

@Injectable()
export class CacheService implements OnModuleInit, OnModuleDestroy {
  private redisClient: RedisClientType;
  private readonly logger = new Logger(CacheService.name);

  constructor(private configService: ConfigService) {
    const redisUrl = this.configService.get<string>(
      "REDIS_URL",
      "redis://localhost:6379"
    );
    const redisPassword = this.configService.get<string>("REDIS_PASSWORD");

    const options: any = { url: redisUrl };

    if (redisPassword) {
      options.password = redisPassword;
    }

    this.redisClient = createClient(options);

    this.redisClient.on("error", (err) => {
      this.logger.error(`Redis client error: ${err.message}`);
    });

    this.redisClient.on("connect", () => {
      this.logger.log("Connected to Redis server");
    });
  }

  async onModuleInit() {
    try {
      await this.redisClient.connect();
    } catch (error) {
      this.logger.error(
        `Failed to connect to Redis: ${(error as Error).message}`,
        (error as Error).stack
      );
    }
  }

  async onModuleDestroy() {
    try {
      this.redisClient.destroy();
      this.logger.log("Disconnected from Redis server");
    } catch (error) {
      this.logger.error(
        `Error disconnecting from Redis: ${(error as Error).message}`
      );
    }
  }

  async get<T>(key: string): Promise<T | null> {
    try {
      if (!this.redisClient.isOpen) {
        this.logger.warn("Redis client not connected, skipping cache check");
        return null;
      }

      const data = await this.redisClient.get(key);
      if (!data) return null;

      return JSON.parse(data) as T;
    } catch (error) {
      this.logger.error(
        `Error retrieving from cache: ${(error as Error).message}`
      );
      return null;
    }
  }

  async set(key: string, value: any, ttlSeconds = 60): Promise<void> {
    try {
      if (!this.redisClient.isOpen) {
        this.logger.warn("Redis client not connected, skipping cache set");
        return;
      }

      await this.redisClient.setEx(key, ttlSeconds, JSON.stringify(value));
    } catch (error) {
      this.logger.error(`Error setting cache: ${(error as Error).message}`);
      // Continue without caching - application still works
    }
  }
}
