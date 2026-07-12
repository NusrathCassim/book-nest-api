// src/bookings/dto/update-booking-status.dto.ts
import { IsEnum } from 'class-validator';
import { BookingStatus } from '../../common/enum/booking-status.enum';

export class UpdateBookingStatusDto {
  @IsEnum(BookingStatus)
  status!: BookingStatus;
}