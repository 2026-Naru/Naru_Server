import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, envFilePath: '.env' }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: () => {
        const useSsl = process.env.DB_SSL === 'true';
        return {
          type: 'postgres',
          host: process.env.DB_HOST || 'localhost',
          port: Number(process.env.DB_PORT) || 5432,
          username: process.env.DB_USER || 'postgres',
          password: process.env.DB_PASSWORD || 'password',
          database: process.env.DB_NAME || 'naru',
          ssl: useSsl ? { rejectUnauthorized: false } : false,
          extra: useSsl ? { ssl: { rejectUnauthorized: false } } : undefined,
          entities: [__dirname + '/**/*.entity.{ts,js}'],
          synchronize: false,
          logging: false,
        };
      },
      inject: [],
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}