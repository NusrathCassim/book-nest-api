import { Module } from '@nestjs/common';
import { BookingsService } from './bookings.service';
import { BookingsController } from './bookings.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Booking } from './entities/booking.entity';
import { Service } from 'src/services/entities/service.entity';

@Module({
  imports : [TypeOrmModule.forFeature([Booking, Service]) ],
  controllers: [BookingsController],
  providers: [BookingsService],
})
export class BookingsModule {
}
