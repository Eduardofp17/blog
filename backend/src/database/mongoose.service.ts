import { Injectable, OnApplicationShutdown, Logger } from '@nestjs/common';
import { Connection } from 'mongoose';
import { InjectConnection } from '@nestjs/mongoose';

@Injectable()
export class MongooseService implements OnApplicationShutdown {
  private readonly logger = new Logger(MongooseService.name);

  constructor(@InjectConnection() private readonly connection: Connection) {}

  onApplicationShutdown(signal?: string) {
    this.logger.log(`App is going down... Signal: ${signal}`);
    this.connection.close().then(() => {
      this.logger.log('Connection sucessfully closed with mongodb');
    });
  }

  async isConnected(): Promise<boolean> {
    return this.connection.readyState === 1;
  }

  async cleanDb(): Promise<void> {
    const collections = this.connection.collections;

    for (const key in collections) {
      if (collections.hasOwnProperty(key)) {
        await collections[key].deleteMany({});
      }
    }
  }
}
