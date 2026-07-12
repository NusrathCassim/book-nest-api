import { DataSource } from 'typeorm';
import { config } from 'dotenv';
import { User } from '../users/entities/user.entity';
import { Service } from '../services/entities/service.entity';
import { Booking } from '../bookings/entities/booking.entity';

config();

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,

  entities: [
    User,
    Service,
    Booking,
  ],

  migrations: [
    'src/database/migration/*.ts',
  ],

  synchronize: false,
});